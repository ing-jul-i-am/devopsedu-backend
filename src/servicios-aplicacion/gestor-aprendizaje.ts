// src/servicios-aplicacion/gestor-aprendizaje.ts
// Servicio de aplicacion para las acciones del estudiante sobre su propia ruta de aprendizaje.
// Cubre: RF-22, RF-23 — CU-13, CU-12

import type {
  RutaAprendizajeRepo,
  RutaAprendizajeConModulosDetalle,
} from "../repositorios/ruta-aprendizaje-repo.js";
import { ModuloNoAsignadoError } from "../dominio/errores/modulo-no-asignado-error.js";

export interface DependenciasGestorAprendizaje {
  rutaRepo: Pick<
    RutaAprendizajeRepo,
    "buscarUltimaPorUsuario" | "marcarInicioModulo"
  >;
}

export class GestorAprendizaje {
  constructor(private readonly dep: DependenciasGestorAprendizaje) {}

  async obtenerMiRuta(
    idUsuario: number
  ): Promise<RutaAprendizajeConModulosDetalle | null> {
    return this.dep.rutaRepo.buscarUltimaPorUsuario(idUsuario);
  }

  // RF-23: marca cuando el estudiante llega al modulo, para calcular el tiempo empleado en sus
  // actividades. Idempotente: repetir la llamada no reinicia el conteo (ver RutaAprendizajeRepo.marcarInicioModulo).
  async iniciarModulo(idUsuario: number, idModulo: number): Promise<void> {
    const ruta = await this.dep.rutaRepo.buscarUltimaPorUsuario(idUsuario);
    const pertenece = ruta?.rutaModulos.some((rm) => rm.idModulo === idModulo);
    if (!ruta || !pertenece) {
      throw new ModuloNoAsignadoError();
    }
    await this.dep.rutaRepo.marcarInicioModulo(ruta.idRuta, idModulo);
  }
}
