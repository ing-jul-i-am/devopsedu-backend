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
});
