// src/dominio/tipo-volumen.ts
// Regla de negocio pura que distingue un bind mount de un volumen nombrado a partir del origen
// declarado en la configuracion del servicio. Reproduce la misma inferencia que hace Docker con
// HostConfig.Binds, de modo que lo declarado coincide siempre con lo que el motor crea.
// Al recrear o eliminar un contenedor solo se destruyen los volumenes nombrados: los bind mounts
// son directorios del host y deben conservarse (ver docs/decisiones-tecnicas.md DT-15).
// Cubre: RF-08, RF-11, RF-14

export type TipoVolumen = "bind" | "volumen";

// Un origen es una ruta del host (bind mount) si empieza con separador, con una ruta relativa,
// con el directorio del usuario, o con una letra de unidad de Windows.
const RUTA_DE_HOST = /^(\/|\.{1,2}[/\\]|~|[A-Za-z]:[/\\])/;

export function clasificarVolumen(origen: string): TipoVolumen {
  return RUTA_DE_HOST.test(origen.trim()) ? "bind" : "volumen";
}
