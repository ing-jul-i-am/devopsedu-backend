// src/api/validadores/servicios/crear-servicio.validador.ts
// Esquema de validacion del cuerpo de POST /api/servicios. Valida formato, rangos y campos
// obligatorios con mensajes descriptivos en espanol (RF-06).
// Cubre: RF-05, RF-06

import { z } from "zod";

const puertoSchema = z.object({
  host: z.number().int().min(1).max(65535),
  contenedor: z.number().int().min(1).max(65535),
  protocolo: z.enum(["tcp", "udp"]),
});

const volumenSchema = z.object({
  origen: z.string().min(1),
  destino: z.string().min(1),
  modo: z.enum(["ro", "rw"]),
});

export const crearServicioSchema = z.object({
  nombre: z
    .string()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .max(120, { message: "El nombre no puede exceder 120 caracteres" }),
  descripcion: z
    .string()
    .max(500, { message: "La descripcion no puede exceder 500 caracteres" })
    .optional(),
  configuracion: z.object({
    imagenDocker: z
      .string()
      .min(1, { message: "La imagen Docker es obligatoria" })
      .max(255),
    cpuAsignado: z
      .number({ message: "El CPU asignado debe ser un numero" })
      .positive({ message: "El CPU asignado debe ser mayor que cero" })
      .max(8, { message: "El CPU asignado no puede exceder 8 nucleos" }),
    memoriaAsignada: z
      .number()
      .int({ message: "La memoria asignada debe ser un entero (MB)" })
      .positive({ message: "La memoria asignada debe ser mayor que cero" })
      .max(131072, { message: "La memoria asignada no puede exceder 131072 MB" }),
    almacenamientoAsignado: z
      .number()
      .int({ message: "El almacenamiento asignado debe ser un entero (MB)" })
      .positive({ message: "El almacenamiento asignado debe ser mayor que cero" })
      .max(1048576, {
        message: "El almacenamiento asignado no puede exceder 1048576 MB",
      }),
    puertos: z.array(puertoSchema),
    variablesEntorno: z.record(z.string(), z.string()),
    volumenes: z.array(volumenSchema),
  }),
});

export type CrearServicioDTO = z.infer<typeof crearServicioSchema>;
