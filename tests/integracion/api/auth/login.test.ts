// tests/integracion/api/auth/login.test.ts
// Pruebas de integracion para POST /api/auth/login.
// Cubre: RF-02 — CU-01

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

describe("POST /api/auth/login", () => {
  const app = construirApp();

  beforeEach(async () => {
    await limpiarBd();
    await crearRolEnBd({ nombre: "estudiante" });
  });

  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it("devuelve token y usuario con credenciales validas", async () => {
    // Arrange
    await request(app).post("/api/auth/registro").send(CREDENCIALES);

    // Act
    const respuesta = await request(app).post("/api/auth/login").send({
      correo: CREDENCIALES.correo,
      contrasena: CREDENCIALES.contrasena,
    });

    // Assert
    expect(respuesta.status).toBe(200);
    expect(respuesta.body.token).toEqual(expect.any(String));
    expect(respuesta.body.usuario.correo).toBe(CREDENCIALES.correo);
    expect(respuesta.body.usuario).not.toHaveProperty("contrasenaCifrada");
  });

  it("devuelve 401 con credenciales invalidas", async () => {
    // Act
    const respuesta = await request(app).post("/api/auth/login").send({
      correo: "inexistente@devopsedu.local",
      contrasena: "clave_incorrecta",
    });

    // Assert
    expect(respuesta.status).toBe(401);
  });
});
