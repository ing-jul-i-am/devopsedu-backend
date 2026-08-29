// src/api/controladores/aprendizaje/aprendizaje.controlador.ts
// Controlador HTTP para las acciones del estudiante sobre su propia ruta de aprendizaje.
// Cubre: RF-22 — CU-13

import type { RequestHandler, Request } from "express";
import type { GestorAprendizaje } from "../../../servicios-aplicacion/gestor-aprendizaje.js";
import type { RutaAprendizajeConModulosDetalle } from "../../../repositorios/ruta-aprendizaje-repo.js";
import type { UsuarioAutenticado } from "../../tipos/usuario-autenticado.js";
import { TokenInvalidoError } from "../../../dominio/errores/token-invalido-error.js";

function usuarioDe(req: Request): UsuarioAutenticado {
  if (!req.usuario) {
    throw new TokenInvalidoError();
  }
  return req.usuario;
}

function aRutaRespuesta(ruta: RutaAprendizajeConModulosDetalle) {
  return {
    idRuta: ruta.idRuta,
    progreso: Number(ruta.progreso),
    fechaAsignacion: ruta.fechaAsignacion,
    modulos: ruta.rutaModulos.map((rm) => ({
      idModulo: rm.idModulo,
      nombre: rm.modulo.nombre,
      ordenSecuencia: rm.ordenSecuencia,
    })),
  };
}

export function crearControladoresAprendizaje(
  gestorAprendizaje: GestorAprendizaje
): { miRuta: RequestHandler } {
  const miRuta: RequestHandler = async (req, res, next) => {
    try {
      const usuario = usuarioDe(req);
      const ruta = await gestorAprendizaje.obtenerMiRuta(usuario.idUsuario);
      res.status(200).json(ruta ? aRutaRespuesta(ruta) : null);
    } catch (error) {
      next(error);
    }
  };

  return { miRuta };
}
