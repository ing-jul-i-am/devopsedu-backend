// src/api/validadores/evaluaciones/crear-evaluacion.validador.ts
// Cubre: RF-24 — CU-14

import { z } from "zod";
import type { PreguntaEvaluacion } from "../../../dominio/modelos/pregunta-evaluacion.js";

const preguntaEvaluacionSchema: z.ZodType<PreguntaEvaluacion> = z
  .object({
    pregunta: z.string().min(3, "La pregunta es obligatoria"),
    opciones: z
      .array(z.string().min(1))
      .min(2, "Cada pregunta necesita al menos 2 opciones")
      .max(5, "Cada pregunta admite hasta 5 opciones"),
    respuestaCorrecta: z.number().int().nonnegative(),
  })
  .superRefine((pregunta, ctx) => {
    if (pregunta.respuestaCorrecta >= pregunta.opciones.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "respuestaCorrecta debe ser el indice de una opcion existente",
        path: ["respuestaCorrecta"],
      });
    }
  });

export const crearEvaluacionSchema = z.object({
  titulo: z.string().min(3, "El titulo es obligatorio").max(200),
  preguntas: z
    .array(preguntaEvaluacionSchema)
    .min(1, "La evaluacion debe tener al menos una pregunta"),
  fechaDisponible: z.coerce.date(),
});

export type CrearEvaluacionDTO = z.infer<typeof crearEvaluacionSchema>;
