// tests/unitarias/dominio/progreso-ruta.test.ts
// Cubre: RF-22, RF-23, RF-24 — CU-13, CU-12, CU-14 (DT-14)

import { describe, it, expect } from "vitest";
import { calcularProgresoRuta } from "@/dominio/progreso-ruta.js";

describe("calcularProgresoRuta", () => {
  it("devuelve 0 sin dividir por cero cuando la ruta no tiene modulos", () => {
    expect(calcularProgresoRuta([])).toBe(0);
  });

  it("devuelve 100 cuando todos los modulos estan completados", () => {
    const estados = ["completado", "completado", "completado"] as const;

    expect(calcularProgresoRuta([...estados])).toBe(100);
  });

  it("cuenta solo los modulos completados, redondeando a dos decimales", () => {
    const estados = ["completado", "en_progreso", "sin_iniciar"] as const;

    expect(calcularProgresoRuta([...estados])).toBe(33.33);
  });

  it("devuelve 0 cuando ningun modulo esta completado", () => {
    const estados = ["en_progreso", "sin_iniciar"] as const;

    expect(calcularProgresoRuta([...estados])).toBe(0);
  });
});
