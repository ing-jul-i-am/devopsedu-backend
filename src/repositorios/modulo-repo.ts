// src/repositorios/modulo-repo.ts
// Repositorio de acceso a datos para los modulos de aprendizaje del componente educativo.
// Cubre: RF-20

import type { PrismaClient, Modulo } from "@prisma/client";

export interface DatosModulo {
  nombre: string;
  contenidoTeorico: string;
  orden: number;
}

export class ModuloRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async crear(datos: DatosModulo): Promise<Modulo> {
    return this.prisma.modulo.create({ data: datos });
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
    return this.prisma.modulo.update({ where: { idModulo }, data: datos });
  }
}
