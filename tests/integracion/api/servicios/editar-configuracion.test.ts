// tests/integracion/api/servicios/editar-configuracion.test.ts
// Pruebas de integracion para PUT /api/servicios/:idServicio/configuracion.
// Cubre: RF-08 — CU-03

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import { construirApp } from "../../../ayudas/construir-app.js";
import { limpiarBd } from "../../../ayudas/limpiar-bd.js";
import { prismaTest } from "../../../ayudas/prisma-test.js";
import { crearRolEnBd } from "../../../fixtures/rol.factory.js";

function configValida(sobrescribir: Record<string, unknown> = {}) {
  return {
    imagenDocker: "postgres:16-alpine",
    cpuAsignado: 1,
    memoriaAsignada: 512,
    almacenamientoAsignado: 1024,
    puertos: [],
    variablesEntorno: {},
    volumenes: [],
    ...sobrescribir,
  };
}

describe("PUT /api/servicios/:idServicio/configuracion", () => {
  const app = construirApp();

  beforeEach(async () => {
    await limpiarBd();
    await crearRolEnBd({ nombre: "estudiante" });
  });

  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  async function tokenDe(correo: string): Promise<string> {
    await request(app).post("/api/auth/registro").send({
      nombre: "Estudiante",
      correo,
      contrasena: "Clave_segura_1",
    });
    const login = await request(app)
      .post("/api/auth/login")
      .send({ correo, contrasena: "Clave_segura_1" });
    return login.body.token as string;
  }

  async function crearServicio(token: string): Promise<number> {
    const respuesta = await request(app)
      .post("/api/servicios")
      .set("Authorization", `Bearer ${token}`)
      .send({ nombre: "svc", configuracion: configValida() });
    return respuesta.body.idServicio as number;
  }

  it("edita la configuracion, devuelve 200 y registra una nueva version", async () => {
    // Arrange
    const token = await tokenDe("ana@devopsedu.local");
    const idServicio = await crearServicio(token);

    // Act
    const respuesta = await request(app)
      .put(`/api/servicios/${idServicio}/configuracion`)
      .set("Authorization", `Bearer ${token}`)
      .send({ configuracion: configValida({ memoriaAsignada: 2048 }) });

    // Assert
    expect(respuesta.status).toBe(200);
    expect(respuesta.body.configuracion.memoriaAsignada).toBe(2048);
    const total = await prismaTest.configuracionServicio.count({
      where: { idServicio },
    });
    expect(total).toBe(2);
  });

  it("rechaza con 401 cuando no se envia token", async () => {
    // Act
    const respuesta = await request(app)
      .put("/api/servicios/1/configuracion")
      .send({ configuracion: configValida() });

    // Assert
    expect(respuesta.status).toBe(401);
  });

  it("rechaza con 404 cuando el servicio pertenece a otro usuario", async () => {
    // Arrange
    const tokenA = await tokenDe("ana@devopsedu.local");
    const idServicio = await crearServicio(tokenA);
    const tokenB = await tokenDe("beto@devopsedu.local");

    // Act
    const respuesta = await request(app)
      .put(`/api/servicios/${idServicio}/configuracion`)
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ configuracion: configValida({ memoriaAsignada: 2048 }) });

    // Assert
    expect(respuesta.status).toBe(404);
  });

  it("rechaza con 400 cuando la configuracion es invalida", async () => {
    // Arrange
    const token = await tokenDe("ana@devopsedu.local");
    const idServicio = await crearServicio(token);

    // Act
    const respuesta = await request(app)
      .put(`/api/servicios/${idServicio}/configuracion`)
      .set("Authorization", `Bearer ${token}`)
      .send({ configuracion: configValida({ cpuAsignado: -1 }) });

    // Assert
    expect(respuesta.status).toBe(400);
  });
});
