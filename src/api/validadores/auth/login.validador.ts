// src/api/validadores/auth/login.validador.ts
// Esquema de validacion del cuerpo de POST /api/auth/login.
// Cubre: RF-02

import { z } from "zod";

export const loginSchema = z.object({
  correo: z.string().email(),
  contrasena: z.string().min(1),
});

export type LoginDTO = z.infer<typeof loginSchema>;
