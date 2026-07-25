// src/api/rutas/servicios.rutas.ts
// Rutas del grupo de servicios. Orden de middlewares: autenticacion -> autorizacion ->
// validacion -> controlador.
// Cubre: RF-05, RF-06 — CU-03

import { Router, type RequestHandler } from "express";
import type { GestorServicios } from "../../servicios-aplicacion/gestor-servicios.js";
import { crearControladoresServicios } from "../controladores/servicios/servicios.controlador.js";
import { validar } from "../middlewares/validar.js";
import { autorizar } from "../middlewares/autorizar.js";
import { crearServicioSchema } from "../validadores/servicios/crear-servicio.validador.js";
import { editarConfiguracionSchema } from "../validadores/servicios/editar-configuracion.validador.js";

export function crearRutasServicios(
  gestor: GestorServicios,
  autenticar: RequestHandler
): Router {
  const router = Router();
  const controladores = crearControladoresServicios(gestor);

  router.post(
    "/",
    autenticar,
    autorizar("estudiante", "docente"),
    validar(crearServicioSchema),
    controladores.crear
  );

  router.put(
    "/:idServicio/configuracion",
    autenticar,
    autorizar("estudiante", "docente"),
    validar(editarConfiguracionSchema),
    controladores.editarConfiguracion
  );

  return router;
}
