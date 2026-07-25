// tests/fixtures/servicio.factory.ts
// Funcion de fabrica para crear servicios (con su configuracion inicial) en la base de pruebas.
// Si no se indica idUsuario, crea un usuario por defecto para satisfacer la llave foranea.

import { prismaTest } from "../ayudas/prisma-test.js";
import { crearUsuarioEnBd } from "./usuario.factory.js";

export interface ConfiguracionDePrueba {
  imagenDocker?: string;
  cpuAsignado?: number;
  memoriaAsignada?: number;
  almacenamientoAsignado?: number;
  puertos?: Array<{ host: number; contenedor: number; protocolo: "tcp" | "udp" }>;
  variablesEntorno?: Record<string, string>;
  volumenes?: Array<{ origen: string; destino: string; modo: "ro" | "rw" }>;
}

export interface ParcialesServicio {
  nombre?: string;
  descripcion?: string;
  estado?: string;
  idUsuario?: number;
  configuracion?: ConfiguracionDePrueba;
}

let secuenciaServicio = 0;

export async function crearServicioEnBd(parciales: ParcialesServicio = {}) {
  const idUsuario = parciales.idUsuario ?? (await crearUsuarioEnBd()).idUsuario;
  const cfg = parciales.configuracion ?? {};

  return prismaTest.servicio.create({
    data: {
      nombre: parciales.nombre ?? `servicio-prueba-${++secuenciaServicio}`,
      descripcion: parciales.descripcion ?? null,
      estado: parciales.estado ?? "configurado",
      idUsuario,
      configuraciones: {
        create: {
          imagenDocker: cfg.imagenDocker ?? "postgres:16-alpine",
          cpuAsignado: cfg.cpuAsignado ?? 1,
          memoriaAsignada: cfg.memoriaAsignada ?? 512,
          almacenamientoAsignado: cfg.almacenamientoAsignado ?? 1024,
          puertos: cfg.puertos ?? [],
          variablesEntorno: cfg.variablesEntorno ?? {},
          volumenes: cfg.volumenes ?? [],
        },
      },
    },
    include: { configuraciones: true },
  });
}
