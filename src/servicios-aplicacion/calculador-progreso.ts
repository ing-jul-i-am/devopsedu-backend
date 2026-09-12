// src/servicios-aplicacion/calculador-progreso.ts
// Servicio de aplicacion que recalcula el progreso combinado (actividades + evaluaciones) de
// una ruta de aprendizaje. Compartido por EvaluadorActividad (RF-23) y GestorAprendizaje (RF-24)
// para no duplicar la formula de progreso entre ambos flujos.
// Cubre: RF-23, RF-24 — CU-12, CU-14 (ver docs/decisiones-tecnicas.md DT-11)

import type {
  RutaAprendizajeRepo,
  RutaAprendizajeConModulos,
} from "../repositorios/ruta-aprendizaje-repo.js";
import type { ActividadRepo } from "../repositorios/actividad-repo.js";
import type { EvaluacionRepo } from "../repositorios/evaluacion-repo.js";
import type { ResultadoRepo } from "../repositorios/resultado-repo.js";
import { UMBRAL_APROBACION_EVALUACION } from "../dominio/reglas-evaluacion.js";

export interface DependenciasCalculadorProgreso {
  rutaRepo: Pick<RutaAprendizajeRepo, "actualizarProgreso">;
  actividadRepo: Pick<ActividadRepo, "listarPorModulo">;
  evaluacionRepo: Pick<EvaluacionRepo, "buscarPorModulo">;
  resultadoRepo: Pick<
    ResultadoRepo,
    "contarActividadesCompletadasEnRuta" | "contarEvaluacionesAprobadasEnRuta"
  >;
}

export class CalculadorProgreso {
  constructor(private readonly dep: DependenciasCalculadorProgreso) {}

  async recalcular(
    idUsuario: number,
    ruta: RutaAprendizajeConModulos
  ): Promise<void> {
    const idsActividad: number[] = [];
    const idsEvaluacion: number[] = [];

    for (const rutaModulo of ruta.rutaModulos) {
      const actividades = await this.dep.actividadRepo.listarPorModulo(
        rutaModulo.idModulo
      );
      idsActividad.push(...actividades.map((actividad) => actividad.idActividad));

      const evaluacion = await this.dep.evaluacionRepo.buscarPorModulo(
        rutaModulo.idModulo
      );
      if (evaluacion) {
        idsEvaluacion.push(evaluacion.idEvaluacion);
      }
    }

    const total = idsActividad.length + idsEvaluacion.length;
    if (total === 0) {
      await this.dep.rutaRepo.actualizarProgreso(ruta.idRuta, 0);
      return;
    }

    const actividadesCompletadas =
      await this.dep.resultadoRepo.contarActividadesCompletadasEnRuta(
        idUsuario,
        idsActividad
      );
    const evaluacionesAprobadas =
      await this.dep.resultadoRepo.contarEvaluacionesAprobadasEnRuta(
        idUsuario,
        idsEvaluacion,
        UMBRAL_APROBACION_EVALUACION
      );

    const progreso =
      Math.round(
        ((actividadesCompletadas + evaluacionesAprobadas) / total) * 10000
      ) / 100;
    await this.dep.rutaRepo.actualizarProgreso(ruta.idRuta, progreso);
  }
}
