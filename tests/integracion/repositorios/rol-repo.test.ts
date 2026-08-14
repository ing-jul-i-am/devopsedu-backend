// tests/integracion/repositorios/rol-repo.test.ts
// Pruebas de integracion del repositorio de roles contra la base de pruebas.
// buscarPorNombre sustenta la asignacion del rol por defecto en el auto-registro.
// Cubre: RF-01, RF-04

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { RolRepo } from "@/repositorios/rol-repo.js";
import { prismaTest } from "../../ayudas/prisma-test.js";
import { limpiarBd } from "../../ayudas/limpiar-bd.js";
import { crearRolEnBd } from "../../fixtures/rol.factory.js";

describe("RolRepo", () => {
  const repo = new RolRepo(prismaTest);

  beforeEach(async () => {
    await limpiarBd();
  });

  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  describe("buscarPorNombre", () => {
    it("devuelve el rol cuando el nombre existe", async () => {
      // Arrange
      await crearRolEnBd({ nombre: "estudiante", permisos: ["servicio.crear"] });

      // Act
      const encontrado = await repo.buscarPorNombre("estudiante");

      // Assert
      expect(encontrado).not.toBeNull();
      expect(encontrado?.nombre).toBe("estudiante");
      expect(encontrado?.permisos).toContain("servicio.crear");
    });

    it("devuelve null cuando el nombre no existe", async () => {
      // Act
      const encontrado = await repo.buscarPorNombre("inexistente");

      // Assert
      expect(encontrado).toBeNull();
    });
  });
});
