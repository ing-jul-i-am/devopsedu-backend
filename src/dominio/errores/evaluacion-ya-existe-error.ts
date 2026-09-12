// src/dominio/errores/evaluacion-ya-existe-error.ts
// Error de dominio: el modulo ya tiene una evaluacion asociada (cardinalidad 0-o-1). El
// middleware global lo traduce a HTTP 409.
// Cubre: RF-24 — CU-14

export class EvaluacionYaExisteError extends Error {
  constructor() {
    super("El modulo ya tiene una evaluacion asociada");
    this.name = "EvaluacionYaExisteError";
  }
}
