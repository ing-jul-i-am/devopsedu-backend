// src/api/middlewares/subida-imagen.ts
// Middleware de subida de imagenes para bloques de contenido de un modulo. Encapsula multer:
// valida el tipo MIME declarado y el tamano maximo, y genera el nombre de archivo con un UUID
// (nunca a partir del nombre original) para evitar colisiones y ataques de path traversal.
//
// Limitacion conocida: la validacion de tipo MIME confia en el Content-Type declarado por el
// cliente en la parte multipart, no inspecciona los bytes reales del archivo (ver DT-09).
// Cubre: RF-20 — CU-10

import { randomUUID } from "node:crypto";
import multer, { MulterError } from "multer";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import {
  EXTENSION_POR_MIME,
  TAMANO_MAXIMO_IMAGEN_BYTES,
  TIPOS_MIME_IMAGEN_PERMITIDOS,
} from "../../dominio/limites-contenido-modulo.js";
import { TipoArchivoNoPermitidoError } from "../../dominio/errores/tipo-archivo-no-permitido-error.js";
import { ArchivoDemasiadoGrandeError } from "../../dominio/errores/archivo-demasiado-grande-error.js";
import { ArchivoNoProporcionadoError } from "../../dominio/errores/archivo-no-proporcionado-error.js";

export function esTipoMimePermitido(mimetype: string): boolean {
  return TIPOS_MIME_IMAGEN_PERMITIDOS.includes(mimetype);
}

export function nombreDeArchivoPara(mimetype: string): string | null {
  const extension = EXTENSION_POR_MIME[mimetype];
  return extension ? `${randomUUID()}${extension}` : null;
}

export function crearMiddlewareSubidaImagen(rutaDestino: string): RequestHandler {
  const upload = multer({
    storage: multer.diskStorage({
      destination: rutaDestino,
      filename: (_req, file, cb) => {
        const nombre = nombreDeArchivoPara(file.mimetype);
        if (!nombre) {
          cb(new TipoArchivoNoPermitidoError(), "");
          return;
        }
        cb(null, nombre);
      },
    }),
    limits: { fileSize: TAMANO_MAXIMO_IMAGEN_BYTES, files: 1 },
    fileFilter: (_req, file, cb) => {
      if (!esTipoMimePermitido(file.mimetype)) {
        cb(new TipoArchivoNoPermitidoError());
        return;
      }
      cb(null, true);
    },
  }).single("imagen");

  return (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, (err: unknown) => {
      if (err instanceof MulterError && err.code === "LIMIT_FILE_SIZE") {
        next(new ArchivoDemasiadoGrandeError());
        return;
      }
      if (err) {
        next(err);
        return;
      }
      if (!req.file) {
        next(new ArchivoNoProporcionadoError());
        return;
      }
      next();
    });
  };
}
