// src/api/validadores/modulos/crear-modulo.validador.ts
// Cubre: RF-20 — CU-10

import { z } from "zod";

export const crearModuloSchema = z.object({
  nombre: z.string().min(3).max(160),
  contenidoTeorico: z.string().min(1),
  orden: z.number().int().positive(),
});

export type CrearModuloDTO = z.infer<typeof crearModuloSchema>;
