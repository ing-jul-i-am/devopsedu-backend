// src/api/validadores/usuarios/resetear-contrasena.validador.ts
// Cubre: RF-04

import { z } from "zod";

export const resetearContrasenaSchema = z.object({
  contrasenaNueva: z.string().min(1),
});

export type ResetearContrasenaDTO = z.infer<typeof resetearContrasenaSchema>;
