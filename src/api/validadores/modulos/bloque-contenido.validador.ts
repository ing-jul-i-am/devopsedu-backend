// src/api/validadores/modulos/bloque-contenido.validador.ts
// Cubre: RF-20 — CU-10

import { z } from "zod";
import type { BloqueContenido } from "../../../dominio/modelos/bloque-contenido.js";

const bloqueTextoSchema = z.object({
  tipo: z.literal("texto"),
  contenido: z.string().min(1, "El contenido de texto no puede estar vacio"),
});

const bloqueImagenSchema = z.object({
  tipo: z.literal("imagen"),
  url: z.string().min(1, "La url de la imagen es obligatoria"),
  textoAlternativo: z.string().max(300).optional(),
});

const bloqueEnlaceSchema = z.object({
  tipo: z.literal("enlace"),
  url: z.string().url("La url del enlace no es valida"),
  titulo: z.string().min(1, "El titulo del enlace es obligatorio").max(200),
  descripcion: z.string().max(500).optional(),
});

const bloqueActividadSchema = z.object({
  tipo: z.literal("actividad"),
  idActividad: z.number().int().positive(),
});

// La anotacion de tipo obliga a que este esquema implemente exactamente el discriminated union
// de dominio: si BloqueContenido cambia sin actualizar el esquema, esto deja de compilar.
export const bloqueContenidoSchema: z.ZodType<BloqueContenido> =
  z.discriminatedUnion("tipo", [
    bloqueTextoSchema,
    bloqueImagenSchema,
    bloqueEnlaceSchema,
    bloqueActividadSchema,
  ]);

export type BloqueContenidoDTO = z.infer<typeof bloqueContenidoSchema>;
