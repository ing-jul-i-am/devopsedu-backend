// src/api/rutas/auth.rutas.ts
// Rutas del grupo de identidad. Orden de middlewares: validacion -> controlador.
// Cubre: RF-01, RF-02, RF-03 — CU-01, CU-02

import { Router } from "express";
import type { Autenticador } from "../../servicios-aplicacion/autenticador.js";
import { crearControladoresAuth } from "../controladores/auth/auth.controlador.js";
import { validar } from "../middlewares/validar.js";
import { registroSchema } from "../validadores/auth/registro.validador.js";
import { loginSchema } from "../validadores/auth/login.validador.js";

export function crearRutasAuth(autenticador: Autenticador): Router {
  const router = Router();
  const controladores = crearControladoresAuth(autenticador);

  router.post("/registro", validar(registroSchema), controladores.registro);
  router.post("/login", validar(loginSchema), controladores.login);
  router.post("/logout", controladores.logout);

  return router;
}
