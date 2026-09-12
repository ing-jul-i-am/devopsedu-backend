// src/api/validadores/actividades/crear-actividad.validador.ts
// Cubre: RF-23 — CU-12

import { z } from "zod";
import type { CriteriosValidacion } from "../../../dominio/modelos/criterios-validacion.js";

const condicionesValidacionSchema = z.object({
  imagenDocker: z.string().min(1).optional(),
  volumenesMinimos: z.number().int().nonnegative().optional(),
  puertosMinimos: z.number().int().nonnegative().optional(),
  cpuMinimo: z.number().positive().optional(),
  memoriaMinima: z.number().int().positive().optional(),
});

// La anotacion de tipo obliga a que este esquema implemente exactamente el tipo de dominio.
const criteriosValidacionSchema: z.ZodType<CriteriosValidacion> = z.object({
  operacion: z.enum(["desplegar", "detener", "reiniciar", "eliminar"]),
  condiciones: condicionesValidacionSchema.optional(),
});

export const crearActividadSchema = z.object({
  descripcion: z.string().min(3, "La descripcion es obligatoria"),
  criteriosValidacion: criteriosValidacionSchema,
  orden: z.number().int().positive(),
});

export type CrearActividadDTO = z.infer<typeof crearActividadSchema>;
