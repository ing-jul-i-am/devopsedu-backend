// src/api/validadores/servicios/metricas.validador.ts
// Validacion de los parametros de consulta de GET /api/servicios/:id/metricas: rango de fechas
// opcional (desde/hasta) para filtrar el historico.
// Cubre: RF-18

import { z } from "zod";

export const metricasQuerySchema = z.object({
  desde: z.coerce.date().optional(),
  hasta: z.coerce.date().optional(),
});

export type MetricasQueryDTO = z.infer<typeof metricasQuerySchema>;
