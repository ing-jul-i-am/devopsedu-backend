// tests/integracion/api/aprendizaje/iniciar-modulo.test.ts
// Pruebas de integracion para POST /api/aprendizaje/modulos/:idModulo/iniciar.
// Cubre: RF-23 — CU-12

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import { construirApp } from "../../../ayudas/construir-app.js";
import { limpiarBd } from "../../../ayudas/limpiar-bd.js";
import { prismaTest } from "../../../ayudas/prisma-test.js";
import { crearUsuarioConRol } from "../../../ayudas/crear-usuario-con-rol.js";
import { crearModuloEnBd } from "../../../fixtures/modulo.factory.js";

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

describe("POST /api/aprendizaje/modulos/:idModulo/iniciar", () => {
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

  async function asignarRuta(correo: string, idModulo: number) {
    const estudiante = await prismaTest.usuario.findUniqueOrThrow({
      where: { correo },
    });
    return prismaTest.rutaAprendizaje.create({
      data: {
        idUsuario: estudiante.idUsuario,
        rutaModulos: { create: [{ idModulo, ordenSecuencia: 1 }] },
      },
      include: { rutaModulos: true },
    });
  }

  it("marca el inicio del modulo y devuelve 200 cuando pertenece a la ruta del estudiante", async () => {
    // Arrange
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const token = await obtenerToken(ESTUDIANTE);
    const modulo = await crearModuloEnBd();
    await asignarRuta(ESTUDIANTE.correo, modulo.idModulo);

    // Act
    const respuesta = await request(app)
      .post(`/api/aprendizaje/modulos/${modulo.idModulo}/iniciar`)
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.status).toBe(200);
    const rutaModulo = await prismaTest.rutaModulo.findFirst({
      where: { idModulo: modulo.idModulo },
    });
    expect(rutaModulo?.fechaInicio).not.toBeNull();
  });

  it("es idempotente: no reinicia la fecha si ya se habia marcado", async () => {
    // Arrange
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const token = await obtenerToken(ESTUDIANTE);
    const modulo = await crearModuloEnBd();
    await asignarRuta(ESTUDIANTE.correo, modulo.idModulo);
    await request(app)
      .post(`/api/aprendizaje/modulos/${modulo.idModulo}/iniciar`)
      .set("Authorization", `Bearer ${token}`);
    const primera = await prismaTest.rutaModulo.findFirst({
      where: { idModulo: modulo.idModulo },
    });

    // Act
    await request(app)
      .post(`/api/aprendizaje/modulos/${modulo.idModulo}/iniciar`)
      .set("Authorization", `Bearer ${token}`);

    // Assert
    const segunda = await prismaTest.rutaModulo.findFirst({
      where: { idModulo: modulo.idModulo },
    });
    expect(segunda?.fechaInicio).toEqual(primera?.fechaInicio);
  });

  it("rechaza con 404 cuando el modulo no pertenece a la ruta del estudiante", async () => {
    // Arrange
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const token = await obtenerToken(ESTUDIANTE);
    const modulo = await crearModuloEnBd();

    // Act
    const respuesta = await request(app)
      .post(`/api/aprendizaje/modulos/${modulo.idModulo}/iniciar`)
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.status).toBe(404);
  });

  it("rechaza con 403 cuando el usuario es docente", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);
    const modulo = await crearModuloEnBd();

    // Act
    const respuesta = await request(app)
      .post(`/api/aprendizaje/modulos/${modulo.idModulo}/iniciar`)
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.status).toBe(403);
  });

  it("rechaza con 401 cuando no se envia token", async () => {
    // Arrange
    const modulo = await crearModuloEnBd();

    // Act
    const respuesta = await request(app).post(
      `/api/aprendizaje/modulos/${modulo.idModulo}/iniciar`
    );

    // Assert
    expect(respuesta.status).toBe(401);
  });
});
