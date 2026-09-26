// src/dominio/errores/volumen-no-encontrado-error.ts
// Error de dominio: el volumen que se intenta eliminar ya no existe. Ocurre de forma habitual
// con los volumenes anonimos, que Docker arrastra al eliminar el contenedor con el flag "v"
// (ver docs/decisiones-tecnicas.md DT-15). El middleware global lo traduce a HTTP 404.
// Cubre: RF-11, RF-14

export class VolumenNoEncontradoError extends Error {
  constructor(public readonly volumen: string) {
    super(`El volumen ${volumen} no existe`);
    this.name = "VolumenNoEncontradoError";
  }
}
