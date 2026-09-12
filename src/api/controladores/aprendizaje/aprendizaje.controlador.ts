// src/api/controladores/aprendizaje/aprendizaje.controlador.ts
// Controlador HTTP para las acciones del estudiante sobre su propia ruta de aprendizaje.
// Cubre: RF-22, RF-23 — CU-13, CU-12

import type { RequestHandler, Request } from "express";
import type { GestorAprendizaje } from "../../../servicios-aplicacion/gestor-aprendizaje.js";
import type { RutaAprendizajeConModulosDetalle } from "../../../repositorios/ruta-aprendizaje-repo.js";
import type { UsuarioAutenticado } from "../../tipos/usuario-autenticado.js";
import { TokenInvalidoError } from "../../../dominio/errores/token-invalido-error.js";
import { ModuloNoAsignadoError } from "../../../dominio/errores/modulo-no-asignado-error.js";

function usuarioDe(req: Request): UsuarioAutenticado {
  if (!req.usuario) {
    throw new TokenInvalidoError();
  }
  return req.usuario;
}

function idModuloDe(req: Request): number {
  const id = Number(req.params["idModulo"]);
  if (!Number.isInteger(id)) {
    throw new ModuloNoAsignadoError();
  }
  return id;
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
): { miRuta: RequestHandler; iniciarModulo: RequestHandler } {
  const miRuta: RequestHandler = async (req, res, next) => {
    try {
      const usuario = usuarioDe(req);
      const ruta = await gestorAprendizaje.obtenerMiRuta(usuario.idUsuario);
      res.status(200).json(ruta ? aRutaRespuesta(ruta) : null);
    } catch (error) {
      next(error);
    }
  };

  const iniciarModulo: RequestHandler = async (req, res, next) => {
    try {
      const usuario = usuarioDe(req);
      const idModulo = idModuloDe(req);
      await gestorAprendizaje.iniciarModulo(usuario.idUsuario, idModulo);
      res.status(200).json({ mensaje: "Modulo iniciado" });
    } catch (error) {
      next(error);
    }
  };

  return { miRuta, iniciarModulo };
}
