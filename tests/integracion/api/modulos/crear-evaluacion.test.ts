// tests/integracion/api/modulos/crear-evaluacion.test.ts
// Pruebas de integracion para POST /api/modulos/:idModulo/evaluacion.
// Cubre: RF-24 — CU-14

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import { construirApp } from "../../../ayudas/construir-app.js";
import { limpiarBd } from "../../../ayudas/limpiar-bd.js";
import { prismaTest } from "../../../ayudas/prisma-test.js";
import { crearUsuarioConRol } from "../../../ayudas/crear-usuario-con-rol.js";
import { crearModuloEnBd } from "../../../fixtures/modulo.factory.js";
import { preguntasDePrueba } from "../../../fixtures/evaluacion.factory.js";

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

function datosEvaluacionValidos(parciales: Record<string, unknown> = {}) {
  return {
    titulo: "Evaluacion: Redes en Docker",
    preguntas: preguntasDePrueba(5),
    fechaDisponible: "2026-01-01T00:00:00.000Z",
    ...parciales,
  };
}

describe("POST /api/modulos/:idModulo/evaluacion", () => {
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

  it("crea la evaluacion cuando el docente envia datos validos y devuelve 201", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);
    const modulo = await crearModuloEnBd();

    // Act
    const respuesta = await request(app)
      .post(`/api/modulos/${modulo.idModulo}/evaluacion`)
      .set("Authorization", `Bearer ${token}`)
      .send(datosEvaluacionValidos());

    // Assert
    expect(respuesta.status).toBe(201);
    expect(respuesta.body.idEvaluacion).toEqual(expect.any(Number));
    expect(respuesta.body.idModulo).toBe(modulo.idModulo);
    expect(respuesta.body.preguntas).toHaveLength(5);
  });

  it("rechaza con 409 cuando el modulo ya tiene una evaluacion", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);
    const modulo = await crearModuloEnBd();
    await request(app)
      .post(`/api/modulos/${modulo.idModulo}/evaluacion`)
      .set("Authorization", `Bearer ${token}`)
      .send(datosEvaluacionValidos());

    // Act
    const respuesta = await request(app)
      .post(`/api/modulos/${modulo.idModulo}/evaluacion`)
      .set("Authorization", `Bearer ${token}`)
      .send(datosEvaluacionValidos());

    // Assert
    expect(respuesta.status).toBe(409);
  });

  it("rechaza con 404 cuando el modulo no existe", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);

    // Act
    const respuesta = await request(app)
      .post("/api/modulos/999999/evaluacion")
      .set("Authorization", `Bearer ${token}`)
      .send(datosEvaluacionValidos());

    // Assert
    expect(respuesta.status).toBe(404);
  });

  it("rechaza con 403 cuando el usuario es estudiante", async () => {
    // Arrange
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const token = await obtenerToken(ESTUDIANTE);
    const modulo = await crearModuloEnBd();

    // Act
    const respuesta = await request(app)
      .post(`/api/modulos/${modulo.idModulo}/evaluacion`)
      .set("Authorization", `Bearer ${token}`)
      .send(datosEvaluacionValidos());

    // Assert
    expect(respuesta.status).toBe(403);
  });

  it("rechaza con 401 cuando no se envia token", async () => {
    // Arrange
    const modulo = await crearModuloEnBd();

    // Act
    const respuesta = await request(app)
      .post(`/api/modulos/${modulo.idModulo}/evaluacion`)
      .send(datosEvaluacionValidos());

    // Assert
    expect(respuesta.status).toBe(401);
  });

  it("rechaza con 400 cuando una pregunta no tiene suficientes opciones", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);
    const modulo = await crearModuloEnBd();

    // Act
    const respuesta = await request(app)
      .post(`/api/modulos/${modulo.idModulo}/evaluacion`)
      .set("Authorization", `Bearer ${token}`)
      .send(
        datosEvaluacionValidos({
          preguntas: [{ pregunta: "Unica opcion", opciones: ["a"], respuestaCorrecta: 0 }],
        })
      );

    // Assert
    expect(respuesta.status).toBe(400);
  });

  it("rechaza con 400 cuando respuestaCorrecta esta fuera de rango", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);
    const modulo = await crearModuloEnBd();

    // Act
    const respuesta = await request(app)
      .post(`/api/modulos/${modulo.idModulo}/evaluacion`)
      .set("Authorization", `Bearer ${token}`)
      .send(
        datosEvaluacionValidos({
          preguntas: [
            { pregunta: "Pregunta", opciones: ["a", "b"], respuestaCorrecta: 5 },
          ],
        })
      );

    // Assert
    expect(respuesta.status).toBe(400);
  });
});
