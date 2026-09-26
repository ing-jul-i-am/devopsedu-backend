// tests/unitarias/servicios-aplicacion/gestor-docker.test.ts
// Pruebas unitarias del GestorDocker: orquesta cliente-docker, repositorios y transiciones de
// estado. Se mockea cliente-docker (no dockerode) y los repositorios.
// Incluye la recreacion del contenedor al volver a desplegar y la limpieza de volumenes que no
// son bind mount, tanto al recrear como al eliminar (ver docs/decisiones-tecnicas.md DT-15).
// Cubre: RF-08, RF-11, RF-12, RF-13, RF-14, RF-15, RF-19, RF-23 — CU-05, CU-12

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/docker/cliente-docker.js", () => ({
  nombreContenedor: vi.fn(),
  crearContenedor: vi.fn(),
  iniciarContenedor: vi.fn(),
  detenerContenedor: vi.fn(),
  reiniciarContenedor: vi.fn(),
  eliminarContenedor: vi.fn(),
  eliminarVolumen: vi.fn(),
  listarVolumenesDelContenedor: vi.fn(),
}));

import * as clienteDocker from "@/docker/cliente-docker.js";
import { GestorDocker } from "@/servicios-aplicacion/gestor-docker.js";
import { ServicioNoEncontradoError } from "@/dominio/errores/servicio-no-encontrado-error.js";
import { RecursosInsuficientesError } from "@/dominio/errores/recursos-insuficientes-error.js";
import { TransicionInvalidaError } from "@/dominio/errores/transicion-invalida-error.js";
import { ContenedorNoEncontradoError } from "@/dominio/errores/contenedor-no-encontrado-error.js";
import { VolumenEnUsoError } from "@/dominio/errores/volumen-en-uso-error.js";
import { VolumenNoEncontradoError } from "@/dominio/errores/volumen-no-encontrado-error.js";

function crearDeps() {
  return {
    servicioRepo: {
      buscarPorIdConConfiguracionVigente: vi.fn(),
      actualizarEstado: vi.fn().mockResolvedValue({ estado: "actualizado" }),
      marcarEliminado: vi.fn().mockResolvedValue({ estado: "eliminado" }),
    },
    registroRepo: { registrar: vi.fn() },
    verificador: { verificarDisponibilidad: vi.fn() },
    evaluador: { evaluarTrasOperacion: vi.fn().mockResolvedValue(undefined) },
  };
}

// Deja el contenedor como "ya existente" con los volumenes indicados.
function contenedorExistenteCon(volumenes: string[]): void {
  vi.mocked(clienteDocker.listarVolumenesDelContenedor).mockResolvedValue(
    volumenes
  );
  vi.mocked(clienteDocker.eliminarContenedor).mockResolvedValue(undefined);
  vi.mocked(clienteDocker.eliminarVolumen).mockResolvedValue(undefined);
}

function ordenDeLlamada(mock: { mock: { invocationCallOrder: number[] } }): number {
  return mock.mock.invocationCallOrder[0] ?? Number.MAX_SAFE_INTEGER;
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
    // Por defecto el contenedor no existe: es el caso del primer despliegue.
    vi.mocked(clienteDocker.listarVolumenesDelContenedor).mockRejectedValue(
      new ContenedorNoEncontradoError()
    );
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

    it("informa que no hubo recreacion cuando el contenedor no existia", async () => {
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
      const resultado = await crearGestor(dep).desplegar(5, 1);

      // Assert
      expect(resultado.recreado).toBe(false);
      expect(resultado.volumenesEliminados).toEqual([]);
      expect(clienteDocker.eliminarContenedor).not.toHaveBeenCalled();
    });
  });

  // RF-08 y RF-11: la configuracion editada solo surte efecto si el contenedor se vuelve a crear.
  describe("desplegar cuando el contenedor ya existe (recreacion, DT-15)", () => {
    function prepararRedespliegue(dep: Deps, estado = "detenido") {
      dep.servicioRepo.buscarPorIdConConfiguracionVigente.mockResolvedValue(
        servicio({ estado })
      );
      dep.verificador.verificarDisponibilidad.mockResolvedValue({
        aprobado: true,
        solicitado: {},
        disponible: {},
      });
      vi.mocked(clienteDocker.crearContenedor).mockResolvedValue("cid");
      vi.mocked(clienteDocker.iniciarContenedor).mockResolvedValue(undefined);
    }

    it("elimina el contenedor anterior antes de crear el nuevo", async () => {
      // Arrange
      const dep = crearDeps();
      prepararRedespliegue(dep);
      contenedorExistenteCon([]);

      // Act
      const resultado = await crearGestor(dep).desplegar(5, 1);

      // Assert
      expect(clienteDocker.eliminarContenedor).toHaveBeenCalledWith(
        "devopsedu-1-svc"
      );
      expect(ordenDeLlamada(vi.mocked(clienteDocker.eliminarContenedor))).
        toBeLessThan(ordenDeLlamada(vi.mocked(clienteDocker.crearContenedor)));
      expect(resultado.recreado).toBe(true);
    });

    it("elimina los volumenes nombrados del contenedor anterior y los informa", async () => {
      // Arrange
      const dep = crearDeps();
      prepararRedespliegue(dep);
      contenedorExistenteCon(["datos-redis", "cache-redis"]);

      // Act
      const resultado = await crearGestor(dep).desplegar(5, 1);

      // Assert
      expect(clienteDocker.eliminarVolumen).toHaveBeenCalledWith("datos-redis");
      expect(clienteDocker.eliminarVolumen).toHaveBeenCalledWith("cache-redis");
      expect(resultado.volumenesEliminados).toEqual([
        "datos-redis",
        "cache-redis",
      ]);
      expect(resultado.volumenesOmitidos).toEqual([]);
    });

    it("omite un volumen que otro contenedor sigue usando y completa el despliegue", async () => {
      // Arrange
      const dep = crearDeps();
      prepararRedespliegue(dep);
      contenedorExistenteCon(["compartido"]);
      vi.mocked(clienteDocker.eliminarVolumen).mockRejectedValue(
        new VolumenEnUsoError("compartido")
      );

      // Act
      const resultado = await crearGestor(dep).desplegar(5, 1);

      // Assert
      expect(resultado.volumenesOmitidos).toEqual(["compartido"]);
      expect(resultado.volumenesEliminados).toEqual([]);
      expect(clienteDocker.crearContenedor).toHaveBeenCalled();
    });

    it("no cuenta como eliminado un volumen anonimo que Docker ya arrastro con el contenedor", async () => {
      // Arrange
      const dep = crearDeps();
      prepararRedespliegue(dep);
      contenedorExistenteCon(["a1b2c3"]);
      vi.mocked(clienteDocker.eliminarVolumen).mockRejectedValue(
        new VolumenNoEncontradoError("a1b2c3")
      );

      // Act
      const resultado = await crearGestor(dep).desplegar(5, 1);

      // Assert
      expect(resultado.volumenesEliminados).toEqual([]);
      expect(resultado.volumenesOmitidos).toEqual([]);
      expect(clienteDocker.crearContenedor).toHaveBeenCalled();
    });

    it("marca fallido y registra fallo cuando no se puede retirar el contenedor anterior", async () => {
      // Arrange
      const dep = crearDeps();
      prepararRedespliegue(dep);
      vi.mocked(clienteDocker.listarVolumenesDelContenedor).mockResolvedValue([]);
      vi.mocked(clienteDocker.eliminarContenedor).mockRejectedValue(
        new Error("falla docker")
      );

      // Act + Assert
      await expect(crearGestor(dep).desplegar(5, 1)).rejects.toThrow();
      expect(clienteDocker.crearContenedor).not.toHaveBeenCalled();
      expect(dep.servicioRepo.actualizarEstado).toHaveBeenCalledWith(1, "fallido");
      expect(dep.registroRepo.registrar).toHaveBeenCalledWith(
        expect.objectContaining({ operacion: "desplegar", resultado: "fallo" })
      );
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
      contenedorExistenteCon([]);

      await crearGestor(dep).eliminar(5, 1);

      expect(clienteDocker.eliminarContenedor).toHaveBeenCalledWith(
        "devopsedu-1-svc"
      );
      expect(dep.servicioRepo.marcarEliminado).toHaveBeenCalledWith(1);
      expect(dep.registroRepo.registrar).toHaveBeenCalledWith(
        expect.objectContaining({ operacion: "eliminar", resultado: "exito" })
      );
    });

    // RF-14 + DT-15: al eliminar el servicio se libera tambien el almacenamiento asociado.
    it("elimina los volumenes nombrados del contenedor y los informa", async () => {
      // Arrange
      const dep = crearDeps();
      dep.servicioRepo.buscarPorIdConConfiguracionVigente.mockResolvedValue(
        servicio({ estado: "en_ejecucion" })
      );
      contenedorExistenteCon(["datos-redis"]);

      // Act
      const resultado = await crearGestor(dep).eliminar(5, 1);

      // Assert
      expect(clienteDocker.eliminarVolumen).toHaveBeenCalledWith("datos-redis");
      expect(resultado.volumenesEliminados).toEqual(["datos-redis"]);
    });

    it("marca eliminado aunque el contenedor no exista (servicio nunca desplegado)", async () => {
      const dep = crearDeps();
      dep.servicioRepo.buscarPorIdConConfiguracionVigente.mockResolvedValue(
        servicio({ estado: "configurado" })
      );

      await crearGestor(dep).eliminar(5, 1);

      expect(clienteDocker.eliminarContenedor).not.toHaveBeenCalled();
      expect(dep.servicioRepo.marcarEliminado).toHaveBeenCalledWith(1);
      expect(dep.registroRepo.registrar).toHaveBeenCalledWith(
        expect.objectContaining({ operacion: "eliminar", resultado: "exito" })
      );
    });

    it("registra fallo y no marca eliminado cuando Docker falla por otra causa", async () => {
      const dep = crearDeps();
      dep.servicioRepo.buscarPorIdConConfiguracionVigente.mockResolvedValue(
        servicio({ estado: "en_ejecucion" })
      );
      vi.mocked(clienteDocker.listarVolumenesDelContenedor).mockResolvedValue([]);
      vi.mocked(clienteDocker.eliminarContenedor).mockRejectedValue(
        new Error("falla docker")
      );

      await expect(crearGestor(dep).eliminar(5, 1)).rejects.toThrow();
      expect(dep.servicioRepo.marcarEliminado).not.toHaveBeenCalled();
      expect(dep.registroRepo.registrar).toHaveBeenCalledWith(
        expect.objectContaining({ operacion: "eliminar", resultado: "fallo" })
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

  describe("evaluacion automatica de actividades (RF-23)", () => {
    it("invoca a evaluarTrasOperacion tras desplegar con exito", async () => {
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

      await crearGestor(dep).desplegar(5, 1);

      expect(dep.evaluador.evaluarTrasOperacion).toHaveBeenCalledWith(
        5,
        1,
        "desplegar"
      );
    });

    it("no invoca al evaluador cuando la operacion falla", async () => {
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

      await expect(crearGestor(dep).desplegar(5, 1)).rejects.toThrow();

      expect(dep.evaluador.evaluarTrasOperacion).not.toHaveBeenCalled();
    });

    it("no rompe la respuesta cuando el evaluador de actividades falla", async () => {
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
      dep.evaluador.evaluarTrasOperacion.mockRejectedValue(
        new Error("fallo inesperado del evaluador")
      );

      await expect(crearGestor(dep).desplegar(5, 1)).resolves.toBeDefined();
    });
  });
});
