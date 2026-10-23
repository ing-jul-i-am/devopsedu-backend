// src/api/validadores/reportes/exportar-reporte.validador.ts
// Validacion de los parametros de consulta de GET /api/reportes/progreso/exportar: formato
// obligatorio (csv o pdf) y el mismo filtro opcional por estudiante que la consulta del reporte.
// Cubre: RF-25 — CU-16

import { z } from "zod";
import { reporteProgresoQuerySchema } from "./reporte-progreso.validador.js";

export const exportarReporteQuerySchema = reporteProgresoQuerySchema.extend({
  formato: z.enum(["csv", "pdf"]),
});

export type ExportarReporteQueryDTO = z.infer<typeof exportarReporteQuerySchema>;
