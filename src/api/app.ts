// src/api/app.ts
// Composicion de la aplicacion Express: parsers, montaje de routers y manejador global de
// errores. Recibe sus dependencias ya construidas para ser facilmente testeable.
// Cubre: RNF-15

import express, { type Express } from "express";
import type { Autenticador } from "../servicios-aplicacion/autenticador.js";
import { crearRutasAuth } from "./rutas/auth.rutas.js";
import { manejadorErrores } from "./middlewares/manejador-errores.js";

export interface DependenciasApp {
  autenticador: Autenticador;
}

export function crearApp(dependencias: DependenciasApp): Express {
  const app = express();

  app.use(express.json());

  app.use("/api/auth", crearRutasAuth(dependencias.autenticador));

  // El manejador de errores se registra al final, tras todas las rutas.
  app.use(manejadorErrores);

  return app;
}
