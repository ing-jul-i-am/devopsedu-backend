// src/api/validadores/servicios/editar-configuracion.validador.ts
// Esquema de validacion del cuerpo de PUT /api/servicios/:idServicio/configuracion. Reutiliza
// el esquema de configuracion de la creacion (RF-06).
// Cubre: RF-08

import { z } from "zod";
import { configuracionSchema } from "./crear-servicio.validador.js";

export const editarConfiguracionSchema = z.object({
  configuracion: configuracionSchema,
});

export type EditarConfiguracionDTO = z.infer<typeof editarConfiguracionSchema>;
