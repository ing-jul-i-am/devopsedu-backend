// src/servicios-aplicacion/gestor-aprendizaje.ts
// Servicio de aplicacion para las acciones del estudiante sobre su propia ruta de aprendizaje.
// Cubre: RF-22 — CU-13

import type {
  RutaAprendizajeRepo,
  RutaAprendizajeConModulosDetalle,
} from "../repositorios/ruta-aprendizaje-repo.js";

export interface DependenciasGestorAprendizaje {
  rutaRepo: RutaAprendizajeRepo;
}

export class GestorAprendizaje {
  constructor(private readonly dep: DependenciasGestorAprendizaje) {}

  async obtenerMiRuta(
    idUsuario: number
  ): Promise<RutaAprendizajeConModulosDetalle | null> {
    return this.dep.rutaRepo.buscarUltimaPorUsuario(idUsuario);
  }
}
