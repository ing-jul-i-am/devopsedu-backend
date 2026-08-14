// tests/integracion/api/servidor/capacidad.test.ts
// Pruebas de integracion para GET /api/servidor/capacidad.
// Cubre: RF-10 — CU-04

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

describe("GET /api/servidor/capacidad", () => {
  const app = construirApp();

  beforeEach(async () => {
    await limpiarBd();
    await crearRolEnBd({ nombre: "estudiante" });
  });

  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  async function obtenerToken(): Promise<string> {
    await request(app).post("/api/auth/registro").send(ESTUDIANTE);
    const login = await request(app).post("/api/auth/login").send({
      correo: ESTUDIANTE.correo,
      contrasena: ESTUDIANTE.contrasena,
    });
    return login.body.token as string;
  }

  it("devuelve 200 con la capacidad total, comprometida y disponible", async () => {
    // Arrange
    const token = await obtenerToken();

    // Act
    const respuesta = await request(app)
      .get("/api/servidor/capacidad")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.status).toBe(200);
    expect(respuesta.body.total).toHaveProperty("cpu");
    expect(respuesta.body.total).toHaveProperty("memoria");
    expect(respuesta.body.total).toHaveProperty("almacenamiento");
    expect(respuesta.body.comprometido).toBeDefined();
    expect(respuesta.body.disponible).toBeDefined();
  });

  it("rechaza con 401 cuando no se envia token", async () => {
    // Act
    const respuesta = await request(app).get("/api/servidor/capacidad");

    // Assert
    expect(respuesta.status).toBe(401);
  });
});
