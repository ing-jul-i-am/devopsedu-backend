// src/api/validadores/rutas/asignar-ruta.validador.ts
// Cubre: RF-21 — CU-11

import { z } from "zod";

export const asignarRutaSchema = z.object({
  idUsuario: z.number().int().positive(),
  idModulos: z.array(z.number().int().positive()).min(1),
});

export type AsignarRutaDTO = z.infer<typeof asignarRutaSchema>;
