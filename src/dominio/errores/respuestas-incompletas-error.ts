// src/dominio/errores/respuestas-incompletas-error.ts
// Error de dominio: la cantidad de respuestas enviadas no coincide con la cantidad de preguntas
// de la evaluacion. El middleware global lo traduce a HTTP 400.
// Cubre: RF-24 — CU-14

export class RespuestasIncompletasError extends Error {
  constructor() {
    super("La cantidad de respuestas no coincide con la cantidad de preguntas");
    this.name = "RespuestasIncompletasError";
  }
}
