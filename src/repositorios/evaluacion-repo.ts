// src/repositorios/evaluacion-repo.ts
// Repositorio de acceso a datos para las evaluaciones de modulo (cardinalidad 0-o-1 con Modulo).
// Cubre: RF-24, RF-25 — CU-14, CU-15

import type { PrismaClient, Evaluacion, Prisma } from "@prisma/client";
import type { PreguntaEvaluacion } from "../dominio/modelos/pregunta-evaluacion.js";

export interface DatosEvaluacion {
  titulo: string;
  preguntas: PreguntaEvaluacion[];
  fechaDisponible: Date;
  idModulo: number;
}

export class EvaluacionRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async crear(datos: DatosEvaluacion): Promise<Evaluacion> {
    return this.prisma.evaluacion.create({
      data: {
        titulo: datos.titulo,
        preguntas: datos.preguntas as unknown as Prisma.InputJsonValue,
        fechaDisponible: datos.fechaDisponible,
        idModulo: datos.idModulo,
      },
    });
  }

  async buscarPorModulo(idModulo: number): Promise<Evaluacion | null> {
    return this.prisma.evaluacion.findUnique({ where: { idModulo } });
  }

  async buscarPorId(idEvaluacion: number): Promise<Evaluacion | null> {
    return this.prisma.evaluacion.findUnique({ where: { idEvaluacion } });
  }

  // RF-25: evaluaciones de todos los modulos del reporte en una sola consulta.
  async listarPorModulos(idsModulo: number[]): Promise<Evaluacion[]> {
    if (idsModulo.length === 0) {
      return [];
    }
    return this.prisma.evaluacion.findMany({
      where: { idModulo: { in: idsModulo } },
      orderBy: { idModulo: "asc" },
    });
  }
}
