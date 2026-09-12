// tests/integracion/api/modulos/obtener-modulo.test.ts
// Pruebas de integracion para GET /api/modulos/:idModulo.
// Cubre: RF-20 — CU-10

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import { construirApp } from "../../../ayudas/construir-app.js";
import { limpiarBd } from "../../../ayudas/limpiar-bd.js";
import { prismaTest } from "../../../ayudas/prisma-test.js";
import { crearUsuarioConRol } from "../../../ayudas/crear-usuario-con-rol.js";
import { crearModuloEnBd } from "../../../fixtures/modulo.factory.js";

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

describe("GET /api/modulos/:idModulo", () => {
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

  it("devuelve 200 con el contenido del modulo cuando existe", async () => {
    // Arrange
    const modulo = await crearModuloEnBd({ nombre: "Introduccion" });
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);

    // Act
    const respuesta = await request(app)
      .get(`/api/modulos/${modulo.idModulo}`)
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toMatchObject({
      idModulo: modulo.idModulo,
      nombre: "Introduccion",
    });
    expect(respuesta.body.contenido).toEqual(modulo.contenido);
  });

  it("devuelve 404 cuando el modulo no existe", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);

    // Act
    const respuesta = await request(app)
      .get("/api/modulos/999")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.status).toBe(404);
  });

  it("rechaza con 403 cuando el usuario es estudiante", async () => {
    // Arrange
    const modulo = await crearModuloEnBd();
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const token = await obtenerToken(ESTUDIANTE);

    // Act
    const respuesta = await request(app)
      .get(`/api/modulos/${modulo.idModulo}`)
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.status).toBe(403);
  });

  it("rechaza con 401 cuando no se envia token", async () => {
    // Arrange
    const modulo = await crearModuloEnBd();

    // Act
    const respuesta = await request(app).get(`/api/modulos/${modulo.idModulo}`);

    // Assert
    expect(respuesta.status).toBe(401);
  });
});
