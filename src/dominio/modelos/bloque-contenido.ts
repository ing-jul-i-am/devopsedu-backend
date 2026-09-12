// src/dominio/modelos/bloque-contenido.ts
// Modelo de dominio de los bloques de contenido enriquecido de un modulo de aprendizaje.
// Se persisten como un arreglo ordenado en Modulo.contenido (Json); el orden del arreglo es
// el orden de lectura, por lo que no se necesita un campo de orden dentro de cada bloque.
// Cubre: RF-20 — CU-10

export interface BloqueTexto {
  tipo: "texto";
  contenido: string; // Markdown
}

export interface BloqueImagen {
  tipo: "imagen";
  url: string;
  textoAlternativo?: string | undefined;
}

export interface BloqueEnlace {
  tipo: "enlace";
  url: string;
  titulo: string;
  descripcion?: string | undefined;
}

// RF-23: marca donde aparece una actividad practica dentro de la lectura lineal del modulo.
// idActividad referencia una Actividad ya creada para ese mismo modulo (ver DT-10).
export interface BloqueActividad {
  tipo: "actividad";
  idActividad: number;
}

export type BloqueContenido =
  | BloqueTexto
  | BloqueImagen
  | BloqueEnlace
  | BloqueActividad;
