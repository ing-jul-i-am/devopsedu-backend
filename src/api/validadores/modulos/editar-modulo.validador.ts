// src/api/validadores/modulos/editar-modulo.validador.ts
// Cubre: RF-20 — CU-10

import { z } from "zod";
import { crearModuloSchema } from "./crear-modulo.validador.js";

export const editarModuloSchema = crearModuloSchema.partial();

export type EditarModuloDTO = z.infer<typeof editarModuloSchema>;
