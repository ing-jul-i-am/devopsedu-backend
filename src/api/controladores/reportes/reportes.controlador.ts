// src/api/controladores/reportes/reportes.controlador.ts
// Controladores HTTP de los reportes de progreso, exclusivos del rol docente: consulta (CU-15) y
// exportacion como archivo descargable (CU-16).
// Cubre: RF-25 — CU-15, CU-16

import type { Request, RequestHandler } from "express";
import type { GestorReportes } from "../../../servicios-aplicacion/gestor-reportes.js";
import type { UsuarioAutenticado } from "../../tipos/usuario-autenticado.js";
import { TokenInvalidoError } from "../../../dominio/errores/token-invalido-error.js";
import { reporteProgresoQuerySchema } from "../../validadores/reportes/reporte-progreso.validador.js";
import { exportarReporteQuerySchema } from "../../validadores/reportes/exportar-reporte.validador.js";

function usuarioDe(req: Request): UsuarioAutenticado {
  if (!req.usuario) {
    throw new TokenInvalidoError();
  }
  return req.usuario;
}

export function crearControladoresReportes(gestorReportes: GestorReportes): {
  progreso: RequestHandler;
  exportar: RequestHandler;
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

  const exportar: RequestHandler = async (req, res, next) => {
    try {
      const usuario = usuarioDe(req);
      const query = exportarReporteQuerySchema.safeParse(req.query);
      if (!query.success) {
        res.status(400).json({ error: "Parametros de consulta invalidos" });
        return;
      }
      const archivo = await gestorReportes.exportarProgreso(
        usuario.idUsuario,
        query.data.idUsuario !== undefined
          ? { formato: query.data.formato, idUsuario: query.data.idUsuario }
          : { formato: query.data.formato }
      );
      res
        .status(200)
        .type(archivo.tipoContenido)
        .attachment(archivo.nombreArchivo)
        .send(archivo.contenido);
    } catch (error) {
      next(error);
    }
  };

  return { progreso, exportar };
}
