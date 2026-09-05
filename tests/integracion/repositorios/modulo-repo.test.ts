// tests/integracion/repositorios/modulo-repo.test.ts
// Pruebas de integracion del repositorio de modulos de aprendizaje contra la base de pruebas.
// Cubre: RF-20 — CU-10

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { ModuloRepo } from "@/repositorios/modulo-repo.js";
import { prismaTest } from "../../ayudas/prisma-test.js";
import { limpiarBd } from "../../ayudas/limpiar-bd.js";
import {
  bloqueEnlace,
  bloqueImagen,
  bloqueTexto,
  datosModuloValidos,
} from "../../fixtures/modulo.factory.js";

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
      const datos = datosModuloValidos();

      // Act
      const modulo = await repo.crear(datos);

      // Assert
      expect(modulo.idModulo).toBeTypeOf("number");
      expect(modulo.nombre).toBe(datos.nombre);
      expect(modulo.contenido).toEqual(datos.contenido);
      expect(modulo.orden).toBe(1);
    });

    it("conserva los tres tipos de bloque y su orden de lectura", async () => {
      // Arrange
      const contenido = [
        bloqueTexto({ contenido: "Que es un contenedor" }),
        bloqueImagen({ url: "/archivos/modulos/diagrama.png" }),
        bloqueEnlace({ titulo: "Guia oficial" }),
      ];
      const datos = datosModuloValidos({ contenido });

      // Act
      const modulo = await repo.crear(datos);

      // Assert
      expect(modulo.contenido).toEqual(contenido);
    });
  });

  describe("listarTodos", () => {
    it("devuelve los modulos ordenados por el campo orden ascendente", async () => {
      // Arrange
      await repo.crear(datosModuloValidos({ nombre: "Tercero", orden: 3 }));
      await repo.crear(datosModuloValidos({ nombre: "Primero", orden: 1 }));
      await repo.crear(datosModuloValidos({ nombre: "Segundo", orden: 2 }));

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
      const creado = await repo.crear(
        datosModuloValidos({ nombre: "Volumenes" })
      );

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
      const creado = await repo.crear(datosModuloValidos({ nombre: "Redes" }));

      // Act
      const actualizado = await repo.actualizar(creado.idModulo, {
        nombre: "Redes en Docker",
        orden: 2,
      });

      // Assert
      expect(actualizado.nombre).toBe("Redes en Docker");
      expect(actualizado.orden).toBe(2);
      expect(actualizado.contenido).toEqual(datosModuloValidos().contenido);
    });

    it("reemplaza el contenido cuando se indica", async () => {
      // Arrange
      const creado = await repo.crear(datosModuloValidos());
      const nuevoContenido = [bloqueEnlace()];

      // Act
      const actualizado = await repo.actualizar(creado.idModulo, {
        contenido: nuevoContenido,
      });

      // Assert
      expect(actualizado.contenido).toEqual(nuevoContenido);
    });
  });
});
