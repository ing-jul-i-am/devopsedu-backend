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

// Factory pura en memoria (sin base de datos), para las pruebas unitarias (CLAUDE.md 7.5).
export function crearUsuario(parciales: Partial<Usuario> = {}): Usuario {
  return {
    idUsuario: 1,
    nombre: "Estudiante de prueba",
    correo: "estudiante@devopsedu.local",
    contrasenaCifrada: "hash_falso",
    fechaRegistro: new Date("2026-01-01"),
    idRol: 1,
    ...parciales,
  };
}

// Contador para generar correos unicos por defecto y no chocar con la restriccion @unique
// cuando un mismo test crea varios usuarios sin especificar el correo.
let secuenciaUsuario = 0;

export async function crearUsuarioEnBd(
  parciales: ParcialesUsuario = {}
): Promise<Usuario> {
  const idRol = parciales.idRol ?? (await crearRolEnBd()).idRol;

  return prismaTest.usuario.create({
    data: {
      nombre: parciales.nombre ?? "Estudiante de prueba",
      correo: parciales.correo ?? `usuario-${++secuenciaUsuario}@devopsedu.local`,
      contrasenaCifrada: parciales.contrasenaCifrada ?? "hash_falso",
      idRol,
    },
  });
}
