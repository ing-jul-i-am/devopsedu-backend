// src/servicios-aplicacion/calculador-progreso.ts
// Servicio de aplicacion que calcula el estado de cada modulo de una ruta de aprendizaje y, a
// partir de ellos, su progreso: porcentaje de modulos completados, lo que incluye a los modulos
// de solo lectura. Es la unica fuente de ese calculo: lo usan EvaluadorActividad (RF-23),
// GestorAprendizaje al responder evaluaciones (RF-24), al iniciar un modulo y al consultar la
// ruta (RF-22), para que los estados y el porcentaje nunca diverjan.
// Cubre: RF-22, RF-23, RF-24 — CU-13, CU-12, CU-14 (ver docs/decisiones-tecnicas.md DT-11, DT-13, DT-14)

import type { RutaModulo } from "@prisma/client";
import type {
  RutaAprendizajeRepo,
  RutaAprendizajeConModulos,
} from "../repositorios/ruta-aprendizaje-repo.js";
import type { ActividadRepo } from "../repositorios/actividad-repo.js";
import type { EvaluacionRepo } from "../repositorios/evaluacion-repo.js";
import type { ResultadoRepo } from "../repositorios/resultado-repo.js";
import type { EstadoModulo } from "../dominio/estado-modulo.js";
import { calcularEstadoModulo } from "../dominio/estado-modulo.js";
import { calcularProgresoRuta } from "../dominio/progreso-ruta.js";
import { UMBRAL_APROBACION_EVALUACION } from "../dominio/reglas-evaluacion.js";

export interface DependenciasCalculadorProgreso {
  rutaRepo: Pick<RutaAprendizajeRepo, "actualizarProgreso">;
  actividadRepo: Pick<ActividadRepo, "listarPorModulo">;
  evaluacionRepo: Pick<EvaluacionRepo, "buscarPorModulo">;
  resultadoRepo: Pick<
    ResultadoRepo,
    "contarActividadesCompletadasEnRuta" | "existeAprobadaPorUsuarioYEvaluacion"
  >;
}

export interface EstadosYProgreso {
  estados: EstadoModulo[];
  progreso: number;
}

export class CalculadorProgreso {
  constructor(private readonly dep: DependenciasCalculadorProgreso) {}

  async recalcular(
    idUsuario: number,
    ruta: RutaAprendizajeConModulos
  ): Promise<void> {
    await this.recalcularConEstados(idUsuario, ruta);
  }

  // DT-14: persiste el progreso solo si cambio, porque tambien se invoca desde la consulta
  // GET /mi-ruta. Los estados se devuelven en el mismo orden que ruta.rutaModulos.
  async recalcularConEstados(
    idUsuario: number,
    ruta: RutaAprendizajeConModulos
  ): Promise<EstadosYProgreso> {
    const estados: EstadoModulo[] = [];
    for (const rutaModulo of ruta.rutaModulos) {
      estados.push(await this.calcularEstadoDeModulo(idUsuario, rutaModulo));
    }

    const progreso = calcularProgresoRuta(estados);
    if (Number(ruta.progreso) !== progreso) {
      await this.dep.rutaRepo.actualizarProgreso(ruta.idRuta, progreso);
    }

    return { estados, progreso };
  }

  private async calcularEstadoDeModulo(
    idUsuario: number,
    rutaModulo: RutaModulo
  ): Promise<EstadoModulo> {
    const actividades = await this.dep.actividadRepo.listarPorModulo(
      rutaModulo.idModulo
    );
    const idsActividad = actividades.map((actividad) => actividad.idActividad);
    const actividadesCompletadas =
      idsActividad.length > 0
        ? await this.dep.resultadoRepo.contarActividadesCompletadasEnRuta(
            idUsuario,
            idsActividad
          )
        : 0;

    const evaluacion = await this.dep.evaluacionRepo.buscarPorModulo(
      rutaModulo.idModulo
    );
    const evaluacionAprobada = evaluacion
      ? await this.dep.resultadoRepo.existeAprobadaPorUsuarioYEvaluacion(
          idUsuario,
          evaluacion.idEvaluacion,
          UMBRAL_APROBACION_EVALUACION
        )
      : false;

    return calcularEstadoModulo({
      totalActividadesReferenciadas: idsActividad.length,
      actividadesCompletadas,
      tieneEvaluacion: evaluacion !== null,
      evaluacionAprobada,
      fechaInicio: rutaModulo.fechaInicio,
    });
  }
}
