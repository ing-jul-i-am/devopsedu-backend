// tests/integracion/api/auth/logout.test.ts
// Pruebas de integracion para POST /api/auth/logout.
// Cubre: RF-03 — CU-01

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import { construirApp } from "../../../ayudas/construir-app.js";
import { limpiarBd } from "../../../ayudas/limpiar-bd.js";
import { prismaTest } from "../../../ayudas/prisma-test.js";
import { crearRolEnBd } from "../../../fixtures/rol.factory.js";

const CREDENCIALES = {
  nombre: "Ana Estudiante",
  correo: "ana@devopsedu.local",
  contrasena: "Clave_segura_1",
};

describe("POST /api/auth/logout", () => {
  const app = construirApp();

  beforeEach(async () => {
    await limpiarBd();
    await crearRolEnBd({ nombre: "estudiante" });
  });

  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it("revoca la sesion activa y devuelve 200", async () => {
    // Arrange
    await request(app).post("/api/auth/registro").send(CREDENCIALES);
    const login = await request(app).post("/api/auth/login").send({
      correo: CREDENCIALES.correo,
      contrasena: CREDENCIALES.contrasena,
    });
    const token = login.body.token as string;

    // Act
    const respuesta = await request(app)
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.status).toBe(200);
    const sesion = await prismaTest.sesion.findUnique({ where: { token } });
    expect(sesion?.estado).toBe("revocada");
  });

  it("devuelve 200 aunque no se envie token (operacion idempotente)", async () => {
    // Act
    const respuesta = await request(app).post("/api/auth/logout");

    // Assert
    expect(respuesta.status).toBe(200);
  });
});
