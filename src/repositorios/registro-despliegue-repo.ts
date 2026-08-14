// src/repositorios/registro-despliegue-repo.ts
// Repositorio de la bitacora de operaciones sobre servicios (despliegue, detencion, reinicio,
// eliminacion). Sustenta el historico consultable del servicio y la auditoria.
// Cubre: RF-15, RF-17

import type { PrismaClient, RegistroDespliegue } from "@prisma/client";

export interface DatosRegistroOperacion {
  idServicio: number;
  idUsuario: number;
  operacion: string;
  resultado: string;
  mensajeError?: string;
}

export class RegistroDespliegueRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async registrar(
    datos: DatosRegistroOperacion
  ): Promise<RegistroDespliegue> {
    return this.prisma.registroDespliegue.create({
      data: {
        idServicio: datos.idServicio,
        idUsuario: datos.idUsuario,
        operacion: datos.operacion,
        resultado: datos.resultado,
        mensajeError: datos.mensajeError ?? null,
      },
    });
  }

  async listarPorServicio(idServicio: number): Promise<RegistroDespliegue[]> {
    return this.prisma.registroDespliegue.findMany({
      where: { idServicio },
      orderBy: [{ fechaHora: "desc" }, { idRegistro: "desc" }],
    });
  }
}
