// src/api/controladores/servidor/capacidad.controlador.ts
// Controlador HTTP que expone la capacidad del servidor (total, comprometida y disponible).
// Cubre: RF-10 — CU-04

import type { RequestHandler } from "express";
import type { VerificadorRecursos } from "../../../servicios-aplicacion/verificador-recursos.js";

export function crearControladorCapacidad(
  verificador: Pick<VerificadorRecursos, "consultarCapacidad">
): RequestHandler {
  return async (_req, res, next) => {
    try {
      const capacidad = await verificador.consultarCapacidad();
      res.status(200).json(capacidad);
    } catch (error) {
      next(error);
    }
  };
}
