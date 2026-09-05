// src/dominio/errores/archivo-demasiado-grande-error.ts
// Error de dominio: el archivo subido excede el tamano maximo permitido.
// El middleware global lo traduce a HTTP 400.
// Cubre: RF-20 — CU-10

export class ArchivoDemasiadoGrandeError extends Error {
  constructor() {
    super("El archivo excede el tamano maximo permitido");
    this.name = "ArchivoDemasiadoGrandeError";
  }
}
