// tests/unitarias/docker/monitor-periodico.test.ts
// Pruebas unitarias del MonitorPeriodico: recoleccion de metricas por intervalo y deteccion de
// fallos. Se mockea cliente-docker y los repositorios; se usan timers falsos.
// Cubre: RF-16, RF-18, RF-19, RNF-09

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/docker/cliente-docker.js", () => ({
  nombreContenedor: (idServicio: number, nombre: string) =>
    `devopsedu-${idServicio}-${nombre}`,
  obtenerEstadisticas: vi.fn(),
  obtenerEstadoContenedor: vi.fn(),
}));

import * as clienteDocker from "@/docker/cliente-docker.js";
import { MonitorPeriodico } from "@/docker/monitor-periodico.js";

function crearDeps() {
  return {
    servicioRepo: {
      listarEnEjecucion: vi.fn().mockResolvedValue([]),
      listarDetenidos: vi.fn().mockResolvedValue([]),
      actualizarEstado: vi.fn(),
    },
    metricaRepo: { registrarLote: vi.fn() },
    registroRepo: { registrar: vi.fn() },
    intervaloMs: 5000,
  };
}

describe("MonitorPeriodico", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("recolecta y registra metricas de los servicios en ejecucion en cada intervalo", async () => {
    // Arrange
    const dep = crearDeps();
    dep.servicioRepo.listarEnEjecucion.mockResolvedValue([
      { idServicio: 1, idUsuario: 5, nombre: "svc" },
    ]);
    vi.mocked(clienteDocker.obtenerEstadoContenedor).mockResolvedValue({
      enEjecucion: true,
      estado: "running",
    });
    vi.mocked(clienteDocker.obtenerEstadisticas).mockResolvedValue({
      cpu: 12.5,
      memoria: 128,
    });
    const monitor = new MonitorPeriodico(dep as never);

    // Act
    monitor.iniciar();
    await vi.advanceTimersByTimeAsync(5000);

    // Assert
    expect(clienteDocker.obtenerEstadoContenedor).toHaveBeenCalledWith(
      "devopsedu-1-svc"
    );
    expect(clienteDocker.obtenerEstadisticas).toHaveBeenCalledWith(
      "devopsedu-1-svc"
    );
    expect(dep.metricaRepo.registrarLote).toHaveBeenCalledWith([
      {
        idServicio: 1,
        consumoCpu: 12.5,
        consumoMemoria: 128,
        estadoEjecucion: "en_ejecucion",
      },
    ]);

    await vi.advanceTimersByTimeAsync(5000);
    expect(dep.metricaRepo.registrarLote).toHaveBeenCalledTimes(2);

    monitor.detener();
  });

  it("marca el servicio como fallido y registra el incidente cuando falla la lectura (RF-19)", async () => {
    // Arrange
    const dep = crearDeps();
    dep.servicioRepo.listarEnEjecucion.mockResolvedValue([
      { idServicio: 1, idUsuario: 5, nombre: "svc" },
    ]);
    vi.mocked(clienteDocker.obtenerEstadoContenedor).mockResolvedValue({
      enEjecucion: true,
      estado: "running",
    });
    vi.mocked(clienteDocker.obtenerEstadisticas).mockRejectedValue(
      new Error("contenedor caido")
    );
    const monitor = new MonitorPeriodico(dep as never);

    // Act
    await monitor.recolectar();

    // Assert
    expect(dep.servicioRepo.actualizarEstado).toHaveBeenCalledWith(1, "fallido");
    expect(dep.registroRepo.registrar).toHaveBeenCalledWith(
      expect.objectContaining({ resultado: "fallo", idServicio: 1 })
    );
    expect(dep.metricaRepo.registrarLote).not.toHaveBeenCalled();
  });

  it("marca el servicio como fallido cuando el contenedor se detuvo fuera de la plataforma (RF-19)", async () => {
    // Arrange
    const dep = crearDeps();
    dep.servicioRepo.listarEnEjecucion.mockResolvedValue([
      { idServicio: 1, idUsuario: 5, nombre: "svc" },
    ]);
    vi.mocked(clienteDocker.obtenerEstadoContenedor).mockResolvedValue({
      enEjecucion: false,
      estado: "exited",
    });
    const monitor = new MonitorPeriodico(dep as never);

    // Act
    await monitor.recolectar();

    // Assert
    expect(clienteDocker.obtenerEstadisticas).not.toHaveBeenCalled();
    expect(dep.servicioRepo.actualizarEstado).toHaveBeenCalledWith(1, "fallido");
    expect(dep.registroRepo.registrar).toHaveBeenCalledWith(
      expect.objectContaining({ resultado: "fallo", idServicio: 1 })
    );
    expect(dep.metricaRepo.registrarLote).not.toHaveBeenCalled();
  });

  it("detener() detiene la recoleccion", async () => {
    // Arrange
    const dep = crearDeps();
    dep.servicioRepo.listarEnEjecucion.mockResolvedValue([
      { idServicio: 1, idUsuario: 5, nombre: "svc" },
    ]);
    vi.mocked(clienteDocker.obtenerEstadoContenedor).mockResolvedValue({
      enEjecucion: true,
      estado: "running",
    });
    vi.mocked(clienteDocker.obtenerEstadisticas).mockResolvedValue({
      cpu: 1,
      memoria: 1,
    });
    const monitor = new MonitorPeriodico(dep as never);

    // Act
    monitor.iniciar();
    monitor.detener();
    await vi.advanceTimersByTimeAsync(15000);

    // Assert
    expect(dep.metricaRepo.registrarLote).not.toHaveBeenCalled();
  });

  it("marca en_ejecucion un servicio detenido cuyo contenedor fue iniciado fuera de la plataforma (RF-19)", async () => {
    // Arrange
    const dep = crearDeps();
    dep.servicioRepo.listarDetenidos.mockResolvedValue([
      { idServicio: 2, idUsuario: 5, nombre: "svc-detenido" },
    ]);
    vi.mocked(clienteDocker.obtenerEstadoContenedor).mockResolvedValue({
      enEjecucion: true,
      estado: "running",
    });
    const monitor = new MonitorPeriodico(dep as never);

    // Act
    await monitor.recolectar();

    // Assert
    expect(clienteDocker.obtenerEstadoContenedor).toHaveBeenCalledWith(
      "devopsedu-2-svc-detenido"
    );
    expect(dep.servicioRepo.actualizarEstado).toHaveBeenCalledWith(
      2,
      "en_ejecucion"
    );
    expect(dep.registroRepo.registrar).toHaveBeenCalledWith(
      expect.objectContaining({
        idServicio: 2,
        operacion: "monitorear",
        resultado: "exito",
      })
    );
  });

  it("no cambia un servicio detenido cuyo contenedor sigue detenido o no existe (RF-19)", async () => {
    // Arrange
    const dep = crearDeps();
    dep.servicioRepo.listarDetenidos.mockResolvedValue([
      { idServicio: 2, idUsuario: 5, nombre: "svc-detenido" },
      { idServicio: 3, idUsuario: 5, nombre: "svc-sin-contenedor" },
    ]);
    vi.mocked(clienteDocker.obtenerEstadoContenedor).mockImplementation(
      async (nombre: string) => {
        if (nombre === "devopsedu-2-svc-detenido") {
          return { enEjecucion: false, estado: "exited" };
        }
        throw new Error("contenedor no encontrado");
      }
    );
    const monitor = new MonitorPeriodico(dep as never);

    // Act
    await monitor.recolectar();

    // Assert
    expect(dep.servicioRepo.actualizarEstado).not.toHaveBeenCalled();
    expect(dep.registroRepo.registrar).not.toHaveBeenCalled();
  });
});
