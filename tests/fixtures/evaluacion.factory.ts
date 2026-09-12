// tests/fixtures/evaluacion.factory.ts
// Funcion de fabrica para crear evaluaciones de modulo en la base de pruebas. Si no se indica
// idModulo, crea un modulo por defecto para satisfacer la llave foranea.
// Cubre: RF-24

import type { Prisma } from "@prisma/client";
import type { PreguntaEvaluacion } from "@/dominio/modelos/pregunta-evaluacion.js";
import { prismaTest } from "../ayudas/prisma-test.js";
import { crearModuloEnBd } from "./modulo.factory.js";

export interface ParcialesEvaluacion {
  titulo?: string;
  preguntas?: PreguntaEvaluacion[];
  fechaDisponible?: Date;
  idModulo?: number;
}

export function preguntaDePrueba(
  parciales: Partial<PreguntaEvaluacion> = {}
): PreguntaEvaluacion {
  return {
    pregunta: "¿Cual de las siguientes es una diferencia entre volumen y bind mount?",
    opciones: [
      "No hay diferencia, son sinonimos",
      "El volumen lo administra Docker; el bind mount apunta a una ruta del host",
      "El bind mount solo funciona en Windows",
      "El volumen no persiste datos",
    ],
    respuestaCorrecta: 1,
    ...parciales,
  };
}

export function preguntasDePrueba(cantidad = 1): PreguntaEvaluacion[] {
  return Array.from({ length: cantidad }, (_, indice) =>
    preguntaDePrueba({ pregunta: `Pregunta ${indice + 1}` })
  );
}

export async function crearEvaluacionEnBd(
  parciales: ParcialesEvaluacion = {}
) {
  const idModulo = parciales.idModulo ?? (await crearModuloEnBd()).idModulo;

  return prismaTest.evaluacion.create({
    data: {
      titulo: parciales.titulo ?? "Evaluacion del modulo",
      preguntas: (parciales.preguntas ??
        preguntasDePrueba()) as unknown as Prisma.InputJsonValue,
      fechaDisponible: parciales.fechaDisponible ?? new Date("2026-01-01"),
      idModulo,
    },
  });
}
