// src/api/rutas/servicios.rutas.ts
// Rutas del grupo de servicios. Orden de middlewares: autenticacion -> autorizacion ->
// validacion -> controlador. Las rutas literales se declaran antes que las parametrizadas.
// Cubre: RF-05, RF-06, RF-07, RF-11, RF-12, RF-13, RF-14, RF-16, RF-17 — CU-03, CU-05

import { Router, type RequestHandler } from "express";
import type { GestorServicios } from "../../servicios-aplicacion/gestor-servicios.js";
import type { GestorDocker } from "../../servicios-aplicacion/gestor-docker.js";
import { crearControladoresServicios } from "../controladores/servicios/servicios.controlador.js";
import { validar } from "../middlewares/validar.js";
import { autorizar } from "../middlewares/autorizar.js";
import { crearServicioSchema } from "../validadores/servicios/crear-servicio.validador.js";
import { editarConfiguracionSchema } from "../validadores/servicios/editar-configuracion.validador.js";

export function crearRutasServicios(
  gestorServicios: GestorServicios,
  gestorDocker: GestorDocker,
  autenticar: RequestHandler
): Router {
  const router = Router();
  const c = crearControladoresServicios(gestorServicios, gestorDocker);
  const rol = autorizar("estudiante", "docente");

  // RF-07: catalogo de imagenes sugeridas (ruta literal antes que las parametrizadas).
  router.get("/imagenes", autenticar, c.listarImagenes);

  // RF-16: panel de servicios activos del usuario.
  router.get("/", autenticar, rol, c.listar);

  // RF-05, RF-06: creacion de servicio.
  router.post("/", autenticar, rol, validar(crearServicioSchema), c.crear);

  // RF-17: detalle del servicio con su historico.
  router.get("/:idServicio", autenticar, rol, c.detalle);

  // RF-08: edicion de la configuracion.
  router.put(
    "/:idServicio/configuracion",
    autenticar,
    rol,
    validar(editarConfiguracionSchema),
    c.editarConfiguracion
  );

  // RF-11, RF-12, RF-13: control del ciclo de vida del contenedor.
  router.post("/:idServicio/desplegar", autenticar, rol, c.desplegar);
  router.post("/:idServicio/detener", autenticar, rol, c.detener);
  router.post("/:idServicio/reiniciar", autenticar, rol, c.reiniciar);

  // RF-14: eliminacion del servicio.
  router.delete("/:idServicio", autenticar, rol, c.eliminar);

  return router;
}
