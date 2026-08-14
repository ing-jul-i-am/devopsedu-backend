// src/dominio/errores/imagen-docker-no-disponible-error.ts
// Error de dominio: la imagen Docker solicitada no existe o no esta disponible en el motor.
// El middleware global lo traduce a HTTP 422.
// Cubre: RF-11, RNF-13

export class ImagenDockerNoDisponibleError extends Error {
  constructor(imagen: string) {
    super(`La imagen Docker '${imagen}' no esta disponible`);
    this.name = "ImagenDockerNoDisponibleError";
  }
}
