// tests/integracion/api/modulos/crear-modulo.test.ts
// Pruebas de integracion para POST /api/modulos.
// Cubre: RF-20 — CU-10

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import { construirApp } from "../../../ayudas/construir-app.js";
import { limpiarBd } from "../../../ayudas/limpiar-bd.js";
import { prismaTest } from "../../../ayudas/prisma-test.js";
import { crearUsuarioConRol } from "../../../ayudas/crear-usuario-con-rol.js";
import {
  bloqueEnlace,
  bloqueImagen,
  bloqueTexto,
  datosModuloValidos,
} from "../../../fixtures/modulo.factory.js";

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

describe("POST /api/modulos", () => {
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

  it("crea el modulo cuando el docente envia datos validos y devuelve 201", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);

    // Act
    const respuesta = await request(app)
      .post("/api/modulos")
      .set("Authorization", `Bearer ${token}`)
      .send(datosModuloValidos());

    // Assert
    expect(respuesta.status).toBe(201);
    expect(respuesta.body).toMatchObject(datosModuloValidos());
    expect(respuesta.body.idModulo).toEqual(expect.any(Number));
  });

  it("acepta un contenido con los tres tipos de bloque", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);
    const contenido = [bloqueTexto(), bloqueImagen(), bloqueEnlace()];

    // Act
    const respuesta = await request(app)
      .post("/api/modulos")
      .set("Authorization", `Bearer ${token}`)
      .send(datosModuloValidos({ contenido }));

    // Assert
    expect(respuesta.status).toBe(201);
    expect(respuesta.body.contenido).toEqual(contenido);
  });

  it("rechaza con 403 cuando el usuario es estudiante", async () => {
    // Arrange
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const token = await obtenerToken(ESTUDIANTE);

    // Act
    const respuesta = await request(app)
      .post("/api/modulos")
      .set("Authorization", `Bearer ${token}`)
      .send(datosModuloValidos());

    // Assert
    expect(respuesta.status).toBe(403);
  });

  it("rechaza con 401 cuando no se envia token", async () => {
    // Act
    const respuesta = await request(app)
      .post("/api/modulos")
      .send(datosModuloValidos());

    // Assert
    expect(respuesta.status).toBe(401);
  });

  it("rechaza con 400 y detalles cuando faltan campos requeridos", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);

    // Act
    const respuesta = await request(app)
      .post("/api/modulos")
      .set("Authorization", `Bearer ${token}`)
      .send({ nombre: "" });

    // Assert
    expect(respuesta.status).toBe(400);
    expect(respuesta.body.detalles).toBeDefined();
  });

  it("rechaza con 400 cuando el contenido es un arreglo vacio", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);

    // Act
    const respuesta = await request(app)
      .post("/api/modulos")
      .set("Authorization", `Bearer ${token}`)
      .send(datosModuloValidos({ contenido: [] }));

    // Assert
    expect(respuesta.status).toBe(400);
    expect(respuesta.body.detalles).toBeDefined();
  });

  it("rechaza con 400 cuando un bloque tiene un tipo no reconocido", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);

    // Act
    const respuesta = await request(app)
      .post("/api/modulos")
      .set("Authorization", `Bearer ${token}`)
      .send(
        datosModuloValidos({
          contenido: [{ tipo: "video", url: "x" } as never],
        })
      );

    // Assert
    expect(respuesta.status).toBe(400);
  });

  it("rechaza con 400 cuando un bloque de imagen no trae url", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);

    // Act
    const respuesta = await request(app)
      .post("/api/modulos")
      .set("Authorization", `Bearer ${token}`)
      .send(
        datosModuloValidos({
          contenido: [{ tipo: "imagen" } as never],
        })
      );

    // Assert
    expect(respuesta.status).toBe(400);
  });

  it("rechaza con 400 cuando un bloque de enlace no trae titulo", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);

    // Act
    const respuesta = await request(app)
      .post("/api/modulos")
      .set("Authorization", `Bearer ${token}`)
      .send(
        datosModuloValidos({
          contenido: [{ tipo: "enlace", url: "https://docs.docker.com/" } as never],
        })
      );

    // Assert
    expect(respuesta.status).toBe(400);
  });
});
