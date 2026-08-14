// src/api/middlewares/autorizar.ts
// Middleware de autorizacion por rol: se ejecuta despues de autenticar. Permite el paso solo
// si el rol del usuario esta en la lista de roles permitidos; si no, deniega y registra el
// intento de acceso no autorizado (RNF-14).

import type { RequestHandler } from "express";
import { PermisoDenegadoError } from "../../dominio/errores/permiso-denegado-error.js";
import { TokenInvalidoError } from "../../dominio/errores/token-invalido-error.js";
import { logger } from "../../infraestructura/logger.js";

export function autorizar(...rolesPermitidos: string[]): RequestHandler {
  return (req, _res, next) => {
    const usuario = req.usuario;
    if (!usuario) {
      next(new TokenInvalidoError());
      return;
    }

    if (!rolesPermitidos.includes(usuario.rol)) {
      logger.warn({
        evento: "acceso_no_autorizado",
        rol: usuario.rol,
        ruta: req.path,
      });
      next(new PermisoDenegadoError());
      return;
    }

    next();
  };
}
