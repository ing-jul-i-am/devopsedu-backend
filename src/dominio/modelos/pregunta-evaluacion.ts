// src/dominio/modelos/pregunta-evaluacion.ts
// Modelo de dominio de una pregunta de opcion multiple dentro de una evaluacion de modulo.
// Se persisten como un arreglo ordenado en Evaluacion.preguntas (Json); el orden del arreglo es
// el orden de presentacion al estudiante.
// Cubre: RF-24 — CU-14 (ver docs/decisiones-tecnicas.md DT-11)

export interface PreguntaEvaluacion {
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: number;
}
