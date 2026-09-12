// src/api/controladores/aprendizaje/aprendizaje.controlador.ts
// Controlador HTTP para las acciones del estudiante sobre su propia ruta de aprendizaje.
// La respuesta de la evaluacion (RF-24) oculta respuestaCorrecta de cada pregunta: el
// estudiante no debe poder ver la respuesta correcta antes de responder ni entre reintentos.
// Cubre: RF-22, RF-23, RF-24 — CU-13, CU-12, CU-14

import type { RequestHandler, Request } from "express";
import type { Evaluacion, Actividad } from "@prisma/client";
import type { GestorAprendizaje, ModuloConActividades } from "../../../servicios-aplicacion/gestor-aprendizaje.js";
import type { RutaAprendizajeConModulosDetalle } from "../../../repositorios/ruta-aprendizaje-repo.js";
import type { PreguntaEvaluacion } from "../../../dominio/modelos/pregunta-evaluacion.js";
import type { BloqueContenido } from "../../../dominio/modelos/bloque-contenido.js";
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

// Enriquece los bloques tipo "actividad" con la descripcion de la actividad para que el
// frontend no necesite otra llamada. Deliberadamente omite criteriosValidacion: es informacion
// de validacion automatica, no contenido educativo para el estudiante.
function aBloqueRespuesta(
  bloque: BloqueContenido,
  actividades: Actividad[]
): BloqueContenido | (Omit<BloqueContenido, "tipo"> & { tipo: "actividad"; descripcion: string }) {
  if (bloque.tipo !== "actividad") {
    return bloque;
  }
  const actividad = actividades.find((a) => a.idActividad === bloque.idActividad);
  return {
    tipo: "actividad",
    idActividad: bloque.idActividad,
    descripcion: actividad?.descripcion ?? "",
  };
}

function aModuloRespuesta({ modulo, actividades, fechaInicio }: ModuloConActividades) {
  const contenido = (modulo.contenido as unknown as BloqueContenido[]).map((bloque) =>
    aBloqueRespuesta(bloque, actividades)
  );
  return {
    idModulo: modulo.idModulo,
    nombre: modulo.nombre,
    orden: modulo.orden,
    fechaInicio,
    contenido,
  };
}

function aEvaluacionRespuesta(evaluacion: Evaluacion) {
  const preguntas = evaluacion.preguntas as unknown as PreguntaEvaluacion[];
  return {
    idEvaluacion: evaluacion.idEvaluacion,
    titulo: evaluacion.titulo,
    fechaDisponible: evaluacion.fechaDisponible,
    preguntas: preguntas.map((pregunta) => ({
      pregunta: pregunta.pregunta,
      opciones: pregunta.opciones,
    })),
  };
}

export function crearControladoresAprendizaje(
  gestorAprendizaje: GestorAprendizaje
): {
  miRuta: RequestHandler;
  iniciarModulo: RequestHandler;
  obtenerModulo: RequestHandler;
  obtenerEvaluacion: RequestHandler;
  responderEvaluacion: RequestHandler;
} {
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

  const obtenerModulo: RequestHandler = async (req, res, next) => {
    try {
      const usuario = usuarioDe(req);
      const idModulo = idModuloDe(req);
      const resultado = await gestorAprendizaje.obtenerModulo(
        usuario.idUsuario,
        idModulo
      );
      res.status(200).json(aModuloRespuesta(resultado));
    } catch (error) {
      next(error);
    }
  };

  const obtenerEvaluacion: RequestHandler = async (req, res, next) => {
    try {
      const usuario = usuarioDe(req);
      const idModulo = idModuloDe(req);
      const evaluacion = await gestorAprendizaje.obtenerEvaluacion(
        usuario.idUsuario,
        idModulo
      );
      res.status(200).json(aEvaluacionRespuesta(evaluacion));
    } catch (error) {
      next(error);
    }
  };

  const responderEvaluacion: RequestHandler = async (req, res, next) => {
    try {
      const usuario = usuarioDe(req);
      const idModulo = idModuloDe(req);
      const retroalimentacion = await gestorAprendizaje.responderEvaluacion(
        usuario.idUsuario,
        idModulo,
        req.body.respuestas
      );
      res.status(200).json(retroalimentacion);
    } catch (error) {
      next(error);
    }
  };

  return {
    miRuta,
    iniciarModulo,
    obtenerModulo,
    obtenerEvaluacion,
    responderEvaluacion,
  };
}
