// src/dominio/errores/token-invalido-error.ts
// Error de dominio: el token presentado es invalido, esta manipulado o expiro.
// El middleware global lo traduce a HTTP 401. No expone detalles internos (RNF-12).
// Cubre: RF-03, RNF-14

export class TokenInvalidoError extends Error {
  constructor() {
    super("Token invalido o expirado");
    this.name = "TokenInvalidoError";
  }
}
