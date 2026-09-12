// src/dominio/errores/evaluacion-no-disponible-error.ts
// Error de dominio: la evaluacion existe pero todavia no alcanza su fechaDisponible. El
// middleware global lo traduce a HTTP 422.
// Cubre: RF-24 — CU-14

export class EvaluacionNoDisponibleError extends Error {
  constructor() {
    super("La evaluacion todavia no esta disponible");
    this.name = "EvaluacionNoDisponibleError";
  }
}
