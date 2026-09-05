// src/servicios-aplicacion/gestor-usuarios.ts
// Servicio de aplicacion para operaciones administrativas sobre usuarios, ejecutadas por el
// rol docente. Por ahora cubre unicamente el reseteo manual de contrasena.
// Cubre: RF-04

import type { UsuarioRepo } from "../repositorios/usuario-repo.js";
import type { Cifrador } from "../infraestructura/cifrador.js";
import { UsuarioNoEncontradoError } from "../dominio/errores/usuario-no-encontrado-error.js";

export interface DependenciasGestorUsuarios {
  usuarioRepo: UsuarioRepo;
  cifrador: Cifrador;
}

export class GestorUsuarios {
  constructor(private readonly dep: DependenciasGestorUsuarios) {}

  async resetearContrasena(
    idUsuario: number,
    contrasenaNueva: string
  ): Promise<void> {
    const usuario = await this.dep.usuarioRepo.buscarPorId(idUsuario);
    if (!usuario) {
      throw new UsuarioNoEncontradoError();
    }

    const contrasenaCifrada = await this.dep.cifrador.cifrar(contrasenaNueva);
    await this.dep.usuarioRepo.actualizarContrasena(idUsuario, contrasenaCifrada);
  }
}
