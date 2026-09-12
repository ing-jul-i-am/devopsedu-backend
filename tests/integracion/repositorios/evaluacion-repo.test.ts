// tests/integracion/repositorios/evaluacion-repo.test.ts
// Pruebas de integracion del repositorio de evaluaciones de modulo.
// Cubre: RF-24 — CU-14

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { EvaluacionRepo } from "@/repositorios/evaluacion-repo.js";
import { prismaTest } from "../../ayudas/prisma-test.js";
import { limpiarBd } from "../../ayudas/limpiar-bd.js";
import { crearModuloEnBd } from "../../fixtures/modulo.factory.js";
import {
  crearEvaluacionEnBd,
  preguntasDePrueba,
} from "../../fixtures/evaluacion.factory.js";

describe("EvaluacionRepo", () => {
  const repo = new EvaluacionRepo(prismaTest);

  beforeEach(async () => {
    await limpiarBd();
  });

  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  describe("crear", () => {
    it("persiste la evaluacion con sus preguntas", async () => {
      // Arrange
      const modulo = await crearModuloEnBd();
      const preguntas = preguntasDePrueba(5);

      // Act
      const evaluacion = await repo.crear({
        titulo: "Evaluacion: Redes en Docker",
        preguntas,
        fechaDisponible: new Date("2026-01-01"),
        idModulo: modulo.idModulo,
      });

      // Assert
      expect(evaluacion.idEvaluacion).toBeTypeOf("number");
      expect(evaluacion.preguntas).toMatchObject(
        preguntas as unknown as Record<string, unknown>[]
      );
    });

    it("rechaza crear una segunda evaluacion para el mismo modulo", async () => {
      // Arrange
      const modulo = await crearModuloEnBd();
      await repo.crear({
        titulo: "Primera",
        preguntas: preguntasDePrueba(1),
        fechaDisponible: new Date("2026-01-01"),
        idModulo: modulo.idModulo,
      });

      // Act + Assert
      await expect(
        repo.crear({
          titulo: "Segunda",
          preguntas: preguntasDePrueba(1),
          fechaDisponible: new Date("2026-01-01"),
          idModulo: modulo.idModulo,
        })
      ).rejects.toThrow();
    });
  });

  describe("buscarPorModulo", () => {
    it("devuelve la evaluacion del modulo cuando existe", async () => {
      // Arrange
      const creada = await crearEvaluacionEnBd();

      // Act
      const encontrada = await repo.buscarPorModulo(creada.idModulo);

      // Assert
      expect(encontrada?.idEvaluacion).toBe(creada.idEvaluacion);
    });

    it("devuelve null cuando el modulo no tiene evaluacion", async () => {
      // Arrange
      const modulo = await crearModuloEnBd();

      // Act
      const encontrada = await repo.buscarPorModulo(modulo.idModulo);

      // Assert
      expect(encontrada).toBeNull();
    });
  });

  describe("buscarPorId", () => {
    it("devuelve la evaluacion cuando existe", async () => {
      // Arrange
      const creada = await crearEvaluacionEnBd();

      // Act
      const encontrada = await repo.buscarPorId(creada.idEvaluacion);

      // Assert
      expect(encontrada?.idEvaluacion).toBe(creada.idEvaluacion);
    });

    it("devuelve null cuando no existe", async () => {
      // Act
      const encontrada = await repo.buscarPorId(999_999);

      // Assert
      expect(encontrada).toBeNull();
    });
  });
});
