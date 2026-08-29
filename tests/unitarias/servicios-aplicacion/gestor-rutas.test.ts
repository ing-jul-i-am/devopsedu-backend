// tests/unitarias/servicios-aplicacion/gestor-rutas.test.ts
// Cubre: RF-21 — CU-11

import { describe, it, expect, vi } from "vitest";
import { GestorRutas } from "@/servicios-aplicacion/gestor-rutas.js";
import { UsuarioNoEncontradoError } from "@/dominio/errores/usuario-no-encontrado-error.js";
import { ModuloNoEncontradoError } from "@/dominio/errores/modulo-no-encontrado-error.js";

function crearDependenciasMock() {
  return {
    rutaRepo: { asignar: vi.fn() },
    usuarioRepo: { buscarPorId: vi.fn() },
    moduloRepo: { buscarPorId: vi.fn() },
  };
}

describe("GestorRutas.asignar", () => {
  it("lanza UsuarioNoEncontradoError cuando el usuario destino no existe", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    dep.usuarioRepo.buscarPorId.mockResolvedValue(null);
    const gestor = new GestorRutas(dep as any);

    // Act
    const intento = gestor.asignar(999, [1, 2]);

    // Assert
    await expect(intento).rejects.toBeInstanceOf(UsuarioNoEncontradoError);
    expect(dep.rutaRepo.asignar).not.toHaveBeenCalled();
  });

  it("lanza ModuloNoEncontradoError cuando alguno de los modulos no existe", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    dep.usuarioRepo.buscarPorId.mockResolvedValue({ idUsuario: 1 });
    dep.moduloRepo.buscarPorId.mockImplementation((id: number) =>
      Promise.resolve(id === 1 ? { idModulo: 1 } : null)
    );
    const gestor = new GestorRutas(dep as any);

    // Act
    const intento = gestor.asignar(1, [1, 2]);

    // Assert
    await expect(intento).rejects.toBeInstanceOf(ModuloNoEncontradoError);
    expect(dep.rutaRepo.asignar).not.toHaveBeenCalled();
  });

  it("asigna la ruta con los modulos en el orden recibido cuando todo existe", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    dep.usuarioRepo.buscarPorId.mockResolvedValue({ idUsuario: 1 });
    dep.moduloRepo.buscarPorId.mockResolvedValue({ idModulo: 1 });
    dep.rutaRepo.asignar.mockResolvedValue({
      idRuta: 10,
      idUsuario: 1,
      progreso: 0,
      rutaModulos: [{ idModulo: 2, ordenSecuencia: 1 }, { idModulo: 1, ordenSecuencia: 2 }],
    });
    const gestor = new GestorRutas(dep as any);

    // Act
    const ruta = await gestor.asignar(1, [2, 1]);

    // Assert
    expect(dep.rutaRepo.asignar).toHaveBeenCalledWith(1, [2, 1]);
    expect(ruta.idRuta).toBe(10);
  });
});
