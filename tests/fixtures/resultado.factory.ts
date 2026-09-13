// tests/fixtures/resultado.factory.ts
// Funciones de fabrica para crear resultados de actividad o de evaluacion en la base de
// pruebas. El modelo Resultado es polimorfico (ver prisma/schema.prisma): cada funcion
// llena exactamente una de las dos llaves foraneas opcionales.
// Cubre: RF-23, RF-24

import { prismaTest } from "../ayudas/prisma-test.js";

export interface ParcialesResultadoActividad {
  idUsuario: number;
  idActividad: number;
  puntuacion?: number;
  tiempoEmpleado?: number;
  intentos?: number;
}

export async function crearResultadoActividadEnBd(
  parciales: ParcialesResultadoActividad
) {
  return prismaTest.resultado.create({
    data: {
      idUsuario: parciales.idUsuario,
      idActividad: parciales.idActividad,
      puntuacion: parciales.puntuacion ?? 100,
      tiempoEmpleado: parciales.tiempoEmpleado ?? 60,
      intentos: parciales.intentos ?? 1,
    },
  });
}

export interface ParcialesResultadoEvaluacion {
  idUsuario: number;
  idEvaluacion: number;
  puntuacion?: number;
  tiempoEmpleado?: number;
  intentos?: number;
}

export async function crearResultadoEvaluacionEnBd(
  parciales: ParcialesResultadoEvaluacion
) {
  return prismaTest.resultado.create({
    data: {
      idUsuario: parciales.idUsuario,
      idEvaluacion: parciales.idEvaluacion,
      puntuacion: parciales.puntuacion ?? 100,
      tiempoEmpleado: parciales.tiempoEmpleado ?? 60,
      intentos: parciales.intentos ?? 1,
    },
  });
}
