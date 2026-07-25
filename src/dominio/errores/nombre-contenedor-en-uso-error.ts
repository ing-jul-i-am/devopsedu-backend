// src/dominio/errores/nombre-contenedor-en-uso-error.ts
// Error de dominio: ya existe un contenedor con el nombre determinístico del servicio.
// El middleware global lo traduce a HTTP 409.
// Cubre: RF-11, RNF-13

export class NombreContenedorEnUsoError extends Error {
  constructor() {
    super("Ya existe un contenedor para este servicio");
    this.name = "NombreContenedorEnUsoError";
  }
}
