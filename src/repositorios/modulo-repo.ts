// src/repositorios/modulo-repo.ts
// Repositorio de acceso a datos para los modulos de aprendizaje del componente educativo.
// Cubre: RF-20

import type { PrismaClient, Modulo, Prisma } from "@prisma/client";
import type { BloqueContenido } from "../dominio/modelos/bloque-contenido.js";

export interface DatosModulo {
  nombre: string;
  contenido: BloqueContenido[];
  orden: number;
}

export class ModuloRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async crear(datos: DatosModulo): Promise<Modulo> {
    return this.prisma.modulo.create({
      data: {
        nombre: datos.nombre,
        orden: datos.orden,
        contenido: datos.contenido as unknown as Prisma.InputJsonValue,
      },
    });
  }

  // Orden ascendente: es el orden de aparicion del modulo dentro de una ruta de aprendizaje.
  async listarTodos(): Promise<Modulo[]> {
    return this.prisma.modulo.findMany({ orderBy: { orden: "asc" } });
  }

  async buscarPorId(idModulo: number): Promise<Modulo | null> {
    return this.prisma.modulo.findUnique({ where: { idModulo } });
  }

  async actualizar(
    idModulo: number,
    datos: Partial<DatosModulo>
  ): Promise<Modulo> {
    const { contenido, ...resto } = datos;
    return this.prisma.modulo.update({
      where: { idModulo },
      data: {
        ...resto,
        ...(contenido !== undefined
          ? { contenido: contenido as unknown as Prisma.InputJsonValue }
          : {}),
      },
    });
  }
}
