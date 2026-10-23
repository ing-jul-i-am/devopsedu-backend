// src/api/rutas/reportes.rutas.ts
// Rutas de reportes de progreso. Exclusivas del rol docente: el perfil investigador del diseno
// se descarto (ver docs/decisiones-tecnicas.md DT-20).
// Orden de middlewares: autenticacion -> autorizacion -> controlador (valida su query).
// Cubre: RF-25 — CU-15, CU-16

import { Router, type RequestHandler } from "express";
import type { GestorReportes } from "../../servicios-aplicacion/gestor-reportes.js";
import { crearControladoresReportes } from "../controladores/reportes/reportes.controlador.js";
import { autorizar } from "../middlewares/autorizar.js";

export function crearRutasReportes(
  gestorReportes: GestorReportes,
  autenticar: RequestHandler
): Router {
  const router = Router();
  const c = crearControladoresReportes(gestorReportes);
  const rol = autorizar("docente");

  router.get("/progreso", autenticar, rol, c.progreso);
  router.get("/progreso/exportar", autenticar, rol, c.exportar);

  return router;
}
