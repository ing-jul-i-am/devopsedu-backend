// tests/integracion/api/usuarios/listar-estudiantes.test.ts
// Pruebas de integracion para GET /api/usuarios/estudiantes.
// Cubre: RF-04, RF-25 — CU-15 (DT-21)

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import { construirApp } from "../../../ayudas/construir-app.js";
import { limpiarBd } from "../../../ayudas/limpiar-bd.js";
import { prismaTest } from "../../../ayudas/prisma-test.js";
import { crearUsuarioConRol } from "../../../ayudas/crear-usuario-con-rol.js";
import { crearUsuarioEnBd } from "../../../fixtures/usuario.factory.js";
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

describe("GET /api/usuarios/estudiantes", () => {
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

  it("devuelve 200 con los estudiantes ordenados por nombre y el resumen de su ruta", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const luis = await prismaTest.usuario.findUniqueOrThrow({
      where: { correo: ESTUDIANTE.correo },
    });
    const beatriz = await crearUsuarioEnBd({
      nombre: "Beatriz Estudiante",
      idRol: luis.idRol,
    });
    const leido = await crearModuloEnBd({ nombre: "Modulo leido" });
    const pendiente = await crearModuloEnBd({ nombre: "Modulo pendiente" });
    const ruta = await prismaTest.rutaAprendizaje.create({
      data: {
        idUsuario: luis.idUsuario,
        rutaModulos: {
          create: [
            { idModulo: leido.idModulo, ordenSecuencia: 1, fechaInicio: new Date() },
            { idModulo: pendiente.idModulo, ordenSecuencia: 2 },
          ],
        },
      },
    });
    const token = await obtenerToken(DOCENTE);

    // Act
    const respuesta = await request(app)
      .get("/api/usuarios/estudiantes")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual([
      {
        idUsuario: beatriz.idUsuario,
        nombre: "Beatriz Estudiante",
        correo: beatriz.correo,
        fechaRegistro: beatriz.fechaRegistro.toISOString(),
        ruta: null,
      },
      {
        idUsuario: luis.idUsuario,
        nombre: ESTUDIANTE.nombre,
        correo: ESTUDIANTE.correo,
        fechaRegistro: luis.fechaRegistro.toISOString(),
        ruta: {
          idRuta: ruta.idRuta,
          fechaAsignacion: ruta.fechaAsignacion.toISOString(),
          progreso: 50,
          totalModulos: 2,
          modulosCompletados: 1,
        },
      },
    ]);
  });

  it("no expone la contrasena cifrada de los estudiantes", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const token = await obtenerToken(DOCENTE);

    // Act
    const respuesta = await request(app)
      .get("/api/usuarios/estudiantes")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toHaveLength(1);
    expect(respuesta.body[0]).not.toHaveProperty("contrasenaCifrada");
    expect(respuesta.text).not.toContain("$2b$");
  });

  it("devuelve una lista vacia cuando no hay estudiantes registrados", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);

    // Act
    const respuesta = await request(app)
      .get("/api/usuarios/estudiantes")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual([]);
  });

  it("rechaza con 403 cuando el usuario es estudiante", async () => {
    // Arrange
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const token = await obtenerToken(ESTUDIANTE);

    // Act
    const respuesta = await request(app)
      .get("/api/usuarios/estudiantes")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.status).toBe(403);
  });

  it("rechaza con 401 sin token", async () => {
    // Act
    const respuesta = await request(app).get("/api/usuarios/estudiantes");

    // Assert
    expect(respuesta.status).toBe(401);
  });
});
