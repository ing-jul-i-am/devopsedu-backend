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

  // RF-22, RF-23: usado por CalculadorProgreso para saber si un modulo tiene todas sus
  // actividades completadas (DT-14).
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

  // RF-23: usado por GestorAprendizaje para marcar como completadas las actividades del
  // modulo (DT-18). Una sola consulta agrupada; si hubiera varios resultados por actividad,
  // se toma la fecha de finalizacion mas antigua.
  async buscarPrimeraFinalizacionPorActividades(
    idUsuario: number,
    idsActividad: number[]
  ): Promise<Map<number, Date>> {
    if (idsActividad.length === 0) {
      return new Map();
    }
    const grupos = await this.prisma.resultado.groupBy({
      by: ["idActividad"],
      where: { idUsuario, idActividad: { in: idsActividad } },
      _min: { fechaFinalizacion: true },
    });
    const fechas = new Map<number, Date>();
    for (const grupo of grupos) {
      if (grupo.idActividad !== null && grupo._min.fechaFinalizacion !== null) {
        fechas.set(grupo.idActividad, grupo._min.fechaFinalizacion);
      }
    }
    return fechas;
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

  // RF-24: usado para bloquear reintentos una vez que la evaluacion fue aprobada, y por
  // CalculadorProgreso para saber si el modulo tiene su evaluacion aprobada (DT-14).
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
}
