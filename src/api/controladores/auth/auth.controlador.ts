// src/api/controladores/auth/auth.controlador.ts
// Controladores HTTP de identidad. Delegan la logica al Autenticador y el manejo de errores
// al middleware global (via next). No contienen reglas de negocio.
// Cubre: RF-01, RF-02, RF-03 — CU-01

import type { RequestHandler } from "express";
import type { Autenticador } from "../../../servicios-aplicacion/autenticador.js";

function extraerToken(encabezado: string | undefined): string | null {
  if (!encabezado?.startsWith("Bearer ")) {
    return null;
  }
  return encabezado.slice("Bearer ".length);
}

export function crearControladoresAuth(autenticador: Autenticador): {
  registro: RequestHandler;
  login: RequestHandler;
  logout: RequestHandler;
} {
  const registro: RequestHandler = async (req, res, next) => {
    try {
      const usuario = await autenticador.registrar(req.body);
      res.status(201).json({ usuario });
    } catch (error) {
      next(error);
    }
  };

  const login: RequestHandler = async (req, res, next) => {
    try {
      const { correo, contrasena } = req.body;
      const resultado = await autenticador.iniciarSesion(correo, contrasena);
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  };

  const logout: RequestHandler = async (req, res, next) => {
    try {
      const token = extraerToken(req.headers.authorization);
      if (token) {
        await autenticador.cerrarSesion(token);
      }
      res.status(200).json({ mensaje: "Sesion cerrada" });
    } catch (error) {
      next(error);
    }
  };

  return { registro, login, logout };
}
