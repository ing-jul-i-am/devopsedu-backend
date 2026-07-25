// tests/integracion/repositorios/servicio-repo.test.ts
// Pruebas de integracion del repositorio de servicios contra la base de pruebas.
// Cubre: RF-05, RF-08

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { ServicioRepo } from "@/repositorios/servicio-repo.js";
import { prismaTest } from "../../ayudas/prisma-test.js";
import { limpiarBd } from "../../ayudas/limpiar-bd.js";
import { crearUsuarioEnBd } from "../../fixtures/usuario.factory.js";

function configValida() {
  return {
    imagenDocker: "postgres:16-alpine",
    cpuAsignado: 1,
    memoriaAsignada: 512,
    almacenamientoAsignado: 1024,
    puertos: [{ host: 5440, contenedor: 5432, protocolo: "tcp" as const }],
    variablesEntorno: { POSTGRES_PASSWORD: "demo" },
    volumenes: [],
  };
}

describe("ServicioRepo", () => {
  const repo = new ServicioRepo(prismaTest);

  beforeEach(async () => {
    await limpiarBd();
  });

  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  describe("crearConConfiguracion", () => {
    it("crea el servicio en estado 'configurado' con su configuracion inicial", async () => {
      // Arrange
      const usuario = await crearUsuarioEnBd();

      // Act
      const servicio = await repo.crearConConfiguracion({
        idUsuario: usuario.idUsuario,
        nombre: "postgres-clase-04",
        descripcion: "BD para la practica",
        configuracion: configValida(),
      });

      // Assert
      expect(servicio.idServicio).toBeTypeOf("number");
      expect(servicio.estado).toBe("configurado");
      expect(servicio.configuraciones).toHaveLength(1);
      expect(servicio.configuraciones[0]?.imagenDocker).toBe("postgres:16-alpine");
    });

    it("rechaza dos servicios con el mismo nombre para el mismo usuario", async () => {
      // Arrange
      const usuario = await crearUsuarioEnBd();
      const datos = {
        idUsuario: usuario.idUsuario,
        nombre: "duplicado",
        configuracion: configValida(),
      };
      await repo.crearConConfiguracion(datos);

      // Act + Assert
      await expect(repo.crearConConfiguracion(datos)).rejects.toThrow();
    });
  });

  describe("buscarPorIdConConfiguracionVigente", () => {
    it("devuelve el servicio con su configuracion mas reciente (vigente)", async () => {
      // Arrange
      const usuario = await crearUsuarioEnBd();
      const servicio = await repo.crearConConfiguracion({
        idUsuario: usuario.idUsuario,
        nombre: "svc",
        configuracion: configValida(),
      });
      // Segunda configuracion, mas reciente, con memoria distinta
      await prismaTest.configuracionServicio.create({
        data: {
          imagenDocker: "postgres:16-alpine",
          cpuAsignado: 1,
          memoriaAsignada: 2048,
          almacenamientoAsignado: 1024,
          puertos: [],
          variablesEntorno: {},
          volumenes: [],
          idServicio: servicio.idServicio,
        },
      });

      // Act
      const encontrado = await repo.buscarPorIdConConfiguracionVigente(
        servicio.idServicio
      );

      // Assert
      expect(encontrado?.configuraciones).toHaveLength(1);
      expect(encontrado?.configuraciones[0]?.memoriaAsignada).toBe(2048);
    });

    it("devuelve null cuando el servicio no existe", async () => {
      // Act
      const encontrado = await repo.buscarPorIdConConfiguracionVigente(999_999);

      // Assert
      expect(encontrado).toBeNull();
    });
  });

  describe("sumarRecursosVigentes", () => {
    it("suma la configuracion vigente de los servicios no eliminados", async () => {
      // Arrange
      const usuario = await crearUsuarioEnBd();
      await repo.crearConConfiguracion({
        idUsuario: usuario.idUsuario,
        nombre: "a",
        configuracion: {
          ...configValida(),
          cpuAsignado: 1,
          memoriaAsignada: 512,
          almacenamientoAsignado: 1024,
        },
      });
      await repo.crearConConfiguracion({
        idUsuario: usuario.idUsuario,
        nombre: "b",
        configuracion: {
          ...configValida(),
          cpuAsignado: 2,
          memoriaAsignada: 1024,
          almacenamientoAsignado: 2048,
        },
      });

      // Act
      const suma = await repo.sumarRecursosVigentes();

      // Assert
      expect(suma).toEqual({ cpu: 3, memoria: 1536, almacenamiento: 3072 });
    });

    it("ignora los servicios en estado 'eliminado'", async () => {
      // Arrange
      const usuario = await crearUsuarioEnBd();
      const servicio = await repo.crearConConfiguracion({
        idUsuario: usuario.idUsuario,
        nombre: "a",
        configuracion: configValida(),
      });
      await prismaTest.servicio.update({
        where: { idServicio: servicio.idServicio },
        data: { estado: "eliminado" },
      });

      // Act
      const suma = await repo.sumarRecursosVigentes();

      // Assert
      expect(suma).toEqual({ cpu: 0, memoria: 0, almacenamiento: 0 });
    });

    it("suma solo la configuracion vigente cuando el servicio tiene historico", async () => {
      // Arrange
      const usuario = await crearUsuarioEnBd();
      const servicio = await repo.crearConConfiguracion({
        idUsuario: usuario.idUsuario,
        nombre: "a",
        configuracion: { ...configValida(), memoriaAsignada: 512 },
      });
      await prismaTest.configuracionServicio.create({
        data: {
          imagenDocker: "postgres:16-alpine",
          cpuAsignado: 1,
          memoriaAsignada: 4096,
          almacenamientoAsignado: 1024,
          puertos: [],
          variablesEntorno: {},
          volumenes: [],
          idServicio: servicio.idServicio,
        },
      });

      // Act
      const suma = await repo.sumarRecursosVigentes();

      // Assert
      expect(suma.memoria).toBe(4096);
    });
  });

  describe("agregarConfiguracion", () => {
    it("inserta una nueva version de configuracion (historico) para el servicio", async () => {
      // Arrange
      const usuario = await crearUsuarioEnBd();
      const servicio = await repo.crearConConfiguracion({
        idUsuario: usuario.idUsuario,
        nombre: "svc",
        configuracion: configValida(),
      });

      // Act
      await repo.agregarConfiguracion(servicio.idServicio, {
        ...configValida(),
        memoriaAsignada: 2048,
      });

      // Assert
      const vigente = await repo.buscarPorIdConConfiguracionVigente(
        servicio.idServicio
      );
      expect(vigente?.configuraciones[0]?.memoriaAsignada).toBe(2048);
      const total = await prismaTest.configuracionServicio.count({
        where: { idServicio: servicio.idServicio },
      });
      expect(total).toBe(2);
    });
  });

  describe("actualizarEstado", () => {
    it("cambia el estado del servicio", async () => {
      // Arrange
      const usuario = await crearUsuarioEnBd();
      const servicio = await repo.crearConConfiguracion({
        idUsuario: usuario.idUsuario,
        nombre: "svc",
        configuracion: configValida(),
      });

      // Act
      const actualizado = await repo.actualizarEstado(
        servicio.idServicio,
        "en_ejecucion"
      );

      // Assert
      expect(actualizado.estado).toBe("en_ejecucion");
    });
  });

  describe("listarActivosPorUsuario", () => {
    it("devuelve los servicios no eliminados del usuario con su configuracion vigente", async () => {
      // Arrange
      const usuario = await crearUsuarioEnBd();
      await repo.crearConConfiguracion({
        idUsuario: usuario.idUsuario,
        nombre: "a",
        configuracion: configValida(),
      });
      const b = await repo.crearConConfiguracion({
        idUsuario: usuario.idUsuario,
        nombre: "b",
        configuracion: configValida(),
      });
      await repo.actualizarEstado(b.idServicio, "eliminado");

      // Act
      const activos = await repo.listarActivosPorUsuario(usuario.idUsuario);

      // Assert
      expect(activos).toHaveLength(1);
      expect(activos[0]?.nombre).toBe("a");
      expect(activos[0]?.configuraciones).toHaveLength(1);
    });

    it("no incluye servicios de otros usuarios", async () => {
      // Arrange
      const usuarioA = await crearUsuarioEnBd();
      const usuarioB = await crearUsuarioEnBd();
      await repo.crearConConfiguracion({
        idUsuario: usuarioA.idUsuario,
        nombre: "a",
        configuracion: configValida(),
      });

      // Act
      const activosB = await repo.listarActivosPorUsuario(usuarioB.idUsuario);

      // Assert
      expect(activosB).toHaveLength(0);
    });
  });

  describe("listarEnEjecucion", () => {
    it("devuelve solo los servicios en estado en_ejecucion, de cualquier usuario", async () => {
      // Arrange
      const usuario1 = await crearUsuarioEnBd();
      const usuario2 = await crearUsuarioEnBd();
      const a = await repo.crearConConfiguracion({
        idUsuario: usuario1.idUsuario,
        nombre: "a",
        configuracion: configValida(),
      });
      await repo.actualizarEstado(a.idServicio, "en_ejecucion");
      await repo.crearConConfiguracion({
        idUsuario: usuario2.idUsuario,
        nombre: "b",
        configuracion: configValida(),
      });

      // Act
      const enEjecucion = await repo.listarEnEjecucion();

      // Assert
      expect(enEjecucion).toHaveLength(1);
      expect(enEjecucion[0]?.nombre).toBe("a");
    });
  });
});
