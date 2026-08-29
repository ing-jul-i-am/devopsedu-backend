// tests/unitarias/servicios-aplicacion/gestor-aprendizaje.test.ts
// Cubre: RF-22 — CU-13

import { describe, it, expect, vi } from "vitest";
import { GestorAprendizaje } from "@/servicios-aplicacion/gestor-aprendizaje.js";

function crearRutaRepoMock() {
  return { buscarUltimaPorUsuario: vi.fn() };
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
