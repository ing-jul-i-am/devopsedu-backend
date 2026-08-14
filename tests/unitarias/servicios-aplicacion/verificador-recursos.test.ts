// tests/unitarias/servicios-aplicacion/verificador-recursos.test.ts
// Pruebas unitarias del VerificadorRecursos. Lo disponible proviene de una medicion del SO
// (inyectada y mockeada aqui para determinismo), que ya descuenta todo el uso de la maquina.
// Cubre: RF-09, RF-10, RNF-07

import { describe, it, expect, vi, beforeEach } from "vitest";
import { VerificadorRecursos } from "@/servicios-aplicacion/verificador-recursos.js";

function crearDeps() {
  return { medirRecursos: vi.fn() };
}

type Deps = ReturnType<typeof crearDeps>;

describe("VerificadorRecursos", () => {
  let dep: Deps;

  beforeEach(() => {
    dep = crearDeps();
    dep.medirRecursos.mockResolvedValue({
      total: { cpu: 8, memoria: 16_000, almacenamiento: 100_000 },
      disponible: { cpu: 6, memoria: 12_000, almacenamiento: 80_000 },
    });
  });

  function crear() {
    return new VerificadorRecursos(dep as never);
  }

  describe("verificarDisponibilidad", () => {
    it("aprueba cuando lo solicitado cabe en lo disponible", async () => {
      const resultado = await crear().verificarDisponibilidad({
        cpu: 2,
        memoria: 4_000,
        almacenamiento: 10_000,
      });

      expect(resultado.aprobado).toBe(true);
      expect(resultado.disponible).toEqual({
        cpu: 6,
        memoria: 12_000,
        almacenamiento: 80_000,
      });
      expect(resultado.solicitado).toEqual({
        cpu: 2,
        memoria: 4_000,
        almacenamiento: 10_000,
      });
    });

    it("rechaza cuando la memoria solicitada supera la disponible", async () => {
      const resultado = await crear().verificarDisponibilidad({
        cpu: 1,
        memoria: 20_000,
        almacenamiento: 1_000,
      });

      expect(resultado.aprobado).toBe(false);
      expect(resultado.disponible.memoria).toBe(12_000);
    });
  });

  describe("consultarCapacidad", () => {
    it("devuelve total, comprometido (total menos disponible) y disponible", async () => {
      const capacidad = await crear().consultarCapacidad();

      expect(capacidad.total).toEqual({
        cpu: 8,
        memoria: 16_000,
        almacenamiento: 100_000,
      });
      expect(capacidad.disponible).toEqual({
        cpu: 6,
        memoria: 12_000,
        almacenamiento: 80_000,
      });
      expect(capacidad.comprometido).toEqual({
        cpu: 2,
        memoria: 4_000,
        almacenamiento: 20_000,
      });
    });
  });
});
