// tests/unitarias/servicios-aplicacion/gestor-reportes.test.ts
// Pruebas unitarias de GestorReportes con dependencias mockeadas. El detalle del calculo de cada
// reporte se prueba en tests/unitarias/dominio/reporte-progreso.test.ts; aqui se prueba la
// orquestacion: que datos se cargan, cuantas veces y como se reparten entre los estudiantes.
// Cubre: RF-25 — CU-15

import { describe, it, expect, vi } from "vitest";
import { Prisma } from "@prisma/client";
import { GestorReportes } from "@/servicios-aplicacion/gestor-reportes.js";
import { UsuarioNoEncontradoError } from "@/dominio/errores/usuario-no-encontrado-error.js";
import { crearUsuario } from "../../fixtures/usuario.factory.js";

function crearDependenciasMock() {
  return {
    usuarioRepo: { listarPorRol: vi.fn(), buscarPorIdConRol: vi.fn() },
    rutaRepo: { buscarUltimasPorUsuarios: vi.fn().mockResolvedValue(new Map()) },
    actividadRepo: { listarPorModulos: vi.fn().mockResolvedValue([]) },
    evaluacionRepo: { listarPorModulos: vi.fn().mockResolvedValue([]) },
    resultadoRepo: { listarPorUsuarios: vi.fn().mockResolvedValue([]) },
  };
}

function rutaCon(idRuta: number, idUsuario: number, idsModulo: number[]) {
  return {
    idRuta,
    idUsuario,
    progreso: new Prisma.Decimal(0),
    fechaAsignacion: new Date("2026-02-01"),
    rutaModulos: idsModulo.map((idModulo, indice) => ({
      idRuta,
      idModulo,
      ordenSecuencia: indice + 1,
      fechaInicio: new Date("2026-03-01"),
      modulo: { idModulo, nombre: `Modulo ${idModulo}`, contenido: [], orden: 1 },
    })),
  };
}

function resultadoEvaluacion(idUsuario: number, idEvaluacion: number, puntuacion: string) {
  return {
    idResultado: 1,
    idUsuario,
    idEvaluacion,
    idActividad: null,
    puntuacion: new Prisma.Decimal(puntuacion),
    tiempoEmpleado: 60,
    intentos: 1,
    fechaFinalizacion: new Date("2026-03-02"),
  };
}

describe("GestorReportes.generarProgreso", () => {
  it("genera un reporte por estudiante, en el orden del listado", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    dep.usuarioRepo.listarPorRol.mockResolvedValue([
      crearUsuario({ idUsuario: 1, nombre: "Ana" }),
      crearUsuario({ idUsuario: 2, nombre: "Luis" }),
    ]);
    dep.rutaRepo.buscarUltimasPorUsuarios.mockResolvedValue(
      new Map([[1, rutaCon(10, 1, [5])]])
    );
    const gestor = new GestorReportes(dep as never);

    // Act
    const reportes = await gestor.generarProgreso({});

    // Assert
    expect(dep.usuarioRepo.listarPorRol).toHaveBeenCalledWith("estudiante");
    expect(reportes.map((r) => [r.idUsuario, r.ruta?.idRuta ?? null])).toEqual([
      [1, 10],
      [2, null],
    ]);
  });

  it("carga rutas, actividades, evaluaciones y resultados una sola vez para todos", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    dep.usuarioRepo.listarPorRol.mockResolvedValue([
      crearUsuario({ idUsuario: 1 }),
      crearUsuario({ idUsuario: 2 }),
    ]);
    dep.rutaRepo.buscarUltimasPorUsuarios.mockResolvedValue(
      new Map([
        [1, rutaCon(10, 1, [5, 6])],
        [2, rutaCon(11, 2, [6, 7])],
      ])
    );
    const gestor = new GestorReportes(dep as never);

    // Act
    await gestor.generarProgreso({});

    // Assert
    expect(dep.rutaRepo.buscarUltimasPorUsuarios).toHaveBeenCalledTimes(1);
    expect(dep.rutaRepo.buscarUltimasPorUsuarios).toHaveBeenCalledWith([1, 2]);
    expect(dep.actividadRepo.listarPorModulos).toHaveBeenCalledTimes(1);
    expect(dep.actividadRepo.listarPorModulos).toHaveBeenCalledWith([5, 6, 7]);
    expect(dep.evaluacionRepo.listarPorModulos).toHaveBeenCalledWith([5, 6, 7]);
    expect(dep.resultadoRepo.listarPorUsuarios).toHaveBeenCalledTimes(1);
    expect(dep.resultadoRepo.listarPorUsuarios).toHaveBeenCalledWith([1, 2]);
  });

  it("reparte a cada estudiante solo sus propios resultados", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    dep.usuarioRepo.listarPorRol.mockResolvedValue([
      crearUsuario({ idUsuario: 1 }),
      crearUsuario({ idUsuario: 2 }),
    ]);
    dep.rutaRepo.buscarUltimasPorUsuarios.mockResolvedValue(
      new Map([
        [1, rutaCon(10, 1, [5])],
        [2, rutaCon(11, 2, [5])],
      ])
    );
    dep.evaluacionRepo.listarPorModulos.mockResolvedValue([
      { idEvaluacion: 3, idModulo: 5, titulo: "Evaluacion", preguntas: [], fechaDisponible: new Date() },
    ]);
    dep.resultadoRepo.listarPorUsuarios.mockResolvedValue([
      resultadoEvaluacion(1, 3, "85.5"),
      resultadoEvaluacion(2, 3, "40"),
    ]);
    const gestor = new GestorReportes(dep as never);

    // Act
    const [ana, luis] = await gestor.generarProgreso({});

    // Assert
    expect(ana?.ruta?.modulos[0]?.evaluacion).toMatchObject({
      mejorNota: 85.5,
      intentos: 1,
      aprobada: true,
    });
    expect(luis?.ruta?.modulos[0]?.evaluacion).toMatchObject({
      mejorNota: 40,
      intentos: 1,
      aprobada: false,
    });
  });

  it("devuelve una lista vacia sin consultar el resto cuando no hay estudiantes", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    dep.usuarioRepo.listarPorRol.mockResolvedValue([]);
    const gestor = new GestorReportes(dep as never);

    // Act
    const reportes = await gestor.generarProgreso({});

    // Assert
    expect(reportes).toEqual([]);
    expect(dep.rutaRepo.buscarUltimasPorUsuarios).not.toHaveBeenCalled();
    expect(dep.resultadoRepo.listarPorUsuarios).not.toHaveBeenCalled();
  });

  it("genera solo el reporte del estudiante indicado", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    dep.usuarioRepo.buscarPorIdConRol.mockResolvedValue({
      ...crearUsuario({ idUsuario: 4 }),
      rol: { idRol: 1, nombre: "estudiante", permisos: [] },
    });
    const gestor = new GestorReportes(dep as never);

    // Act
    const reportes = await gestor.generarProgreso({ idUsuario: 4 });

    // Assert
    expect(reportes.map((r) => r.idUsuario)).toEqual([4]);
    expect(dep.usuarioRepo.listarPorRol).not.toHaveBeenCalled();
    expect(dep.resultadoRepo.listarPorUsuarios).toHaveBeenCalledWith([4]);
  });

  it("lanza UsuarioNoEncontradoError cuando el estudiante indicado no existe", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    dep.usuarioRepo.buscarPorIdConRol.mockResolvedValue(null);
    const gestor = new GestorReportes(dep as never);

    // Act
    const intento = gestor.generarProgreso({ idUsuario: 999 });

    // Assert
    await expect(intento).rejects.toBeInstanceOf(UsuarioNoEncontradoError);
  });

  it("lanza UsuarioNoEncontradoError cuando el usuario indicado no es estudiante", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    dep.usuarioRepo.buscarPorIdConRol.mockResolvedValue({
      ...crearUsuario({ idUsuario: 5 }),
      rol: { idRol: 2, nombre: "docente", permisos: [] },
    });
    const gestor = new GestorReportes(dep as never);

    // Act
    const intento = gestor.generarProgreso({ idUsuario: 5 });

    // Assert
    await expect(intento).rejects.toBeInstanceOf(UsuarioNoEncontradoError);
    expect(dep.rutaRepo.buscarUltimasPorUsuarios).not.toHaveBeenCalled();
  });
});
