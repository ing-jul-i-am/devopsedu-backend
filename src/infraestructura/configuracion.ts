// src/infraestructura/configuracion.ts
// Lectura y validacion centralizada de las variables de entorno al arranque.
// Si una variable obligatoria falta o es invalida, la aplicacion no debe iniciar.
// Cubre: RNF-21

import { z } from "zod";

// Esquema de las variables de entorno de la aplicacion. Se amplia por etapa a medida que
// se necesitan nuevas variables.
const esquemaConfiguracion = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string().url(),
  DATABASE_URL_TEST: z.string().url().optional(),
  // Autenticacion (Etapa 2). El secreto no tiene valor por defecto a proposito: un secreto
  // debil o predecible comprometeria la firma de los tokens (RNF-10, RNF-14).
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRACION_SEGUNDOS: z.coerce.number().int().positive().default(3600),
  PORT: z.coerce.number().int().positive().default(3000),
  ROL_POR_DEFECTO: z.string().min(1).default("estudiante"),
  // Ruta del sistema de archivos a inspeccionar para el espacio en disco libre (RF-09/RF-10).
  SERVIDOR_RUTA_DISCO: z.string().min(1).default("/"),
  // Frecuencia del monitor de metricas en ms. No debe superar 5000 (RNF-09).
  MONITOR_INTERVALO_MS: z.coerce.number().int().positive().max(5000).default(5000),
});

export type Configuracion = z.infer<typeof esquemaConfiguracion>;

// Error de configuracion: mensaje legible sin exponer trazas internas (RNF-12, RNF-14).
export class ConfiguracionInvalidaError extends Error {
  constructor(detalle: string) {
    super(`Configuracion de entorno invalida: ${detalle}`);
    this.name = "ConfiguracionInvalidaError";
  }
}

/**
 * Valida el conjunto de variables de entorno recibido y devuelve una configuracion tipada.
 * Lanza ConfiguracionInvalidaError si alguna variable obligatoria falta o es invalida.
 */
export function cargarConfiguracion(
  entorno: NodeJS.ProcessEnv = process.env
): Configuracion {
  const resultado = esquemaConfiguracion.safeParse(entorno);

  if (!resultado.success) {
    const detalle = resultado.error.issues
      .map((issue) => `${issue.path.join(".") || "(raiz)"}: ${issue.message}`)
      .join("; ");
    throw new ConfiguracionInvalidaError(detalle);
  }

  return resultado.data;
}
