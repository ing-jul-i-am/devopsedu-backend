// src/repositorios/actividad-repo.ts
// Repositorio de acceso a datos para las actividades practicas de un modulo de aprendizaje.
// Cubre: RF-23, RF-25 — CU-12, CU-15

import type { PrismaClient, Actividad, Prisma } from "@prisma/client";
import type { CriteriosValidacion } from "../dominio/modelos/criterios-validacion.js";

export interface DatosActividad {
  descripcion: string;
  criteriosValidacion: CriteriosValidacion;
  orden: number;
  idModulo: number;
}

export class ActividadRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async crear(datos: DatosActividad): Promise<Actividad> {
    return this.prisma.actividad.create({
      data: {
        descripcion: datos.descripcion,
        criteriosValidacion:
          datos.criteriosValidacion as unknown as Prisma.InputJsonValue,
        orden: datos.orden,
        idModulo: datos.idModulo,
      },
    });
  }

  async buscarPorId(idActividad: number): Promise<Actividad | null> {
    return this.prisma.actividad.findUnique({ where: { idActividad } });
  }

  async listarPorModulo(idModulo: number): Promise<Actividad[]> {
    return this.prisma.actividad.findMany({
      where: { idModulo },
      orderBy: { orden: "asc" },
    });
  }

  // RF-25: actividades de todos los modulos del reporte en una sola consulta.
  async listarPorModulos(idsModulo: number[]): Promise<Actividad[]> {
    if (idsModulo.length === 0) {
      return [];
    }
    return this.prisma.actividad.findMany({
      where: { idModulo: { in: idsModulo } },
      orderBy: [{ idModulo: "asc" }, { orden: "asc" }],
    });
  }
}
