// tests/unitarias/servicios-aplicacion/gestor-aprendizaje.test.ts
// Cubre: RF-22, RF-23, RF-24 — CU-13, CU-12, CU-14

import { describe, it, expect, vi } from "vitest";
import { GestorAprendizaje } from "@/servicios-aplicacion/gestor-aprendizaje.js";
import { ModuloNoAsignadoError } from "@/dominio/errores/modulo-no-asignado-error.js";
import { EvaluacionNoEncontradaError } from "@/dominio/errores/evaluacion-no-encontrada-error.js";
import { EvaluacionNoDisponibleError } from "@/dominio/errores/evaluacion-no-disponible-error.js";
import { RespuestasIncompletasError } from "@/dominio/errores/respuestas-incompletas-error.js";
import { EvaluacionYaAprobadaError } from "@/dominio/errores/evaluacion-ya-aprobada-error.js";
import { IntentosAgotadosError } from "@/dominio/errores/intentos-agotados-error.js";
import { preguntasDePrueba } from "../../fixtures/evaluacion.factory.js";

function crearDependenciasMock() {
  return {
    rutaRepo: {
      buscarUltimaPorUsuario: vi.fn(),
      marcarInicioModulo: vi.fn(),
    },
    evaluacionRepo: { buscarPorModulo: vi.fn() },
    resultadoRepo: {
      crearParaEvaluacion: vi.fn(),
      contarIntentosPorUsuarioYEvaluacion: vi.fn(),
      existeAprobadaPorUsuarioYEvaluacion: vi.fn(),
    },
    calculadorProgreso: { recalcular: vi.fn() },
    actividadRepo: { listarPorModulo: vi.fn() },
  };
}

function crearGestor(dep: ReturnType<typeof crearDependenciasMock>) {
  return new GestorAprendizaje(dep as any);
}

function rutaConModulo(
  idModulo = 7,
  fechaInicio: Date | null = null,
  modulo: Record<string, unknown> | undefined = undefined
) {
  return {
    idRuta: 1,
    idUsuario: 5,
    progreso: 0,
    rutaModulos: [{ idRuta: 1, idModulo, ordenSecuencia: 1, fechaInicio, modulo }],
  };
}

function moduloDePrueba(parciales: Record<string, unknown> = {}) {
  return {
    idModulo: 7,
    nombre: "Introduccion a contenedores",
    contenido: [{ tipo: "texto", contenido: "..." }],
    orden: 1,
    ...parciales,
  };
}

function evaluacion(parciales: Record<string, unknown> = {}) {
  return {
    idEvaluacion: 200,
    titulo: "Evaluacion del modulo",
    preguntas: preguntasDePrueba(2),
    fechaDisponible: new Date("2026-01-01"),
    idModulo: 7,
    ...parciales,
  };
}

describe("GestorAprendizaje.obtenerMiRuta", () => {
  it("delega la busqueda en el repositorio y devuelve la ruta encontrada", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    const ruta = { idRuta: 1, idUsuario: 5, progreso: 0, rutaModulos: [] };
    dep.rutaRepo.buscarUltimaPorUsuario.mockResolvedValue(ruta);
    const gestor = crearGestor(dep);

    // Act
    const resultado = await gestor.obtenerMiRuta(5);

    // Assert
    expect(dep.rutaRepo.buscarUltimaPorUsuario).toHaveBeenCalledWith(5);
    expect(resultado).toBe(ruta);
  });

  it("devuelve null cuando el estudiante no tiene ninguna ruta asignada", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    dep.rutaRepo.buscarUltimaPorUsuario.mockResolvedValue(null);
    const gestor = crearGestor(dep);

    // Act
    const resultado = await gestor.obtenerMiRuta(5);

    // Assert
    expect(resultado).toBeNull();
  });
});

describe("GestorAprendizaje.iniciarModulo", () => {
  it("marca el inicio del modulo cuando pertenece a la ruta activa del estudiante", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    dep.rutaRepo.buscarUltimaPorUsuario.mockResolvedValue(rutaConModulo());
    const gestor = crearGestor(dep);

    // Act
    await gestor.iniciarModulo(5, 7);

    // Assert
    expect(dep.rutaRepo.marcarInicioModulo).toHaveBeenCalledWith(1, 7);
  });

  it("lanza ModuloNoAsignadoError cuando el estudiante no tiene ninguna ruta asignada", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    dep.rutaRepo.buscarUltimaPorUsuario.mockResolvedValue(null);
    const gestor = crearGestor(dep);

    // Act
    const intento = gestor.iniciarModulo(5, 7);

    // Assert
    await expect(intento).rejects.toBeInstanceOf(ModuloNoAsignadoError);
    expect(dep.rutaRepo.marcarInicioModulo).not.toHaveBeenCalled();
  });

  it("lanza ModuloNoAsignadoError cuando el modulo no pertenece a la ruta activa", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    dep.rutaRepo.buscarUltimaPorUsuario.mockResolvedValue(rutaConModulo());
    const gestor = crearGestor(dep);

    // Act
    const intento = gestor.iniciarModulo(5, 999);

    // Assert
    await expect(intento).rejects.toBeInstanceOf(ModuloNoAsignadoError);
    expect(dep.rutaRepo.marcarInicioModulo).not.toHaveBeenCalled();
  });
});

describe("GestorAprendizaje.obtenerModulo", () => {
  it("devuelve el modulo y sus actividades cuando pertenece a la ruta activa", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    dep.rutaRepo.buscarUltimaPorUsuario.mockResolvedValue(
      rutaConModulo(7, null, moduloDePrueba())
    );
    const actividades = [{ idActividad: 3, descripcion: "Despliega nginx" }];
    dep.actividadRepo.listarPorModulo.mockResolvedValue(actividades);
    const gestor = crearGestor(dep);

    // Act
    const resultado = await gestor.obtenerModulo(5, 7);

    // Assert
    expect(dep.actividadRepo.listarPorModulo).toHaveBeenCalledWith(7);
    expect(resultado.modulo).toMatchObject({ idModulo: 7 });
    expect(resultado.actividades).toBe(actividades);
  });

  it("lanza ModuloNoAsignadoError cuando el modulo no pertenece a la ruta del estudiante", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    dep.rutaRepo.buscarUltimaPorUsuario.mockResolvedValue(rutaConModulo());
    const gestor = crearGestor(dep);

    // Act
    const intento = gestor.obtenerModulo(5, 999);

    // Assert
    await expect(intento).rejects.toBeInstanceOf(ModuloNoAsignadoError);
    expect(dep.actividadRepo.listarPorModulo).not.toHaveBeenCalled();
  });

  it("lanza ModuloNoAsignadoError cuando el estudiante no tiene ninguna ruta asignada", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    dep.rutaRepo.buscarUltimaPorUsuario.mockResolvedValue(null);
    const gestor = crearGestor(dep);

    // Act
    const intento = gestor.obtenerModulo(5, 7);

    // Assert
    await expect(intento).rejects.toBeInstanceOf(ModuloNoAsignadoError);
  });
});

describe("GestorAprendizaje.obtenerEvaluacion", () => {
  it("devuelve la evaluacion cuando el modulo pertenece a la ruta y ya esta disponible", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    dep.rutaRepo.buscarUltimaPorUsuario.mockResolvedValue(rutaConModulo());
    dep.evaluacionRepo.buscarPorModulo.mockResolvedValue(
      evaluacion({ fechaDisponible: new Date("2020-01-01") })
    );
    const gestor = crearGestor(dep);

    // Act
    const resultado = await gestor.obtenerEvaluacion(5, 7);

    // Assert
    expect(resultado.idEvaluacion).toBe(200);
  });

  it("lanza ModuloNoAsignadoError cuando el modulo no pertenece a la ruta del estudiante", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    dep.rutaRepo.buscarUltimaPorUsuario.mockResolvedValue(rutaConModulo());
    const gestor = crearGestor(dep);

    // Act
    const intento = gestor.obtenerEvaluacion(5, 999);

    // Assert
    await expect(intento).rejects.toBeInstanceOf(ModuloNoAsignadoError);
  });

  it("lanza EvaluacionNoEncontradaError cuando el modulo no tiene evaluacion", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    dep.rutaRepo.buscarUltimaPorUsuario.mockResolvedValue(rutaConModulo());
    dep.evaluacionRepo.buscarPorModulo.mockResolvedValue(null);
    const gestor = crearGestor(dep);

    // Act
    const intento = gestor.obtenerEvaluacion(5, 7);

    // Assert
    await expect(intento).rejects.toBeInstanceOf(EvaluacionNoEncontradaError);
  });

  it("lanza EvaluacionNoDisponibleError cuando la fecha disponible aun no llego", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    dep.rutaRepo.buscarUltimaPorUsuario.mockResolvedValue(rutaConModulo());
    dep.evaluacionRepo.buscarPorModulo.mockResolvedValue(
      evaluacion({ fechaDisponible: new Date(Date.now() + 86_400_000) })
    );
    const gestor = crearGestor(dep);

    // Act
    const intento = gestor.obtenerEvaluacion(5, 7);

    // Assert
    await expect(intento).rejects.toBeInstanceOf(EvaluacionNoDisponibleError);
  });
});

describe("GestorAprendizaje.responderEvaluacion", () => {
  function arrangeFeliz(
    dep: ReturnType<typeof crearDependenciasMock>,
    fechaInicio: Date | null
  ) {
    dep.rutaRepo.buscarUltimaPorUsuario.mockResolvedValue(
      rutaConModulo(7, fechaInicio)
    );
    dep.evaluacionRepo.buscarPorModulo.mockResolvedValue(
      evaluacion({
        fechaDisponible: new Date("2020-01-01"),
        preguntas: [
          { pregunta: "P1", opciones: ["a", "b"], respuestaCorrecta: 0 },
          { pregunta: "P2", opciones: ["a", "b"], respuestaCorrecta: 1 },
        ],
      })
    );
    dep.resultadoRepo.existeAprobadaPorUsuarioYEvaluacion.mockResolvedValue(false);
    dep.resultadoRepo.contarIntentosPorUsuarioYEvaluacion.mockResolvedValue(0);
  }

  it("califica, registra el resultado y recalcula el progreso cuando aprueba", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    const fechaInicio = new Date(Date.now() - 60_000);
    arrangeFeliz(dep, fechaInicio);

    // Act
    const retroalimentacion = await crearGestor(dep).responderEvaluacion(5, 7, [0, 1]);

    // Assert
    expect(retroalimentacion.puntuacion).toBe(100);
    expect(retroalimentacion.aprobado).toBe(true);
    expect(retroalimentacion.intentosRestantes).toBe(1);
    expect(dep.resultadoRepo.crearParaEvaluacion).toHaveBeenCalledWith(
      expect.objectContaining({
        idUsuario: 5,
        idEvaluacion: 200,
        puntuacion: 100,
        intentos: 1,
      })
    );
    expect(dep.calculadorProgreso.recalcular).toHaveBeenCalledWith(
      5,
      expect.objectContaining({ idRuta: 1 })
    );
  });

  it("no recalcula el progreso cuando la puntuacion no alcanza el umbral", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    arrangeFeliz(dep, null);

    // Act
    const retroalimentacion = await crearGestor(dep).responderEvaluacion(5, 7, [0, 0]);

    // Assert
    expect(retroalimentacion.puntuacion).toBe(50);
    expect(retroalimentacion.aprobado).toBe(false);
    expect(dep.calculadorProgreso.recalcular).not.toHaveBeenCalled();
  });

  it("lanza RespuestasIncompletasError cuando la cantidad de respuestas no coincide", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    arrangeFeliz(dep, null);

    // Act
    const intento = crearGestor(dep).responderEvaluacion(5, 7, [0]);

    // Assert
    await expect(intento).rejects.toBeInstanceOf(RespuestasIncompletasError);
    expect(dep.resultadoRepo.crearParaEvaluacion).not.toHaveBeenCalled();
  });

  it("lanza EvaluacionYaAprobadaError cuando el estudiante ya la habia aprobado", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    arrangeFeliz(dep, null);
    dep.resultadoRepo.existeAprobadaPorUsuarioYEvaluacion.mockResolvedValue(true);

    // Act
    const intento = crearGestor(dep).responderEvaluacion(5, 7, [0, 1]);

    // Assert
    await expect(intento).rejects.toBeInstanceOf(EvaluacionYaAprobadaError);
    expect(dep.resultadoRepo.crearParaEvaluacion).not.toHaveBeenCalled();
  });

  it("lanza IntentosAgotadosError cuando ya se alcanzo el maximo de intentos", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    arrangeFeliz(dep, null);
    dep.resultadoRepo.contarIntentosPorUsuarioYEvaluacion.mockResolvedValue(2);

    // Act
    const intento = crearGestor(dep).responderEvaluacion(5, 7, [0, 1]);

    // Assert
    await expect(intento).rejects.toBeInstanceOf(IntentosAgotadosError);
    expect(dep.resultadoRepo.crearParaEvaluacion).not.toHaveBeenCalled();
  });

  it("lanza EvaluacionNoDisponibleError cuando la fecha disponible aun no llego", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    dep.rutaRepo.buscarUltimaPorUsuario.mockResolvedValue(rutaConModulo());
    dep.evaluacionRepo.buscarPorModulo.mockResolvedValue(
      evaluacion({ fechaDisponible: new Date(Date.now() + 86_400_000) })
    );

    // Act
    const intento = crearGestor(dep).responderEvaluacion(5, 7, [0, 1]);

    // Assert
    await expect(intento).rejects.toBeInstanceOf(EvaluacionNoDisponibleError);
  });

  it("lanza ModuloNoAsignadoError cuando el modulo no pertenece a la ruta del estudiante", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    dep.rutaRepo.buscarUltimaPorUsuario.mockResolvedValue(rutaConModulo());

    // Act
    const intento = crearGestor(dep).responderEvaluacion(5, 999, [0, 1]);

    // Assert
    await expect(intento).rejects.toBeInstanceOf(ModuloNoAsignadoError);
  });
});
