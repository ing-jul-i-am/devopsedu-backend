// src/infraestructura/capacidad-servidor.ts
// Lee la capacidad total del servidor fisico. La CPU y la memoria provienen del sistema
// operativo; el almacenamiento total no lo expone os de forma portable, por lo que se toma de
// la configuracion (variable de entorno), evitando dependencias nuevas (RNF-20).
// Cubre: RF-09, RF-10

import os from "node:os";

export interface CapacidadServidor {
  cpu: number; // nucleos
  memoria: number; // MB
  almacenamiento: number; // MB
}

const BYTES_POR_MB = 1024 * 1024;

export function crearLectorCapacidad(
  almacenamientoTotalMb: number
): () => CapacidadServidor {
  return () => ({
    cpu: os.cpus().length,
    memoria: Math.floor(os.totalmem() / BYTES_POR_MB),
    almacenamiento: almacenamientoTotalMb,
  });
}
