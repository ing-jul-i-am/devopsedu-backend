// tests/integracion/repositorios/actividad-repo.test.ts
// Pruebas de integracion del repositorio de actividades practicas de un modulo.
// Cubre: RF-23 — CU-12

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { ActividadRepo } from "@/repositorios/actividad-repo.js";
import { prismaTest } from "../../ayudas/prisma-test.js";
import { limpiarBd } from "../../ayudas/limpiar-bd.js";
import { crearModuloEnBd } from "../../fixtures/modulo.factory.js";
import {
  crearActividadEnBd,
  criteriosValidacionDePrueba,
} from "../../fixtures/actividad.factory.js";

describe("ActividadRepo", () => {
  const repo = new ActividadRepo(prismaTest);

  beforeEach(async () => {
    await limpiarBd();
  });

  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  describe("crear", () => {
    it("persiste la actividad con sus criterios de validacion", async () => {
      // Arrange
      const modulo = await crearModuloEnBd();
      const criterios = criteriosValidacionDePrueba({
        operacion: "desplegar",
        condiciones: { imagenDocker: "nginx", volumenesMinimos: 1 },
      });

      // Act
      const actividad = await repo.crear({
        descripcion: "Despliega nginx con al menos un volumen",
        criteriosValidacion: criterios,
        orden: 1,
        idModulo: modulo.idModulo,
      });

      // Assert
      expect(actividad.idActividad).toBeTypeOf("number");
      expect(actividad.criteriosValidacion).toMatchObject(
        criterios as unknown as Record<string, unknown>
      );
    });
  });

  describe("buscarPorId", () => {
    it("devuelve la actividad cuando existe", async () => {
      // Arrange
      const creada = await crearActividadEnBd();

      // Act
      const encontrada = await repo.buscarPorId(creada.idActividad);

      // Assert
      expect(encontrada?.idActividad).toBe(creada.idActividad);
    });

    it("devuelve null cuando no existe", async () => {
      // Act
      const encontrada = await repo.buscarPorId(999_999);

      // Assert
      expect(encontrada).toBeNull();
    });
  });

  describe("listarPorModulo", () => {
    it("devuelve las actividades del modulo ordenadas por el campo orden", async () => {
      // Arrange
      const modulo = await crearModuloEnBd();
      const segunda = await crearActividadEnBd({ idModulo: modulo.idModulo, orden: 2 });
      const primera = await crearActividadEnBd({ idModulo: modulo.idModulo, orden: 1 });

      // Act
      const actividades = await repo.listarPorModulo(modulo.idModulo);

      // Assert
      expect(actividades.map((a) => a.idActividad)).toEqual([
        primera.idActividad,
        segunda.idActividad,
      ]);
    });

    it("devuelve una lista vacia cuando el modulo no tiene actividades", async () => {
      // Arrange
      const modulo = await crearModuloEnBd();

      // Act
      const actividades = await repo.listarPorModulo(modulo.idModulo);

      // Assert
      expect(actividades).toHaveLength(0);
    });
  });
});
