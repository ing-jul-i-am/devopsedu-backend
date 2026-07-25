// tests/integracion/api/servicios/control-panel-detalle.test.ts
// Pruebas de integracion HTTP del panel, el detalle y las operaciones de control de servicios.
// Se mockea cliente-docker (no se toca el motor real); la BD, los gestores y los middlewares son
// reales.
// Cubre: RF-11, RF-12, RF-13, RF-14, RF-15, RF-16, RF-17 — CU-05

import { describe, it, expect, beforeEach, afterAll, vi } from "vitest";
import request from "supertest";

vi.mock("@/docker/cliente-docker.js", () => ({
  nombreContenedor: (idServicio: number, nombre: string) =>
    `devopsedu-${idServicio}-${nombre}`,
  crearContenedor: vi.fn().mockResolvedValue("contenedor-abc"),
  iniciarContenedor: vi.fn().mockResolvedValue(undefined),
  detenerContenedor: vi.fn().mockResolvedValue(undefined),
  reiniciarContenedor: vi.fn().mockResolvedValue(undefined),
  eliminarContenedor: vi.fn().mockResolvedValue(undefined),
}));

import { construirApp } from "../../../ayudas/construir-app.js";
import { limpiarBd } from "../../../ayudas/limpiar-bd.js";
import { prismaTest } from "../../../ayudas/prisma-test.js";
import { crearRolEnBd } from "../../../fixtures/rol.factory.js";

function configValida() {
  return {
    imagenDocker: "postgres:16-alpine",
    cpuAsignado: 1,
    memoriaAsignada: 512,
    almacenamientoAsignado: 1024,
    puertos: [],
    variablesEntorno: {},
    volumenes: [],
  };
}

describe("Control, panel y detalle de servicios", () => {
  const app = construirApp();

  beforeEach(async () => {
    await limpiarBd();
    await crearRolEnBd({ nombre: "estudiante" });
  });

  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  async function tokenDe(correo: string): Promise<string> {
    await request(app).post("/api/auth/registro").send({
      nombre: "Estudiante",
      correo,
      contrasena: "Clave_segura_1",
    });
    const login = await request(app)
      .post("/api/auth/login")
      .send({ correo, contrasena: "Clave_segura_1" });
    return login.body.token as string;
  }

  async function crearServicio(token: string, nombre = "svc"): Promise<number> {
    const respuesta = await request(app)
      .post("/api/servicios")
      .set("Authorization", `Bearer ${token}`)
      .send({ nombre, configuracion: configValida() });
    return respuesta.body.idServicio as number;
  }

  it("GET /api/servicios devuelve el panel con los servicios del usuario", async () => {
    const token = await tokenDe("ana@devopsedu.local");
    await crearServicio(token, "svc-a");

    const respuesta = await request(app)
      .get("/api/servicios")
      .set("Authorization", `Bearer ${token}`);

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toHaveLength(1);
    expect(respuesta.body[0].nombre).toBe("svc-a");
  });

  it("GET /api/servicios rechaza con 401 sin token", async () => {
    const respuesta = await request(app).get("/api/servicios");
    expect(respuesta.status).toBe(401);
  });

  it("recorre el ciclo de vida: desplegar, detener, reiniciar y eliminar", async () => {
    const token = await tokenDe("ana@devopsedu.local");
    const idServicio = await crearServicio(token);
    const bearer = { Authorization: `Bearer ${token}` };

    const desplegar = await request(app)
      .post(`/api/servicios/${idServicio}/desplegar`)
      .set(bearer);
    expect(desplegar.status).toBe(200);
    expect(desplegar.body.estado).toBe("en_ejecucion");

    const detener = await request(app)
      .post(`/api/servicios/${idServicio}/detener`)
      .set(bearer);
    expect(detener.status).toBe(200);
    expect(detener.body.estado).toBe("detenido");

    const reiniciar = await request(app)
      .post(`/api/servicios/${idServicio}/reiniciar`)
      .set(bearer);
    expect(reiniciar.status).toBe(200);
    expect(reiniciar.body.estado).toBe("en_ejecucion");

    const eliminar = await request(app)
      .delete(`/api/servicios/${idServicio}`)
      .set(bearer);
    expect(eliminar.status).toBe(200);
    expect(eliminar.body.estado).toBe("eliminado");

    // RF-15: cada operacion dejo su registro en la bitacora.
    const registros = await prismaTest.registroDespliegue.count({
      where: { idServicio },
    });
    expect(registros).toBe(4);
  });

  it("GET /api/servicios/:id devuelve el detalle con configuracion e historico", async () => {
    const token = await tokenDe("ana@devopsedu.local");
    const idServicio = await crearServicio(token);
    await request(app)
      .post(`/api/servicios/${idServicio}/desplegar`)
      .set("Authorization", `Bearer ${token}`);

    const respuesta = await request(app)
      .get(`/api/servicios/${idServicio}`)
      .set("Authorization", `Bearer ${token}`);

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.estado).toBe("en_ejecucion");
    expect(respuesta.body.configuracion.imagenDocker).toBe("postgres:16-alpine");
    expect(respuesta.body.registros.length).toBeGreaterThanOrEqual(1);
    expect(respuesta.body.registros[0].operacion).toBe("desplegar");
  });

  it("rechaza con 404 al desplegar un servicio de otro usuario", async () => {
    const tokenA = await tokenDe("ana@devopsedu.local");
    const idServicio = await crearServicio(tokenA);
    const tokenB = await tokenDe("beto@devopsedu.local");

    const respuesta = await request(app)
      .post(`/api/servicios/${idServicio}/desplegar`)
      .set("Authorization", `Bearer ${tokenB}`);

    expect(respuesta.status).toBe(404);
  });

  it("rechaza con 409 al detener un servicio que no esta en ejecucion", async () => {
    const token = await tokenDe("ana@devopsedu.local");
    const idServicio = await crearServicio(token);

    const respuesta = await request(app)
      .post(`/api/servicios/${idServicio}/detener`)
      .set("Authorization", `Bearer ${token}`);

    expect(respuesta.status).toBe(409);
  });
});
