// src/dominio/errores/modulo-no-asignado-error.ts
// Error de dominio: el modulo existe pero no pertenece a la ruta de aprendizaje activa del
// estudiante. El middleware global lo traduce a HTTP 404.
// Cubre: RF-23 — CU-12

export class ModuloNoAsignadoError extends Error {
  constructor() {
    super("El modulo no pertenece a tu ruta de aprendizaje");
    this.name = "ModuloNoAsignadoError";
  }
}
