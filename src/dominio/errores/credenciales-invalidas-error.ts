// src/dominio/errores/credenciales-invalidas-error.ts
// Error de dominio: el correo no existe o la contrasena no coincide. Se responde de forma
// generica para no revelar cual de las dos condiciones fallo (RNF-12, RNF-14).
// El middleware global lo traduce a HTTP 401.
// Cubre: RF-02

export class CredencialesInvalidasError extends Error {
  constructor() {
    super("Credenciales invalidas");
    this.name = "CredencialesInvalidasError";
  }
}
