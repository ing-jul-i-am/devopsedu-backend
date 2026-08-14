// tests/integracion/api/auth/registro.test.ts
// Pruebas de integracion para POST /api/auth/registro.
// Cubre: RF-01 — CU-01

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import { construirApp } from "../../../ayudas/construir-app.js";
import { limpiarBd } from "../../../ayudas/limpiar-bd.js";
import { prismaTest } from "../../../ayudas/prisma-test.js";
import { crearRolEnBd } from "../../../fixtures/rol.factory.js";

describe("POST /api/auth/registro", () => {
  const app = construirApp();

  beforeEach(async () => {
    await limpiarBd();
    await crearRolEnBd({ nombre: "estudiante" });
  });

  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  it("registra un usuario y devuelve 201 sin exponer la contrasena", async () => {
    // Act
    const respuesta = await request(app).post("/api/auth/registro").send({
      nombre: "Ana Estudiante",
      correo: "ana@devopsedu.local",
      contrasena: "Clave_segura_1",
    });

    // Assert
    expect(respuesta.status).toBe(201);
    expect(respuesta.body.usuario.correo).toBe("ana@devopsedu.local");
    expect(respuesta.body.usuario).not.toHaveProperty("contrasenaCifrada");
  });

  it("devuelve 400 cuando el correo es invalido", async () => {
    // Act
    const respuesta = await request(app).post("/api/auth/registro").send({
      nombre: "Ana",
      correo: "no-es-un-correo",
      contrasena: "Clave_segura_1",
    });

    // Assert
    expect(respuesta.status).toBe(400);
  });

  it("devuelve 409 cuando el correo ya esta registrado", async () => {
    // Arrange
    const cuerpo = {
      nombre: "Ana",
      correo: "ana@devopsedu.local",
      contrasena: "Clave_segura_1",
    };
    await request(app).post("/api/auth/registro").send(cuerpo);

    // Act
    const respuesta = await request(app).post("/api/auth/registro").send(cuerpo);

    // Assert
    expect(respuesta.status).toBe(409);
  });
});
