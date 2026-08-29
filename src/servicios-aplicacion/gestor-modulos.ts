// src/servicios-aplicacion/gestor-modulos.ts
// Servicio de aplicacion para la gestion de modulos de aprendizaje por parte del docente.
// Cubre: RF-20 — CU-10

import type { Modulo } from "@prisma/client";
import type { ModuloRepo, DatosModulo } from "../repositorios/modulo-repo.js";
import { ModuloNoEncontradoError } from "../dominio/errores/modulo-no-encontrado-error.js";

export class GestorModulos {
  constructor(private readonly moduloRepo: ModuloRepo) {}

  async crear(datos: DatosModulo): Promise<Modulo> {
    return this.moduloRepo.crear(datos);
  }

  async listarTodos(): Promise<Modulo[]> {
    return this.moduloRepo.listarTodos();
  }

  async editar(idModulo: number, datos: Partial<DatosModulo>): Promise<Modulo> {
    const existente = await this.moduloRepo.buscarPorId(idModulo);
    if (!existente) {
      throw new ModuloNoEncontradoError();
    }
    return this.moduloRepo.actualizar(idModulo, datos);
  }
}
