// tests/integracion/api/servicios/imagenes.test.ts
// Pruebas de integracion para GET /api/servicios/imagenes (catalogo de imagenes sugeridas).
// Cubre: RF-07

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

describe("GET /api/servicios/imagenes", () => {
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

  it("devuelve 200 con el catalogo de imagenes sugeridas", async () => {
    // Arrange
    const token = await obtenerToken();

    // Act
    const respuesta = await request(app)
      .get("/api/servicios/imagenes")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.status).toBe(200);
    expect(Array.isArray(respuesta.body)).toBe(true);
    expect(respuesta.body.length).toBeGreaterThan(0);
    expect(respuesta.body[0]).toHaveProperty("nombre");
    expect(respuesta.body[0]).toHaveProperty("descripcion");
  });

  it("rechaza con 401 cuando no se envia token", async () => {
    // Act
    const respuesta = await request(app).get("/api/servicios/imagenes");

    // Assert
    expect(respuesta.status).toBe(401);
  });
});
