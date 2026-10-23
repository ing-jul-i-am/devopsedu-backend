// tests/unitarias/servicios-aplicacion/gestor-reportes.test.ts
// Pruebas unitarias de GestorReportes con dependencias mockeadas. El detalle del calculo de cada
// reporte se prueba en tests/unitarias/dominio/reporte-progreso.test.ts; aqui se prueba la
// orquestacion: que datos se cargan, cuantas veces y como se reparten entre los estudiantes.
// Cubre: RF-25 — CU-15, CU-16

import { describe, it, expect, vi, afterEach } from "vitest";
import { Prisma } from "@prisma/client";
import { GestorReportes } from "@/servicios-aplicacion/gestor-reportes.js";
import { COLUMNAS_REPORTE } from "@/dominio/reporte-progreso.js";
import { logger } from "@/infraestructura/logger.js";
import { UsuarioNoEncontradoError } from "@/dominio/errores/usuario-no-encontrado-error.js";
import { crearUsuario } from "../../fixtures/usuario.factory.js";

function crearDependenciasMock() {
  return {
    usuarioRepo: { listarPorRol: vi.fn(), buscarPorIdConRol: vi.fn() },
    rutaRepo: { buscarUltimasPorUsuarios: vi.fn().mockResolvedValue(new Map()) },
    actividadRepo: { listarPorModulos: vi.fn().mockResolvedValue([]) },
    evaluacionRepo: { listarPorModulos: vi.fn().mockResolvedValue([]) },
    resultadoRepo: { listarPorUsuarios: vi.fn().mockResolvedValue([]) },
    exportadorCsv: { generar: vi.fn().mockReturnValue(Buffer.from("csv")) },
    exportadorPdf: { generar: vi.fn().mockResolvedValue(Buffer.from("pdf")) },
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

describe("GestorReportes.exportarProgreso", () => {
  const FECHA = new Date("2026-10-23T15:30:00.000Z");

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  function prepararUnEstudiante() {
    const dep = crearDependenciasMock();
    dep.usuarioRepo.listarPorRol.mockResolvedValue([
      crearUsuario({ idUsuario: 1, nombre: "Ana", correo: "ana@devopsedu.local" }),
    ]);
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(FECHA);
    return dep;
  }

  it("genera el CSV con las columnas y las filas del reporte", async () => {
    // Arrange
    const dep = prepararUnEstudiante();
    const gestor = new GestorReportes(dep as never);

    // Act
    const archivo = await gestor.exportarProgreso(9, { formato: "csv" });

    // Assert
    expect(dep.exportadorCsv.generar).toHaveBeenCalledWith(COLUMNAS_REPORTE, [
      [1, "Ana", "ana@devopsedu.local", ...Array(11).fill(null)],
    ]);
    expect(archivo).toEqual({
      contenido: Buffer.from("csv"),
      tipoContenido: "text/csv; charset=utf-8",
      nombreArchivo: "reporte-progreso-2026-10-23.csv",
    });
    expect(dep.exportadorPdf.generar).not.toHaveBeenCalled();
  });

  it("genera el PDF con los reportes y la fecha de generacion", async () => {
    // Arrange
    const dep = prepararUnEstudiante();
    const gestor = new GestorReportes(dep as never);

    // Act
    const archivo = await gestor.exportarProgreso(9, { formato: "pdf" });

    // Assert
    expect(dep.exportadorPdf.generar).toHaveBeenCalledWith(
      [expect.objectContaining({ idUsuario: 1, ruta: null })],
      FECHA
    );
    expect(archivo).toEqual({
      contenido: Buffer.from("pdf"),
      tipoContenido: "application/pdf",
      nombreArchivo: "reporte-progreso-2026-10-23.pdf",
    });
  });

  it("incluye el id del estudiante en el nombre del archivo cuando se filtra", async () => {
    // Arrange
    const dep = prepararUnEstudiante();
    dep.usuarioRepo.buscarPorIdConRol.mockResolvedValue({
      ...crearUsuario({ idUsuario: 4 }),
      rol: { idRol: 1, nombre: "estudiante", permisos: [] },
    });
    const gestor = new GestorReportes(dep as never);

    // Act
    const archivo = await gestor.exportarProgreso(9, { formato: "pdf", idUsuario: 4 });

    // Assert
    expect(archivo.nombreArchivo).toBe("reporte-progreso-estudiante-4-2026-10-23.pdf");
    expect(dep.usuarioRepo.listarPorRol).not.toHaveBeenCalled();
  });

  // RNF-14, CLAUDE.md 6.6: la exportacion de datos de estudiantes es una operacion
  // administrativa y deja registro de quien la hizo.
  it("registra la exportacion con el docente que la solicito", async () => {
    // Arrange
    const dep = prepararUnEstudiante();
    const warn = vi.spyOn(logger, "warn").mockImplementation(() => undefined);
    const gestor = new GestorReportes(dep as never);

    // Act
    await gestor.exportarProgreso(9, { formato: "csv" });

    // Assert
    expect(warn).toHaveBeenCalledWith({
      evento: "reporte_exportado",
      idDocente: 9,
      formato: "csv",
      idUsuario: null,
      estudiantes: 1,
    });
  });
});
