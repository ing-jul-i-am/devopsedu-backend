// src/api/rutas/aprendizaje.rutas.ts
// Rutas del grupo de aprendizaje del estudiante. Exclusivas del rol estudiante.
// Orden de middlewares: autenticacion -> autorizacion -> validacion -> controlador.
// Cubre: RF-22, RF-23, RF-24 — CU-13, CU-12, CU-14

import { Router, type RequestHandler } from "express";
import type { GestorAprendizaje } from "../../servicios-aplicacion/gestor-aprendizaje.js";
import { crearControladoresAprendizaje } from "../controladores/aprendizaje/aprendizaje.controlador.js";
import { validar } from "../middlewares/validar.js";
import { autorizar } from "../middlewares/autorizar.js";
import { responderEvaluacionSchema } from "../validadores/evaluaciones/responder-evaluacion.validador.js";

export function crearRutasAprendizaje(
  gestorAprendizaje: GestorAprendizaje,
  autenticar: RequestHandler
): Router {
  const router = Router();
  const c = crearControladoresAprendizaje(gestorAprendizaje);
  const rol = autorizar("estudiante");

  router.get("/mi-ruta", autenticar, rol, c.miRuta);
  router.get("/modulos/:idModulo", autenticar, rol, c.obtenerModulo);
  router.post("/modulos/:idModulo/iniciar", autenticar, rol, c.iniciarModulo);
  router.get(
    "/modulos/:idModulo/evaluacion",
    autenticar,
    rol,
    c.obtenerEvaluacion
  );
  router.post(
    "/modulos/:idModulo/evaluacion",
    autenticar,
    rol,
    validar(responderEvaluacionSchema),
    c.responderEvaluacion
  );

  return router;
}
