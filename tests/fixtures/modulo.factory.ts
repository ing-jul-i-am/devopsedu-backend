// tests/fixtures/modulo.factory.ts
// Funciones de fabrica para bloques de contenido y datos de modulo de aprendizaje. Evitan
// repetir literales de bloques en cada test (CLAUDE.md 7.5).

import type { Modulo, Prisma } from "@prisma/client";
import type {
  BloqueContenido,
  BloqueEnlace,
  BloqueImagen,
  BloqueTexto,
} from "@/dominio/modelos/bloque-contenido.js";
import { prismaTest } from "../ayudas/prisma-test.js";

export function bloqueTexto(
  parciales: Partial<Omit<BloqueTexto, "tipo">> = {}
): BloqueTexto {
  return {
    tipo: "texto",
    contenido: "Los contenedores empaquetan una aplicacion y sus dependencias.",
    ...parciales,
  };
}

export function bloqueImagen(
  parciales: Partial<Omit<BloqueImagen, "tipo">> = {}
): BloqueImagen {
  return {
    tipo: "imagen",
    url: "/archivos/modulos/ejemplo.png",
    textoAlternativo: "Diagrama de ejemplo",
    ...parciales,
  };
}

export function bloqueEnlace(
  parciales: Partial<Omit<BloqueEnlace, "tipo">> = {}
): BloqueEnlace {
  return {
    tipo: "enlace",
    url: "https://docs.docker.com/",
    titulo: "Documentacion oficial de Docker",
    ...parciales,
  };
}

export interface ParcialesModulo {
  nombre?: string;
  contenido?: BloqueContenido[];
  orden?: number;
}

export function datosModuloValidos(parciales: ParcialesModulo = {}): {
  nombre: string;
  contenido: BloqueContenido[];
  orden: number;
} {
  return {
    nombre: "Introduccion a contenedores",
    contenido: [bloqueTexto()],
    orden: 1,
    ...parciales,
  };
}

// Crea un modulo directo en la base de pruebas (sin pasar por ModuloRepo) para preparar
// (Arrange) datos en pruebas que no estan probando el propio repositorio.
export async function crearModuloEnBd(
  parciales: ParcialesModulo = {}
): Promise<Modulo> {
  const datos = datosModuloValidos(parciales);
  return prismaTest.modulo.create({
    data: {
      nombre: datos.nombre,
      contenido: datos.contenido as unknown as Prisma.InputJsonValue,
      orden: datos.orden,
    },
  });
}
