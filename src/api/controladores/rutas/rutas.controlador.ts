// src/api/controladores/rutas/rutas.controlador.ts
// Controlador HTTP para la asignacion de rutas de aprendizaje.
// Cubre: RF-21 — CU-11

import type { RequestHandler } from "express";
import type { GestorRutas } from "../../../servicios-aplicacion/gestor-rutas.js";
import type { RutaAprendizajeConModulos } from "../../../repositorios/ruta-aprendizaje-repo.js";

function aRutaRespuesta(ruta: RutaAprendizajeConModulos) {
  return {
    idRuta: ruta.idRuta,
    idUsuario: ruta.idUsuario,
    progreso: Number(ruta.progreso),
    fechaAsignacion: ruta.fechaAsignacion,
    modulos: ruta.rutaModulos
      .slice()
      .sort((a, b) => a.ordenSecuencia - b.ordenSecuencia)
      .map((rm) => ({ idModulo: rm.idModulo, ordenSecuencia: rm.ordenSecuencia })),
  };
}

export function crearControladoresRutas(gestorRutas: GestorRutas): {
  asignar: RequestHandler;
} {
  const asignar: RequestHandler = async (req, res, next) => {
    try {
      const ruta = await gestorRutas.asignar(
        req.body.idUsuario,
        req.body.idModulos
      );
      res.status(201).json(aRutaRespuesta(ruta));
    } catch (error) {
      next(error);
    }
  };

  return { asignar };
}
