// src/repositorios/rol-repo.ts
// Repositorio de acceso a datos para la entidad Rol.
// Cubre: RF-01, RF-04

import type { PrismaClient, Rol } from "@prisma/client";

export class RolRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async buscarPorNombre(nombre: string): Promise<Rol | null> {
    return this.prisma.rol.findUnique({ where: { nombre } });
  }
}
