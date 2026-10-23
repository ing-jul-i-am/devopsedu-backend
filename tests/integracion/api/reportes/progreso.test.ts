// tests/integracion/api/reportes/progreso.test.ts
// Pruebas de integracion para GET /api/reportes/progreso.
// Cubre: RF-25 — CU-15 (DT-20)

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import { construirApp } from "../../../ayudas/construir-app.js";
import { limpiarBd } from "../../../ayudas/limpiar-bd.js";
import { prismaTest } from "../../../ayudas/prisma-test.js";
import { crearUsuarioConRol } from "../../../ayudas/crear-usuario-con-rol.js";
import { crearUsuarioEnBd } from "../../../fixtures/usuario.factory.js";
import { crearModuloEnBd } from "../../../fixtures/modulo.factory.js";
import { crearActividadEnBd } from "../../../fixtures/actividad.factory.js";
import { crearEvaluacionEnBd } from "../../../fixtures/evaluacion.factory.js";
import {
  crearResultadoActividadEnBd,
  crearResultadoEvaluacionEnBd,
} from "../../../fixtures/resultado.factory.js";

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

describe("GET /api/reportes/progreso", () => {
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

  // Luis tiene una ruta de un modulo iniciado, con su actividad completada y la evaluacion
  // aprobada en el segundo intento; Beatriz es estudiante pero no tiene ruta.
  async function prepararEscenario() {
    await crearUsuarioConRol(DOCENTE, "docente");
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const luis = await prismaTest.usuario.findUniqueOrThrow({
      where: { correo: ESTUDIANTE.correo },
    });
    const beatriz = await crearUsuarioEnBd({
      nombre: "Beatriz Estudiante",
      idRol: luis.idRol,
    });
    const modulo = await crearModuloEnBd({ nombre: "Volumenes y persistencia" });
    const actividad = await crearActividadEnBd({ idModulo: modulo.idModulo });
    const evaluacion = await crearEvaluacionEnBd({ idModulo: modulo.idModulo });
    await crearResultadoActividadEnBd({
      idUsuario: luis.idUsuario,
      idActividad: actividad.idActividad,
      fechaFinalizacion: new Date("2026-03-02T10:00:00.000Z"),
    });
    await crearResultadoEvaluacionEnBd({
      idUsuario: luis.idUsuario,
      idEvaluacion: evaluacion.idEvaluacion,
      puntuacion: 50,
    });
    await crearResultadoEvaluacionEnBd({
      idUsuario: luis.idUsuario,
      idEvaluacion: evaluacion.idEvaluacion,
      puntuacion: 80,
      intentos: 2,
    });
    const ruta = await prismaTest.rutaAprendizaje.create({
      data: {
        idUsuario: luis.idUsuario,
        rutaModulos: {
          create: [
            {
              idModulo: modulo.idModulo,
              ordenSecuencia: 1,
              fechaInicio: new Date("2026-03-01T10:00:00.000Z"),
            },
          ],
        },
      },
    });
    return { luis, beatriz, modulo, actividad, evaluacion, ruta };
  }

  it("devuelve 200 con el progreso de todos los estudiantes ordenados por nombre", async () => {
    // Arrange
    const { luis, beatriz, modulo, actividad, evaluacion, ruta } =
      await prepararEscenario();
    const token = await obtenerToken(DOCENTE);

    // Act
    const respuesta = await request(app)
      .get("/api/reportes/progreso")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual([
      {
        idUsuario: beatriz.idUsuario,
        nombre: "Beatriz Estudiante",
        correo: beatriz.correo,
        ruta: null,
      },
      {
        idUsuario: luis.idUsuario,
        nombre: ESTUDIANTE.nombre,
        correo: ESTUDIANTE.correo,
        ruta: {
          idRuta: ruta.idRuta,
          fechaAsignacion: ruta.fechaAsignacion.toISOString(),
          progreso: 100,
          modulos: [
            {
              idModulo: modulo.idModulo,
              nombre: "Volumenes y persistencia",
              ordenSecuencia: 1,
              estado: "completado",
              fechaInicio: "2026-03-01T10:00:00.000Z",
              actividades: {
                completadas: 1,
                total: 1,
                detalle: [
                  {
                    idActividad: actividad.idActividad,
                    descripcion: actividad.descripcion,
                    fechaCompletada: "2026-03-02T10:00:00.000Z",
                  },
                ],
              },
              evaluacion: {
                idEvaluacion: evaluacion.idEvaluacion,
                titulo: evaluacion.titulo,
                mejorNota: 80,
                intentos: 2,
                intentosMaximos: 2,
                aprobada: true,
              },
            },
          ],
        },
      },
    ]);
  });

  it("no persiste el progreso recalculado", async () => {
    // Arrange
    const { ruta } = await prepararEscenario();
    const token = await obtenerToken(DOCENTE);

    // Act
    await request(app)
      .get("/api/reportes/progreso")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    const enBd = await prismaTest.rutaAprendizaje.findUniqueOrThrow({
      where: { idRuta: ruta.idRuta },
    });
    expect(Number(enBd.progreso)).toBe(0);
  });

  it("devuelve solo el estudiante indicado con idUsuario", async () => {
    // Arrange
    const { luis } = await prepararEscenario();
    const token = await obtenerToken(DOCENTE);

    // Act
    const respuesta = await request(app)
      .get(`/api/reportes/progreso?idUsuario=${luis.idUsuario}`)
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.status).toBe(200);
    expect(respuesta.body.map((r: { idUsuario: number }) => r.idUsuario)).toEqual([
      luis.idUsuario,
    ]);
  });

  it("devuelve 404 cuando idUsuario no corresponde a un estudiante", async () => {
    // Arrange
    await prepararEscenario();
    const docente = await prismaTest.usuario.findUniqueOrThrow({
      where: { correo: DOCENTE.correo },
    });
    const token = await obtenerToken(DOCENTE);

    // Act
    const inexistente = await request(app)
      .get("/api/reportes/progreso?idUsuario=999999")
      .set("Authorization", `Bearer ${token}`);
    const deDocente = await request(app)
      .get(`/api/reportes/progreso?idUsuario=${docente.idUsuario}`)
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(inexistente.status).toBe(404);
    expect(inexistente.body.error).toEqual(expect.any(String));
    expect(deDocente.status).toBe(404);
    expect(deDocente.body).toEqual(inexistente.body);
  });

  it("devuelve 400 cuando idUsuario no es un entero positivo", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);

    // Act
    const respuesta = await request(app)
      .get("/api/reportes/progreso?idUsuario=abc")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.status).toBe(400);
  });

  it("rechaza con 403 cuando el usuario es estudiante", async () => {
    // Arrange
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const token = await obtenerToken(ESTUDIANTE);

    // Act
    const respuesta = await request(app)
      .get("/api/reportes/progreso")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.status).toBe(403);
  });

  it("rechaza con 401 sin token", async () => {
    // Act
    const respuesta = await request(app).get("/api/reportes/progreso");

    // Assert
    expect(respuesta.status).toBe(401);
  });
});
