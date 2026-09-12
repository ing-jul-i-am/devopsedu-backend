// src/servicios-aplicacion/gestor-modulos.ts
// Servicio de aplicacion para la gestion de modulos de aprendizaje y sus actividades practicas,
// por parte del docente.
// Cubre: RF-20, RF-23 — CU-10, CU-12

import type { Modulo, Actividad } from "@prisma/client";
import type { ModuloRepo, DatosModulo } from "../repositorios/modulo-repo.js";
import type {
  ActividadRepo,
  DatosActividad,
} from "../repositorios/actividad-repo.js";
import { ModuloNoEncontradoError } from "../dominio/errores/modulo-no-encontrado-error.js";

export interface DatosNuevaActividad {
  descripcion: string;
  criteriosValidacion: DatosActividad["criteriosValidacion"];
  orden: number;
}

export interface DependenciasGestorModulos {
  moduloRepo: Pick<
    ModuloRepo,
    "crear" | "listarTodos" | "buscarPorId" | "actualizar"
  >;
  actividadRepo: Pick<ActividadRepo, "crear">;
}

export class GestorModulos {
  constructor(private readonly dep: DependenciasGestorModulos) {}

  async crear(datos: DatosModulo): Promise<Modulo> {
    return this.dep.moduloRepo.crear(datos);
  }

  async listarTodos(): Promise<Modulo[]> {
    return this.dep.moduloRepo.listarTodos();
  }

  async editar(idModulo: number, datos: Partial<DatosModulo>): Promise<Modulo> {
    const existente = await this.dep.moduloRepo.buscarPorId(idModulo);
    if (!existente) {
      throw new ModuloNoEncontradoError();
    }
    return this.dep.moduloRepo.actualizar(idModulo, datos);
  }

  // RF-23: el docente define los criterios que EvaluadorActividad aplicara automaticamente.
  async crearActividad(
    idModulo: number,
    datos: DatosNuevaActividad
  ): Promise<Actividad> {
    const modulo = await this.dep.moduloRepo.buscarPorId(idModulo);
    if (!modulo) {
      throw new ModuloNoEncontradoError();
    }
    return this.dep.actividadRepo.crear({ ...datos, idModulo });
  }
}
