// src/dominio/errores/tipo-archivo-no-permitido-error.ts
// Error de dominio: el archivo subido no tiene un tipo MIME de imagen permitido.
// El middleware global lo traduce a HTTP 400.
// Cubre: RF-20 — CU-10

export class TipoArchivoNoPermitidoError extends Error {
  constructor() {
    super("Tipo de archivo no permitido");
    this.name = "TipoArchivoNoPermitidoError";
  }
}
