// tests/unitarias/api/middlewares/cors.test.ts
// Pruebas unitarias del middleware CORS: solo los origenes configurados reciben los
// encabezados de acceso, y el preflight OPTIONS se responde sin llegar a las rutas.
// Cubre: DT-07 (RNF-15)

import { describe, it, expect } from "vitest";
import express from "express";
import request from "supertest";
import { crearCors } from "@/api/middlewares/cors.js";

function crearAppDePrueba(origenesPermitidos: string[]) {
  const app = express();
  app.use(crearCors(origenesPermitidos));
  app.get("/recurso", (_req, res) => res.status(200).json({ ok: true }));
  return app;
}

describe("crearCors", () => {
  it("responde con Access-Control-Allow-Origin cuando el origen esta permitido", async () => {
    const app = crearAppDePrueba(["http://localhost:5173"]);

    const respuesta = await request(app)
      .get("/recurso")
      .set("Origin", "http://localhost:5173");

    expect(respuesta.status).toBe(200);
    expect(respuesta.headers["access-control-allow-origin"]).toBe(
      "http://localhost:5173"
    );
  });

  it("no incluye el encabezado de acceso cuando el origen no esta permitido", async () => {
    const app = crearAppDePrueba(["http://localhost:5173"]);

    const respuesta = await request(app)
      .get("/recurso")
      .set("Origin", "http://sitio-no-confiable.com");

    expect(respuesta.headers["access-control-allow-origin"]).toBeUndefined();
  });

  it("responde el preflight OPTIONS con los metodos y encabezados permitidos", async () => {
    const app = crearAppDePrueba(["http://localhost:5173"]);

    const respuesta = await request(app)
      .options("/recurso")
      .set("Origin", "http://localhost:5173")
      .set("Access-Control-Request-Method", "POST")
      .set("Access-Control-Request-Headers", "authorization,content-type");

    expect(respuesta.status).toBe(204);
    expect(respuesta.headers["access-control-allow-origin"]).toBe(
      "http://localhost:5173"
    );
    expect(respuesta.headers["access-control-allow-methods"]).toContain(
      "POST"
    );
  });
});
