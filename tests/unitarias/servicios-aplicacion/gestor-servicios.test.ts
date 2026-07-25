// tests/unitarias/servicios-aplicacion/gestor-servicios.test.ts
// Pruebas unitarias del GestorServicios (repositorio y verificador mockeados).
// Cubre: RF-05, RF-09 — CU-03, CU-04

import { describe, it, expect, vi } from "vitest";
import { GestorServicios } from "@/servicios-aplicacion/gestor-servicios.js";
import { RecursosInsuficientesError } from "@/dominio/errores/recursos-insuficientes-error.js";

function crearDeps() {
  return {
    servicioRepo: { crearConConfiguracion: vi.fn() },
    verificador: { verificarDisponibilidad: vi.fn() },
  };
}

function dtoValido() {
  return {
    nombre: "postgres-clase-04",
    descripcion: "BD para la practica",
    configuracion: {
      imagenDocker: "postgres:16-alpine",
      cpuAsignado: 1,
      memoriaAsignada: 512,
      almacenamientoAsignado: 1024,
      puertos: [],
      variablesEntorno: {},
      volumenes: [],
    },
  };
}

describe("GestorServicios.crearServicio", () => {
  it("verifica los recursos solicitados y persiste el servicio cuando hay disponibilidad", async () => {
    // Arrange
    const dep = crearDeps();
    dep.verificador.verificarDisponibilidad.mockResolvedValue({
      aprobado: true,
      solicitado: { cpu: 1, memoria: 512, almacenamiento: 1024 },
      disponible: { cpu: 4, memoria: 8000, almacenamiento: 50000 },
    });
    dep.servicioRepo.crearConConfiguracion.mockResolvedValue({
      idServicio: 1,
      estado: "configurado",
      configuraciones: [],
    });
    const gestor = new GestorServicios(dep as never);

    // Act
    await gestor.crearServicio(7, dtoValido());

    // Assert
    expect(dep.verificador.verificarDisponibilidad).toHaveBeenCalledWith({
      cpu: 1,
      memoria: 512,
      almacenamiento: 1024,
    });
    expect(dep.servicioRepo.crearConConfiguracion).toHaveBeenCalledWith(
      expect.objectContaining({ idUsuario: 7, nombre: "postgres-clase-04" })
    );
  });

  it("lanza RecursosInsuficientesError y no persiste cuando no hay disponibilidad", async () => {
    // Arrange
    const dep = crearDeps();
    dep.verificador.verificarDisponibilidad.mockResolvedValue({
      aprobado: false,
      solicitado: { cpu: 1, memoria: 512, almacenamiento: 1024 },
      disponible: { cpu: 0, memoria: 0, almacenamiento: 0 },
    });
    const gestor = new GestorServicios(dep as never);

    // Act
    const intento = gestor.crearServicio(7, dtoValido());

    // Assert
    await expect(intento).rejects.toBeInstanceOf(RecursosInsuficientesError);
    expect(dep.servicioRepo.crearConConfiguracion).not.toHaveBeenCalled();
  });
});
