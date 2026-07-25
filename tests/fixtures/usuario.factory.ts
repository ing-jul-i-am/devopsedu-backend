// tests/fixtures/usuario.factory.ts
// Funcion de fabrica para crear usuarios en la base de pruebas. Si no se indica un idRol,
// crea un rol por defecto para satisfacer la llave foranea. Se usa para preparar (Arrange)
// datos en las pruebas de integracion, no para probar el propio UsuarioRepo.crear.

import type { Usuario } from "@prisma/client";
import { prismaTest } from "../ayudas/prisma-test.js";
import { crearRolEnBd } from "./rol.factory.js";

export interface ParcialesUsuario {
  nombre?: string;
  correo?: string;
  contrasenaCifrada?: string;
  idRol?: number;
}

export async function crearUsuarioEnBd(
  parciales: ParcialesUsuario = {}
): Promise<Usuario> {
  const idRol = parciales.idRol ?? (await crearRolEnBd()).idRol;

  return prismaTest.usuario.create({
    data: {
      nombre: parciales.nombre ?? "Estudiante de prueba",
      correo: parciales.correo ?? "estudiante@devopsedu.local",
      contrasenaCifrada: parciales.contrasenaCifrada ?? "hash_falso",
      idRol,
    },
  });
}
