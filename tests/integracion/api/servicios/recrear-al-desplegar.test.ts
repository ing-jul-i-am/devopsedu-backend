// tests/integracion/api/servicios/recrear-al-desplegar.test.ts
// Pruebas de integracion HTTP de la recreacion del contenedor al volver a desplegar y de la
// liberacion del nombre al eliminar. Se mockea cliente-docker (no se toca el motor real); la BD,
// los gestores y los middlewares son reales.
// Cubre: RF-05, RF-08, RF-11, RF-14 — CU-05, CU-06

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
  eliminarVolumen: vi.fn().mockResolvedValue(undefined),
  listarVolumenesDelContenedor: vi.fn(),
}));

import * as clienteDocker from "@/docker/cliente-docker.js";
import { ContenedorNoEncontradoError } from "@/dominio/errores/contenedor-no-encontrado-error.js";
import { construirApp } from "../../../ayudas/construir-app.js";
import { limpiarBd } from "../../../ayudas/limpiar-bd.js";
import { prismaTest } from "../../../ayudas/prisma-test.js";
import { crearRolEnBd } from "../../../fixtures/rol.factory.js";

function configValida(puertoHost = 5440) {
  return {
    imagenDocker: "redis:7-alpine",
    cpuAsignado: 1,
    memoriaAsignada: 512,
    almacenamientoAsignado: 1024,
    puertos: [{ host: puertoHost, contenedor: 6379, protocolo: "tcp" as const }],
    variablesEntorno: {},
    volumenes: [{ origen: "datos-redis", destino: "/data", modo: "rw" as const }],
  };
}

describe("Recreacion al desplegar y liberacion del nombre", () => {
  const app = construirApp();

  beforeEach(async () => {
    await limpiarBd();
    await crearRolEnBd({ nombre: "estudiante" });
    vi.mocked(clienteDocker.eliminarContenedor).mockClear();
    vi.mocked(clienteDocker.crearContenedor).mockClear();
    vi.mocked(clienteDocker.eliminarVolumen).mockClear();
    // Por defecto el contenedor no existe todavia: es el primer despliegue.
    vi.mocked(clienteDocker.listarVolumenesDelContenedor).mockRejectedValue(
      new ContenedorNoEncontradoError()
    );
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

  async function crearServicio(token: string, nombre: string) {
    return request(app)
      .post("/api/servicios")
      .set("Authorization", `Bearer ${token}`)
      .send({ nombre, configuracion: configValida() });
  }

  it("aplica la configuracion editada recreando el contenedor y avisa de los volumenes perdidos", async () => {
    // Arrange: servicio desplegado y detenido, con la configuracion editada despues
    const token = await tokenDe("ana@devopsedu.local");
    const { body } = await crearServicio(token, "cache");
    const id = body.idServicio as number;
    const auth = { Authorization: `Bearer ${token}` };

    await request(app).post(`/api/servicios/${id}/desplegar`).set(auth);
    await request(app).post(`/api/servicios/${id}/detener`).set(auth);
    await request(app)
      .put(`/api/servicios/${id}/configuracion`)
      .set(auth)
      .send({ configuracion: configValida(5441) });

    vi.mocked(clienteDocker.listarVolumenesDelContenedor).mockResolvedValue([
      "datos-redis",
    ]);

    // Act
    const respuesta = await request(app)
      .post(`/api/servicios/${id}/desplegar`)
      .set(auth);

    // Assert
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toMatchObject({
      estado: "en_ejecucion",
      recreado: true,
      volumenesEliminados: ["datos-redis"],
      volumenesOmitidos: [],
    });
    expect(clienteDocker.eliminarContenedor).toHaveBeenCalledWith(
      `devopsedu-${id}-cache`
    );
    expect(clienteDocker.eliminarVolumen).toHaveBeenCalledWith("datos-redis");
    // El contenedor nuevo se crea con el puerto de la configuracion vigente (RF-08).
    expect(clienteDocker.crearContenedor).toHaveBeenLastCalledWith(
      expect.objectContaining({
        puertos: [{ host: 5441, contenedor: 6379, protocolo: "tcp" }],
      })
    );
  });

  it("informa recreado false en el primer despliegue", async () => {
    // Arrange
    const token = await tokenDe("luis@devopsedu.local");
    const { body } = await crearServicio(token, "cache");
    const auth = { Authorization: `Bearer ${token}` };

    // Act
    const respuesta = await request(app)
      .post(`/api/servicios/${body.idServicio}/desplegar`)
      .set(auth);

    // Assert
    expect(respuesta.body).toMatchObject({
      recreado: false,
      volumenesEliminados: [],
    });
    expect(clienteDocker.eliminarContenedor).not.toHaveBeenCalled();
  });

  it("DELETE elimina los volumenes del contenedor y los informa", async () => {
    // Arrange
    const token = await tokenDe("sara@devopsedu.local");
    const { body } = await crearServicio(token, "cache");
    const id = body.idServicio as number;
    const auth = { Authorization: `Bearer ${token}` };
    await request(app).post(`/api/servicios/${id}/desplegar`).set(auth);
    vi.mocked(clienteDocker.listarVolumenesDelContenedor).mockResolvedValue([
      "datos-redis",
    ]);

    // Act
    const respuesta = await request(app).delete(`/api/servicios/${id}`).set(auth);

    // Assert
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toMatchObject({
      estado: "eliminado",
      volumenesEliminados: ["datos-redis"],
    });
  });

  // RF-05 + DT-16: el estudiante que se equivoco al nombrar puede recuperar el nombre exacto que
  // exige la actividad eliminando el servicio y volviendolo a crear.
  it("libera el nombre al eliminar para poder volver a crearlo", async () => {
    // Arrange
    const token = await tokenDe("nora@devopsedu.local");
    const primero = await crearServicio(token, "servidor-web");
    const auth = { Authorization: `Bearer ${token}` };
    await request(app)
      .delete(`/api/servicios/${primero.body.idServicio}`)
      .set(auth);

    // Act
    const segundo = await crearServicio(token, "servidor-web");

    // Assert
    expect(segundo.status).toBe(201);
    expect(segundo.body.nombre).toBe("servidor-web");
    expect(segundo.body.idServicio).not.toBe(primero.body.idServicio);
  });

  it("rechaza con 409 un segundo servicio activo con el mismo nombre", async () => {
    // Arrange
    const token = await tokenDe("hugo@devopsedu.local");
    await crearServicio(token, "servidor-web");

    // Act
    const repetido = await crearServicio(token, "servidor-web");

    // Assert
    expect(repetido.status).toBe(409);
    expect(repetido.body.error).toContain("servidor-web");
  });

  it("expone el tipo de cada volumen para que el frontend advierta la perdida de datos", async () => {
    // Arrange
    const token = await tokenDe("iris@devopsedu.local");
    const { body } = await request(app)
      .post("/api/servicios")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nombre: "mixto",
        configuracion: {
          ...configValida(),
          volumenes: [
            { origen: "datos-redis", destino: "/data", modo: "rw" },
            { origen: "/srv/config", destino: "/etc/redis", modo: "ro" },
          ],
        },
      });

    // Act
    const detalle = await request(app)
      .get(`/api/servicios/${body.idServicio}`)
      .set("Authorization", `Bearer ${token}`);

    // Assert
    expect(detalle.body.configuracion.volumenes).toEqual([
      { origen: "datos-redis", destino: "/data", modo: "rw", tipo: "volumen" },
      { origen: "/srv/config", destino: "/etc/redis", modo: "ro", tipo: "bind" },
    ]);
  });
});
