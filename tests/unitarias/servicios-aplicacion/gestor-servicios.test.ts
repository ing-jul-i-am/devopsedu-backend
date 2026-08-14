// tests/unitarias/servicios-aplicacion/gestor-servicios.test.ts
// Pruebas unitarias del GestorServicios (repositorio y verificador mockeados).
// Cubre: RF-05, RF-09 — CU-03, CU-04

import { describe, it, expect, vi } from "vitest";
import { GestorServicios } from "@/servicios-aplicacion/gestor-servicios.js";
import { RecursosInsuficientesError } from "@/dominio/errores/recursos-insuficientes-error.js";
import { ServicioNoEncontradoError } from "@/dominio/errores/servicio-no-encontrado-error.js";

function crearDeps() {
  return {
    servicioRepo: {
      crearConConfiguracion: vi.fn(),
      buscarPorIdConConfiguracionVigente: vi.fn(),
      agregarConfiguracion: vi.fn(),
      listarActivosPorUsuario: vi.fn(),
    },
    registroRepo: { listarPorServicio: vi.fn() },
    metricaRepo: { listarPorServicio: vi.fn() },
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

describe("GestorServicios.editarConfiguracion", () => {
  it("agrega una nueva version de configuracion cuando el servicio es del usuario", async () => {
    // Arrange
    const dep = crearDeps();
    dep.servicioRepo.buscarPorIdConConfiguracionVigente.mockResolvedValue({
      idServicio: 1,
      idUsuario: 7,
      configuraciones: [],
    });
    dep.servicioRepo.agregarConfiguracion.mockResolvedValue({});
    const gestor = new GestorServicios(dep as never);

    // Act
    await gestor.editarConfiguracion(7, 1, dtoValido().configuracion);

    // Assert
    expect(dep.servicioRepo.agregarConfiguracion).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ memoriaAsignada: 512 })
    );
  });

  it("lanza ServicioNoEncontradoError cuando el servicio no existe", async () => {
    // Arrange
    const dep = crearDeps();
    dep.servicioRepo.buscarPorIdConConfiguracionVigente.mockResolvedValue(null);
    const gestor = new GestorServicios(dep as never);

    // Act
    const intento = gestor.editarConfiguracion(7, 1, dtoValido().configuracion);

    // Assert
    await expect(intento).rejects.toBeInstanceOf(ServicioNoEncontradoError);
    expect(dep.servicioRepo.agregarConfiguracion).not.toHaveBeenCalled();
  });

  it("lanza ServicioNoEncontradoError cuando el servicio pertenece a otro usuario", async () => {
    // Arrange
    const dep = crearDeps();
    dep.servicioRepo.buscarPorIdConConfiguracionVigente.mockResolvedValue({
      idServicio: 1,
      idUsuario: 99,
      configuraciones: [],
    });
    const gestor = new GestorServicios(dep as never);

    // Act
    const intento = gestor.editarConfiguracion(7, 1, dtoValido().configuracion);

    // Assert
    await expect(intento).rejects.toBeInstanceOf(ServicioNoEncontradoError);
    expect(dep.servicioRepo.agregarConfiguracion).not.toHaveBeenCalled();
  });
});

describe("GestorServicios.listarPanel", () => {
  it("devuelve los servicios activos del usuario", async () => {
    // Arrange
    const dep = crearDeps();
    dep.servicioRepo.listarActivosPorUsuario.mockResolvedValue([
      { idServicio: 1 },
      { idServicio: 2 },
    ]);
    const gestor = new GestorServicios(dep as never);

    // Act
    const panel = await gestor.listarPanel(7);

    // Assert
    expect(dep.servicioRepo.listarActivosPorUsuario).toHaveBeenCalledWith(7);
    expect(panel).toHaveLength(2);
  });
});

describe("GestorServicios.obtenerDetalle", () => {
  it("devuelve el servicio con su historico cuando pertenece al usuario", async () => {
    // Arrange
    const dep = crearDeps();
    dep.servicioRepo.buscarPorIdConConfiguracionVigente.mockResolvedValue({
      idServicio: 1,
      idUsuario: 7,
      configuraciones: [],
    });
    dep.registroRepo.listarPorServicio.mockResolvedValue([
      { operacion: "desplegar" },
    ]);
    const gestor = new GestorServicios(dep as never);

    // Act
    const detalle = await gestor.obtenerDetalle(7, 1);

    // Assert
    expect(detalle.servicio.idServicio).toBe(1);
    expect(detalle.registros).toHaveLength(1);
  });

  it("lanza ServicioNoEncontradoError cuando el servicio es de otro usuario", async () => {
    // Arrange
    const dep = crearDeps();
    dep.servicioRepo.buscarPorIdConConfiguracionVigente.mockResolvedValue({
      idServicio: 1,
      idUsuario: 99,
      configuraciones: [],
    });
    const gestor = new GestorServicios(dep as never);

    // Act
    const intento = gestor.obtenerDetalle(7, 1);

    // Assert
    await expect(intento).rejects.toBeInstanceOf(ServicioNoEncontradoError);
    expect(dep.registroRepo.listarPorServicio).not.toHaveBeenCalled();
  });
});

describe("GestorServicios.obtenerMetricas", () => {
  it("devuelve las metricas cuando el servicio pertenece al usuario", async () => {
    // Arrange
    const dep = crearDeps();
    dep.servicioRepo.buscarPorIdConConfiguracionVigente.mockResolvedValue({
      idServicio: 1,
      idUsuario: 7,
      configuraciones: [],
    });
    dep.metricaRepo.listarPorServicio.mockResolvedValue([{ consumoCpu: 10 }]);
    const gestor = new GestorServicios(dep as never);

    // Act
    const metricas = await gestor.obtenerMetricas(7, 1, {});

    // Assert
    expect(dep.metricaRepo.listarPorServicio).toHaveBeenCalledWith(1, {});
    expect(metricas).toHaveLength(1);
  });

  it("lanza ServicioNoEncontradoError cuando el servicio es de otro usuario", async () => {
    // Arrange
    const dep = crearDeps();
    dep.servicioRepo.buscarPorIdConConfiguracionVigente.mockResolvedValue({
      idServicio: 1,
      idUsuario: 99,
      configuraciones: [],
    });
    const gestor = new GestorServicios(dep as never);

    // Act
    const intento = gestor.obtenerMetricas(7, 1, {});

    // Assert
    await expect(intento).rejects.toBeInstanceOf(ServicioNoEncontradoError);
    expect(dep.metricaRepo.listarPorServicio).not.toHaveBeenCalled();
  });
});
