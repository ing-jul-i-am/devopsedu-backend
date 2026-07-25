// src/dominio/errores/transicion-invalida-error.ts
// Error de dominio: la operacion solicitada no es valida desde el estado actual del servicio,
// segun la maquina de estados (seccion 4.2.14). El middleware global lo traduce a HTTP 409.
// Cubre: RF-11, RF-12, RF-13, RF-14

export class TransicionInvalidaError extends Error {
  constructor(operacion: string, estado: string) {
    super(`No se puede ${operacion} un servicio en estado '${estado}'`);
    this.name = "TransicionInvalidaError";
  }
}
