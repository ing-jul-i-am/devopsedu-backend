// tests/fixtures/actividad.factory.ts
// Funcion de fabrica para crear actividades practicas en la base de pruebas. Si no se indica
// idModulo, crea un modulo por defecto para satisfacer la llave foranea.
// Cubre: RF-23

import type { Prisma } from "@prisma/client";
import type { CriteriosValidacion } from "@/dominio/modelos/criterios-validacion.js";
import { prismaTest } from "../ayudas/prisma-test.js";
import { crearModuloEnBd } from "./modulo.factory.js";

export interface ParcialesActividad {
  descripcion?: string;
  criteriosValidacion?: CriteriosValidacion;
  orden?: number;
  idModulo?: number;
}

export function criteriosValidacionDePrueba(
  parciales: Partial<CriteriosValidacion> = {}
): CriteriosValidacion {
  return {
    operacion: "desplegar",
    ...parciales,
  };
}

export async function crearActividadEnBd(parciales: ParcialesActividad = {}) {
  const idModulo = parciales.idModulo ?? (await crearModuloEnBd()).idModulo;

  return prismaTest.actividad.create({
    data: {
      descripcion: parciales.descripcion ?? "Despliega un servicio con Docker",
      criteriosValidacion: (parciales.criteriosValidacion ??
        criteriosValidacionDePrueba()) as unknown as Prisma.InputJsonValue,
      orden: parciales.orden ?? 1,
      idModulo,
    },
  });
}
