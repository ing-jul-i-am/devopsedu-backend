// tests/fixtures/sesion.factory.ts
// Funcion de fabrica para crear sesiones en la base de pruebas. Si no se indica idUsuario,
// crea un usuario por defecto para satisfacer la llave foranea.

import type { Sesion } from "@prisma/client";
import { prismaTest } from "../ayudas/prisma-test.js";
import { crearUsuarioEnBd } from "./usuario.factory.js";

export interface ParcialesSesion {
  token?: string;
  fechaExpiracion?: Date;
  estado?: string;
  idUsuario?: number;
}

// Contador para generar tokens unicos por defecto y no chocar con la restriccion @unique.
let secuenciaSesion = 0;

export async function crearSesionEnBd(
  parciales: ParcialesSesion = {}
): Promise<Sesion> {
  const idUsuario = parciales.idUsuario ?? (await crearUsuarioEnBd()).idUsuario;

  return prismaTest.sesion.create({
    data: {
      token: parciales.token ?? `token-prueba-${++secuenciaSesion}`,
      fechaExpiracion:
        parciales.fechaExpiracion ?? new Date(Date.now() + 60 * 60 * 1000),
      estado: parciales.estado ?? "activa",
      idUsuario,
    },
  });
}
