// tests/integracion/api/servicios/metricas.test.ts
// Pruebas de integracion para GET /api/servicios/:idServicio/metricas.
// Cubre: RF-18

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import { construirApp } from "../../../ayudas/construir-app.js";
import { limpiarBd } from "../../../ayudas/limpiar-bd.js";
import { prismaTest } from "../../../ayudas/prisma-test.js";
import { crearRolEnBd } from "../../../fixtures/rol.factory.js";

const ESTUDIANTE = {
  nombre: "Ana Estudiante",
  correo: "ana@devopsedu.local",
  contrasena: "Clave_segura_1",
};

describe("GET /api/servicios/:idServicio/metricas", () => {
  const app = construirApp();

  beforeEach(async () => {
    await limpiarBd();
    await crearRolEnBd({ nombre: "estudiante" });
  });

  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  async function obtenerTokenYServicio(): Promise<{
    token: string;
    idServicio: number;
  }> {
    await request(app).post("/api/auth/registro").send(ESTUDIANTE);
    const login = await request(app).post("/api/auth/login").send({
      correo: ESTUDIANTE.correo,
      contrasena: ESTUDIANTE.contrasena,
    });
    const token = login.body.token as string;
    const servicio = await request(app)
      .post("/api/servicios")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nombre: "svc",
        configuracion: {
          imagenDocker: "postgres:16-alpine",
          cpuAsignado: 1,
          memoriaAsignada: 512,
          almacenamientoAsignado: 1024,
          puertos: [],
          variablesEntorno: {},
          volumenes: [],
        },
      });
    return { token, idServicio: servicio.body.idServicio as number };
  }

  it("devuelve 200 con el historico de metricas del servicio", async () => {
    // Arrange
    const { token, idServicio } = await obtenerTokenYServicio();
    await prismaTest.metrica.create({
      data: {
        idServicio,
        consumoCpu: 15.25,
        consumoMemoria: 200,
        estadoEjecucion: "en_ejecucion",
      },
    });

    // Act
    const respuesta = await request(app)
      .get(`/api/servicios/${idServicio}/metricas`)
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toHaveLength(1);
    expect(respuesta.body[0].consumoCpu).toBe(15.25);
    expect(respuesta.body[0].consumoMemoria).toBe(200);
  });

  it("rechaza con 401 cuando no se envia token", async () => {
    const respuesta = await request(app).get("/api/servicios/1/metricas");
    expect(respuesta.status).toBe(401);
  });
});
