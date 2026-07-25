// src/dominio/errores/contenedor-no-encontrado-error.ts
// Error de dominio: no existe el contenedor sobre el que se intenta operar (detener, reiniciar,
// eliminar o medir). El middleware global lo traduce a HTTP 404.
// Cubre: RF-12, RF-13, RF-14, RNF-13

export class ContenedorNoEncontradoError extends Error {
  constructor() {
    super("El contenedor del servicio no existe");
    this.name = "ContenedorNoEncontradoError";
  }
}
