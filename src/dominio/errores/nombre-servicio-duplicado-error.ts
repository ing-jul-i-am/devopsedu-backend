// src/dominio/errores/nombre-servicio-duplicado-error.ts
// Error de dominio: el usuario ya tiene un servicio activo con ese nombre. Los servicios
// eliminados no reservan su nombre, asi que puede reutilizarse tras eliminarlos
// (ver docs/decisiones-tecnicas.md DT-16). El middleware global lo traduce a HTTP 409.
// Cubre: RF-05, RF-14

export class NombreServicioDuplicadoError extends Error {
  constructor(public readonly nombre: string) {
    super(`Ya tienes un servicio activo llamado ${nombre}`);
    this.name = "NombreServicioDuplicadoError";
  }
}
