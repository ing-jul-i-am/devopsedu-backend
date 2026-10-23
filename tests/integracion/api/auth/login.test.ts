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

  // DT-19: dos sesiones simultaneas del mismo usuario (doble clic, dos pestanas) no deben
  // chocar con el indice unico de sesion.token.
  it("permite dos inicios de sesion simultaneos del mismo usuario", async () => {
    // Arrange
    await request(app).post("/api/auth/registro").send(CREDENCIALES);
    const credenciales = {
      correo: CREDENCIALES.correo,
      contrasena: CREDENCIALES.contrasena,
    };

    // Act
    const [primero, segundo] = await Promise.all([
      request(app).post("/api/auth/login").send(credenciales),
      request(app).post("/api/auth/login").send(credenciales),
    ]);

    // Assert
    expect(primero.status).toBe(200);
    expect(segundo.status).toBe(200);
    expect(primero.body.token).not.toBe(segundo.body.token);
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
