// tests/integracion/api/reportes/exportar.test.ts
// Pruebas de integracion para GET /api/reportes/progreso/exportar.
// Cubre: RF-25 — CU-16 (DT-22)

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request, { type Response } from "supertest";
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
  nombre: "Ñandú Pérez",
  correo: "nandu@devopsedu.local",
  contrasena: "Clave_segura_1",
};

const BOM = "﻿";

// Supertest solo junta el cuerpo como texto para tipos de texto; el PDF se recoge en un Buffer.
function recogerBinario(
  respuesta: Response,
  listo: (error: Error | null, cuerpo: Buffer) => void
): void {
  const partes: Buffer[] = [];
  respuesta.on("data", (parte: Buffer) => partes.push(parte));
  respuesta.on("end", () => listo(null, Buffer.concat(partes)));
}

describe("GET /api/reportes/progreso/exportar", () => {
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

  // Un estudiante con una ruta de un modulo y otro, sin ruta, cuyo nombre intenta inyectar una
  // formula en la hoja de calculo.
  async function prepararEscenario() {
    await crearUsuarioConRol(DOCENTE, "docente");
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const nandu = await prismaTest.usuario.findUniqueOrThrow({
      where: { correo: ESTUDIANTE.correo },
    });
    const malicioso = await crearUsuarioEnBd({
      nombre: "=HYPERLINK(\"http://ejemplo.invalido\")",
      idRol: nandu.idRol,
    });
    const modulo = await crearModuloEnBd({ nombre: "Redes en Docker" });
    await prismaTest.rutaAprendizaje.create({
      data: {
        idUsuario: nandu.idUsuario,
        rutaModulos: { create: [{ idModulo: modulo.idModulo, ordenSecuencia: 1 }] },
      },
    });
    return { nandu, malicioso, token: await obtenerToken(DOCENTE) };
  }

  it("descarga el CSV con cabecera, una fila por modulo y las celdas peligrosas neutralizadas", async () => {
    // Arrange
    const { nandu, malicioso, token } = await prepararEscenario();

    // Act
    const respuesta = await request(app)
      .get("/api/reportes/progreso/exportar?formato=csv")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.status).toBe(200);
    expect(respuesta.headers["content-type"]).toBe("text/csv; charset=utf-8");
    expect(respuesta.headers["content-disposition"]).toMatch(
      /^attachment; filename="reporte-progreso-\d{4}-\d{2}-\d{2}\.csv"$/
    );
    const lineas = respuesta.text.split("\r\n");
    expect(lineas[0]).toBe(
      `${BOM}id_estudiante,estudiante,correo,fecha_asignacion_ruta,progreso_ruta,` +
        "orden_modulo,modulo,estado_modulo,actividades_completadas,actividades_totales," +
        "evaluacion,mejor_nota,intentos_evaluacion,evaluacion_aprobada"
    );
    expect(lineas[1]).toBe(
      `${malicioso.idUsuario},"'=HYPERLINK(""http://ejemplo.invalido"")",${malicioso.correo},,,,,,,,,,,`
    );
    expect(lineas[2]).toMatch(
      new RegExp(
        `^${nandu.idUsuario},Ñandú Pérez,nandu@devopsedu\\.local,[^,]+,0,1,Redes en Docker,sin_iniciar,0,0,,,,$`
      )
    );
    expect(lineas[3]).toBe("");
  });

  it("descarga el PDF del reporte", async () => {
    // Arrange
    const { token } = await prepararEscenario();

    // Act
    const respuesta = await request(app)
      .get("/api/reportes/progreso/exportar?formato=pdf")
      .set("Authorization", `Bearer ${token}`)
      .buffer(true)
      .parse(recogerBinario);

    // Assert
    expect(respuesta.status).toBe(200);
    expect(respuesta.headers["content-type"]).toBe("application/pdf");
    expect(respuesta.headers["content-disposition"]).toMatch(
      /^attachment; filename="reporte-progreso-\d{4}-\d{2}-\d{2}\.pdf"$/
    );
    const cuerpo = respuesta.body as Buffer;
    expect(cuerpo.subarray(0, 5).toString("latin1")).toBe("%PDF-");
  });

  it("exporta solo al estudiante indicado e incluye su id en el nombre del archivo", async () => {
    // Arrange
    const { nandu, token } = await prepararEscenario();

    // Act
    const respuesta = await request(app)
      .get(`/api/reportes/progreso/exportar?formato=csv&idUsuario=${nandu.idUsuario}`)
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.status).toBe(200);
    expect(respuesta.headers["content-disposition"]).toContain(
      `reporte-progreso-estudiante-${nandu.idUsuario}-`
    );
    const filas = respuesta.text.split("\r\n").slice(1, -1);
    expect(filas).toHaveLength(1);
    expect(filas[0]?.startsWith(`${nandu.idUsuario},`)).toBe(true);
  });

  it.each([
    ["sin formato", ""],
    ["con formato no soportado", "?formato=xlsx"],
    ["con idUsuario invalido", "?formato=csv&idUsuario=abc"],
  ])("devuelve 400 %s", async (_caso, query) => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);

    // Act
    const respuesta = await request(app)
      .get(`/api/reportes/progreso/exportar${query}`)
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.status).toBe(400);
  });

  it("devuelve 404 cuando idUsuario no corresponde a un estudiante", async () => {
    // Arrange
    await crearUsuarioConRol(DOCENTE, "docente");
    const token = await obtenerToken(DOCENTE);

    // Act
    const respuesta = await request(app)
      .get("/api/reportes/progreso/exportar?formato=pdf&idUsuario=999999")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.status).toBe(404);
    expect(respuesta.body.error).toEqual(expect.any(String));
  });

  it("rechaza con 403 cuando el usuario es estudiante", async () => {
    // Arrange
    await crearUsuarioConRol(ESTUDIANTE, "estudiante");
    const token = await obtenerToken(ESTUDIANTE);

    // Act
    const respuesta = await request(app)
      .get("/api/reportes/progreso/exportar?formato=csv")
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(respuesta.status).toBe(403);
  });

  it("rechaza con 401 sin token", async () => {
    // Act
    const respuesta = await request(app).get(
      "/api/reportes/progreso/exportar?formato=csv"
    );

    // Assert
    expect(respuesta.status).toBe(401);
  });
});
