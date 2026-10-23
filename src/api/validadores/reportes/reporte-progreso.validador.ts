// src/api/validadores/reportes/reporte-progreso.validador.ts
// Validacion de los parametros de consulta de GET /api/reportes/progreso: filtro opcional por
// estudiante.
// Cubre: RF-25 — CU-15

import { z } from "zod";

export const reporteProgresoQuerySchema = z.object({
  idUsuario: z.coerce.number().int().positive().optional(),
});

export type ReporteProgresoQueryDTO = z.infer<typeof reporteProgresoQuerySchema>;
