// src/dominio/errores/rol-no-disponible-error.ts
// Error de dominio: el rol por defecto del auto-registro no existe en la base de datos
// (por ejemplo, si no se cargaron los datos semilla). Es una condicion de configuracion del
// servidor, no un error del cliente: el middleware global lo traduce a HTTP 500.
// Cubre: RF-01

export class RolNoDisponibleError extends Error {
  constructor(nombreRol: string) {
    super(`El rol '${nombreRol}' no esta disponible`);
    this.name = "RolNoDisponibleError";
  }
}
