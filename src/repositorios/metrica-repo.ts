// src/repositorios/metrica-repo.ts
// Repositorio de metricas de consumo (series temporales). El monitor periodico inserta lotes y
// el historico se consulta filtrado por servicio y rango de fechas.
// Cubre: RF-18

import type { PrismaClient, Metrica } from "@prisma/client";

export interface DatosMetrica {
  idServicio: number;
  consumoCpu: number;
  consumoMemoria: number;
  estadoEjecucion: string;
}

export interface RangoFechas {
  desde?: Date;
  hasta?: Date;
}

export class MetricaRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async registrarLote(metricas: DatosMetrica[]): Promise<number> {
    const resultado = await this.prisma.metrica.createMany({ data: metricas });
    return resultado.count;
  }

  async listarPorServicio(
    idServicio: number,
    rango: RangoFechas = {}
  ): Promise<Metrica[]> {
    const filtroTiempo: { gte?: Date; lte?: Date } = {};
    if (rango.desde) {
      filtroTiempo.gte = rango.desde;
    }
    if (rango.hasta) {
      filtroTiempo.lte = rango.hasta;
    }

    return this.prisma.metrica.findMany({
      where: {
        idServicio,
        ...(rango.desde || rango.hasta ? { marcaTiempo: filtroTiempo } : {}),
      },
      orderBy: [{ marcaTiempo: "desc" }, { idMetrica: "desc" }],
    });
  }
}
