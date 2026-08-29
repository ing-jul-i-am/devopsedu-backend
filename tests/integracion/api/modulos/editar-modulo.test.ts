// tests/integracion/api/modulos/editar-modulo.test.ts
// Pruebas de integracion para PUT /api/modulos/:idModulo.
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

describe("PUT /api/modulos/:idModulo", () => {
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

  it("aplica los cambios y devuelve 200 cuando el modulo existe", async () => {
    // Arrange
    const modulo = await prismaTest.modulo.create({
      data: { nombre: "Redes", contenidoTeorico: "c", orden: 1 },
    });
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);

    // Act
    const respuesta = await request(app)
      .put(`/api/modulos/${modulo.idModulo}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ nombre: "Redes en Docker", orden: 2 });

    // Assert
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toMatchObject({
      nombre: "Redes en Docker",
      orden: 2,
      contenidoTeorico: "c",
    });
  });

  it("rechaza con 404 cuando el modulo no existe", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);

    // Act
    const respuesta = await request(app)
      .put("/api/modulos/999999")
      .set("Authorization", `Bearer ${token}`)
      .send({ nombre: "No existe" });

    // Assert
    expect(respuesta.status).toBe(404);
  });

  it("rechaza con 403 cuando el usuario es estudiante", async () => {
    // Arrange
    const modulo = await prismaTest.modulo.create({
      data: { nombre: "Redes", contenidoTeorico: "c", orden: 1 },
    });
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const token = await obtenerToken(ESTUDIANTE);

    // Act
    const respuesta = await request(app)
      .put(`/api/modulos/${modulo.idModulo}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ nombre: "Intento" });

    // Assert
    expect(respuesta.status).toBe(403);
  });

  it("rechaza con 400 cuando los datos son invalidos", async () => {
    // Arrange
    const modulo = await prismaTest.modulo.create({
      data: { nombre: "Redes", contenidoTeorico: "c", orden: 1 },
    });
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);

    // Act
    const respuesta = await request(app)
      .put(`/api/modulos/${modulo.idModulo}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ orden: -1 });

    // Assert
    expect(respuesta.status).toBe(400);
    expect(respuesta.body.detalles).toBeDefined();
  });
});
