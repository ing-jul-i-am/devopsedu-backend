// src/dominio/errores/volumen-en-uso-error.ts
// Error de dominio: no se puede eliminar un volumen porque otro contenedor lo sigue montando.
// Los nombres de volumen son globales en Docker, asi que un volumen declarado por un servicio
// puede estar compartido con otro (ver docs/decisiones-tecnicas.md DT-15).
// El middleware global lo traduce a HTTP 409.
// Cubre: RF-11, RF-14

export class VolumenEnUsoError extends Error {
  constructor(public readonly volumen: string) {
    super(`El volumen ${volumen} esta en uso por otro contenedor`);
    this.name = "VolumenEnUsoError";
  }
}
