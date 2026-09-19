// tests/integracion/api/aprendizaje/mi-ruta.test.ts
// Pruebas de integracion para GET /api/aprendizaje/mi-ruta.
// Cubre: RF-22 — CU-13 (DT-14)

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import { construirApp } from "../../../ayudas/construir-app.js";
import { limpiarBd } from "../../../ayudas/limpiar-bd.js";
import { prismaTest } from "../../../ayudas/prisma-test.js";
import { crearUsuarioConRol } from "../../../ayudas/crear-usuario-con-rol.js";
import { crearModuloEnBd } from "../../../fixtures/modulo.factory.js";
import { crearActividadEnBd } from "../../../fixtures/actividad.factory.js";
import { crearEvaluacionEnBd } from "../../../fixtures/evaluacion.factory.js";
import {
  crearResultadoActividadEnBd,
  crearResultadoEvaluacionEnBd,
} from "../../../fixtures/resultado.factory.js";

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
    const moduloA = await crearModuloEnBd({ nombre: "Modulo A", orden: 1 });
    const moduloB = await crearModuloEnBd({ nombre: "Modulo B", orden: 2 });
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
      { idModulo: moduloB.idModulo, nombre: "Modulo B", ordenSecuencia: 1, estado: "sin_iniciar" },
      { idModulo: moduloA.idModulo, nombre: "Modulo A", ordenSecuencia: 2, estado: "sin_iniciar" },
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

  it("marca el modulo como completado cuando esta iniciado, su actividad esta completa y su evaluacion fue aprobada", async () => {
    // Arrange
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const token = await obtenerToken(ESTUDIANTE);
    const estudiante = await prismaTest.usuario.findUniqueOrThrow({
      where: { correo: ESTUDIANTE.correo },
    });
    const modulo = await crearModuloEnBd({ nombre: "Modulo con evaluacion" });
    const actividad = await crearActividadEnBd({ idModulo: modulo.idModulo });
    const evaluacion = await crearEvaluacionEnBd({ idModulo: modulo.idModulo });
    await crearResultadoActividadEnBd({
      idUsuario: estudiante.idUsuario,
      idActividad: actividad.idActividad,
    });
    await crearResultadoEvaluacionEnBd({
      idUsuario: estudiante.idUsuario,
      idEvaluacion: evaluacion.idEvaluacion,
      puntuacion: 100,
    });
    await prismaTest.rutaAprendizaje.create({
      data: {
        idUsuario: estudiante.idUsuario,
        rutaModulos: {
          create: [{ idModulo: modulo.idModulo, ordenSecuencia: 1, fechaInicio: new Date("2026-01-01") }],
        },
      },
    });

    // Act
    const respuesta = await request(app)
      .get("/api/aprendizaje/mi-ruta")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.body.modulos[0].estado).toBe("completado");
  });

  it("marca el modulo como en_progreso cuando esta iniciado pero la evaluacion no fue aprobada", async () => {
    // Arrange
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const token = await obtenerToken(ESTUDIANTE);
    const estudiante = await prismaTest.usuario.findUniqueOrThrow({
      where: { correo: ESTUDIANTE.correo },
    });
    const modulo = await crearModuloEnBd({ nombre: "Modulo con evaluacion" });
    const actividad = await crearActividadEnBd({ idModulo: modulo.idModulo });
    const evaluacion = await crearEvaluacionEnBd({ idModulo: modulo.idModulo });
    await crearResultadoActividadEnBd({
      idUsuario: estudiante.idUsuario,
      idActividad: actividad.idActividad,
    });
    await crearResultadoEvaluacionEnBd({
      idUsuario: estudiante.idUsuario,
      idEvaluacion: evaluacion.idEvaluacion,
      puntuacion: 40,
    });
    await prismaTest.rutaAprendizaje.create({
      data: {
        idUsuario: estudiante.idUsuario,
        rutaModulos: {
          create: [{ idModulo: modulo.idModulo, ordenSecuencia: 1, fechaInicio: new Date("2026-01-01") }],
        },
      },
    });

    // Act
    const respuesta = await request(app)
      .get("/api/aprendizaje/mi-ruta")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.body.modulos[0].estado).toBe("en_progreso");
  });

  it("marca el modulo como sin_iniciar cuando tiene una actividad pendiente y no ha sido iniciado", async () => {
    // Arrange
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const token = await obtenerToken(ESTUDIANTE);
    const estudiante = await prismaTest.usuario.findUniqueOrThrow({
      where: { correo: ESTUDIANTE.correo },
    });
    const modulo = await crearModuloEnBd({ nombre: "Modulo sin iniciar" });
    await crearActividadEnBd({ idModulo: modulo.idModulo });
    await prismaTest.rutaAprendizaje.create({
      data: {
        idUsuario: estudiante.idUsuario,
        rutaModulos: {
          create: [{ idModulo: modulo.idModulo, ordenSecuencia: 1 }],
        },
      },
    });

    // Act
    const respuesta = await request(app)
      .get("/api/aprendizaje/mi-ruta")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.body.modulos[0].estado).toBe("sin_iniciar");
  });

  it("marca como completado un modulo sin actividades ni evaluacion en cuanto se inicia", async () => {
    // Arrange
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const token = await obtenerToken(ESTUDIANTE);
    const estudiante = await prismaTest.usuario.findUniqueOrThrow({
      where: { correo: ESTUDIANTE.correo },
    });
    const modulo = await crearModuloEnBd({ nombre: "Modulo de solo lectura" });
    await prismaTest.rutaAprendizaje.create({
      data: {
        idUsuario: estudiante.idUsuario,
        rutaModulos: {
          create: [{ idModulo: modulo.idModulo, ordenSecuencia: 1, fechaInicio: new Date("2026-01-01") }],
        },
      },
    });

    // Act
    const respuesta = await request(app)
      .get("/api/aprendizaje/mi-ruta")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.body.modulos[0].estado).toBe("completado");
  });

  it("calcula el estado de cada modulo de la ruta de forma independiente", async () => {
    // Arrange
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const token = await obtenerToken(ESTUDIANTE);
    const estudiante = await prismaTest.usuario.findUniqueOrThrow({
      where: { correo: ESTUDIANTE.correo },
    });
    const moduloCompletado = await crearModuloEnBd({ nombre: "Modulo completado" });
    const moduloSinIniciar = await crearModuloEnBd({ nombre: "Modulo sin iniciar" });
    await prismaTest.rutaAprendizaje.create({
      data: {
        idUsuario: estudiante.idUsuario,
        rutaModulos: {
          create: [
            { idModulo: moduloCompletado.idModulo, ordenSecuencia: 1, fechaInicio: new Date("2026-01-01") },
            { idModulo: moduloSinIniciar.idModulo, ordenSecuencia: 2 },
          ],
        },
      },
    });

    // Act
    const respuesta = await request(app)
      .get("/api/aprendizaje/mi-ruta")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.body.modulos).toEqual([
      { idModulo: moduloCompletado.idModulo, nombre: "Modulo completado", ordenSecuencia: 1, estado: "completado" },
      { idModulo: moduloSinIniciar.idModulo, nombre: "Modulo sin iniciar", ordenSecuencia: 2, estado: "sin_iniciar" },
    ]);
  });

  it("devuelve y persiste progreso 100 cuando todos los modulos de solo lectura fueron iniciados", async () => {
    // Arrange
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const token = await obtenerToken(ESTUDIANTE);
    const estudiante = await prismaTest.usuario.findUniqueOrThrow({
      where: { correo: ESTUDIANTE.correo },
    });
    const modulos = [
      await crearModuloEnBd({ nombre: "Lectura 1" }),
      await crearModuloEnBd({ nombre: "Lectura 2" }),
      await crearModuloEnBd({ nombre: "Lectura 3" }),
    ];
    const ruta = await prismaTest.rutaAprendizaje.create({
      data: {
        idUsuario: estudiante.idUsuario,
        rutaModulos: {
          create: modulos.map((modulo, indice) => ({
            idModulo: modulo.idModulo,
            ordenSecuencia: indice + 1,
            fechaInicio: new Date("2026-01-01"),
          })),
        },
      },
    });

    // Act
    const respuesta = await request(app)
      .get("/api/aprendizaje/mi-ruta")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.body.progreso).toBe(100);
    const rutaPersistida = await prismaTest.rutaAprendizaje.findUniqueOrThrow({
      where: { idRuta: ruta.idRuta },
    });
    expect(Number(rutaPersistida.progreso)).toBe(100);
  });

  it("no suma al progreso los modulos con actividades pendientes", async () => {
    // Arrange
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const token = await obtenerToken(ESTUDIANTE);
    const estudiante = await prismaTest.usuario.findUniqueOrThrow({
      where: { correo: ESTUDIANTE.correo },
    });
    const moduloLectura = await crearModuloEnBd({ nombre: "Lectura" });
    const moduloPractico = await crearModuloEnBd({ nombre: "Practica" });
    await crearActividadEnBd({ idModulo: moduloPractico.idModulo });
    await prismaTest.rutaAprendizaje.create({
      data: {
        idUsuario: estudiante.idUsuario,
        rutaModulos: {
          create: [
            { idModulo: moduloLectura.idModulo, ordenSecuencia: 1, fechaInicio: new Date("2026-01-01") },
            { idModulo: moduloPractico.idModulo, ordenSecuencia: 2, fechaInicio: new Date("2026-01-01") },
          ],
        },
      },
    });

    // Act
    const respuesta = await request(app)
      .get("/api/aprendizaje/mi-ruta")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.body.progreso).toBe(50);
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
