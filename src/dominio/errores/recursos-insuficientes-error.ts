// src/dominio/errores/recursos-insuficientes-error.ts
// Error de dominio: los recursos solicitados superan la capacidad disponible del servidor.
// Lleva el detalle de lo solicitado y lo disponible para informarlo al usuario (RF-09).
// El middleware global lo traduce a HTTP 422.
// Cubre: RF-09 — CU-04

export interface RecursosDetalle {
  cpu: number;
  memoria: number;
  almacenamiento: number;
}

export class RecursosInsuficientesError extends Error {
  constructor(
    public readonly solicitado: RecursosDetalle,
    public readonly disponible: RecursosDetalle
  ) {
    super("Recursos insuficientes para la configuracion solicitada");
    this.name = "RecursosInsuficientesError";
  }
}
