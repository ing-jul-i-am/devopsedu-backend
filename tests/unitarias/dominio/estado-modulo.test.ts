// tests/unitarias/dominio/estado-modulo.test.ts
// Cubre: RF-22 — CU-13 (DT-13)

import { describe, it, expect } from "vitest";
import {
  calcularEstadoModulo,
  type DatosEstadoModulo,
} from "@/dominio/estado-modulo.js";

function datosDePrueba(
  parciales: Partial<DatosEstadoModulo> = {}
): DatosEstadoModulo {
  return {
    totalActividadesReferenciadas: 0,
    actividadesCompletadas: 0,
    tieneEvaluacion: false,
    evaluacionAprobada: false,
    fechaInicio: null,
    ...parciales,
  };
}

describe("calcularEstadoModulo", () => {
  it("devuelve sin_iniciar cuando fechaInicio es null, sin importar las actividades", () => {
    const datos = datosDePrueba({
      totalActividadesReferenciadas: 2,
      actividadesCompletadas: 2,
      fechaInicio: null,
    });

    expect(calcularEstadoModulo(datos)).toBe("sin_iniciar");
  });

  it("devuelve completado cuando esta iniciado y todas las actividades estan completas, sin evaluacion", () => {
    const datos = datosDePrueba({
      totalActividadesReferenciadas: 2,
      actividadesCompletadas: 2,
      fechaInicio: new Date("2026-01-01"),
    });

    expect(calcularEstadoModulo(datos)).toBe("completado");
  });

  it("devuelve completado cuando esta iniciado, las actividades estan completas y la evaluacion fue aprobada", () => {
    const datos = datosDePrueba({
      totalActividadesReferenciadas: 1,
      actividadesCompletadas: 1,
      tieneEvaluacion: true,
      evaluacionAprobada: true,
      fechaInicio: new Date("2026-01-01"),
    });

    expect(calcularEstadoModulo(datos)).toBe("completado");
  });

  it("devuelve en_progreso cuando esta iniciado, las actividades estan completas pero la evaluacion no fue aprobada", () => {
    const datos = datosDePrueba({
      totalActividadesReferenciadas: 1,
      actividadesCompletadas: 1,
      tieneEvaluacion: true,
      evaluacionAprobada: false,
      fechaInicio: new Date("2026-01-01"),
    });

    expect(calcularEstadoModulo(datos)).toBe("en_progreso");
  });

  it("devuelve en_progreso cuando esta iniciado y falta completar alguna actividad", () => {
    const datos = datosDePrueba({
      totalActividadesReferenciadas: 2,
      actividadesCompletadas: 1,
      fechaInicio: new Date("2026-01-01"),
    });

    expect(calcularEstadoModulo(datos)).toBe("en_progreso");
  });

  it("devuelve completado cuando el modulo no tiene actividades ni evaluacion y ya fue iniciado", () => {
    const datos = datosDePrueba({
      fechaInicio: new Date("2026-01-01"),
    });

    expect(calcularEstadoModulo(datos)).toBe("completado");
  });

  it("devuelve sin_iniciar cuando el modulo no tiene actividades ni evaluacion y no ha sido iniciado", () => {
    const datos = datosDePrueba();

    expect(calcularEstadoModulo(datos)).toBe("sin_iniciar");
  });
});
