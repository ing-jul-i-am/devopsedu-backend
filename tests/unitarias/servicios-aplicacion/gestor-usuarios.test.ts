// tests/unitarias/servicios-aplicacion/gestor-usuarios.test.ts
// Pruebas unitarias de GestorUsuarios con dependencias mockeadas.
// Cubre: RF-04

import { describe, it, expect, vi } from "vitest";
import { GestorUsuarios } from "@/servicios-aplicacion/gestor-usuarios.js";
import { UsuarioNoEncontradoError } from "@/dominio/errores/usuario-no-encontrado-error.js";
import { crearUsuario } from "../../fixtures/usuario.factory.js";

describe("GestorUsuarios.resetearContrasena", () => {
  it("cifra la contrasena nueva y la persiste cuando el usuario existe", async () => {
    // Arrange
    const usuario = crearUsuario({ idUsuario: 7 });
    const usuarioRepoMock = {
      buscarPorId: vi.fn().mockResolvedValue(usuario),
      actualizarContrasena: vi.fn().mockResolvedValue(usuario),
    };
    const cifradorMock = {
      cifrar: vi.fn().mockResolvedValue("hash_nuevo"),
    };
    const gestor = new GestorUsuarios({
      usuarioRepo: usuarioRepoMock as any,
      cifrador: cifradorMock as any,
    });

    // Act
    await gestor.resetearContrasena(7, "clave_en_texto_plano");

    // Assert
    expect(cifradorMock.cifrar).toHaveBeenCalledWith("clave_en_texto_plano");
    expect(usuarioRepoMock.actualizarContrasena).toHaveBeenCalledWith(
      7,
      "hash_nuevo"
    );
  });

  it("lanza UsuarioNoEncontradoError cuando el usuario no existe", async () => {
    // Arrange
    const usuarioRepoMock = {
      buscarPorId: vi.fn().mockResolvedValue(null),
      actualizarContrasena: vi.fn(),
    };
    const cifradorMock = { cifrar: vi.fn() };
    const gestor = new GestorUsuarios({
      usuarioRepo: usuarioRepoMock as any,
      cifrador: cifradorMock as any,
    });

    // Act
    const intento = gestor.resetearContrasena(999_999, "clave_en_texto_plano");

    // Assert
    await expect(intento).rejects.toBeInstanceOf(UsuarioNoEncontradoError);
    expect(cifradorMock.cifrar).not.toHaveBeenCalled();
    expect(usuarioRepoMock.actualizarContrasena).not.toHaveBeenCalled();
  });
});
