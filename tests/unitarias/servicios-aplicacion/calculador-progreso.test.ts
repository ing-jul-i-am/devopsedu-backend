// tests/unitarias/servicios-aplicacion/calculador-progreso.test.ts
// Cubre: RF-22, RF-23, RF-24 — CU-13, CU-12, CU-14 (DT-14)

import { describe, it, expect, vi } from "vitest";
import {
  CalculadorProgreso,
  type DependenciasCalculadorProgreso,
} from "@/servicios-aplicacion/calculador-progreso.js";
import type { RutaAprendizajeConModulos } from "@/repositorios/ruta-aprendizaje-repo.js";
import { UMBRAL_APROBACION_EVALUACION } from "@/dominio/reglas-evaluacion.js";

const INICIADO = new Date("2026-01-01");

function crearDependenciasMock() {
  return {
    rutaRepo: { actualizarProgreso: vi.fn() },
    actividadRepo: { listarPorModulo: vi.fn().mockResolvedValue([]) },
    evaluacionRepo: { buscarPorModulo: vi.fn().mockResolvedValue(null) },
    resultadoRepo: {
      contarActividadesCompletadasEnRuta: vi.fn(),
      existeAprobadaPorUsuarioYEvaluacion: vi.fn(),
    },
  };
}

function crearCalculador(dep: ReturnType<typeof crearDependenciasMock>) {
  return new CalculadorProgreso(dep as unknown as DependenciasCalculadorProgreso);
}

function rutaConModulos(
  modulos: Array<{ idModulo: number; fechaInicio: Date | null }>,
  progreso = 0
): RutaAprendizajeConModulos {
  const ruta = {
    idRuta: 10,
    idUsuario: 1,
    progreso,
    rutaModulos: modulos.map(({ idModulo, fechaInicio }, indice) => ({
      idRuta: 10,
      idModulo,
      ordenSecuencia: indice + 1,
      fechaInicio,
    })),
  };
  return ruta as unknown as RutaAprendizajeConModulos;
}

describe("CalculadorProgreso.recalcular", () => {
  it("cuenta como completados los modulos de solo lectura ya iniciados", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    const ruta = rutaConModulos([
      { idModulo: 1, fechaInicio: INICIADO },
      { idModulo: 2, fechaInicio: INICIADO },
      { idModulo: 3, fechaInicio: INICIADO },
    ]);
    const calculador = crearCalculador(dep);

    // Act
    await calculador.recalcular(1, ruta);

    // Assert
    expect(dep.rutaRepo.actualizarProgreso).toHaveBeenCalledWith(10, 100);
    expect(dep.resultadoRepo.contarActividadesCompletadasEnRuta).not.toHaveBeenCalled();
    expect(dep.resultadoRepo.existeAprobadaPorUsuarioYEvaluacion).not.toHaveBeenCalled();
  });

  it("no cuenta un modulo de solo lectura que aun no se ha iniciado", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    const ruta = rutaConModulos(
      [
        { idModulo: 1, fechaInicio: INICIADO },
        { idModulo: 2, fechaInicio: null },
      ],
      100
    );
    const calculador = crearCalculador(dep);

    // Act
    await calculador.recalcular(1, ruta);

    // Assert
    expect(dep.rutaRepo.actualizarProgreso).toHaveBeenCalledWith(10, 50);
  });

  it("no cuenta un modulo con actividades pendientes aunque este iniciado", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    const ruta = rutaConModulos([
      { idModulo: 1, fechaInicio: INICIADO },
      { idModulo: 2, fechaInicio: INICIADO },
    ]);
    dep.actividadRepo.listarPorModulo.mockImplementation((idModulo: number) =>
      Promise.resolve(
        idModulo === 2 ? [{ idActividad: 100 }, { idActividad: 101 }] : []
      )
    );
    dep.resultadoRepo.contarActividadesCompletadasEnRuta.mockResolvedValue(1);
    const calculador = crearCalculador(dep);

    // Act
    await calculador.recalcular(1, ruta);

    // Assert
    expect(dep.resultadoRepo.contarActividadesCompletadasEnRuta).toHaveBeenCalledWith(
      1,
      [100, 101]
    );
    expect(dep.rutaRepo.actualizarProgreso).toHaveBeenCalledWith(10, 50);
  });

  it("cuenta un modulo con evaluacion solo cuando esta fue aprobada", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    const ruta = rutaConModulos([
      { idModulo: 1, fechaInicio: INICIADO },
      { idModulo: 2, fechaInicio: INICIADO },
    ]);
    dep.evaluacionRepo.buscarPorModulo.mockImplementation((idModulo: number) =>
      Promise.resolve({ idEvaluacion: 200 + idModulo })
    );
    dep.resultadoRepo.existeAprobadaPorUsuarioYEvaluacion.mockImplementation(
      (_idUsuario: number, idEvaluacion: number) =>
        Promise.resolve(idEvaluacion === 201)
    );
    const calculador = crearCalculador(dep);

    // Act
    await calculador.recalcular(1, ruta);

    // Assert
    expect(dep.resultadoRepo.existeAprobadaPorUsuarioYEvaluacion).toHaveBeenCalledWith(
      1,
      201,
      UMBRAL_APROBACION_EVALUACION
    );
    expect(dep.rutaRepo.actualizarProgreso).toHaveBeenCalledWith(10, 50);
  });

  it("no escribe en la base de datos cuando el progreso no cambio", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    const ruta = rutaConModulos([{ idModulo: 1, fechaInicio: INICIADO }], 100);
    const calculador = crearCalculador(dep);

    // Act
    await calculador.recalcular(1, ruta);

    // Assert
    expect(dep.rutaRepo.actualizarProgreso).not.toHaveBeenCalled();
  });
});

describe("CalculadorProgreso.recalcularConEstados", () => {
  it("devuelve el estado de cada modulo en orden junto al progreso derivado", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    const ruta = rutaConModulos([
      { idModulo: 1, fechaInicio: INICIADO },
      { idModulo: 2, fechaInicio: INICIADO },
      { idModulo: 3, fechaInicio: null },
    ]);
    dep.actividadRepo.listarPorModulo.mockImplementation((idModulo: number) =>
      Promise.resolve(idModulo === 2 ? [{ idActividad: 100 }] : [])
    );
    dep.resultadoRepo.contarActividadesCompletadasEnRuta.mockResolvedValue(0);
    const calculador = crearCalculador(dep);

    // Act
    const resultado = await calculador.recalcularConEstados(1, ruta);

    // Assert
    expect(resultado).toEqual({
      estados: ["completado", "en_progreso", "sin_iniciar"],
      progreso: 33.33,
    });
    expect(dep.rutaRepo.actualizarProgreso).toHaveBeenCalledWith(10, 33.33);
  });

  it("devuelve progreso 0 sin estados cuando la ruta no tiene modulos", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    const ruta = rutaConModulos([]);
    const calculador = crearCalculador(dep);

    // Act
    const resultado = await calculador.recalcularConEstados(1, ruta);

    // Assert
    expect(resultado).toEqual({ estados: [], progreso: 0 });
    expect(dep.rutaRepo.actualizarProgreso).not.toHaveBeenCalled();
  });
});
