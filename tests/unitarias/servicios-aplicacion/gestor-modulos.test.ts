// tests/unitarias/servicios-aplicacion/gestor-modulos.test.ts
// Cubre: RF-20 — CU-10

import { describe, it, expect, vi } from "vitest";
import { GestorModulos } from "@/servicios-aplicacion/gestor-modulos.js";
import { ModuloNoEncontradoError } from "@/dominio/errores/modulo-no-encontrado-error.js";

function crearModuloRepoMock() {
  return {
    crear: vi.fn(),
    listarTodos: vi.fn(),
    buscarPorId: vi.fn(),
    actualizar: vi.fn(),
  };
}

describe("GestorModulos", () => {
  describe("crear", () => {
    it("delega la creacion en el repositorio y devuelve el modulo creado", async () => {
      // Arrange
      const repoMock = crearModuloRepoMock();
      const datos = { nombre: "Redes", contenidoTeorico: "c", orden: 1 };
      repoMock.crear.mockResolvedValue({ idModulo: 1, ...datos });
      const gestor = new GestorModulos(repoMock as any);

      // Act
      const modulo = await gestor.crear(datos);

      // Assert
      expect(repoMock.crear).toHaveBeenCalledWith(datos);
      expect(modulo).toMatchObject({ idModulo: 1, ...datos });
    });
  });

  describe("listarTodos", () => {
    it("delega el listado en el repositorio", async () => {
      // Arrange
      const repoMock = crearModuloRepoMock();
      repoMock.listarTodos.mockResolvedValue([]);
      const gestor = new GestorModulos(repoMock as any);

      // Act
      await gestor.listarTodos();

      // Assert
      expect(repoMock.listarTodos).toHaveBeenCalled();
    });
  });

  describe("editar", () => {
    it("actualiza el modulo cuando existe", async () => {
      // Arrange
      const repoMock = crearModuloRepoMock();
      repoMock.buscarPorId.mockResolvedValue({
        idModulo: 1,
        nombre: "Redes",
        contenidoTeorico: "c",
        orden: 1,
      });
      repoMock.actualizar.mockResolvedValue({
        idModulo: 1,
        nombre: "Redes en Docker",
        contenidoTeorico: "c",
        orden: 2,
      });
      const gestor = new GestorModulos(repoMock as any);

      // Act
      const modulo = await gestor.editar(1, { nombre: "Redes en Docker", orden: 2 });

      // Assert
      expect(repoMock.actualizar).toHaveBeenCalledWith(1, {
        nombre: "Redes en Docker",
        orden: 2,
      });
      expect(modulo.nombre).toBe("Redes en Docker");
    });

    it("lanza ModuloNoEncontradoError cuando el modulo no existe", async () => {
      // Arrange
      const repoMock = crearModuloRepoMock();
      repoMock.buscarPorId.mockResolvedValue(null);
      const gestor = new GestorModulos(repoMock as any);

      // Act
      const intento = gestor.editar(999, { nombre: "No existe" });

      // Assert
      await expect(intento).rejects.toBeInstanceOf(ModuloNoEncontradoError);
      expect(repoMock.actualizar).not.toHaveBeenCalled();
    });
  });
});
