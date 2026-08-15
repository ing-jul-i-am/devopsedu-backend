// tests/unitarias/docker/cliente-docker.test.ts
// Pruebas unitarias del wrapper de Dockerode: traduccion de errores, mapeo de parametros y
// calculo de consumo. Se mockea el modulo dockerode (no se toca el motor real).
// Cubre: RF-11, RF-12, RF-13, RF-14, RF-19, RNF-13

import { describe, it, expect, vi, beforeEach } from "vitest";

const { dockerMock, contenedorMock } = vi.hoisted(() => {
  const contenedorMock = {
    id: "contenedor-abc",
    start: vi.fn(),
    stop: vi.fn(),
    restart: vi.fn(),
    remove: vi.fn(),
    stats: vi.fn(),
    inspect: vi.fn(),
  };
  const dockerMock = {
    createContainer: vi.fn(),
    getContainer: vi.fn(() => contenedorMock),
  };
  return { dockerMock, contenedorMock };
});

vi.mock("dockerode", () => ({ default: vi.fn(() => dockerMock) }));

import {
  crearContenedor,
  detenerContenedor,
  reiniciarContenedor,
  eliminarContenedor,
  obtenerEstadisticas,
  obtenerEstadoContenedor,
  nombreContenedor,
} from "@/docker/cliente-docker.js";
import { ImagenDockerNoDisponibleError } from "@/dominio/errores/imagen-docker-no-disponible-error.js";
import { NombreContenedorEnUsoError } from "@/dominio/errores/nombre-contenedor-en-uso-error.js";
import { ContenedorNoEncontradoError } from "@/dominio/errores/contenedor-no-encontrado-error.js";
import { MotorDockerNoDisponibleError } from "@/dominio/errores/motor-docker-no-disponible-error.js";

function paramsBase() {
  return {
    nombre: "devopsedu-1-postgres",
    imagen: "postgres:16-alpine",
    cpuAsignado: 1.5,
    memoriaAsignada: 512,
    almacenamientoAsignado: 1024,
    puertos: [{ host: 5440, contenedor: 5432, protocolo: "tcp" as const }],
    variablesEntorno: { POSTGRES_PASSWORD: "demo" },
    volumenes: [],
  };
}

describe("cliente-docker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dockerMock.getContainer.mockReturnValue(contenedorMock);
  });

  describe("nombreContenedor", () => {
    it("genera un nombre deterministico normalizado", () => {
      expect(nombreContenedor(4, "Postgres Clase 04")).toBe(
        "devopsedu-4-postgres-clase-04"
      );
    });
  });

  describe("crearContenedor", () => {
    it("convierte CPU a NanoCpus y memoria a bytes, y devuelve el id", async () => {
      // Arrange
      dockerMock.createContainer.mockResolvedValue(contenedorMock);

      // Act
      const id = await crearContenedor(paramsBase());

      // Assert
      expect(id).toBe("contenedor-abc");
      expect(dockerMock.createContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "devopsedu-1-postgres",
          Image: "postgres:16-alpine",
          HostConfig: expect.objectContaining({
            NanoCpus: 1_500_000_000,
            Memory: 512 * 1024 * 1024,
          }),
        })
      );
    });

    it("traduce un error 404 a ImagenDockerNoDisponibleError", async () => {
      dockerMock.createContainer.mockRejectedValue({
        statusCode: 404,
        message: "No such image",
      });
      await expect(crearContenedor(paramsBase())).rejects.toBeInstanceOf(
        ImagenDockerNoDisponibleError
      );
    });

    it("traduce un error 409 a NombreContenedorEnUsoError", async () => {
      dockerMock.createContainer.mockRejectedValue({
        statusCode: 409,
        message: "Conflict",
      });
      await expect(crearContenedor(paramsBase())).rejects.toBeInstanceOf(
        NombreContenedorEnUsoError
      );
    });

    it("traduce un fallo de conexion al socket a MotorDockerNoDisponibleError", async () => {
      dockerMock.createContainer.mockRejectedValue({ code: "ECONNREFUSED" });
      await expect(crearContenedor(paramsBase())).rejects.toBeInstanceOf(
        MotorDockerNoDisponibleError
      );
    });
  });

  describe("operaciones de control", () => {
    it("detenerContenedor invoca stop sobre el contenedor por su nombre", async () => {
      contenedorMock.stop.mockResolvedValue(undefined);
      await detenerContenedor("devopsedu-1-postgres");
      expect(dockerMock.getContainer).toHaveBeenCalledWith("devopsedu-1-postgres");
      expect(contenedorMock.stop).toHaveBeenCalled();
    });

    it("detenerContenedor traduce 404 a ContenedorNoEncontradoError", async () => {
      contenedorMock.stop.mockRejectedValue({ statusCode: 404 });
      await expect(detenerContenedor("x")).rejects.toBeInstanceOf(
        ContenedorNoEncontradoError
      );
    });

    it("reiniciarContenedor invoca restart", async () => {
      contenedorMock.restart.mockResolvedValue(undefined);
      await reiniciarContenedor("x");
      expect(contenedorMock.restart).toHaveBeenCalled();
    });

    it("eliminarContenedor invoca remove con force", async () => {
      contenedorMock.remove.mockResolvedValue(undefined);
      await eliminarContenedor("x");
      expect(contenedorMock.remove).toHaveBeenCalledWith({ force: true });
    });
  });

  describe("obtenerEstadisticas", () => {
    it("calcula el porcentaje de CPU y la memoria en MB", async () => {
      // Arrange: cpuDelta=1000, systemDelta=4000, online=2 -> (1000/4000)*2*100 = 50%
      contenedorMock.stats.mockResolvedValue({
        cpu_stats: {
          cpu_usage: { total_usage: 2000 },
          system_cpu_usage: 10000,
          online_cpus: 2,
        },
        precpu_stats: {
          cpu_usage: { total_usage: 1000 },
          system_cpu_usage: 6000,
        },
        memory_stats: { usage: 256 * 1024 * 1024 },
      });

      // Act
      const consumo = await obtenerEstadisticas("x");

      // Assert
      expect(consumo.cpu).toBeCloseTo(50);
      expect(consumo.memoria).toBe(256);
    });
  });

  describe("obtenerEstadoContenedor", () => {
    it("indica que esta en ejecucion cuando State.Running es true", async () => {
      // Arrange
      contenedorMock.inspect.mockResolvedValue({
        State: { Running: true, Status: "running" },
      });

      // Act
      const estado = await obtenerEstadoContenedor("x");

      // Assert
      expect(estado).toEqual({ enEjecucion: true, estado: "running" });
    });

    it("indica que no esta en ejecucion cuando el contenedor se detuvo fuera de la plataforma", async () => {
      // Arrange
      contenedorMock.inspect.mockResolvedValue({
        State: { Running: false, Status: "exited" },
      });

      // Act
      const estado = await obtenerEstadoContenedor("x");

      // Assert
      expect(estado).toEqual({ enEjecucion: false, estado: "exited" });
    });

    it("traduce un error 404 a ContenedorNoEncontradoError", async () => {
      // Arrange
      contenedorMock.inspect.mockRejectedValue({ statusCode: 404 });

      // Act / Assert
      await expect(obtenerEstadoContenedor("x")).rejects.toBeInstanceOf(
        ContenedorNoEncontradoError
      );
    });
  });
});
