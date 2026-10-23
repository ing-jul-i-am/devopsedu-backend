// tests/unitarias/servicios-aplicacion/gestor-usuarios.test.ts
// Pruebas unitarias de GestorUsuarios con dependencias mockeadas.
// Cubre: RF-04, RF-25 — CU-15

import { describe, it, expect, vi } from "vitest";
import { GestorUsuarios } from "@/servicios-aplicacion/gestor-usuarios.js";
import { UsuarioNoEncontradoError } from "@/dominio/errores/usuario-no-encontrado-error.js";
import { crearUsuario } from "../../fixtures/usuario.factory.js";
import { construirReporteEstudiante } from "@/dominio/reporte-progreso.js";
import {
  entradaReporteEstudiante,
  rutaModuloDeReporte,
} from "../../fixtures/reporte.factory.js";

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
      usuarioRepo: usuarioRepoMock as never,
      cifrador: cifradorMock as never,
      gestorReportes: {} as never,
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
      usuarioRepo: usuarioRepoMock as never,
      cifrador: cifradorMock as never,
      gestorReportes: {} as never,
    });

    // Act
    const intento = gestor.resetearContrasena(999_999, "clave_en_texto_plano");

    // Assert
    await expect(intento).rejects.toBeInstanceOf(UsuarioNoEncontradoError);
    expect(cifradorMock.cifrar).not.toHaveBeenCalled();
    expect(usuarioRepoMock.actualizarContrasena).not.toHaveBeenCalled();
  });
});

describe("GestorUsuarios.listarEstudiantes", () => {
  it("resume la ruta de cada estudiante a partir del reporte de progreso", async () => {
    // Arrange
    const conRuta = construirReporteEstudiante(
      entradaReporteEstudiante({
        ruta: {
          idRuta: 3,
          fechaAsignacion: new Date("2026-02-01"),
          rutaModulos: [
            rutaModuloDeReporte({ idModulo: 1 }),
            rutaModuloDeReporte({ idModulo: 2, fechaInicio: null }),
          ],
        },
      })
    );
    const sinRuta = construirReporteEstudiante(
      entradaReporteEstudiante({
        usuario: {
          idUsuario: 2,
          nombre: "Beto",
          correo: "beto@devopsedu.local",
          fechaRegistro: new Date("2026-01-20"),
        },
        ruta: null,
      })
    );
    const gestorReportesMock = {
      generarProgreso: vi.fn().mockResolvedValue([conRuta, sinRuta]),
    };
    const gestor = new GestorUsuarios({
      usuarioRepo: {} as never,
      cifrador: {} as never,
      gestorReportes: gestorReportesMock as never,
    });

    // Act
    const estudiantes = await gestor.listarEstudiantes();

    // Assert
    expect(gestorReportesMock.generarProgreso).toHaveBeenCalledWith({});
    expect(estudiantes).toEqual([
      {
        idUsuario: 1,
        nombre: "Ana Estudiante",
        correo: "ana@devopsedu.local",
        fechaRegistro: new Date("2026-01-15"),
        ruta: {
          idRuta: 3,
          fechaAsignacion: new Date("2026-02-01"),
          progreso: 50,
          totalModulos: 2,
          modulosCompletados: 1,
        },
      },
      {
        idUsuario: 2,
        nombre: "Beto",
        correo: "beto@devopsedu.local",
        fechaRegistro: new Date("2026-01-20"),
        ruta: null,
      },
    ]);
  });
});
