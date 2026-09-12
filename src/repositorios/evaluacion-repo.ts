// src/repositorios/evaluacion-repo.ts
// Repositorio de acceso a datos para las evaluaciones de modulo (cardinalidad 0-o-1 con Modulo).
// Cubre: RF-24 — CU-14

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
}
