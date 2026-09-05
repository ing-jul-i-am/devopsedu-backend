// src/api/rutas/modulos.rutas.ts
// Rutas del grupo de modulos de aprendizaje. Exclusivas del rol docente (RF-04, DT-03).
// Orden de middlewares: autenticacion -> autorizacion -> validacion -> controlador.
// Cubre: RF-20 — CU-10

import { Router, type RequestHandler } from "express";
import type { GestorModulos } from "../../servicios-aplicacion/gestor-modulos.js";
import { crearControladoresModulos } from "../controladores/modulos/modulos.controlador.js";
import { validar } from "../middlewares/validar.js";
import { autorizar } from "../middlewares/autorizar.js";
import { crearModuloSchema } from "../validadores/modulos/crear-modulo.validador.js";
import { editarModuloSchema } from "../validadores/modulos/editar-modulo.validador.js";

export function crearRutasModulos(
  gestorModulos: GestorModulos,
  autenticar: RequestHandler,
  subirImagenModulo: RequestHandler
): Router {
  const router = Router();
  const c = crearControladoresModulos(gestorModulos);
  const rol = autorizar("docente");

  router.get("/", autenticar, rol, c.listar);
  router.post("/", autenticar, rol, validar(crearModuloSchema), c.crear);
  router.post("/imagenes", autenticar, rol, subirImagenModulo, c.subirImagen);
  router.put(
    "/:idModulo",
    autenticar,
    rol,
    validar(editarModuloSchema),
    c.editar
  );

  return router;
}
