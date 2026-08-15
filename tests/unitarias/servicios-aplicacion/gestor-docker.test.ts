// tests/unitarias/servicios-aplicacion/gestor-docker.test.ts
// Pruebas unitarias del GestorDocker: orquesta cliente-docker, repositorios y transiciones de
// estado. Se mockea cliente-docker (no dockerode) y los repositorios.
// Cubre: RF-11, RF-12, RF-13, RF-14, RF-15, RF-19 — CU-05

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/docker/cliente-docker.js", () => ({
  nombreContenedor: vi.fn(),
  crearContenedor: vi.fn(),
  iniciarContenedor: vi.fn(),
  detenerContenedor: vi.fn(),
  reiniciarContenedor: vi.fn(),
  eliminarContenedor: vi.fn(),
}));

import * as clienteDocker from "@/docker/cliente-docker.js";
import { GestorDocker } from "@/servicios-aplicacion/gestor-docker.js";
import { ServicioNoEncontradoError } from "@/dominio/errores/servicio-no-encontrado-error.js";
import { RecursosInsuficientesError } from "@/dominio/errores/recursos-insuficientes-error.js";
import { TransicionInvalidaError } from "@/dominio/errores/transicion-invalida-error.js";
import { ContenedorNoEncontradoError } from "@/dominio/errores/contenedor-no-encontrado-error.js";

function crearDeps() {
  return {
    servicioRepo: {
      buscarPorIdConConfiguracionVigente: vi.fn(),
      actualizarEstado: vi.fn().mockResolvedValue({ estado: "actualizado" }),
    },
    registroRepo: { registrar: vi.fn() },
    verificador: { verificarDisponibilidad: vi.fn() },
  };
}

type Deps = ReturnType<typeof crearDeps>;

function servicio(overrides: Record<string, unknown> = {}) {
  return {
    idServicio: 1,
    idUsuario: 5,
    nombre: "svc",
    descripcion: null,
    estado: "configurado",
    fechaCreacion: new Date(),
    configuraciones: [
      {
        idConfiguracion: 1,
        imagenDocker: "postgres:16-alpine",
        cpuAsignado: 1,
        memoriaAsignada: 512,
        almacenamientoAsignado: 1024,
        puertos: [],
        variablesEntorno: {},
        volumenes: [],
        fechaCreacion: new Date(),
        idServicio: 1,
      },
    ],
    ...overrides,
  };
}

function crearGestor(dep: Deps): GestorDocker {
  return new GestorDocker(dep as never);
}

describe("GestorDocker", () => {
  beforeEach(() => {
    vi.mocked(clienteDocker.nombreContenedor).mockReturnValue("devopsedu-1-svc");
  });

  describe("desplegar", () => {
    it("crea, inicia, marca en_ejecucion y registra exito", async () => {
      // Arrange
      const dep = crearDeps();
      dep.servicioRepo.buscarPorIdConConfiguracionVigente.mockResolvedValue(
        servicio()
      );
      dep.verificador.verificarDisponibilidad.mockResolvedValue({
        aprobado: true,
        solicitado: {},
        disponible: {},
      });
      vi.mocked(clienteDocker.crearContenedor).mockResolvedValue("cid");
      vi.mocked(clienteDocker.iniciarContenedor).mockResolvedValue(undefined);

      // Act
      await crearGestor(dep).desplegar(5, 1);

      // Assert
      expect(clienteDocker.crearContenedor).toHaveBeenCalledWith(
        expect.objectContaining({
          nombre: "devopsedu-1-svc",
          imagen: "postgres:16-alpine",
        })
      );
      expect(clienteDocker.iniciarContenedor).toHaveBeenCalledWith(
        "devopsedu-1-svc"
      );
      expect(dep.servicioRepo.actualizarEstado).toHaveBeenCalledWith(
        1,
        "en_ejecucion"
      );
      expect(dep.registroRepo.registrar).toHaveBeenCalledWith(
        expect.objectContaining({ operacion: "desplegar", resultado: "exito" })
      );
    });

    it("marca fallido y registra fallo cuando la creacion del contenedor falla", async () => {
      // Arrange
      const dep = crearDeps();
      dep.servicioRepo.buscarPorIdConConfiguracionVigente.mockResolvedValue(
        servicio()
      );
      dep.verificador.verificarDisponibilidad.mockResolvedValue({
        aprobado: true,
        solicitado: {},
        disponible: {},
      });
      vi.mocked(clienteDocker.crearContenedor).mockRejectedValue(
        new Error("falla docker")
      );

      // Act + Assert
      await expect(crearGestor(dep).desplegar(5, 1)).rejects.toThrow();
      expect(dep.servicioRepo.actualizarEstado).toHaveBeenCalledWith(1, "fallido");
      expect(dep.registroRepo.registrar).toHaveBeenCalledWith(
        expect.objectContaining({ operacion: "desplegar", resultado: "fallo" })
      );
    });

    it("lanza RecursosInsuficientesError y no crea contenedor cuando no hay recursos", async () => {
      // Arrange
      const dep = crearDeps();
      dep.servicioRepo.buscarPorIdConConfiguracionVigente.mockResolvedValue(
        servicio()
      );
      dep.verificador.verificarDisponibilidad.mockResolvedValue({
        aprobado: false,
        solicitado: { cpu: 1, memoria: 512, almacenamiento: 1024 },
        disponible: { cpu: 0, memoria: 0, almacenamiento: 0 },
      });

      // Act + Assert
      await expect(crearGestor(dep).desplegar(5, 1)).rejects.toBeInstanceOf(
        RecursosInsuficientesError
      );
      expect(clienteDocker.crearContenedor).not.toHaveBeenCalled();
    });

    it("lanza ServicioNoEncontradoError cuando el servicio es de otro usuario", async () => {
      const dep = crearDeps();
      dep.servicioRepo.buscarPorIdConConfiguracionVigente.mockResolvedValue(
        servicio({ idUsuario: 99 })
      );
      await expect(crearGestor(dep).desplegar(5, 1)).rejects.toBeInstanceOf(
        ServicioNoEncontradoError
      );
    });

    it("lanza TransicionInvalidaError al desplegar un servicio en ejecucion", async () => {
      const dep = crearDeps();
      dep.servicioRepo.buscarPorIdConConfiguracionVigente.mockResolvedValue(
        servicio({ estado: "en_ejecucion" })
      );
      await expect(crearGestor(dep).desplegar(5, 1)).rejects.toBeInstanceOf(
        TransicionInvalidaError
      );
      expect(clienteDocker.crearContenedor).not.toHaveBeenCalled();
    });
  });

  describe("detener", () => {
    it("detiene, marca detenido y registra exito", async () => {
      const dep = crearDeps();
      dep.servicioRepo.buscarPorIdConConfiguracionVigente.mockResolvedValue(
        servicio({ estado: "en_ejecucion" })
      );
      vi.mocked(clienteDocker.detenerContenedor).mockResolvedValue(undefined);

      await crearGestor(dep).detener(5, 1);

      expect(clienteDocker.detenerContenedor).toHaveBeenCalledWith(
        "devopsedu-1-svc"
      );
      expect(dep.servicioRepo.actualizarEstado).toHaveBeenCalledWith(
        1,
        "detenido"
      );
      expect(dep.registroRepo.registrar).toHaveBeenCalledWith(
        expect.objectContaining({ operacion: "detener", resultado: "exito" })
      );
    });

    it("no cambia el estado y registra fallo cuando detener falla", async () => {
      const dep = crearDeps();
      dep.servicioRepo.buscarPorIdConConfiguracionVigente.mockResolvedValue(
        servicio({ estado: "en_ejecucion" })
      );
      vi.mocked(clienteDocker.detenerContenedor).mockRejectedValue(
        new Error("falla docker")
      );

      await expect(crearGestor(dep).detener(5, 1)).rejects.toThrow();
      expect(dep.servicioRepo.actualizarEstado).not.toHaveBeenCalled();
      expect(dep.registroRepo.registrar).toHaveBeenCalledWith(
        expect.objectContaining({ operacion: "detener", resultado: "fallo" })
      );
    });
  });

  describe("reiniciar", () => {
    it("reinicia, marca en_ejecucion y registra exito", async () => {
      const dep = crearDeps();
      dep.servicioRepo.buscarPorIdConConfiguracionVigente.mockResolvedValue(
        servicio({ estado: "detenido" })
      );
      vi.mocked(clienteDocker.reiniciarContenedor).mockResolvedValue(undefined);

      await crearGestor(dep).reiniciar(5, 1);

      expect(dep.servicioRepo.actualizarEstado).toHaveBeenCalledWith(
        1,
        "reiniciando"
      );
      expect(clienteDocker.reiniciarContenedor).toHaveBeenCalledWith(
        "devopsedu-1-svc"
      );
      expect(dep.servicioRepo.actualizarEstado).toHaveBeenCalledWith(
        1,
        "en_ejecucion"
      );
      expect(dep.registroRepo.registrar).toHaveBeenCalledWith(
        expect.objectContaining({ operacion: "reiniciar", resultado: "exito" })
      );
    });

    it("marca fallido cuando reiniciar falla", async () => {
      const dep = crearDeps();
      dep.servicioRepo.buscarPorIdConConfiguracionVigente.mockResolvedValue(
        servicio({ estado: "detenido" })
      );
      vi.mocked(clienteDocker.reiniciarContenedor).mockRejectedValue(
        new Error("falla docker")
      );

      await expect(crearGestor(dep).reiniciar(5, 1)).rejects.toThrow();
      expect(dep.servicioRepo.actualizarEstado).toHaveBeenCalledWith(1, "fallido");
      expect(dep.registroRepo.registrar).toHaveBeenCalledWith(
        expect.objectContaining({ operacion: "reiniciar", resultado: "fallo" })
      );
    });

    it("permite reiniciar un servicio en estado fallido (RF-19: recuperar un contenedor detenido fuera de la plataforma)", async () => {
      const dep = crearDeps();
      dep.servicioRepo.buscarPorIdConConfiguracionVigente.mockResolvedValue(
        servicio({ estado: "fallido" })
      );
      vi.mocked(clienteDocker.reiniciarContenedor).mockResolvedValue(undefined);

      await crearGestor(dep).reiniciar(5, 1);

      expect(clienteDocker.reiniciarContenedor).toHaveBeenCalledWith(
        "devopsedu-1-svc"
      );
      expect(dep.servicioRepo.actualizarEstado).toHaveBeenCalledWith(
        1,
        "en_ejecucion"
      );
      expect(dep.registroRepo.registrar).toHaveBeenCalledWith(
        expect.objectContaining({ operacion: "reiniciar", resultado: "exito" })
      );
    });
  });

  describe("eliminar", () => {
    it("elimina el contenedor, marca eliminado y registra exito", async () => {
      const dep = crearDeps();
      dep.servicioRepo.buscarPorIdConConfiguracionVigente.mockResolvedValue(
        servicio({ estado: "en_ejecucion" })
      );
      vi.mocked(clienteDocker.eliminarContenedor).mockResolvedValue(undefined);

      await crearGestor(dep).eliminar(5, 1);

      expect(clienteDocker.eliminarContenedor).toHaveBeenCalledWith(
        "devopsedu-1-svc"
      );
      expect(dep.servicioRepo.actualizarEstado).toHaveBeenCalledWith(
        1,
        "eliminado"
      );
      expect(dep.registroRepo.registrar).toHaveBeenCalledWith(
        expect.objectContaining({ operacion: "eliminar", resultado: "exito" })
      );
    });

    it("marca eliminado aunque el contenedor no exista (servicio nunca desplegado)", async () => {
      const dep = crearDeps();
      dep.servicioRepo.buscarPorIdConConfiguracionVigente.mockResolvedValue(
        servicio({ estado: "configurado" })
      );
      vi.mocked(clienteDocker.eliminarContenedor).mockRejectedValue(
        new ContenedorNoEncontradoError()
      );

      await crearGestor(dep).eliminar(5, 1);

      expect(dep.servicioRepo.actualizarEstado).toHaveBeenCalledWith(
        1,
        "eliminado"
      );
      expect(dep.registroRepo.registrar).toHaveBeenCalledWith(
        expect.objectContaining({ operacion: "eliminar", resultado: "exito" })
      );
    });

    it("lanza TransicionInvalidaError al eliminar un servicio ya eliminado", async () => {
      const dep = crearDeps();
      dep.servicioRepo.buscarPorIdConConfiguracionVigente.mockResolvedValue(
        servicio({ estado: "eliminado" })
      );
      await expect(crearGestor(dep).eliminar(5, 1)).rejects.toBeInstanceOf(
        TransicionInvalidaError
      );
    });
  });
});
