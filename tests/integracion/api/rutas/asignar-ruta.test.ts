// tests/integracion/api/rutas/asignar-ruta.test.ts
// Pruebas de integracion para POST /api/rutas.
// Cubre: RF-21 — CU-11

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

async function crearModulo(orden: number) {
  return crearModuloEnBd({ nombre: `Modulo ${orden}`, orden });
}

describe("POST /api/rutas", () => {
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

  it("asigna la ruta al estudiante con los modulos en el orden dado y devuelve 201", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    const tokenDocente = await obtenerToken(DOCENTE);
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const estudiante = await prismaTest.usuario.findUniqueOrThrow({
      where: { correo: ESTUDIANTE.correo },
    });
    const moduloA = await crearModulo(1);
    const moduloB = await crearModulo(2);

    // Act
    const respuesta = await request(app)
      .post("/api/rutas")
      .set("Authorization", `Bearer ${tokenDocente}`)
      .send({
        idUsuario: estudiante.idUsuario,
        idModulos: [moduloB.idModulo, moduloA.idModulo],
      });

    // Assert
    expect(respuesta.status).toBe(201);
    expect(respuesta.body.idUsuario).toBe(estudiante.idUsuario);
    expect(respuesta.body.modulos).toEqual([
      { idModulo: moduloB.idModulo, ordenSecuencia: 1 },
      { idModulo: moduloA.idModulo, ordenSecuencia: 2 },
    ]);
  });

  it("rechaza con 403 cuando el usuario es estudiante", async () => {
    // Arrange
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const token = await obtenerToken(ESTUDIANTE);
    const modulo = await crearModulo(1);

    // Act
    const respuesta = await request(app)
      .post("/api/rutas")
      .set("Authorization", `Bearer ${token}`)
      .send({ idUsuario: 1, idModulos: [modulo.idModulo] });

    // Assert
    expect(respuesta.status).toBe(403);
  });

  it("rechaza con 401 cuando no se envia token", async () => {
    // Act
    const respuesta = await request(app)
      .post("/api/rutas")
      .send({ idUsuario: 1, idModulos: [1] });

    // Assert
    expect(respuesta.status).toBe(401);
  });

  it("rechaza con 400 cuando idModulos esta vacio", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);

    // Act
    const respuesta = await request(app)
      .post("/api/rutas")
      .set("Authorization", `Bearer ${token}`)
      .send({ idUsuario: 1, idModulos: [] });

    // Assert
    expect(respuesta.status).toBe(400);
    expect(respuesta.body.detalles).toBeDefined();
  });

  it("rechaza con 404 cuando el usuario destino no existe", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);
    const modulo = await crearModulo(1);

    // Act
    const respuesta = await request(app)
      .post("/api/rutas")
      .set("Authorization", `Bearer ${token}`)
      .send({ idUsuario: 999_999, idModulos: [modulo.idModulo] });

    // Assert
    expect(respuesta.status).toBe(404);
  });

  it("rechaza con 404 cuando alguno de los modulos no existe", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const estudiante = await prismaTest.usuario.findUniqueOrThrow({
      where: { correo: ESTUDIANTE.correo },
    });

    // Act
    const respuesta = await request(app)
      .post("/api/rutas")
      .set("Authorization", `Bearer ${token}`)
      .send({ idUsuario: estudiante.idUsuario, idModulos: [999_999] });

    // Assert
    expect(respuesta.status).toBe(404);
  });
});
