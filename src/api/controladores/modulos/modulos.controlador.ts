// src/api/controladores/modulos/modulos.controlador.ts
// Controladores HTTP de modulos de aprendizaje: creacion, listado y edicion por el docente.
// Cubre: RF-20 — CU-10

import type { RequestHandler, Request } from "express";
import type { Modulo } from "@prisma/client";
import type { GestorModulos } from "../../../servicios-aplicacion/gestor-modulos.js";
import { ModuloNoEncontradoError } from "../../../dominio/errores/modulo-no-encontrado-error.js";

function aModuloRespuesta(modulo: Modulo) {
  return {
    idModulo: modulo.idModulo,
    nombre: modulo.nombre,
    contenidoTeorico: modulo.contenidoTeorico,
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

export function crearControladoresModulos(gestorModulos: GestorModulos): {
  crear: RequestHandler;
  listar: RequestHandler;
  editar: RequestHandler;
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

  const editar: RequestHandler = async (req, res, next) => {
    try {
      const idModulo = idModuloDe(req);
      const modulo = await gestorModulos.editar(idModulo, req.body);
      res.status(200).json(aModuloRespuesta(modulo));
    } catch (error) {
      next(error);
    }
  };

  return { crear, listar, editar };
}
