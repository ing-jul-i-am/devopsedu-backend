// tests/integracion/api/modulos/subir-imagen-modulo.test.ts
// Pruebas de integracion para POST /api/modulos/imagenes.
// Cubre: RF-20 — CU-10

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import { construirApp } from "../../../ayudas/construir-app.js";
import { limpiarBd } from "../../../ayudas/limpiar-bd.js";
import { prismaTest } from "../../../ayudas/prisma-test.js";
import { crearUsuarioConRol } from "../../../ayudas/crear-usuario-con-rol.js";
import { TAMANO_MAXIMO_IMAGEN_BYTES } from "@/dominio/limites-contenido-modulo.js";

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

describe("POST /api/modulos/imagenes", () => {
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

  it("guarda la imagen y devuelve una url servible cuando el docente sube un archivo valido", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);

    // Act
    const respuesta = await request(app)
      .post("/api/modulos/imagenes")
      .set("Authorization", `Bearer ${token}`)
      .attach("imagen", Buffer.from("contenido-de-prueba"), {
        filename: "diagrama.png",
        contentType: "image/png",
      });

    // Assert
    expect(respuesta.status).toBe(201);
    expect(respuesta.body.url).toEqual(
      expect.stringContaining("/archivos/modulos/")
    );

    const descarga = await request(app).get(respuesta.body.url);
    expect(descarga.status).toBe(200);
  });

  it("rechaza con 401 cuando no se envia token", async () => {
    // Act
    const respuesta = await request(app)
      .post("/api/modulos/imagenes")
      .attach("imagen", Buffer.from("x"), {
        filename: "a.png",
        contentType: "image/png",
      });

    // Assert
    expect(respuesta.status).toBe(401);
  });

  it("rechaza con 403 cuando el usuario es estudiante", async () => {
    // Arrange
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const token = await obtenerToken(ESTUDIANTE);

    // Act
    const respuesta = await request(app)
      .post("/api/modulos/imagenes")
      .set("Authorization", `Bearer ${token}`)
      .attach("imagen", Buffer.from("x"), {
        filename: "a.png",
        contentType: "image/png",
      });

    // Assert
    expect(respuesta.status).toBe(403);
  });

  it("rechaza con 400 cuando no se adjunta ningun archivo", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);

    // Act
    const respuesta = await request(app)
      .post("/api/modulos/imagenes")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.status).toBe(400);
  });

  it("rechaza con 400 cuando el tipo de archivo no esta permitido", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);

    // Act
    const respuesta = await request(app)
      .post("/api/modulos/imagenes")
      .set("Authorization", `Bearer ${token}`)
      .attach("imagen", Buffer.from("contenido"), {
        filename: "documento.pdf",
        contentType: "application/pdf",
      });

    // Assert
    expect(respuesta.status).toBe(400);
  });

  it("rechaza con 400 cuando el archivo excede el tamano maximo permitido", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);
    const archivoGrande = Buffer.alloc(TAMANO_MAXIMO_IMAGEN_BYTES + 1);

    // Act
    const respuesta = await request(app)
      .post("/api/modulos/imagenes")
      .set("Authorization", `Bearer ${token}`)
      .attach("imagen", archivoGrande, {
        filename: "grande.png",
        contentType: "image/png",
      });

    // Assert
    expect(respuesta.status).toBe(400);
  });
});
