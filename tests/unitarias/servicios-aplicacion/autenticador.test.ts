// tests/unitarias/servicios-aplicacion/autenticador.test.ts
// Pruebas unitarias del servicio de aplicacion Autenticador. Mockea repositorios y wrappers
// (no se prueba lo que se mockea; se envuelven bcrypt/jwt para poder mockearlos).
// Cubre: RF-01, RF-02, RF-03, RNF-10, RNF-12, RNF-14

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { DependenciasAutenticador } from "@/servicios-aplicacion/autenticador.js";
import { Autenticador } from "@/servicios-aplicacion/autenticador.js";
import { CredencialesInvalidasError } from "@/dominio/errores/credenciales-invalidas-error.js";
import { CorreoYaRegistradoError } from "@/dominio/errores/correo-ya-registrado-error.js";
import { RolNoDisponibleError } from "@/dominio/errores/rol-no-disponible-error.js";
import { crearUsuario } from "../../fixtures/usuario.factory.js";

function crearDependencias() {
  return {
    usuarioRepo: {
      buscarPorCorreo: vi.fn(),
      crear: vi.fn(),
      buscarPorId: vi.fn(),
    },
    sesionRepo: {
      crear: vi.fn(),
      revocarPorToken: vi.fn(),
      buscarPorToken: vi.fn(),
    },
    rolRepo: {
      buscarPorNombre: vi.fn(),
    },
    cifrador: {
      cifrar: vi.fn(),
      verificar: vi.fn(),
    },
    emisor: {
      emitir: vi.fn(),
      verificar: vi.fn(),
    },
    rolPorDefecto: "estudiante",
    expiracionTokenSegundos: 3600,
  };
}

type Dependencias = ReturnType<typeof crearDependencias>;

function crearAutenticador(dep: Dependencias): Autenticador {
  return new Autenticador(dep as unknown as DependenciasAutenticador);
}

describe("Autenticador", () => {
  let dep: Dependencias;

  beforeEach(() => {
    dep = crearDependencias();
  });

  describe("registrar", () => {
    it("asigna el rol por defecto, cifra la contrasena y crea el usuario", async () => {
      // Arrange
      dep.usuarioRepo.buscarPorCorreo.mockResolvedValue(null);
      dep.rolRepo.buscarPorNombre.mockResolvedValue({
        idRol: 2,
        nombre: "estudiante",
        permisos: [],
      });
      dep.cifrador.cifrar.mockResolvedValue("hash_generado");
      dep.usuarioRepo.crear.mockResolvedValue(
        crearUsuario({ correo: "nuevo@devopsedu.local", idRol: 2 })
      );
      const autenticador = crearAutenticador(dep);

      // Act
      await autenticador.registrar({
        nombre: "Nuevo Estudiante",
        correo: "nuevo@devopsedu.local",
        contrasena: "Clave_segura_1",
      });

      // Assert
      expect(dep.rolRepo.buscarPorNombre).toHaveBeenCalledWith("estudiante");
      expect(dep.cifrador.cifrar).toHaveBeenCalledWith("Clave_segura_1");
      expect(dep.usuarioRepo.crear).toHaveBeenCalledWith(
        expect.objectContaining({
          correo: "nuevo@devopsedu.local",
          contrasenaCifrada: "hash_generado",
          idRol: 2,
        })
      );
    });

    it("lanza CorreoYaRegistradoError y no crea el usuario si el correo ya existe", async () => {
      // Arrange
      dep.usuarioRepo.buscarPorCorreo.mockResolvedValue(crearUsuario());
      const autenticador = crearAutenticador(dep);

      // Act
      const intento = autenticador.registrar({
        nombre: "X",
        correo: "estudiante@devopsedu.local",
        contrasena: "Clave_segura_1",
      });

      // Assert
      await expect(intento).rejects.toBeInstanceOf(CorreoYaRegistradoError);
      expect(dep.usuarioRepo.crear).not.toHaveBeenCalled();
    });

    it("lanza RolNoDisponibleError si el rol por defecto no existe", async () => {
      // Arrange
      dep.usuarioRepo.buscarPorCorreo.mockResolvedValue(null);
      dep.rolRepo.buscarPorNombre.mockResolvedValue(null);
      const autenticador = crearAutenticador(dep);

      // Act
      const intento = autenticador.registrar({
        nombre: "Nuevo",
        correo: "nuevo@devopsedu.local",
        contrasena: "Clave_segura_1",
      });

      // Assert
      await expect(intento).rejects.toBeInstanceOf(RolNoDisponibleError);
      expect(dep.usuarioRepo.crear).not.toHaveBeenCalled();
    });

    it("no expone la contrasena cifrada en el usuario devuelto (RNF-12)", async () => {
      // Arrange
      dep.usuarioRepo.buscarPorCorreo.mockResolvedValue(null);
      dep.rolRepo.buscarPorNombre.mockResolvedValue({
        idRol: 2,
        nombre: "estudiante",
        permisos: [],
      });
      dep.cifrador.cifrar.mockResolvedValue("hash_generado");
      dep.usuarioRepo.crear.mockResolvedValue(
        crearUsuario({ contrasenaCifrada: "hash_generado" })
      );
      const autenticador = crearAutenticador(dep);

      // Act
      const resultado = await autenticador.registrar({
        nombre: "Nuevo",
        correo: "nuevo@devopsedu.local",
        contrasena: "Clave_segura_1",
      });

      // Assert
      expect(resultado).not.toHaveProperty("contrasenaCifrada");
    });
  });

  describe("iniciarSesion", () => {
    it("devuelve token y usuario sin contrasena con credenciales validas", async () => {
      // Arrange
      dep.usuarioRepo.buscarPorCorreo.mockResolvedValue(
        crearUsuario({ idUsuario: 5, correo: "ana@devopsedu.local" })
      );
      dep.cifrador.verificar.mockResolvedValue(true);
      dep.emisor.emitir.mockReturnValue("jwt-token");
      dep.sesionRepo.crear.mockResolvedValue(undefined);
      const autenticador = crearAutenticador(dep);

      // Act
      const resultado = await autenticador.iniciarSesion(
        "ana@devopsedu.local",
        "Clave_segura_1"
      );

      // Assert
      expect(resultado.token).toBe("jwt-token");
      expect(resultado.usuario.correo).toBe("ana@devopsedu.local");
      expect(resultado.usuario).not.toHaveProperty("contrasenaCifrada");
      expect(dep.emisor.emitir).toHaveBeenCalledWith({ idUsuario: 5 });
      expect(dep.sesionRepo.crear).toHaveBeenCalledWith(
        expect.objectContaining({ token: "jwt-token", idUsuario: 5 })
      );
    });

    it("lanza CredencialesInvalidasError cuando el correo no existe", async () => {
      // Arrange
      dep.usuarioRepo.buscarPorCorreo.mockResolvedValue(null);
      const autenticador = crearAutenticador(dep);

      // Act
      const intento = autenticador.iniciarSesion("nadie@devopsedu.local", "x");

      // Assert
      await expect(intento).rejects.toBeInstanceOf(CredencialesInvalidasError);
      expect(dep.emisor.emitir).not.toHaveBeenCalled();
      expect(dep.sesionRepo.crear).not.toHaveBeenCalled();
    });

    it("lanza CredencialesInvalidasError cuando la contrasena no coincide", async () => {
      // Arrange
      dep.usuarioRepo.buscarPorCorreo.mockResolvedValue(crearUsuario());
      dep.cifrador.verificar.mockResolvedValue(false);
      const autenticador = crearAutenticador(dep);

      // Act
      const intento = autenticador.iniciarSesion(
        "estudiante@devopsedu.local",
        "clave_incorrecta"
      );

      // Assert
      await expect(intento).rejects.toBeInstanceOf(CredencialesInvalidasError);
      expect(dep.sesionRepo.crear).not.toHaveBeenCalled();
    });
  });

  describe("cerrarSesion", () => {
    it("revoca la sesion por su token", async () => {
      // Arrange
      dep.sesionRepo.revocarPorToken.mockResolvedValue(undefined);
      const autenticador = crearAutenticador(dep);

      // Act
      await autenticador.cerrarSesion("jwt-token");

      // Assert
      expect(dep.sesionRepo.revocarPorToken).toHaveBeenCalledWith("jwt-token");
    });
  });
});
