// src/dominio/errores/usuario-no-encontrado-error.ts
// Error de dominio: el usuario destino de una operacion administrativa no existe. El
// middleware global lo traduce a HTTP 404.
// Cubre: RF-21

export class UsuarioNoEncontradoError extends Error {
  constructor() {
    super("Usuario no encontrado");
    this.name = "UsuarioNoEncontradoError";
  }
}
