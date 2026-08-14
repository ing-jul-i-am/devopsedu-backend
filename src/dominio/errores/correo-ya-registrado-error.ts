// src/dominio/errores/correo-ya-registrado-error.ts
// Error de dominio: se intenta registrar un correo que ya pertenece a otro usuario.
// El middleware global lo traduce a HTTP 409.
// Cubre: RF-01

export class CorreoYaRegistradoError extends Error {
  constructor() {
    super("El correo ya esta registrado");
    this.name = "CorreoYaRegistradoError";
  }
}
