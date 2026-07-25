// tests/integracion/repositorios/metrica-repo.test.ts
// Pruebas de integracion del repositorio de metricas (series temporales de consumo).
// Cubre: RF-18

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { MetricaRepo } from "@/repositorios/metrica-repo.js";
import { prismaTest } from "../../ayudas/prisma-test.js";
import { limpiarBd } from "../../ayudas/limpiar-bd.js";
import { crearServicioEnBd } from "../../fixtures/servicio.factory.js";

describe("MetricaRepo", () => {
  const repo = new MetricaRepo(prismaTest);

  beforeEach(async () => {
    await limpiarBd();
  });

  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  describe("registrarLote", () => {
    it("inserta varias metricas en una sola operacion", async () => {
      // Arrange
      const servicio = await crearServicioEnBd();

      // Act
      const insertadas = await repo.registrarLote([
        {
          idServicio: servicio.idServicio,
          consumoCpu: 12.5,
          consumoMemoria: 128,
          estadoEjecucion: "en_ejecucion",
        },
        {
          idServicio: servicio.idServicio,
          consumoCpu: 20,
          consumoMemoria: 256,
          estadoEjecucion: "en_ejecucion",
        },
      ]);

      // Assert
      expect(insertadas).toBe(2);
      const total = await prismaTest.metrica.count({
        where: { idServicio: servicio.idServicio },
      });
      expect(total).toBe(2);
    });
  });

  describe("listarPorServicio", () => {
    it("devuelve las metricas del servicio, de la mas reciente a la mas antigua", async () => {
      // Arrange
      const servicio = await crearServicioEnBd();
      await repo.registrarLote([
        {
          idServicio: servicio.idServicio,
          consumoCpu: 10,
          consumoMemoria: 100,
          estadoEjecucion: "en_ejecucion",
        },
      ]);

      // Act
      const metricas = await repo.listarPorServicio(servicio.idServicio);

      // Assert
      expect(metricas).toHaveLength(1);
      expect(Number(metricas[0]?.consumoCpu)).toBe(10);
    });

    it("filtra por rango de fechas cuando se indican desde y hasta", async () => {
      // Arrange
      const servicio = await crearServicioEnBd();
      await prismaTest.metrica.create({
        data: {
          idServicio: servicio.idServicio,
          consumoCpu: 1,
          consumoMemoria: 1,
          estadoEjecucion: "en_ejecucion",
          marcaTiempo: new Date("2026-01-01T00:00:00Z"),
        },
      });
      await prismaTest.metrica.create({
        data: {
          idServicio: servicio.idServicio,
          consumoCpu: 2,
          consumoMemoria: 2,
          estadoEjecucion: "en_ejecucion",
          marcaTiempo: new Date("2026-06-01T00:00:00Z"),
        },
      });

      // Act
      const metricas = await repo.listarPorServicio(servicio.idServicio, {
        desde: new Date("2026-05-01T00:00:00Z"),
        hasta: new Date("2026-07-01T00:00:00Z"),
      });

      // Assert
      expect(metricas).toHaveLength(1);
      expect(metricas[0]?.consumoMemoria).toBe(2);
    });
  });
});
