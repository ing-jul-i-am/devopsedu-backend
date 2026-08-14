// tests/integracion/repositorios/sesion-repo.test.ts
// Pruebas de integracion del repositorio de sesiones contra la base de pruebas.
// La tabla sesion sustenta la revocacion explicita de JWT (CLAUDE.md 6.8).
// Cubre: RF-02, RF-03, RNF-14

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { SesionRepo } from "@/repositorios/sesion-repo.js";
import { prismaTest } from "../../ayudas/prisma-test.js";
import { limpiarBd } from "../../ayudas/limpiar-bd.js";
import { crearUsuarioEnBd } from "../../fixtures/usuario.factory.js";
import { crearSesionEnBd } from "../../fixtures/sesion.factory.js";

describe("SesionRepo", () => {
  const repo = new SesionRepo(prismaTest);

  beforeEach(async () => {
    await limpiarBd();
  });

  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  describe("crear", () => {
    it("persiste una sesion con estado 'activa' por defecto", async () => {
      // Arrange
      const usuario = await crearUsuarioEnBd();

      // Act
      const sesion = await repo.crear({
        token: "tok-abc",
        fechaExpiracion: new Date(Date.now() + 60 * 60 * 1000),
        idUsuario: usuario.idUsuario,
      });

      // Assert
      expect(sesion.idSesion).toBeTypeOf("number");
      expect(sesion.estado).toBe("activa");
      expect(sesion.token).toBe("tok-abc");
    });

    it("rechaza crear dos sesiones con el mismo token", async () => {
      // Arrange
      const usuario = await crearUsuarioEnBd();
      const datos = {
        token: "tok-dup",
        fechaExpiracion: new Date(Date.now() + 60 * 60 * 1000),
        idUsuario: usuario.idUsuario,
      };
      await repo.crear(datos);

      // Act + Assert
      await expect(repo.crear(datos)).rejects.toThrow();
    });
  });

  describe("buscarPorToken", () => {
    it("devuelve la sesion cuando el token existe", async () => {
      // Arrange
      await crearSesionEnBd({ token: "tok-existe" });

      // Act
      const encontrada = await repo.buscarPorToken("tok-existe");

      // Assert
      expect(encontrada).not.toBeNull();
      expect(encontrada?.token).toBe("tok-existe");
    });

    it("devuelve null cuando el token no existe", async () => {
      // Act
      const encontrada = await repo.buscarPorToken("tok-inexistente");

      // Assert
      expect(encontrada).toBeNull();
    });
  });

  describe("revocarPorToken", () => {
    it("cambia el estado de la sesion a 'revocada'", async () => {
      // Arrange
      await crearSesionEnBd({ token: "tok-rev", estado: "activa" });

      // Act
      await repo.revocarPorToken("tok-rev");

      // Assert
      const sesion = await repo.buscarPorToken("tok-rev");
      expect(sesion?.estado).toBe("revocada");
    });

    it("no lanza error cuando el token no existe (operacion idempotente)", async () => {
      // Act + Assert
      await expect(
        repo.revocarPorToken("tok-inexistente")
      ).resolves.toBeUndefined();
    });
  });
});
