// src/servicios-aplicacion/gestor-rutas.ts
// Servicio de aplicacion para la asignacion de rutas de aprendizaje a un estudiante por parte
// del docente.
// Cubre: RF-21 — CU-11

import type {
  RutaAprendizajeRepo,
  RutaAprendizajeConModulos,
} from "../repositorios/ruta-aprendizaje-repo.js";
import type { UsuarioRepo } from "../repositorios/usuario-repo.js";
import type { ModuloRepo } from "../repositorios/modulo-repo.js";
import { UsuarioNoEncontradoError } from "../dominio/errores/usuario-no-encontrado-error.js";
import { ModuloNoEncontradoError } from "../dominio/errores/modulo-no-encontrado-error.js";

export interface DependenciasGestorRutas {
  rutaRepo: RutaAprendizajeRepo;
  usuarioRepo: UsuarioRepo;
  moduloRepo: ModuloRepo;
}

export class GestorRutas {
  constructor(private readonly dep: DependenciasGestorRutas) {}

  async asignar(
    idUsuario: number,
    idModulos: number[]
  ): Promise<RutaAprendizajeConModulos> {
    const usuario = await this.dep.usuarioRepo.buscarPorId(idUsuario);
    if (!usuario) {
      throw new UsuarioNoEncontradoError();
    }

    for (const idModulo of idModulos) {
      const modulo = await this.dep.moduloRepo.buscarPorId(idModulo);
      if (!modulo) {
        throw new ModuloNoEncontradoError();
      }
    }

    return this.dep.rutaRepo.asignar(idUsuario, idModulos);
  }
}
