// src/dominio/tipo-volumen.ts
// Reglas de negocio puras para clasificar volumenes.
// clasificarVolumen distingue un bind mount de un volumen nombrado a partir del origen declarado
// en la configuracion del servicio. Reproduce la misma inferencia que hace Docker con
// HostConfig.Binds, de modo que lo declarado coincide siempre con lo que el motor crea.
// Al recrear o eliminar un contenedor solo se destruyen los volumenes nombrados: los bind mounts
// son directorios del host y deben conservarse (ver docs/decisiones-tecnicas.md DT-15).
// esVolumenAnonimo reconoce los volumenes que crea la propia imagen, para poder describirselos
// al estudiante antes de destruirlos (DT-17).
// Cubre: RF-08, RF-11, RF-14, RF-17

export type TipoVolumen = "bind" | "volumen";

// Un origen es una ruta del host (bind mount) si empieza con separador, con una ruta relativa,
// con el directorio del usuario, o con una letra de unidad de Windows.
const RUTA_DE_HOST = /^(\/|\.{1,2}[/\\]|~|[A-Za-z]:[/\\])/;

export function clasificarVolumen(origen: string): TipoVolumen {
  return RUTA_DE_HOST.test(origen.trim()) ? "bind" : "volumen";
}

// Un volumen es anonimo cuando lo creo la propia imagen por su instruccion VOLUME y nadie le dio
// nombre: el estudiante nunca lo declaro, pero contiene sus datos. La API de Docker no expone
// ninguna bandera que lo indique, solo el nombre, que en ese caso es un hash de 64 hexadecimales.
// Es una heuristica apoyada en esa convencion, estable en todas las versiones actuales de Docker.
const NOMBRE_ANONIMO = /^[0-9a-f]{64}$/;

export function esVolumenAnonimo(nombre: string): boolean {
  return NOMBRE_ANONIMO.test(nombre);
}
