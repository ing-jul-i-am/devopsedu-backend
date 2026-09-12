// tests/unitarias/servicios-aplicacion/calculador-progreso.test.ts
// Cubre: RF-23, RF-24 — CU-12, CU-14

import { describe, it, expect, vi } from "vitest";
import { CalculadorProgreso } from "@/servicios-aplicacion/calculador-progreso.js";
import { UMBRAL_APROBACION_EVALUACION } from "@/dominio/reglas-evaluacion.js";

function crearDependenciasMock() {
  return {
    rutaRepo: { actualizarProgreso: vi.fn() },
    actividadRepo: { listarPorModulo: vi.fn() },
    evaluacionRepo: { buscarPorModulo: vi.fn() },
    resultadoRepo: {
      contarActividadesCompletadasEnRuta: vi.fn(),
      contarEvaluacionesAprobadasEnRuta: vi.fn(),
    },
  };
}

function rutaConModulos(idModulos: number[]) {
  return {
    idRuta: 10,
    idUsuario: 1,
    rutaModulos: idModulos.map((idModulo, indice) => ({
      idRuta: 10,
      idModulo,
      ordenSecuencia: indice + 1,
      fechaInicio: null,
    })),
  };
}

describe("CalculadorProgreso.recalcular", () => {
  it("calcula el progreso solo con actividades cuando ningun modulo tiene evaluacion", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    const ruta = rutaConModulos([1]);
    dep.actividadRepo.listarPorModulo.mockResolvedValue([
      { idActividad: 100 },
      { idActividad: 101 },
    ]);
    dep.evaluacionRepo.buscarPorModulo.mockResolvedValue(null);
    dep.resultadoRepo.contarActividadesCompletadasEnRuta.mockResolvedValue(1);
    dep.resultadoRepo.contarEvaluacionesAprobadasEnRuta.mockResolvedValue(0);
    const calculador = new CalculadorProgreso(dep as any);

    // Act
    await calculador.recalcular(1, ruta as any);

    // Assert
    expect(dep.resultadoRepo.contarActividadesCompletadasEnRuta).toHaveBeenCalledWith(
      1,
      [100, 101]
    );
    expect(dep.resultadoRepo.contarEvaluacionesAprobadasEnRuta).toHaveBeenCalledWith(
      1,
      [],
      UMBRAL_APROBACION_EVALUACION
    );
    expect(dep.rutaRepo.actualizarProgreso).toHaveBeenCalledWith(10, 50);
  });

  it("combina actividades completadas y evaluaciones aprobadas en el total", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    const ruta = rutaConModulos([1, 2]);
    dep.actividadRepo.listarPorModulo.mockImplementation((idModulo: number) =>
      Promise.resolve(idModulo === 1 ? [{ idActividad: 100 }] : [])
    );
    dep.evaluacionRepo.buscarPorModulo.mockImplementation((idModulo: number) =>
      Promise.resolve(idModulo === 2 ? { idEvaluacion: 200 } : null)
    );
    dep.resultadoRepo.contarActividadesCompletadasEnRuta.mockResolvedValue(1);
    dep.resultadoRepo.contarEvaluacionesAprobadasEnRuta.mockResolvedValue(1);
    const calculador = new CalculadorProgreso(dep as any);

    // Act
    await calculador.recalcular(1, ruta as any);

    // Assert
    expect(dep.resultadoRepo.contarEvaluacionesAprobadasEnRuta).toHaveBeenCalledWith(
      1,
      [200],
      UMBRAL_APROBACION_EVALUACION
    );
    // (1 actividad completada + 1 evaluacion aprobada) / (1 actividad + 1 evaluacion) * 100
    expect(dep.rutaRepo.actualizarProgreso).toHaveBeenCalledWith(10, 100);
  });

  it("deja el progreso en 0 sin dividir por cero cuando la ruta no tiene actividades ni evaluaciones", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    const ruta = rutaConModulos([1]);
    dep.actividadRepo.listarPorModulo.mockResolvedValue([]);
    dep.evaluacionRepo.buscarPorModulo.mockResolvedValue(null);
    const calculador = new CalculadorProgreso(dep as any);

    // Act
    await calculador.recalcular(1, ruta as any);

    // Assert
    expect(dep.rutaRepo.actualizarProgreso).toHaveBeenCalledWith(10, 0);
    expect(dep.resultadoRepo.contarActividadesCompletadasEnRuta).not.toHaveBeenCalled();
    expect(dep.resultadoRepo.contarEvaluacionesAprobadasEnRuta).not.toHaveBeenCalled();
  });
});
