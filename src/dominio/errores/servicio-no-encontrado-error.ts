// src/dominio/errores/servicio-no-encontrado-error.ts
// Error de dominio: el servicio no existe o no pertenece al usuario que lo solicita. Se usa el
// mismo error en ambos casos para no revelar la existencia de servicios ajenos (RNF-12, RNF-14).
// El middleware global lo traduce a HTTP 404.
// Cubre: RF-08

export class ServicioNoEncontradoError extends Error {
  constructor() {
    super("Servicio no encontrado");
    this.name = "ServicioNoEncontradoError";
  }
}
