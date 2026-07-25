// src/infraestructura/configuracion.ts
// Lectura y validacion centralizada de las variables de entorno al arranque.
// Si una variable obligatoria falta o es invalida, la aplicacion no debe iniciar.
// Cubre: RNF-21

import { z } from "zod";

// Esquema de las variables de entorno conocidas hasta la Etapa 0.
// Se ampliara en etapas posteriores (JWT, PORT, etc.) a medida que se necesiten.
const esquemaConfiguracion = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string().url(),
  DATABASE_URL_TEST: z.string().url().optional(),
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
