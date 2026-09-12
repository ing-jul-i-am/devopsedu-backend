// src/dominio/errores/intentos-agotados-error.ts
// Error de dominio: el estudiante ya agoto el maximo de intentos permitidos para la evaluacion
// (ver src/dominio/reglas-evaluacion.ts). El middleware global lo traduce a HTTP 409.
// Cubre: RF-24 — CU-14

export class IntentosAgotadosError extends Error {
  constructor() {
    super("Se agotaron los intentos permitidos para esta evaluacion");
    this.name = "IntentosAgotadosError";
  }
}
