// src/repositorios/resultado-repo.ts
// Repositorio de acceso a datos para los resultados de actividades y evaluaciones del
// componente educativo.
// Cubre: RF-23 — CU-12

import type { PrismaClient, Resultado } from "@prisma/client";

export interface DatosResultadoActividad {
  idUsuario: number;
  idActividad: number;
  puntuacion: number;
  tiempoEmpleado: number;
  intentos: number;
}

export class ResultadoRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async crearParaActividad(
    datos: DatosResultadoActividad
  ): Promise<Resultado> {
    return this.prisma.resultado.create({
      data: {
        idUsuario: datos.idUsuario,
        idActividad: datos.idActividad,
        puntuacion: datos.puntuacion,
        tiempoEmpleado: datos.tiempoEmpleado,
        intentos: datos.intentos,
      },
    });
  }

  async existePorUsuarioYActividad(
    idUsuario: number,
    idActividad: number
  ): Promise<boolean> {
    const resultado = await this.prisma.resultado.findFirst({
      where: { idUsuario, idActividad },
      select: { idResultado: true },
    });
    return resultado !== null;
  }

  // RF-23: usado para recalcular el progreso de la ruta tras completar una actividad.
  async contarActividadesCompletadasEnRuta(
    idUsuario: number,
    idsActividad: number[]
  ): Promise<number> {
    if (idsActividad.length === 0) {
      return 0;
    }
    return this.prisma.resultado.count({
      where: { idUsuario, idActividad: { in: idsActividad } },
    });
  }
}
