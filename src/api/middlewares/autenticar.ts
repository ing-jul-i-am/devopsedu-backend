// src/api/middlewares/autenticar.ts
// Middleware de autenticacion: valida el token JWT del encabezado Authorization y verifica que
// la sesion asociada siga activa y vigente (revocacion explicita). Adjunta el usuario a req.
// Cubre: RF-03, RNF-14

import type { RequestHandler } from "express";
import type { EmisorToken } from "../../infraestructura/emisor-token.js";
import type { SesionRepo } from "../../repositorios/sesion-repo.js";
import type { UsuarioRepo } from "../../repositorios/usuario-repo.js";
import { TokenInvalidoError } from "../../dominio/errores/token-invalido-error.js";

export interface DependenciasAutenticar {
  emisor: EmisorToken;
  sesionRepo: SesionRepo;
  usuarioRepo: UsuarioRepo;
}

function extraerToken(encabezado: string | undefined): string | null {
  if (!encabezado?.startsWith("Bearer ")) {
    return null;
  }
  return encabezado.slice("Bearer ".length);
}

export function crearAutenticar(dep: DependenciasAutenticar): RequestHandler {
  return async (req, _res, next) => {
    try {
      const token = extraerToken(req.headers.authorization);
      if (!token) {
        throw new TokenInvalidoError();
      }

      const payload = dep.emisor.verificar(token);

      const sesion = await dep.sesionRepo.buscarPorToken(token);
      const vigente =
        sesion !== null &&
        sesion.estado === "activa" &&
        sesion.fechaExpiracion.getTime() > Date.now();
      if (!vigente) {
        throw new TokenInvalidoError();
      }

      const usuario = await dep.usuarioRepo.buscarPorIdConRol(payload.idUsuario);
      if (!usuario) {
        throw new TokenInvalidoError();
      }

      req.usuario = {
        idUsuario: usuario.idUsuario,
        idRol: usuario.idRol,
        rol: usuario.rol.nombre,
      };
      next();
    } catch (error) {
      next(error);
    }
  };
}
