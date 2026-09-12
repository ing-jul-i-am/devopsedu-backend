// src/dominio/errores/evaluacion-ya-aprobada-error.ts
// Error de dominio: el estudiante ya aprobo esta evaluacion en un intento previo; no se permiten
// reintentos tras aprobar (ver docs/decisiones-tecnicas.md DT-11). El middleware global lo
// traduce a HTTP 409.
// Cubre: RF-24 — CU-14

export class EvaluacionYaAprobadaError extends Error {
  constructor() {
    super("Ya aprobaste esta evaluacion");
    this.name = "EvaluacionYaAprobadaError";
  }
}
