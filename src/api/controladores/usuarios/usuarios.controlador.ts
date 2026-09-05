// src/api/controladores/usuarios/usuarios.controlador.ts
// Controladores HTTP administrativos sobre usuarios, exclusivos del rol docente.
// Cubre: RF-04

import type { RequestHandler, Request } from "express";
import type { GestorUsuarios } from "../../../servicios-aplicacion/gestor-usuarios.js";
import { UsuarioNoEncontradoError } from "../../../dominio/errores/usuario-no-encontrado-error.js";

function idUsuarioDe(req: Request): number {
  const id = Number(req.params["id"]);
  if (!Number.isInteger(id)) {
    throw new UsuarioNoEncontradoError();
  }
  return id;
}

export function crearControladoresUsuarios(gestorUsuarios: GestorUsuarios): {
  resetearContrasena: RequestHandler;
} {
  const resetearContrasena: RequestHandler = async (req, res, next) => {
    try {
      const idUsuario = idUsuarioDe(req);
      await gestorUsuarios.resetearContrasena(
        idUsuario,
        req.body.contrasenaNueva
      );
      res.status(200).json({ mensaje: "Contrasena actualizada" });
    } catch (error) {
      next(error);
    }
  };

  return { resetearContrasena };
}
