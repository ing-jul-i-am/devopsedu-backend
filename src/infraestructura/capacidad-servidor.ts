// src/infraestructura/capacidad-servidor.ts
// Mide la capacidad total y la disponible del servidor consultando al sistema operativo. Lo
// disponible se lee directamente del SO (memoria y disco libres, carga de CPU), por lo que ya
// descuenta el uso de TODOS los procesos: el propio SO, otros programas y los contenedores
// Docker. Esto hace la verificacion de recursos realista respecto al estado real de la maquina.
// Cubre: RF-09, RF-10

import os from "node:os";
import { statfs } from "node:fs/promises";

export interface Recursos {
  cpu: number; // nucleos
  memoria: number; // MB
  almacenamiento: number; // MB
}

export interface MedicionRecursos {
  total: Recursos;
  disponible: Recursos;
}

const BYTES_POR_MB = 1024 * 1024;

export function crearMedidorRecursos(
  rutaDisco: string
): () => Promise<MedicionRecursos> {
  return async () => {
    const nucleos = os.cpus().length;
    const carga = os.loadavg()[0] ?? 0;
    const disco = await statfs(rutaDisco);

    return {
      total: {
        cpu: nucleos,
        memoria: Math.floor(os.totalmem() / BYTES_POR_MB),
        almacenamiento: Math.floor((disco.blocks * disco.bsize) / BYTES_POR_MB),
      },
      disponible: {
        // CPU libre aproximada: nucleos menos la demanda promedio (carga del sistema).
        cpu: Math.max(0, Number((nucleos - carga).toFixed(2))),
        memoria: Math.floor(os.freemem() / BYTES_POR_MB),
        almacenamiento: Math.floor((disco.bavail * disco.bsize) / BYTES_POR_MB),
      },
    };
  };
}
