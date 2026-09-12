// src/repositorios/resultado-repo.ts
// Repositorio de acceso a datos para los resultados de actividades y evaluaciones del
// componente educativo.
// Cubre: RF-23, RF-24 — CU-12, CU-14

import type { PrismaClient, Resultado } from "@prisma/client";

export interface DatosResultadoActividad {
  idUsuario: number;
  idActividad: number;
  puntuacion: number;
  tiempoEmpleado: number;
  intentos: number;
}

export interface DatosResultadoEvaluacion {
  idUsuario: number;
  idEvaluacion: number;
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

  async crearParaEvaluacion(
    datos: DatosResultadoEvaluacion
  ): Promise<Resultado> {
    return this.prisma.resultado.create({
      data: {
        idUsuario: datos.idUsuario,
        idEvaluacion: datos.idEvaluacion,
        puntuacion: datos.puntuacion,
        tiempoEmpleado: datos.tiempoEmpleado,
        intentos: datos.intentos,
      },
    });
  }

  // RF-24: usado para hacer cumplir el maximo de intentos permitidos.
  async contarIntentosPorUsuarioYEvaluacion(
    idUsuario: number,
    idEvaluacion: number
  ): Promise<number> {
    return this.prisma.resultado.count({
      where: { idUsuario, idEvaluacion },
    });
  }

  // RF-24: usado para bloquear reintentos una vez que la evaluacion fue aprobada.
  async existeAprobadaPorUsuarioYEvaluacion(
    idUsuario: number,
    idEvaluacion: number,
    umbral: number
  ): Promise<boolean> {
    const resultado = await this.prisma.resultado.findFirst({
      where: { idUsuario, idEvaluacion, puntuacion: { gte: umbral } },
      select: { idResultado: true },
    });
    return resultado !== null;
  }

  // RF-24: usado por CalculadorProgreso. Cuenta evaluaciones distintas (no intentos) con al
  // menos un resultado aprobado, dentro de las evaluaciones de la ruta.
  async contarEvaluacionesAprobadasEnRuta(
    idUsuario: number,
    idsEvaluacion: number[],
    umbral: number
  ): Promise<number> {
    if (idsEvaluacion.length === 0) {
      return 0;
    }
    const aprobadas = await this.prisma.resultado.findMany({
      where: {
        idUsuario,
        idEvaluacion: { in: idsEvaluacion },
        puntuacion: { gte: umbral },
      },
      distinct: ["idEvaluacion"],
      select: { idEvaluacion: true },
    });
    return aprobadas.length;
  }
}
