// src/dominio/limites-contenido-modulo.ts
// Limites de negocio para el contenido enriquecido de un modulo y para la subida de imagenes
// que se referencian desde los bloques de tipo imagen.
// Cubre: RF-20 — CU-10

export const MIN_BLOQUES_CONTENIDO = 1;
export const MAX_BLOQUES_CONTENIDO = 50;

export const TAMANO_MAXIMO_IMAGEN_BYTES = 5 * 1024 * 1024; // 5 MB

export const EXTENSION_POR_MIME: Readonly<Record<string, string>> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export const TIPOS_MIME_IMAGEN_PERMITIDOS: readonly string[] =
  Object.keys(EXTENSION_POR_MIME);
