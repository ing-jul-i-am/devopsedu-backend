// tests/unitarias/servicios-aplicacion/gestor-aprendizaje.test.ts
// Cubre: RF-22, RF-23 — CU-13, CU-12

import { describe, it, expect, vi } from "vitest";
import { GestorAprendizaje } from "@/servicios-aplicacion/gestor-aprendizaje.js";
import { ModuloNoAsignadoError } from "@/dominio/errores/modulo-no-asignado-error.js";

function crearRutaRepoMock() {
  return {
    buscarUltimaPorUsuario: vi.fn(),
    marcarInicioModulo: vi.fn(),
  };
}

describe("GestorAprendizaje.obtenerMiRuta", () => {
  it("delega la busqueda en el repositorio y devuelve la ruta encontrada", async () => {
    // Arrange
    const rutaRepo = crearRutaRepoMock();
    const ruta = { idRuta: 1, idUsuario: 5, progreso: 0, rutaModulos: [] };
    rutaRepo.buscarUltimaPorUsuario.mockResolvedValue(ruta);
    const gestor = new GestorAprendizaje({ rutaRepo: rutaRepo as any });

    // Act
    const resultado = await gestor.obtenerMiRuta(5);

    // Assert
    expect(rutaRepo.buscarUltimaPorUsuario).toHaveBeenCalledWith(5);
    expect(resultado).toBe(ruta);
  });

  it("devuelve null cuando el estudiante no tiene ninguna ruta asignada", async () => {
    // Arrange
    const rutaRepo = crearRutaRepoMock();
    rutaRepo.buscarUltimaPorUsuario.mockResolvedValue(null);
    const gestor = new GestorAprendizaje({ rutaRepo: rutaRepo as any });

    // Act
    const resultado = await gestor.obtenerMiRuta(5);

    // Assert
    expect(resultado).toBeNull();
  });
});

describe("GestorAprendizaje.iniciarModulo", () => {
  it("marca el inicio del modulo cuando pertenece a la ruta activa del estudiante", async () => {
    // Arrange
    const rutaRepo = crearRutaRepoMock();
    rutaRepo.buscarUltimaPorUsuario.mockResolvedValue({
      idRuta: 1,
      idUsuario: 5,
      progreso: 0,
      rutaModulos: [{ idRuta: 1, idModulo: 7, ordenSecuencia: 1, fechaInicio: null }],
    });
    const gestor = new GestorAprendizaje({ rutaRepo: rutaRepo as any });

    // Act
    await gestor.iniciarModulo(5, 7);

    // Assert
    expect(rutaRepo.marcarInicioModulo).toHaveBeenCalledWith(1, 7);
  });

  it("lanza ModuloNoAsignadoError cuando el estudiante no tiene ninguna ruta asignada", async () => {
    // Arrange
    const rutaRepo = crearRutaRepoMock();
    rutaRepo.buscarUltimaPorUsuario.mockResolvedValue(null);
    const gestor = new GestorAprendizaje({ rutaRepo: rutaRepo as any });

    // Act
    const intento = gestor.iniciarModulo(5, 7);

    // Assert
    await expect(intento).rejects.toBeInstanceOf(ModuloNoAsignadoError);
    expect(rutaRepo.marcarInicioModulo).not.toHaveBeenCalled();
  });

  it("lanza ModuloNoAsignadoError cuando el modulo no pertenece a la ruta activa", async () => {
    // Arrange
    const rutaRepo = crearRutaRepoMock();
    rutaRepo.buscarUltimaPorUsuario.mockResolvedValue({
      idRuta: 1,
      idUsuario: 5,
      progreso: 0,
      rutaModulos: [{ idRuta: 1, idModulo: 7, ordenSecuencia: 1, fechaInicio: null }],
    });
    const gestor = new GestorAprendizaje({ rutaRepo: rutaRepo as any });

    // Act
    const intento = gestor.iniciarModulo(5, 999);

    // Assert
    await expect(intento).rejects.toBeInstanceOf(ModuloNoAsignadoError);
    expect(rutaRepo.marcarInicioModulo).not.toHaveBeenCalled();
  });
});
