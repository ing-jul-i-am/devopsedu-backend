// tests/integracion/repositorios/usuario-repo.test.ts
// Pruebas de integracion del repositorio de usuarios contra la base de pruebas.
// Cubre: RF-01, RF-04

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { UsuarioRepo } from "@/repositorios/usuario-repo.js";
import { prismaTest } from "../../ayudas/prisma-test.js";
import { limpiarBd } from "../../ayudas/limpiar-bd.js";
import { crearRolEnBd } from "../../fixtures/rol.factory.js";
import { crearUsuarioEnBd } from "../../fixtures/usuario.factory.js";

describe("UsuarioRepo", () => {
  const repo = new UsuarioRepo(prismaTest);

  beforeEach(async () => {
    await limpiarBd();
  });

  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  describe("crear", () => {
    it("persiste un usuario y devuelve su id generado", async () => {
      // Arrange
      const rol = await crearRolEnBd({ nombre: "estudiante" });

      // Act
      const usuario = await repo.crear({
        nombre: "Ana Estudiante",
        correo: "ana@devopsedu.local",
        contrasenaCifrada: "hash_falso",
        idRol: rol.idRol,
      });

      // Assert
      expect(usuario.idUsuario).toBeTypeOf("number");
      expect(usuario.correo).toBe("ana@devopsedu.local");
      const enBd = await prismaTest.usuario.findUnique({
        where: { idUsuario: usuario.idUsuario },
      });
      expect(enBd).not.toBeNull();
    });

    it("rechaza crear dos usuarios con el mismo correo", async () => {
      // Arrange
      const rol = await crearRolEnBd();
      const datos = {
        nombre: "Usuario duplicado",
        correo: "dup@devopsedu.local",
        contrasenaCifrada: "hash_falso",
        idRol: rol.idRol,
      };
      await repo.crear(datos);

      // Act + Assert
      await expect(repo.crear(datos)).rejects.toThrow();
    });
  });

  describe("buscarPorCorreo", () => {
    it("devuelve el usuario cuando el correo existe", async () => {
      // Arrange
      await crearUsuarioEnBd({ correo: "existe@devopsedu.local" });

      // Act
      const encontrado = await repo.buscarPorCorreo("existe@devopsedu.local");

      // Assert
      expect(encontrado).not.toBeNull();
      expect(encontrado?.correo).toBe("existe@devopsedu.local");
    });

    it("devuelve null cuando el correo no existe", async () => {
      // Act
      const encontrado = await repo.buscarPorCorreo("nadie@devopsedu.local");

      // Assert
      expect(encontrado).toBeNull();
    });
  });

  describe("buscarPorId", () => {
    it("devuelve el usuario cuando el id existe", async () => {
      // Arrange
      const creado = await crearUsuarioEnBd();

      // Act
      const encontrado = await repo.buscarPorId(creado.idUsuario);

      // Assert
      expect(encontrado?.idUsuario).toBe(creado.idUsuario);
    });

    it("devuelve null cuando el id no existe", async () => {
      // Act
      const encontrado = await repo.buscarPorId(999_999);

      // Assert
      expect(encontrado).toBeNull();
    });
  });

  describe("buscarPorIdConRol", () => {
    it("devuelve el usuario junto con su rol", async () => {
      // Arrange
      const rol = await crearRolEnBd({ nombre: "estudiante" });
      const creado = await crearUsuarioEnBd({ idRol: rol.idRol });

      // Act
      const encontrado = await repo.buscarPorIdConRol(creado.idUsuario);

      // Assert
      expect(encontrado?.idUsuario).toBe(creado.idUsuario);
      expect(encontrado?.rol.nombre).toBe("estudiante");
    });

    it("devuelve null cuando el id no existe", async () => {
      // Act
      const encontrado = await repo.buscarPorIdConRol(999_999);

      // Assert
      expect(encontrado).toBeNull();
    });
  });

  describe("actualizarContrasena", () => {
    it("reemplaza el hash de la contrasena del usuario", async () => {
      // Arrange
      const creado = await crearUsuarioEnBd({ contrasenaCifrada: "hash_viejo" });

      // Act
      const actualizado = await repo.actualizarContrasena(
        creado.idUsuario,
        "hash_nuevo"
      );

      // Assert
      expect(actualizado.contrasenaCifrada).toBe("hash_nuevo");
      const enBd = await prismaTest.usuario.findUnique({
        where: { idUsuario: creado.idUsuario },
      });
      expect(enBd?.contrasenaCifrada).toBe("hash_nuevo");
    });

    it("rechaza cuando el usuario no existe", async () => {
      // Act + Assert
      await expect(
        repo.actualizarContrasena(999_999, "hash_nuevo")
      ).rejects.toThrow();
    });
  });
});
