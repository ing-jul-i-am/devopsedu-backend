// src/api/middlewares/validar.ts
// Middleware generico de validacion de entrada con Zod. Valida el cuerpo de la peticion y,
// si es valido, lo reemplaza por la version parseada. En caso contrario responde 400.
// Cubre: RNF-12, S-6.4

import type { RequestHandler } from "express";
import type { ZodTypeAny } from "zod";

export function validar(esquema: ZodTypeAny): RequestHandler {
  return (req, res, next) => {
    const resultado = esquema.safeParse(req.body);
    if (!resultado.success) {
      res.status(400).json({
        error: "Datos de entrada invalidos",
        detalles: resultado.error.issues.map((issue) => ({
          campo: issue.path.join(".") || "(raiz)",
          mensaje: issue.message,
        })),
      });
      return;
    }
    req.body = resultado.data;
    next();
  };
}
