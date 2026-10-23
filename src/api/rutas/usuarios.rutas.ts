// src/api/rutas/usuarios.rutas.ts
// Rutas administrativas sobre usuarios. Exclusivas del rol docente (RF-04, DT-08, DT-21).
// Orden de middlewares: autenticacion -> autorizacion -> validacion -> controlador.
// Cubre: RF-04, RF-25 — CU-15

import { Router, type RequestHandler } from "express";
import type { GestorUsuarios } from "../../servicios-aplicacion/gestor-usuarios.js";
import { crearControladoresUsuarios } from "../controladores/usuarios/usuarios.controlador.js";
import { validar } from "../middlewares/validar.js";
import { autorizar } from "../middlewares/autorizar.js";
import { resetearContrasenaSchema } from "../validadores/usuarios/resetear-contrasena.validador.js";

export function crearRutasUsuarios(
  gestorUsuarios: GestorUsuarios,
  autenticar: RequestHandler
): Router {
  const router = Router();
  const c = crearControladoresUsuarios(gestorUsuarios);

  // RF-25: se registra antes que las rutas con parametro para que "estudiantes" nunca se
  // interprete como un :id.
  router.get(
    "/estudiantes",
    autenticar,
    autorizar("docente"),
    c.listarEstudiantes
  );

  router.patch(
    "/:id/contrasena",
    autenticar,
    autorizar("docente"),
    validar(resetearContrasenaSchema),
    c.resetearContrasena
  );

  return router;
}
