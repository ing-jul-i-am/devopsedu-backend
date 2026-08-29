// src/api/app.ts
// Composicion de la aplicacion Express: parsers, montaje de routers y manejador global de
// errores. Recibe sus dependencias ya construidas para ser facilmente testeable.
// Cubre: RNF-15

import express, { type Express, type RequestHandler } from "express";
import type { Autenticador } from "../servicios-aplicacion/autenticador.js";
import type { GestorServicios } from "../servicios-aplicacion/gestor-servicios.js";
import type { GestorDocker } from "../servicios-aplicacion/gestor-docker.js";
import type { VerificadorRecursos } from "../servicios-aplicacion/verificador-recursos.js";
import type { GestorModulos } from "../servicios-aplicacion/gestor-modulos.js";
import { crearRutasAuth } from "./rutas/auth.rutas.js";
import { crearRutasServicios } from "./rutas/servicios.rutas.js";
import { crearRutasServidor } from "./rutas/servidor.rutas.js";
import { crearRutasModulos } from "./rutas/modulos.rutas.js";
import { manejadorErrores } from "./middlewares/manejador-errores.js";

export interface DependenciasApp {
  autenticador: Autenticador;
  gestorServicios: GestorServicios;
  gestorDocker: GestorDocker;
  verificador: VerificadorRecursos;
  gestorModulos: GestorModulos;
  autenticar: RequestHandler;
  cors: RequestHandler;
}

export function crearApp(dependencias: DependenciasApp): Express {
  const app = express();

  app.use(dependencias.cors);
  app.use(express.json());

  app.use("/api/auth", crearRutasAuth(dependencias.autenticador));
  app.use(
    "/api/servicios",
    crearRutasServicios(
      dependencias.gestorServicios,
      dependencias.gestorDocker,
      dependencias.autenticar
    )
  );
  app.use(
    "/api/servidor",
    crearRutasServidor(dependencias.verificador, dependencias.autenticar)
  );
  app.use(
    "/api/modulos",
    crearRutasModulos(dependencias.gestorModulos, dependencias.autenticar)
  );

  // El manejador de errores se registra al final, tras todas las rutas.
  app.use(manejadorErrores);

  return app;
}
