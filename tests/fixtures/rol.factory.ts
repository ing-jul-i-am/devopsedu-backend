// tests/fixtures/rol.factory.ts
// Funcion de fabrica para crear roles en la base de pruebas. Los usuarios requieren un rol
// existente por su llave foranea (idRol), por lo que esta fabrica es apoyo de usuario.factory.

import type { Rol } from "@prisma/client";
import { prismaTest } from "../ayudas/prisma-test.js";

export interface ParcialesRol {
  nombre?: string;
  permisos?: string[];
}

export async function crearRolEnBd(parciales: ParcialesRol = {}): Promise<Rol> {
  return prismaTest.rol.create({
    data: {
      nombre: parciales.nombre ?? "estudiante",
      permisos: parciales.permisos ?? [],
    },
  });
}
