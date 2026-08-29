// tests/integracion/api/modulos/listar-modulos.test.ts
// Pruebas de integracion para GET /api/modulos.
// Cubre: RF-20 — CU-10

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import { construirApp } from "../../../ayudas/construir-app.js";
import { limpiarBd } from "../../../ayudas/limpiar-bd.js";
import { prismaTest } from "../../../ayudas/prisma-test.js";
import { crearUsuarioConRol } from "../../../ayudas/crear-usuario-con-rol.js";

const DOCENTE = {
  nombre: "Prof. Ana",
  correo: "docente@devopsedu.local",
  contrasena: "Clave_segura_1",
};

const ESTUDIANTE = {
  nombre: "Luis Estudiante",
  correo: "luis@devopsedu.local",
  contrasena: "Clave_segura_1",
};

describe("GET /api/modulos", () => {
  const app = construirApp();

  beforeEach(async () => {
    await limpiarBd();
  });

  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  async function obtenerToken(datos: {
    correo: string;
    contrasena: string;
  }): Promise<string> {
    const login = await request(app).post("/api/auth/login").send(datos);
    return login.body.token as string;
  }

  it("devuelve 200 con los modulos ordenados por 'orden' ascendente", async () => {
    // Arrange
    await prismaTest.modulo.create({
      data: { nombre: "Tercero", contenidoTeorico: "c", orden: 3 },
    });
    await prismaTest.modulo.create({
      data: { nombre: "Primero", contenidoTeorico: "c", orden: 1 },
    });
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);

    // Act
    const respuesta = await request(app)
      .get("/api/modulos")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.status).toBe(200);
    expect(respuesta.body.map((m: { nombre: string }) => m.nombre)).toEqual([
      "Primero",
      "Tercero",
    ]);
  });

  it("rechaza con 403 cuando el usuario es estudiante", async () => {
    // Arrange
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const token = await obtenerToken(ESTUDIANTE);

    // Act
    const respuesta = await request(app)
      .get("/api/modulos")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.status).toBe(403);
  });

  it("rechaza con 401 cuando no se envia token", async () => {
    // Act
    const respuesta = await request(app).get("/api/modulos");

    // Assert
    expect(respuesta.status).toBe(401);
  });
});
