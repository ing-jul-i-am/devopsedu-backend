// src/api/rutas/aprendizaje.rutas.ts
// Rutas del grupo de aprendizaje del estudiante. Exclusivas del rol estudiante.
// Orden de middlewares: autenticacion -> autorizacion -> controlador.
// Cubre: RF-22 — CU-13

import { Router, type RequestHandler } from "express";
import type { GestorAprendizaje } from "../../servicios-aplicacion/gestor-aprendizaje.js";
import { crearControladoresAprendizaje } from "../controladores/aprendizaje/aprendizaje.controlador.js";
import { autorizar } from "../middlewares/autorizar.js";

export function crearRutasAprendizaje(
  gestorAprendizaje: GestorAprendizaje,
  autenticar: RequestHandler
): Router {
  const router = Router();
  const c = crearControladoresAprendizaje(gestorAprendizaje);
  const rol = autorizar("estudiante");

  router.get("/mi-ruta", autenticar, rol, c.miRuta);

  return router;
}
