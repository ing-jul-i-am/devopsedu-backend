// src/api/rutas/rutas.rutas.ts
// Rutas del grupo de rutas de aprendizaje. Exclusivas del rol docente (RF-04, DT-03).
// Orden de middlewares: autenticacion -> autorizacion -> validacion -> controlador.
// Cubre: RF-21 — CU-11

import { Router, type RequestHandler } from "express";
import type { GestorRutas } from "../../servicios-aplicacion/gestor-rutas.js";
import { crearControladoresRutas } from "../controladores/rutas/rutas.controlador.js";
import { validar } from "../middlewares/validar.js";
import { autorizar } from "../middlewares/autorizar.js";
import { asignarRutaSchema } from "../validadores/rutas/asignar-ruta.validador.js";

export function crearRutasRutasAprendizaje(
  gestorRutas: GestorRutas,
  autenticar: RequestHandler
): Router {
  const router = Router();
  const c = crearControladoresRutas(gestorRutas);
  const rol = autorizar("docente");

  router.post("/", autenticar, rol, validar(asignarRutaSchema), c.asignar);

  return router;
}
