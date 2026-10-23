// src/api/controladores/reportes/reportes.controlador.ts
// Controladores HTTP de los reportes de progreso, exclusivos del rol docente.
// Cubre: RF-25 — CU-15

import type { RequestHandler } from "express";
import type { GestorReportes } from "../../../servicios-aplicacion/gestor-reportes.js";
import { reporteProgresoQuerySchema } from "../../validadores/reportes/reporte-progreso.validador.js";

export function crearControladoresReportes(gestorReportes: GestorReportes): {
  progreso: RequestHandler;
} {
  const progreso: RequestHandler = async (req, res, next) => {
    try {
      const query = reporteProgresoQuerySchema.safeParse(req.query);
      if (!query.success) {
        res.status(400).json({ error: "Parametros de consulta invalidos" });
        return;
      }
      const reportes = await gestorReportes.generarProgreso(
        query.data.idUsuario !== undefined
          ? { idUsuario: query.data.idUsuario }
          : {}
      );
      res.status(200).json(reportes);
    } catch (error) {
      next(error);
    }
  };

  return { progreso };
}
