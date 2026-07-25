// src/api/tipos/express.d.ts
// Aumenta el tipo Request de Express para incluir el usuario autenticado que agrega el
// middleware de autenticacion.

import type { UsuarioAutenticado } from "./usuario-autenticado.js";

declare global {
  namespace Express {
    interface Request {
      usuario?: UsuarioAutenticado;
    }
  }
}
