// tests/unitarias/servicios-aplicacion/verificador-recursos.test.ts
// Pruebas unitarias del VerificadorRecursos (repo y lector de capacidad mockeados).
// Cubre: RF-09, RF-10, RNF-07

import { describe, it, expect, vi, beforeEach } from "vitest";
import { VerificadorRecursos } from "@/servicios-aplicacion/verificador-recursos.js";

function crearDeps() {
  return {
    servicioRepo: { sumarRecursosVigentes: vi.fn() },
    capacidadTotal: vi.fn(),
  };
}

type Deps = ReturnType<typeof crearDeps>;

describe("VerificadorRecursos", () => {
  let dep: Deps;

  beforeEach(() => {
    dep = crearDeps();
    dep.capacidadTotal.mockReturnValue({
      cpu: 8,
      memoria: 16_000,
      almacenamiento: 100_000,
    });
  });

  function crear() {
    return new VerificadorRecursos(dep as never);
  }

  describe("verificarDisponibilidad", () => {
    it("aprueba cuando lo solicitado cabe en lo disponible", async () => {
      // Arrange
      dep.servicioRepo.sumarRecursosVigentes.mockResolvedValue({
        cpu: 2,
        memoria: 4_000,
        almacenamiento: 20_000,
      });

      // Act
      const resultado = await crear().verificarDisponibilidad({
        cpu: 2,
        memoria: 4_000,
        almacenamiento: 10_000,
      });

      // Assert
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

    it("rechaza cuando la memoria solicitada supera la disponible e informa los valores", async () => {
      // Arrange
      dep.servicioRepo.sumarRecursosVigentes.mockResolvedValue({
        cpu: 0,
        memoria: 15_000,
        almacenamiento: 0,
      });

      // Act
      const resultado = await crear().verificarDisponibilidad({
        cpu: 1,
        memoria: 4_000,
        almacenamiento: 1_000,
      });

      // Assert
      expect(resultado.aprobado).toBe(false);
      expect(resultado.disponible.memoria).toBe(1_000);
      expect(resultado.solicitado.memoria).toBe(4_000);
    });

    it("descuenta lo comprometido del total al calcular lo disponible", async () => {
      // Arrange
      dep.servicioRepo.sumarRecursosVigentes.mockResolvedValue({
        cpu: 3,
        memoria: 1_000,
        almacenamiento: 5_000,
      });

      // Act
      const resultado = await crear().verificarDisponibilidad({
        cpu: 1,
        memoria: 1,
        almacenamiento: 1,
      });

      // Assert
      expect(resultado.disponible).toEqual({
        cpu: 5,
        memoria: 15_000,
        almacenamiento: 95_000,
      });
    });
  });

  describe("consultarCapacidad", () => {
    it("devuelve total, comprometido y disponible", async () => {
      // Arrange
      dep.servicioRepo.sumarRecursosVigentes.mockResolvedValue({
        cpu: 2,
        memoria: 4_000,
        almacenamiento: 20_000,
      });

      // Act
      const capacidad = await crear().consultarCapacidad();

      // Assert
      expect(capacidad.total).toEqual({
        cpu: 8,
        memoria: 16_000,
        almacenamiento: 100_000,
      });
      expect(capacidad.comprometido).toEqual({
        cpu: 2,
        memoria: 4_000,
        almacenamiento: 20_000,
      });
      expect(capacidad.disponible).toEqual({
        cpu: 6,
        memoria: 12_000,
        almacenamiento: 80_000,
      });
    });
  });
});
