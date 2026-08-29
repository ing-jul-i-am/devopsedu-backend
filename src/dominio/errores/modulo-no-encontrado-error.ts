// src/dominio/errores/modulo-no-encontrado-error.ts
// Error de dominio: el modulo de aprendizaje solicitado no existe. El middleware global lo
// traduce a HTTP 404.
// Cubre: RF-20

export class ModuloNoEncontradoError extends Error {
  constructor() {
    super("Modulo no encontrado");
    this.name = "ModuloNoEncontradoError";
  }
}
