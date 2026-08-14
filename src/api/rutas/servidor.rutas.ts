// src/api/rutas/servidor.rutas.ts
// Rutas del grupo de recursos del servidor. Cualquier usuario autenticado puede consultar la
// capacidad (estudiante o docente).
// Cubre: RF-10 — CU-04

import { Router, type RequestHandler } from "express";
import type { VerificadorRecursos } from "../../servicios-aplicacion/verificador-recursos.js";
import { crearControladorCapacidad } from "../controladores/servidor/capacidad.controlador.js";

export function crearRutasServidor(
  verificador: VerificadorRecursos,
  autenticar: RequestHandler
): Router {
  const router = Router();
  router.get("/capacidad", autenticar, crearControladorCapacidad(verificador));
  return router;
}
