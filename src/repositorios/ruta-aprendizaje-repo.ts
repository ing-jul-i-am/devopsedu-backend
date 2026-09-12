// src/repositorios/ruta-aprendizaje-repo.ts
// Repositorio de acceso a datos para las rutas de aprendizaje asignadas a un estudiante.
// Cubre: RF-21, RF-22

import type {
  PrismaClient,
  RutaAprendizaje,
  RutaModulo,
  Modulo,
} from "@prisma/client";

export type RutaAprendizajeConModulos = RutaAprendizaje & {
  rutaModulos: RutaModulo[];
};

export type RutaAprendizajeConModulosDetalle = RutaAprendizaje & {
  rutaModulos: Array<RutaModulo & { modulo: Modulo }>;
};

export class RutaAprendizajeRepo {
  constructor(private readonly prisma: PrismaClient) {}

  // idModulos ya viene en el orden deseado; ordenSecuencia se deriva de su posicion (base 1).
  async asignar(
    idUsuario: number,
    idModulos: number[]
  ): Promise<RutaAprendizajeConModulos> {
    return this.prisma.rutaAprendizaje.create({
      data: {
        idUsuario,
        rutaModulos: {
          create: idModulos.map((idModulo, indice) => ({
            idModulo,
            ordenSecuencia: indice + 1,
          })),
        },
      },
      include: { rutaModulos: true },
    });
  }

  // RF-22: la ruta vigente del estudiante es la asignada mas recientemente. El desempate por
  // idRuta garantiza determinismo cuando dos asignaciones comparten marca de tiempo.
  async buscarUltimaPorUsuario(
    idUsuario: number
  ): Promise<RutaAprendizajeConModulosDetalle | null> {
    return this.prisma.rutaAprendizaje.findFirst({
      where: { idUsuario },
      orderBy: [{ fechaAsignacion: "desc" }, { idRuta: "desc" }],
      include: {
        rutaModulos: {
          include: { modulo: true },
          orderBy: { ordenSecuencia: "asc" },
        },
      },
    });
  }

  // RF-23: marca el inicio del modulo solo si aun no tenia fecha, para que el calculo de
  // tiempoEmpleado de sus actividades sea idempotente ante llamadas repetidas del estudiante.
  async marcarInicioModulo(idRuta: number, idModulo: number): Promise<void> {
    await this.prisma.rutaModulo.updateMany({
      where: { idRuta, idModulo, fechaInicio: null },
      data: { fechaInicio: new Date() },
    });
  }

  // RF-23: recalculado por EvaluadorActividad cada vez que se completa una actividad.
  async actualizarProgreso(idRuta: number, progreso: number): Promise<void> {
    await this.prisma.rutaAprendizaje.update({
      where: { idRuta },
      data: { progreso },
    });
  }
}
