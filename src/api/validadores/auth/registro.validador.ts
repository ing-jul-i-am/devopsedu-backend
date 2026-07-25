// src/api/validadores/auth/registro.validador.ts
// Esquema de validacion del cuerpo de POST /api/auth/registro. El rol NO se acepta desde el
// cliente: lo asigna el servidor (auto-registro como estudiante).
// Cubre: RF-01

import { z } from "zod";

export const registroSchema = z.object({
  nombre: z.string().min(2).max(120),
  correo: z.string().email().max(160),
  contrasena: z.string().min(8).max(128),
});

export type RegistroDTO = z.infer<typeof registroSchema>;
