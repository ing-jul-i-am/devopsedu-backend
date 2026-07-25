// tests/ayudas/construir-app.ts
// Construye una instancia de la aplicacion Express cableada contra la base de pruebas,
// para las pruebas de integracion HTTP con Supertest.

import type { Express } from "express";
import { crearApp } from "@/api/app.js";
import { construirDependencias } from "@/composicion.js";
import { prismaTest } from "./prisma-test.js";

export function construirApp(): Express {
  const dependencias = construirDependencias(prismaTest, {
    jwtSecreto: "secreto-de-prueba",
    jwtExpiracionSegundos: 3600,
    rolPorDefecto: "estudiante",
    almacenamientoTotalMb: 20480,
    monitorIntervaloMs: 5000,
  });
  return crearApp(dependencias);
}
