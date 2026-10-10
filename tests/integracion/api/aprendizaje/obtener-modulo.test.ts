// tests/integracion/api/aprendizaje/obtener-modulo.test.ts
// Pruebas de integracion para GET /api/aprendizaje/modulos/:idModulo.
// Cubre: RF-23 — CU-12

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import type { Prisma } from "@prisma/client";
import { construirApp } from "../../../ayudas/construir-app.js";
import { limpiarBd } from "../../../ayudas/limpiar-bd.js";
import { prismaTest } from "../../../ayudas/prisma-test.js";
import { crearUsuarioConRol } from "../../../ayudas/crear-usuario-con-rol.js";
import {
  crearModuloEnBd,
  bloqueTexto,
  bloqueActividad,
} from "../../../fixtures/modulo.factory.js";
import { crearActividadEnBd } from "../../../fixtures/actividad.factory.js";
import { crearResultadoActividadEnBd } from "../../../fixtures/resultado.factory.js";
import { crearUsuarioEnBd } from "../../../fixtures/usuario.factory.js";

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

describe("GET /api/aprendizaje/modulos/:idModulo", () => {
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

  it("devuelve el contenido del modulo enriqueciendo los bloques de actividad", async () => {
    // Arrange
    const modulo = await crearModuloEnBd({ nombre: "Introduccion" });
    const actividad = await crearActividadEnBd({
      idModulo: modulo.idModulo,
      descripcion: "Despliega un contenedor nginx",
    });
    await prismaTest.modulo.update({
      where: { idModulo: modulo.idModulo },
      data: {
        contenido: [
          bloqueTexto(),
          bloqueActividad({ idActividad: actividad.idActividad }),
        ] as unknown as Prisma.InputJsonValue,
      },
    });
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const token = await obtenerToken(ESTUDIANTE);
    await asignarRuta(ESTUDIANTE.correo, modulo.idModulo);

    // Act
    const respuesta = await request(app)
      .get(`/api/aprendizaje/modulos/${modulo.idModulo}`)
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toMatchObject({
      idModulo: modulo.idModulo,
      nombre: "Introduccion",
    });
    expect(respuesta.body.contenido).toEqual([
      bloqueTexto(),
      {
        tipo: "actividad",
        idActividad: actividad.idActividad,
        descripcion: "Despliega un contenedor nginx",
        completada: false,
        fechaCompletada: null,
      },
    ]);
    expect(respuesta.body.contenido[1].criteriosValidacion).toBeUndefined();
  });

  async function crearModuloConActividad() {
    const modulo = await crearModuloEnBd({ nombre: "Introduccion" });
    const actividad = await crearActividadEnBd({
      idModulo: modulo.idModulo,
      descripcion: "Despliega un contenedor nginx",
    });
    await prismaTest.modulo.update({
      where: { idModulo: modulo.idModulo },
      data: {
        contenido: [
          bloqueActividad({ idActividad: actividad.idActividad }),
        ] as unknown as Prisma.InputJsonValue,
      },
    });
    return { modulo, actividad };
  }

  it("marca la actividad como completada cuando el estudiante tiene un resultado", async () => {
    // Arrange
    const { modulo, actividad } = await crearModuloConActividad();
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const token = await obtenerToken(ESTUDIANTE);
    const ruta = await asignarRuta(ESTUDIANTE.correo, modulo.idModulo);
    await crearResultadoActividadEnBd({
      idUsuario: ruta.idUsuario,
      idActividad: actividad.idActividad,
      fechaFinalizacion: new Date("2026-10-10T20:12:00.000Z"),
    });

    // Act
    const respuesta = await request(app)
      .get(`/api/aprendizaje/modulos/${modulo.idModulo}`)
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.status).toBe(200);
    expect(respuesta.body.contenido[0]).toMatchObject({
      idActividad: actividad.idActividad,
      completada: true,
      fechaCompletada: "2026-10-10T20:12:00.000Z",
    });
  });

  it("no marca la actividad como completada por un resultado de otro usuario", async () => {
    // Arrange
    const { modulo, actividad } = await crearModuloConActividad();
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const otroEstudiante = await crearUsuarioEnBd();
    const token = await obtenerToken(ESTUDIANTE);
    await asignarRuta(ESTUDIANTE.correo, modulo.idModulo);
    await crearResultadoActividadEnBd({
      idUsuario: otroEstudiante.idUsuario,
      idActividad: actividad.idActividad,
    });

    // Act
    const respuesta = await request(app)
      .get(`/api/aprendizaje/modulos/${modulo.idModulo}`)
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.status).toBe(200);
    expect(respuesta.body.contenido[0]).toMatchObject({
      completada: false,
      fechaCompletada: null,
    });
  });

  it("devuelve la actividad como pendiente cuando el bloque referencia una actividad inexistente", async () => {
    // Arrange
    const modulo = await crearModuloEnBd({
      contenido: [bloqueActividad({ idActividad: 999999 })],
    });
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const token = await obtenerToken(ESTUDIANTE);
    await asignarRuta(ESTUDIANTE.correo, modulo.idModulo);

    // Act
    const respuesta = await request(app)
      .get(`/api/aprendizaje/modulos/${modulo.idModulo}`)
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.status).toBe(200);
    expect(respuesta.body.contenido).toEqual([
      {
        tipo: "actividad",
        idActividad: 999999,
        descripcion: "",
        completada: false,
        fechaCompletada: null,
      },
    ]);
  });

  it("rechaza con 404 cuando el modulo no pertenece a la ruta del estudiante", async () => {
    // Arrange
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const token = await obtenerToken(ESTUDIANTE);
    const modulo = await crearModuloEnBd();

    // Act
    const respuesta = await request(app)
      .get(`/api/aprendizaje/modulos/${modulo.idModulo}`)
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
      .get(`/api/aprendizaje/modulos/${modulo.idModulo}`)
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.status).toBe(403);
  });

  it("rechaza con 401 cuando no se envia token", async () => {
    // Arrange
    const modulo = await crearModuloEnBd();

    // Act
    const respuesta = await request(app).get(
      `/api/aprendizaje/modulos/${modulo.idModulo}`
    );

    // Assert
    expect(respuesta.status).toBe(401);
  });
});
