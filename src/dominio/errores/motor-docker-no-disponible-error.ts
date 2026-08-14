// src/dominio/errores/motor-docker-no-disponible-error.ts
// Error de dominio: no se pudo establecer comunicacion con el motor Docker (socket caido).
// El middleware global lo traduce a HTTP 503.
// Cubre: RF-11, RNF-13

export class MotorDockerNoDisponibleError extends Error {
  constructor() {
    super("El motor Docker no esta disponible");
    this.name = "MotorDockerNoDisponibleError";
  }
}
