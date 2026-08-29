// tests/integracion/api/aprendizaje/mi-ruta.test.ts
// Pruebas de integracion para GET /api/aprendizaje/mi-ruta.
// Cubre: RF-22 — CU-13

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import { construirApp } from "../../../ayudas/construir-app.js";
import { limpiarBd } from "../../../ayudas/limpiar-bd.js";
import { prismaTest } from "../../../ayudas/prisma-test.js";
import { crearUsuarioConRol } from "../../../ayudas/crear-usuario-con-rol.js";

const ESTUDIANTE = {
  nombre: "Luis Estudiante",
  correo: "luis@devopsedu.local",
  contrasena: "Clave_segura_1",
};

const DOCENTE = {
  nombre: "Prof. Ana",
  correo: "docente@devopsedu.local",
  contrasena: "Clave_segura_1",
};

describe("GET /api/aprendizaje/mi-ruta", () => {
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

  it("devuelve 200 con la ruta asignada y sus modulos ordenados", async () => {
    // Arrange
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const token = await obtenerToken(ESTUDIANTE);
    const estudiante = await prismaTest.usuario.findUniqueOrThrow({
      where: { correo: ESTUDIANTE.correo },
    });
    const moduloA = await prismaTest.modulo.create({
      data: { nombre: "Modulo A", contenidoTeorico: "c", orden: 1 },
    });
    const moduloB = await prismaTest.modulo.create({
      data: { nombre: "Modulo B", contenidoTeorico: "c", orden: 2 },
    });
    await prismaTest.rutaAprendizaje.create({
      data: {
        idUsuario: estudiante.idUsuario,
        rutaModulos: {
          create: [
            { idModulo: moduloB.idModulo, ordenSecuencia: 1 },
            { idModulo: moduloA.idModulo, ordenSecuencia: 2 },
          ],
        },
      },
    });

    // Act
    const respuesta = await request(app)
      .get("/api/aprendizaje/mi-ruta")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.status).toBe(200);
    expect(respuesta.body.progreso).toBe(0);
    expect(respuesta.body.modulos).toEqual([
      { idModulo: moduloB.idModulo, nombre: "Modulo B", ordenSecuencia: 1 },
      { idModulo: moduloA.idModulo, nombre: "Modulo A", ordenSecuencia: 2 },
    ]);
  });

  it("devuelve 200 con null cuando el estudiante no tiene ruta asignada", async () => {
    // Arrange
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const token = await obtenerToken(ESTUDIANTE);

    // Act
    const respuesta = await request(app)
      .get("/api/aprendizaje/mi-ruta")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toBeNull();
  });

  it("rechaza con 403 cuando el usuario es docente", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);

    // Act
    const respuesta = await request(app)
      .get("/api/aprendizaje/mi-ruta")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.status).toBe(403);
  });

  it("rechaza con 401 cuando no se envia token", async () => {
    // Act
    const respuesta = await request(app).get("/api/aprendizaje/mi-ruta");

    // Assert
    expect(respuesta.status).toBe(401);
  });
});
