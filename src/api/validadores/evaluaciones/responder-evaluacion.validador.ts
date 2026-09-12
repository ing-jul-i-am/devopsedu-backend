// src/api/validadores/evaluaciones/responder-evaluacion.validador.ts
// Cubre: RF-24 — CU-14

import { z } from "zod";

export const responderEvaluacionSchema = z.object({
  respuestas: z
    .array(z.number().int().nonnegative())
    .min(1, "Debes enviar al menos una respuesta"),
});

export type ResponderEvaluacionDTO = z.infer<typeof responderEvaluacionSchema>;
