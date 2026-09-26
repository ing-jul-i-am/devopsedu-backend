// tests/unitarias/docker/cliente-docker.test.ts
// Pruebas unitarias del wrapper de Dockerode: traduccion de errores, mapeo de parametros y
// calculo de consumo. Se mockea el modulo dockerode (no se toca el motor real).
// Cubre: RF-11, RF-12, RF-13, RF-14, RF-19, RNF-13

import { describe, it, expect, vi, beforeEach } from "vitest";

const { dockerMock, contenedorMock, volumenMock } = vi.hoisted(() => {
  const contenedorMock = {
    id: "contenedor-abc",
    start: vi.fn(),
    stop: vi.fn(),
    restart: vi.fn(),
    remove: vi.fn(),
    stats: vi.fn(),
    inspect: vi.fn(),
  };
  const volumenMock = {
    remove: vi.fn(),
  };
  const dockerMock = {
    createContainer: vi.fn(),
    getContainer: vi.fn(() => contenedorMock),
    getVolume: vi.fn(() => volumenMock),
  };
  return { dockerMock, contenedorMock, volumenMock };
});

vi.mock("dockerode", () => ({ default: vi.fn(() => dockerMock) }));

import {
  crearContenedor,
  detenerContenedor,
  reiniciarContenedor,
  eliminarContenedor,
  eliminarVolumen,
  listarVolumenesDelContenedor,
  obtenerEstadisticas,
  obtenerEstadoContenedor,
  nombreContenedor,
} from "@/docker/cliente-docker.js";
import { ImagenDockerNoDisponibleError } from "@/dominio/errores/imagen-docker-no-disponible-error.js";
import { NombreContenedorEnUsoError } from "@/dominio/errores/nombre-contenedor-en-uso-error.js";
import { ContenedorNoEncontradoError } from "@/dominio/errores/contenedor-no-encontrado-error.js";
import { MotorDockerNoDisponibleError } from "@/dominio/errores/motor-docker-no-disponible-error.js";
import { VolumenEnUsoError } from "@/dominio/errores/volumen-en-uso-error.js";
import { VolumenNoEncontradoError } from "@/dominio/errores/volumen-no-encontrado-error.js";

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
    dockerMock.getVolume.mockReturnValue(volumenMock);
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

    // El flag "v" arrastra los volumenes anonimos que Docker crea por instruccion de la imagen;
    // los volumenes nombrados no los toca y se eliminan aparte (DT-15).
    it("eliminarContenedor invoca remove con force y arrastra los volumenes anonimos", async () => {
      contenedorMock.remove.mockResolvedValue(undefined);
      await eliminarContenedor("x");
      expect(contenedorMock.remove).toHaveBeenCalledWith({
        force: true,
        v: true,
      });
    });
  });

  describe("listarVolumenesDelContenedor", () => {
    // Nombre real del volumen que postgres:16-alpine crea por su instruccion VOLUME.
    const ANONIMO =
      "55cc6130e6b6b881f5353f86065017a2eccd6a6f88bbdc1d606b28e377edc537";

    it("devuelve solo los montajes de tipo volumen y descarta los bind mount", async () => {
      // Arrange
      contenedorMock.inspect.mockResolvedValue({
        State: { Running: true, Status: "running" },
        Mounts: [
          { Type: "volume", Name: "datos-redis", Destination: "/data" },
          { Type: "bind", Source: "/datos/pg", Destination: "/var/lib/pg" },
        ],
      });

      // Act
      const volumenes = await listarVolumenesDelContenedor("x");

      // Assert
      expect(volumenes).toEqual([
        { nombre: "datos-redis", destino: "/data", anonimo: false },
      ]);
    });

    // DT-17: el frontend necesita poder decirle al estudiante que se va a destruir, y un volumen
    // anonimo de postgres o mysql contiene toda la base de datos aunque el nunca lo declaro.
    it("marca como anonimo el volumen que crea la propia imagen", async () => {
      // Arrange
      contenedorMock.inspect.mockResolvedValue({
        State: { Running: true, Status: "running" },
        Mounts: [
          {
            Type: "volume",
            Name: ANONIMO,
            Destination: "/var/lib/postgresql/data",
          },
        ],
      });

      // Act
      const volumenes = await listarVolumenesDelContenedor("x");

      // Assert
      expect(volumenes).toEqual([
        {
          nombre: ANONIMO,
          destino: "/var/lib/postgresql/data",
          anonimo: true,
        },
      ]);
    });

    it("devuelve una lista vacia cuando el contenedor no declara montajes", async () => {
      // Arrange
      contenedorMock.inspect.mockResolvedValue({
        State: { Running: true, Status: "running" },
      });

      // Act
      const volumenes = await listarVolumenesDelContenedor("x");

      // Assert
      expect(volumenes).toEqual([]);
    });

    // Sirve tambien como sonda de existencia: el gestor distingue asi si debe recrear o crear.
    it("traduce un error 404 a ContenedorNoEncontradoError", async () => {
      contenedorMock.inspect.mockRejectedValue({ statusCode: 404 });
      await expect(listarVolumenesDelContenedor("x")).rejects.toBeInstanceOf(
        ContenedorNoEncontradoError
      );
    });
  });

  describe("eliminarVolumen", () => {
    it("invoca remove sobre el volumen por su nombre", async () => {
      // Arrange
      volumenMock.remove.mockResolvedValue(undefined);

      // Act
      await eliminarVolumen("datos-redis");

      // Assert
      expect(dockerMock.getVolume).toHaveBeenCalledWith("datos-redis");
      expect(volumenMock.remove).toHaveBeenCalled();
    });

    it("traduce un error 404 a VolumenNoEncontradoError", async () => {
      volumenMock.remove.mockRejectedValue({ statusCode: 404 });
      await expect(eliminarVolumen("datos-redis")).rejects.toBeInstanceOf(
        VolumenNoEncontradoError
      );
    });

    // Docker responde 409 cuando otro contenedor sigue montando el volumen. El nombre de un
    // volumen es global, asi que puede pertenecer a un servicio distinto (DT-15).
    it("traduce un error 409 a VolumenEnUsoError", async () => {
      volumenMock.remove.mockRejectedValue({ statusCode: 409 });
      await expect(eliminarVolumen("datos-redis")).rejects.toBeInstanceOf(
        VolumenEnUsoError
      );
    });

    it("traduce un fallo de conexion al socket a MotorDockerNoDisponibleError", async () => {
      volumenMock.remove.mockRejectedValue({ code: "ECONNREFUSED" });
      await expect(eliminarVolumen("datos-redis")).rejects.toBeInstanceOf(
        MotorDockerNoDisponibleError
      );
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
