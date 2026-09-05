// tests/integracion/api/usuarios/resetear-contrasena.test.ts
// Pruebas de integracion para PATCH /api/usuarios/:id/contrasena.
// Cubre: RF-04

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

describe("PATCH /api/usuarios/:id/contrasena", () => {
  const app = construirApp();

  beforeEach(async () => {
    await limpiarBd();
  });

  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  async function iniciarSesion(datos: {
    correo: string;
    contrasena: string;
  }): Promise<{ token: string; idUsuario: number }> {
    const login = await request(app).post("/api/auth/login").send(datos);
    return { token: login.body.token, idUsuario: login.body.usuario.idUsuario };
  }

  it("actualiza la contrasena cuando el docente envia un id valido y devuelve 200", async () => {
    // Arrange
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const { idUsuario } = await iniciarSesion(ESTUDIANTE);
    await crearUsuarioConRol(DOCENTE, "docente");
    const { token: tokenDocente } = await iniciarSesion(DOCENTE);

    // Act
    const respuesta = await request(app)
      .patch(`/api/usuarios/${idUsuario}/contrasena`)
      .set("Authorization", `Bearer ${tokenDocente}`)
      .send({ contrasenaNueva: "Clave_nueva_2" });

    // Assert
    expect(respuesta.status).toBe(200);
    // La contrasena anterior ya no permite iniciar sesion.
    const loginConClaveVieja = await request(app)
      .post("/api/auth/login")
      .send(ESTUDIANTE);
    expect(loginConClaveVieja.status).toBe(401);
    // La contrasena nueva si permite iniciar sesion.
    const loginConClaveNueva = await request(app)
      .post("/api/auth/login")
      .send({ correo: ESTUDIANTE.correo, contrasena: "Clave_nueva_2" });
    expect(loginConClaveNueva.status).toBe(200);
  });

  it("rechaza con 403 cuando quien invoca es estudiante", async () => {
    // Arrange
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const { token, idUsuario } = await iniciarSesion(ESTUDIANTE);

    // Act
    const respuesta = await request(app)
      .patch(`/api/usuarios/${idUsuario}/contrasena`)
      .set("Authorization", `Bearer ${token}`)
      .send({ contrasenaNueva: "Clave_nueva_2" });

    // Assert
    expect(respuesta.status).toBe(403);
  });

  it("rechaza con 401 cuando no se envia token", async () => {
    // Act
    const respuesta = await request(app)
      .patch("/api/usuarios/1/contrasena")
      .send({ contrasenaNueva: "Clave_nueva_2" });

    // Assert
    expect(respuesta.status).toBe(401);
  });

  it("rechaza con 400 cuando falta contrasenaNueva", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    const { token } = await iniciarSesion(DOCENTE);

    // Act
    const respuesta = await request(app)
      .patch("/api/usuarios/1/contrasena")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    // Assert
    expect(respuesta.status).toBe(400);
  });

  it("rechaza con 404 cuando el usuario no existe", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    const { token } = await iniciarSesion(DOCENTE);

    // Act
    const respuesta = await request(app)
      .patch("/api/usuarios/999999/contrasena")
      .set("Authorization", `Bearer ${token}`)
      .send({ contrasenaNueva: "Clave_nueva_2" });

    // Assert
    expect(respuesta.status).toBe(404);
  });
});
