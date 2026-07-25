// src/dominio/errores/permiso-denegado-error.ts
// Error de dominio: el usuario esta autenticado pero su rol no tiene permiso para la accion.
// El middleware global lo traduce a HTTP 403 y se registra como acceso no autorizado (RNF-14).

export class PermisoDenegadoError extends Error {
  constructor() {
    super("No tiene permiso para realizar esta accion");
    this.name = "PermisoDenegadoError";
  }
}
