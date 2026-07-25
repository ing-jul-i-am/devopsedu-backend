// tests/ayudas/construir-app.ts
// Construye una instancia de la aplicacion Express cableada contra la base de pruebas,
// para las pruebas de integracion HTTP con Supertest.

import type { Express } from "express";
import { crearApp } from "@/api/app.js";
import { construirAutenticador } from "@/composicion.js";
import { prismaTest } from "./prisma-test.js";

export function construirApp(): Express {
  const autenticador = construirAutenticador(prismaTest, {
    jwtSecreto: "secreto-de-prueba",
    jwtExpiracionSegundos: 3600,
    rolPorDefecto: "estudiante",
  });
  return crearApp({ autenticador });
}
