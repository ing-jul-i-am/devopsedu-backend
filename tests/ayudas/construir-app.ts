// tests/ayudas/construir-app.ts
// Construye una instancia de la aplicacion Express cableada contra la base de pruebas,
// para las pruebas de integracion HTTP con Supertest.

import type { Express } from "express";
import { crearApp } from "@/api/app.js";
import { construirDependencias } from "@/composicion.js";
import { prismaTest } from "./prisma-test.js";

export function construirApp(): Express {
  // Medicion determinista para las pruebas (no depende del estado real de la maquina).
  const medirRecursos = async () => ({
    total: { cpu: 16, memoria: 16000, almacenamiento: 51200 },
    disponible: { cpu: 16, memoria: 16000, almacenamiento: 20480 },
  });

  const dependencias = construirDependencias(
    prismaTest,
    {
      jwtSecreto: "secreto-de-prueba",
      jwtExpiracionSegundos: 3600,
      rolPorDefecto: "estudiante",
      rutaDisco: "/",
      monitorIntervaloMs: 5000,
      corsOrigenes: ["http://localhost:5173"],
    },
    medirRecursos
  );
  return crearApp(dependencias);
}
