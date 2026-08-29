// tests/integracion/repositorios/modulo-repo.test.ts
// Pruebas de integracion del repositorio de modulos de aprendizaje contra la base de pruebas.
// Cubre: RF-20

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { ModuloRepo } from "@/repositorios/modulo-repo.js";
import { prismaTest } from "../../ayudas/prisma-test.js";
import { limpiarBd } from "../../ayudas/limpiar-bd.js";

describe("ModuloRepo", () => {
  const repo = new ModuloRepo(prismaTest);

  beforeEach(async () => {
    await limpiarBd();
  });

  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  describe("crear", () => {
    it("crea un modulo con los datos indicados", async () => {
      // Arrange
      const datos = {
        nombre: "Introduccion a contenedores",
        contenidoTeorico: "Los contenedores empaquetan una aplicacion y sus dependencias.",
        orden: 1,
      };

      // Act
      const modulo = await repo.crear(datos);

      // Assert
      expect(modulo.idModulo).toBeTypeOf("number");
      expect(modulo.nombre).toBe(datos.nombre);
      expect(modulo.contenidoTeorico).toBe(datos.contenidoTeorico);
      expect(modulo.orden).toBe(1);
    });
  });

  describe("listarTodos", () => {
    it("devuelve los modulos ordenados por el campo orden ascendente", async () => {
      // Arrange
      await repo.crear({ nombre: "Tercero", contenidoTeorico: "c", orden: 3 });
      await repo.crear({ nombre: "Primero", contenidoTeorico: "c", orden: 1 });
      await repo.crear({ nombre: "Segundo", contenidoTeorico: "c", orden: 2 });

      // Act
      const modulos = await repo.listarTodos();

      // Assert
      expect(modulos.map((m) => m.nombre)).toEqual([
        "Primero",
        "Segundo",
        "Tercero",
      ]);
    });
  });

  describe("buscarPorId", () => {
    it("devuelve el modulo cuando existe", async () => {
      // Arrange
      const creado = await repo.crear({
        nombre: "Volumenes",
        contenidoTeorico: "c",
        orden: 1,
      });

      // Act
      const encontrado = await repo.buscarPorId(creado.idModulo);

      // Assert
      expect(encontrado?.nombre).toBe("Volumenes");
    });

    it("devuelve null cuando el modulo no existe", async () => {
      // Act
      const encontrado = await repo.buscarPorId(999_999);

      // Assert
      expect(encontrado).toBeNull();
    });
  });

  describe("actualizar", () => {
    it("modifica los campos indicados del modulo", async () => {
      // Arrange
      const creado = await repo.crear({
        nombre: "Redes",
        contenidoTeorico: "c",
        orden: 1,
      });

      // Act
      const actualizado = await repo.actualizar(creado.idModulo, {
        nombre: "Redes en Docker",
        orden: 2,
      });

      // Assert
      expect(actualizado.nombre).toBe("Redes en Docker");
      expect(actualizado.orden).toBe(2);
      expect(actualizado.contenidoTeorico).toBe("c");
    });
  });
});
