// tests/integracion/api/modulos/crear-actividad.test.ts
// Pruebas de integracion para POST /api/modulos/:idModulo/actividades.
// Cubre: RF-23 — CU-12

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import { construirApp } from "../../../ayudas/construir-app.js";
import { limpiarBd } from "../../../ayudas/limpiar-bd.js";
import { prismaTest } from "../../../ayudas/prisma-test.js";
import { crearUsuarioConRol } from "../../../ayudas/crear-usuario-con-rol.js";
import { crearModuloEnBd } from "../../../fixtures/modulo.factory.js";
import { criteriosValidacionDePrueba } from "../../../fixtures/actividad.factory.js";

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

function datosActividadValidos(parciales: Record<string, unknown> = {}) {
  return {
    descripcion: "Despliega un servicio con Docker",
    criteriosValidacion: criteriosValidacionDePrueba({
      operacion: "desplegar",
      condiciones: { imagenDocker: "nginx", volumenesMinimos: 1 },
    }),
    orden: 1,
    ...parciales,
  };
}

describe("POST /api/modulos/:idModulo/actividades", () => {
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

  it("crea la actividad cuando el docente envia datos validos y devuelve 201", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);
    const modulo = await crearModuloEnBd();

    // Act
    const respuesta = await request(app)
      .post(`/api/modulos/${modulo.idModulo}/actividades`)
      .set("Authorization", `Bearer ${token}`)
      .send(datosActividadValidos());

    // Assert
    expect(respuesta.status).toBe(201);
    expect(respuesta.body.idActividad).toEqual(expect.any(Number));
    expect(respuesta.body.idModulo).toBe(modulo.idModulo);
    expect(respuesta.body.criteriosValidacion).toMatchObject(
      datosActividadValidos().criteriosValidacion
    );
  });

  it("rechaza con 404 cuando el modulo no existe", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);

    // Act
    const respuesta = await request(app)
      .post("/api/modulos/999999/actividades")
      .set("Authorization", `Bearer ${token}`)
      .send(datosActividadValidos());

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
      .post(`/api/modulos/${modulo.idModulo}/actividades`)
      .set("Authorization", `Bearer ${token}`)
      .send(datosActividadValidos());

    // Assert
    expect(respuesta.status).toBe(403);
  });

  it("rechaza con 401 cuando no se envia token", async () => {
    // Arrange
    const modulo = await crearModuloEnBd();

    // Act
    const respuesta = await request(app)
      .post(`/api/modulos/${modulo.idModulo}/actividades`)
      .send(datosActividadValidos());

    // Assert
    expect(respuesta.status).toBe(401);
  });

  it("rechaza con 400 cuando la operacion del criterio no es reconocida", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);
    const modulo = await crearModuloEnBd();

    // Act
    const respuesta = await request(app)
      .post(`/api/modulos/${modulo.idModulo}/actividades`)
      .set("Authorization", `Bearer ${token}`)
      .send(
        datosActividadValidos({
          criteriosValidacion: { operacion: "formatear" },
        })
      );

    // Assert
    expect(respuesta.status).toBe(400);
  });

  it("rechaza con 400 cuando faltan campos requeridos", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);
    const modulo = await crearModuloEnBd();

    // Act
    const respuesta = await request(app)
      .post(`/api/modulos/${modulo.idModulo}/actividades`)
      .set("Authorization", `Bearer ${token}`)
      .send({ descripcion: "" });

    // Assert
    expect(respuesta.status).toBe(400);
  });
});
