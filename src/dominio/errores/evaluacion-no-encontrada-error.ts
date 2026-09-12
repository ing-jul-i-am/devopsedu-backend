// src/dominio/errores/evaluacion-no-encontrada-error.ts
// Error de dominio: el modulo no tiene ninguna evaluacion asociada, o la evaluacion solicitada
// no existe. El middleware global lo traduce a HTTP 404.
// Cubre: RF-24 — CU-14

export class EvaluacionNoEncontradaError extends Error {
  constructor() {
    super("Evaluacion no encontrada");
    this.name = "EvaluacionNoEncontradaError";
  }
}
