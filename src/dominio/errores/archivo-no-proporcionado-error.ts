// src/dominio/errores/archivo-no-proporcionado-error.ts
// Error de dominio: la peticion de subida no incluyo ningun archivo.
// El middleware global lo traduce a HTTP 400.
// Cubre: RF-20 — CU-10

export class ArchivoNoProporcionadoError extends Error {
  constructor() {
    super("No se proporciono ningun archivo");
    this.name = "ArchivoNoProporcionadoError";
  }
}
