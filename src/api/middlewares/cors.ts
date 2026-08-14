// src/api/middlewares/cors.ts
// Middleware CORS: habilita que el frontend (servido en un origen distinto, p. ej.
// http://localhost:5173) pueda consumir la API desde el navegador, incluyendo el
// preflight OPTIONS que el navegador antepone a las peticiones no triviales.
// Cubre: DT-07 (RNF-15)

import cors, { type CorsOptions } from "cors";
import type { RequestHandler } from "express";

export function crearCors(origenesPermitidos: string[]): RequestHandler {
  const opciones: CorsOptions = {
    origin: origenesPermitidos,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };

  return cors(opciones);
}
