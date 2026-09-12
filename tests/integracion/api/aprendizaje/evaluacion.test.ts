// tests/integracion/api/aprendizaje/evaluacion.test.ts
// Pruebas de integracion para GET y POST /api/aprendizaje/modulos/:idModulo/evaluacion.
// Cubre: RF-24 — CU-14

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import { construirApp } from "../../../ayudas/construir-app.js";
import { limpiarBd } from "../../../ayudas/limpiar-bd.js";
import { prismaTest } from "../../../ayudas/prisma-test.js";
import { crearUsuarioConRol } from "../../../ayudas/crear-usuario-con-rol.js";
import { crearModuloEnBd } from "../../../fixtures/modulo.factory.js";
import { crearEvaluacionEnBd } from "../../../fixtures/evaluacion.factory.js";

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

const PREGUNTAS = [
  { pregunta: "P1", opciones: ["a", "b"], respuestaCorrecta: 0 },
  { pregunta: "P2", opciones: ["a", "b"], respuestaCorrecta: 1 },
];

describe("GET y POST /api/aprendizaje/modulos/:idModulo/evaluacion", () => {
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
    });
  }

  describe("GET", () => {
    it("devuelve 200 con las preguntas sin la respuesta correcta", async () => {
      // Arrange
      await crearUsuarioConRol(ESTUDIANTE, "estudiante");
      const token = await obtenerToken(ESTUDIANTE);
      const modulo = await crearModuloEnBd();
      await asignarRuta(ESTUDIANTE.correo, modulo.idModulo);
      await crearEvaluacionEnBd({
        idModulo: modulo.idModulo,
        preguntas: PREGUNTAS,
        fechaDisponible: new Date("2020-01-01"),
      });

      // Act
      const respuesta = await request(app)
        .get(`/api/aprendizaje/modulos/${modulo.idModulo}/evaluacion`)
        .set("Authorization", `Bearer ${token}`);

      // Assert
      expect(respuesta.status).toBe(200);
      expect(respuesta.body.preguntas).toHaveLength(2);
      expect(respuesta.body.preguntas[0]).toEqual({
        pregunta: "P1",
        opciones: ["a", "b"],
      });
      expect(respuesta.body.preguntas[0].respuestaCorrecta).toBeUndefined();
    });

    it("rechaza con 404 cuando el modulo no tiene evaluacion", async () => {
      // Arrange
      await crearUsuarioConRol(ESTUDIANTE, "estudiante");
      const token = await obtenerToken(ESTUDIANTE);
      const modulo = await crearModuloEnBd();
      await asignarRuta(ESTUDIANTE.correo, modulo.idModulo);

      // Act
      const respuesta = await request(app)
        .get(`/api/aprendizaje/modulos/${modulo.idModulo}/evaluacion`)
        .set("Authorization", `Bearer ${token}`);

      // Assert
      expect(respuesta.status).toBe(404);
    });

    it("rechaza con 404 cuando el modulo no pertenece a la ruta del estudiante", async () => {
      // Arrange
      await crearUsuarioConRol(ESTUDIANTE, "estudiante");
      const token = await obtenerToken(ESTUDIANTE);
      const modulo = await crearModuloEnBd();
      await crearEvaluacionEnBd({
        idModulo: modulo.idModulo,
        fechaDisponible: new Date("2020-01-01"),
      });

      // Act
      const respuesta = await request(app)
        .get(`/api/aprendizaje/modulos/${modulo.idModulo}/evaluacion`)
        .set("Authorization", `Bearer ${token}`);

      // Assert
      expect(respuesta.status).toBe(404);
    });

    it("rechaza con 422 cuando la evaluacion todavia no esta disponible", async () => {
      // Arrange
      await crearUsuarioConRol(ESTUDIANTE, "estudiante");
      const token = await obtenerToken(ESTUDIANTE);
      const modulo = await crearModuloEnBd();
      await asignarRuta(ESTUDIANTE.correo, modulo.idModulo);
      await crearEvaluacionEnBd({
        idModulo: modulo.idModulo,
        fechaDisponible: new Date(Date.now() + 86_400_000),
      });

      // Act
      const respuesta = await request(app)
        .get(`/api/aprendizaje/modulos/${modulo.idModulo}/evaluacion`)
        .set("Authorization", `Bearer ${token}`);

      // Assert
      expect(respuesta.status).toBe(422);
    });

    it("rechaza con 403 cuando el usuario es docente", async () => {
      // Arrange
      await crearUsuarioConRol(DOCENTE, "docente");
      const token = await obtenerToken(DOCENTE);
      const modulo = await crearModuloEnBd();

      // Act
      const respuesta = await request(app)
        .get(`/api/aprendizaje/modulos/${modulo.idModulo}/evaluacion`)
        .set("Authorization", `Bearer ${token}`);

      // Assert
      expect(respuesta.status).toBe(403);
    });

    it("rechaza con 401 cuando no se envia token", async () => {
      // Arrange
      const modulo = await crearModuloEnBd();

      // Act
      const respuesta = await request(app).get(
        `/api/aprendizaje/modulos/${modulo.idModulo}/evaluacion`
      );

      // Assert
      expect(respuesta.status).toBe(401);
    });
  });

  describe("POST", () => {
    it("devuelve 200 con retroalimentacion y aprobado=true cuando todas las respuestas son correctas", async () => {
      // Arrange
      await crearUsuarioConRol(ESTUDIANTE, "estudiante");
      const token = await obtenerToken(ESTUDIANTE);
      const modulo = await crearModuloEnBd();
      await asignarRuta(ESTUDIANTE.correo, modulo.idModulo);
      await crearEvaluacionEnBd({
        idModulo: modulo.idModulo,
        preguntas: PREGUNTAS,
        fechaDisponible: new Date("2020-01-01"),
      });

      // Act
      const respuesta = await request(app)
        .post(`/api/aprendizaje/modulos/${modulo.idModulo}/evaluacion`)
        .set("Authorization", `Bearer ${token}`)
        .send({ respuestas: [0, 1] });

      // Assert
      expect(respuesta.status).toBe(200);
      expect(respuesta.body.puntuacion).toBe(100);
      expect(respuesta.body.aprobado).toBe(true);
      expect(respuesta.body.intentosRestantes).toBe(1);
    });

    it("rechaza con 409 al intentar de nuevo despues de haber aprobado", async () => {
      // Arrange
      await crearUsuarioConRol(ESTUDIANTE, "estudiante");
      const token = await obtenerToken(ESTUDIANTE);
      const modulo = await crearModuloEnBd();
      await asignarRuta(ESTUDIANTE.correo, modulo.idModulo);
      await crearEvaluacionEnBd({
        idModulo: modulo.idModulo,
        preguntas: PREGUNTAS,
        fechaDisponible: new Date("2020-01-01"),
      });
      await request(app)
        .post(`/api/aprendizaje/modulos/${modulo.idModulo}/evaluacion`)
        .set("Authorization", `Bearer ${token}`)
        .send({ respuestas: [0, 1] });

      // Act
      const respuesta = await request(app)
        .post(`/api/aprendizaje/modulos/${modulo.idModulo}/evaluacion`)
        .set("Authorization", `Bearer ${token}`)
        .send({ respuestas: [0, 1] });

      // Assert
      expect(respuesta.status).toBe(409);
    });

    it("rechaza con 409 al agotar el maximo de intentos sin aprobar", async () => {
      // Arrange
      await crearUsuarioConRol(ESTUDIANTE, "estudiante");
      const token = await obtenerToken(ESTUDIANTE);
      const modulo = await crearModuloEnBd();
      await asignarRuta(ESTUDIANTE.correo, modulo.idModulo);
      await crearEvaluacionEnBd({
        idModulo: modulo.idModulo,
        preguntas: PREGUNTAS,
        fechaDisponible: new Date("2020-01-01"),
      });
      // Dos intentos reprobados (maximo de intentos = 2, ver reglas-evaluacion.ts).
      await request(app)
        .post(`/api/aprendizaje/modulos/${modulo.idModulo}/evaluacion`)
        .set("Authorization", `Bearer ${token}`)
        .send({ respuestas: [1, 0] });
      await request(app)
        .post(`/api/aprendizaje/modulos/${modulo.idModulo}/evaluacion`)
        .set("Authorization", `Bearer ${token}`)
        .send({ respuestas: [1, 0] });

      // Act
      const respuesta = await request(app)
        .post(`/api/aprendizaje/modulos/${modulo.idModulo}/evaluacion`)
        .set("Authorization", `Bearer ${token}`)
        .send({ respuestas: [1, 0] });

      // Assert
      expect(respuesta.status).toBe(409);
    });

    it("rechaza con 400 cuando la cantidad de respuestas no coincide con las preguntas", async () => {
      // Arrange
      await crearUsuarioConRol(ESTUDIANTE, "estudiante");
      const token = await obtenerToken(ESTUDIANTE);
      const modulo = await crearModuloEnBd();
      await asignarRuta(ESTUDIANTE.correo, modulo.idModulo);
      await crearEvaluacionEnBd({
        idModulo: modulo.idModulo,
        preguntas: PREGUNTAS,
        fechaDisponible: new Date("2020-01-01"),
      });

      // Act
      const respuesta = await request(app)
        .post(`/api/aprendizaje/modulos/${modulo.idModulo}/evaluacion`)
        .set("Authorization", `Bearer ${token}`)
        .send({ respuestas: [0] });

      // Assert
      expect(respuesta.status).toBe(400);
    });

    it("rechaza con 422 cuando la evaluacion todavia no esta disponible", async () => {
      // Arrange
      await crearUsuarioConRol(ESTUDIANTE, "estudiante");
      const token = await obtenerToken(ESTUDIANTE);
      const modulo = await crearModuloEnBd();
      await asignarRuta(ESTUDIANTE.correo, modulo.idModulo);
      await crearEvaluacionEnBd({
        idModulo: modulo.idModulo,
        preguntas: PREGUNTAS,
        fechaDisponible: new Date(Date.now() + 86_400_000),
      });

      // Act
      const respuesta = await request(app)
        .post(`/api/aprendizaje/modulos/${modulo.idModulo}/evaluacion`)
        .set("Authorization", `Bearer ${token}`)
        .send({ respuestas: [0, 1] });

      // Assert
      expect(respuesta.status).toBe(422);
    });

    it("rechaza con 403 cuando el usuario es docente", async () => {
      // Arrange
      await crearUsuarioConRol(DOCENTE, "docente");
      const token = await obtenerToken(DOCENTE);
      const modulo = await crearModuloEnBd();

      // Act
      const respuesta = await request(app)
        .post(`/api/aprendizaje/modulos/${modulo.idModulo}/evaluacion`)
        .set("Authorization", `Bearer ${token}`)
        .send({ respuestas: [0, 1] });

      // Assert
      expect(respuesta.status).toBe(403);
    });

    it("rechaza con 401 cuando no se envia token", async () => {
      // Arrange
      const modulo = await crearModuloEnBd();

      // Act
      const respuesta = await request(app)
        .post(`/api/aprendizaje/modulos/${modulo.idModulo}/evaluacion`)
        .send({ respuestas: [0, 1] });

      // Assert
      expect(respuesta.status).toBe(401);
    });
  });
});
