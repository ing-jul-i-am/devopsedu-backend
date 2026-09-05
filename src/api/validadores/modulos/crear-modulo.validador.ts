// src/api/validadores/modulos/crear-modulo.validador.ts
// Cubre: RF-20 — CU-10

import { z } from "zod";
import { bloqueContenidoSchema } from "./bloque-contenido.validador.js";
import {
  MAX_BLOQUES_CONTENIDO,
  MIN_BLOQUES_CONTENIDO,
} from "../../../dominio/limites-contenido-modulo.js";

export const crearModuloSchema = z.object({
  nombre: z.string().min(3).max(160),
  contenido: z
    .array(bloqueContenidoSchema)
    .min(MIN_BLOQUES_CONTENIDO, "El modulo debe tener al menos un bloque de contenido")
    .max(MAX_BLOQUES_CONTENIDO, `El modulo no puede tener mas de ${MAX_BLOQUES_CONTENIDO} bloques`),
  orden: z.number().int().positive(),
});

export type CrearModuloDTO = z.infer<typeof crearModuloSchema>;
