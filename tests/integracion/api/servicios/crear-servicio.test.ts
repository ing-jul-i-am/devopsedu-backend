// tests/integracion/api/servicios/crear-servicio.test.ts
// Pruebas de integracion para POST /api/servicios.
// Cubre: RF-05, RF-06, RF-09 — CU-03, CU-04

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import { construirApp } from "../../../ayudas/construir-app.js";
import { limpiarBd } from "../../../ayudas/limpiar-bd.js";
import { prismaTest } from "../../../ayudas/prisma-test.js";
import { crearRolEnBd } from "../../../fixtures/rol.factory.js";

const ESTUDIANTE = {
  nombre: "Ana Estudiante",
  correo: "ana@devopsedu.local",
  contrasena: "Clave_segura_1",
};

function configValida(sobrescribir: Record<string, unknown> = {}) {
  return {
    imagenDocker: "postgres:16-alpine",
    cpuAsignado: 1,
    memoriaAsignada: 512,
    almacenamientoAsignado: 1024,
    puertos: [{ host: 5440, contenedor: 5432, protocolo: "tcp" }],
    variablesEntorno: { POSTGRES_PASSWORD: "demo" },
    volumenes: [],
    ...sobrescribir,
  };
}

describe("POST /api/servicios", () => {
  const app = construirApp();

  beforeEach(async () => {
    await limpiarBd();
    await crearRolEnBd({ nombre: "estudiante" });
  });

  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  async function obtenerToken(): Promise<string> {
    await request(app).post("/api/auth/registro").send(ESTUDIANTE);
    const login = await request(app).post("/api/auth/login").send({
      correo: ESTUDIANTE.correo,
      contrasena: ESTUDIANTE.contrasena,
    });
    return login.body.token as string;
  }

  it("crea un servicio con configuracion valida y devuelve 201", async () => {
    // Arrange
    const token = await obtenerToken();

    // Act
    const respuesta = await request(app)
      .post("/api/servicios")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nombre: "postgres-clase-04",
        descripcion: "BD para la practica",
        configuracion: configValida(),
      });

    // Assert
    expect(respuesta.status).toBe(201);
    expect(respuesta.body).toMatchObject({
      nombre: "postgres-clase-04",
      estado: "configurado",
    });
    expect(respuesta.body.configuracion.imagenDocker).toBe("postgres:16-alpine");
  });

  it("rechaza con 401 cuando no se envia token", async () => {
    // Act
    const respuesta = await request(app)
      .post("/api/servicios")
      .send({ nombre: "svc", configuracion: configValida() });

    // Assert
    expect(respuesta.status).toBe(401);
  });

  it("rechaza con 400 y detalles cuando la configuracion es invalida", async () => {
    // Arrange
    const token = await obtenerToken();

    // Act
    const respuesta = await request(app)
      .post("/api/servicios")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nombre: "svc",
        configuracion: configValida({ cpuAsignado: -1 }),
      });

    // Assert
    expect(respuesta.status).toBe(400);
    expect(respuesta.body.detalles).toBeDefined();
  });

  it("rechaza con 422 cuando los recursos exceden la capacidad disponible", async () => {
    // Arrange
    const token = await obtenerToken();

    // Act: almacenamiento valido para el esquema pero superior a la capacidad del servidor
    const respuesta = await request(app)
      .post("/api/servicios")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nombre: "servicio-grande",
        configuracion: configValida({ almacenamientoAsignado: 50_000 }),
      });

    // Assert
    expect(respuesta.status).toBe(422);
    expect(respuesta.body.disponible).toBeDefined();
    expect(respuesta.body.solicitado).toBeDefined();
  });
});
