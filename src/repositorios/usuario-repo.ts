// src/repositorios/usuario-repo.ts
// Repositorio de acceso a datos para la entidad Usuario. Unico punto de la capa de datos
// que conoce el detalle de persistencia de usuarios (CLAUDE.md 3, capa de acceso a datos).
// Cubre: RF-01, RF-04, RF-25

import type { PrismaClient, Usuario, Rol } from "@prisma/client";

export interface DatosNuevoUsuario {
  nombre: string;
  correo: string;
  contrasenaCifrada: string;
  idRol: number;
}

export class UsuarioRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async crear(datos: DatosNuevoUsuario): Promise<Usuario> {
    return this.prisma.usuario.create({ data: datos });
  }

  async buscarPorCorreo(correo: string): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({ where: { correo } });
  }

  async buscarPorId(idUsuario: number): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({ where: { idUsuario } });
  }

  // Incluye el rol para que el middleware de autenticacion pueda autorizar por rol sin una
  // consulta adicional.
  async buscarPorIdConRol(
    idUsuario: number
  ): Promise<(Usuario & { rol: Rol }) | null> {
    return this.prisma.usuario.findUnique({
      where: { idUsuario },
      include: { rol: true },
    });
  }

  // RF-25: base del reporte de progreso y del listado de estudiantes del docente (CU-15). El
  // desempate por idUsuario mantiene un orden estable entre homonimos.
  async listarPorRol(nombreRol: string): Promise<Usuario[]> {
    return this.prisma.usuario.findMany({
      where: { rol: { nombre: nombreRol } },
      orderBy: [{ nombre: "asc" }, { idUsuario: "asc" }],
    });
  }

  async actualizarContrasena(
    idUsuario: number,
    contrasenaCifrada: string
  ): Promise<Usuario> {
    return this.prisma.usuario.update({
      where: { idUsuario },
      data: { contrasenaCifrada },
    });
  }
}
