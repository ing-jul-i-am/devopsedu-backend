// src/repositorios/sesion-repo.ts
// Repositorio de acceso a datos para la entidad Sesion. Sustenta la revocacion explicita
// de tokens JWT: cada sesion registra su token, vigencia y estado (CLAUDE.md 6.8).
// Cubre: RF-02, RF-03, RNF-14

import type { PrismaClient, Sesion } from "@prisma/client";

export interface DatosNuevaSesion {
  token: string;
  fechaExpiracion: Date;
  idUsuario: number;
  estado?: string;
}

export class SesionRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async crear(datos: DatosNuevaSesion): Promise<Sesion> {
    return this.prisma.sesion.create({
      data: {
        token: datos.token,
        fechaExpiracion: datos.fechaExpiracion,
        idUsuario: datos.idUsuario,
        estado: datos.estado ?? "activa",
      },
    });
  }

  async buscarPorToken(token: string): Promise<Sesion | null> {
    return this.prisma.sesion.findUnique({ where: { token } });
  }

  // Marca la sesion como revocada. Idempotente: si el token no existe, no afecta filas
  // ni lanza error (updateMany, a diferencia de update).
  async revocarPorToken(token: string): Promise<void> {
    await this.prisma.sesion.updateMany({
      where: { token },
      data: { estado: "revocada" },
    });
  }
}
