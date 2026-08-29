// src/repositorios/ruta-aprendizaje-repo.ts
// Repositorio de acceso a datos para las rutas de aprendizaje asignadas a un estudiante.
// Cubre: RF-21

import type { PrismaClient, RutaAprendizaje, RutaModulo } from "@prisma/client";

export type RutaAprendizajeConModulos = RutaAprendizaje & {
  rutaModulos: RutaModulo[];
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
}
