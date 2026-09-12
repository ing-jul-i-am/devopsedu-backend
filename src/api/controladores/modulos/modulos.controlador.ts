// src/api/controladores/modulos/modulos.controlador.ts
// Controladores HTTP de modulos de aprendizaje: creacion, listado y edicion por el docente.
// Tambien expone la creacion de actividades practicas (RF-23) y de la evaluacion (RF-24) de un
// modulo.
// Cubre: RF-20, RF-23, RF-24 — CU-10, CU-12, CU-14

import type { RequestHandler, Request } from "express";
import type { Modulo, Actividad, Evaluacion } from "@prisma/client";
import type { GestorModulos } from "../../../servicios-aplicacion/gestor-modulos.js";
import { ModuloNoEncontradoError } from "../../../dominio/errores/modulo-no-encontrado-error.js";

function aModuloRespuesta(modulo: Modulo) {
  return {
    idModulo: modulo.idModulo,
    nombre: modulo.nombre,
    contenido: modulo.contenido,
    orden: modulo.orden,
  };
}

function idModuloDe(req: Request): number {
  const id = Number(req.params["idModulo"]);
  if (!Number.isInteger(id)) {
    throw new ModuloNoEncontradoError();
  }
  return id;
}

function aActividadRespuesta(actividad: Actividad) {
  return {
    idActividad: actividad.idActividad,
    descripcion: actividad.descripcion,
    criteriosValidacion: actividad.criteriosValidacion,
    orden: actividad.orden,
    idModulo: actividad.idModulo,
  };
}

function aEvaluacionRespuesta(evaluacion: Evaluacion) {
  return {
    idEvaluacion: evaluacion.idEvaluacion,
    titulo: evaluacion.titulo,
    preguntas: evaluacion.preguntas,
    fechaDisponible: evaluacion.fechaDisponible,
    idModulo: evaluacion.idModulo,
  };
}

export function crearControladoresModulos(gestorModulos: GestorModulos): {
  crear: RequestHandler;
  listar: RequestHandler;
  obtener: RequestHandler;
  editar: RequestHandler;
  subirImagen: RequestHandler;
  crearActividad: RequestHandler;
  crearEvaluacion: RequestHandler;
} {
  const crear: RequestHandler = async (req, res, next) => {
    try {
      const modulo = await gestorModulos.crear(req.body);
      res.status(201).json(aModuloRespuesta(modulo));
    } catch (error) {
      next(error);
    }
  };

  const listar: RequestHandler = async (_req, res, next) => {
    try {
      const modulos = await gestorModulos.listarTodos();
      res.status(200).json(modulos.map(aModuloRespuesta));
    } catch (error) {
      next(error);
    }
  };

  const obtener: RequestHandler = async (req, res, next) => {
    try {
      const idModulo = idModuloDe(req);
      const modulo = await gestorModulos.obtenerPorId(idModulo);
      res.status(200).json(aModuloRespuesta(modulo));
    } catch (error) {
      next(error);
    }
  };

  const editar: RequestHandler = async (req, res, next) => {
    try {
      const idModulo = idModuloDe(req);
      const modulo = await gestorModulos.editar(idModulo, req.body);
      res.status(200).json(aModuloRespuesta(modulo));
    } catch (error) {
      next(error);
    }
  };

  // El middleware de subida (subida-imagen.ts) ya garantiza que req.file existe en este punto.
  const subirImagen: RequestHandler = (req, res) => {
    const archivo = req.file as Express.Multer.File;
    res.status(201).json({ url: `/archivos/modulos/${archivo.filename}` });
  };

  const crearActividad: RequestHandler = async (req, res, next) => {
    try {
      const idModulo = idModuloDe(req);
      const actividad = await gestorModulos.crearActividad(idModulo, req.body);
      res.status(201).json(aActividadRespuesta(actividad));
    } catch (error) {
      next(error);
    }
  };

  const crearEvaluacion: RequestHandler = async (req, res, next) => {
    try {
      const idModulo = idModuloDe(req);
      const evaluacion = await gestorModulos.crearEvaluacion(idModulo, req.body);
      res.status(201).json(aEvaluacionRespuesta(evaluacion));
    } catch (error) {
      next(error);
    }
  };

  return {
    crear,
    listar,
    obtener,
    editar,
    subirImagen,
    crearActividad,
    crearEvaluacion,
  };
}
