// src/servicios-aplicacion/gestor-aprendizaje.ts
// Servicio de aplicacion para las acciones del estudiante sobre su propia ruta de aprendizaje.
// Cubre: RF-22, RF-23, RF-24 — CU-13, CU-12, CU-14

import type { Evaluacion, RutaModulo, Modulo } from "@prisma/client";
import type {
  RutaAprendizajeRepo,
  RutaAprendizajeConModulosDetalle,
} from "../repositorios/ruta-aprendizaje-repo.js";
import type { EvaluacionRepo } from "../repositorios/evaluacion-repo.js";
import type { ResultadoRepo } from "../repositorios/resultado-repo.js";
import type { CalculadorProgreso } from "./calculador-progreso.js";
import type { PreguntaEvaluacion } from "../dominio/modelos/pregunta-evaluacion.js";
import { ModuloNoAsignadoError } from "../dominio/errores/modulo-no-asignado-error.js";
import { EvaluacionNoEncontradaError } from "../dominio/errores/evaluacion-no-encontrada-error.js";
import { EvaluacionNoDisponibleError } from "../dominio/errores/evaluacion-no-disponible-error.js";
import { RespuestasIncompletasError } from "../dominio/errores/respuestas-incompletas-error.js";
import { EvaluacionYaAprobadaError } from "../dominio/errores/evaluacion-ya-aprobada-error.js";
import { IntentosAgotadosError } from "../dominio/errores/intentos-agotados-error.js";
import {
  UMBRAL_APROBACION_EVALUACION,
  MAXIMO_INTENTOS_EVALUACION,
} from "../dominio/reglas-evaluacion.js";

export interface DependenciasGestorAprendizaje {
  rutaRepo: Pick<
    RutaAprendizajeRepo,
    "buscarUltimaPorUsuario" | "marcarInicioModulo"
  >;
  evaluacionRepo: Pick<EvaluacionRepo, "buscarPorModulo">;
  resultadoRepo: Pick<
    ResultadoRepo,
    | "crearParaEvaluacion"
    | "contarIntentosPorUsuarioYEvaluacion"
    | "existeAprobadaPorUsuarioYEvaluacion"
  >;
  calculadorProgreso: Pick<CalculadorProgreso, "recalcular">;
}

export interface RetroalimentacionEvaluacion {
  puntuacion: number;
  aprobado: boolean;
  intentosRestantes: number;
  detalle: Array<{ correcta: boolean }>;
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
    const { ruta } = await this.buscarRutaModulo(idUsuario, idModulo);
    await this.dep.rutaRepo.marcarInicioModulo(ruta.idRuta, idModulo);
  }

  // RF-24: devuelve la evaluacion del modulo, sin filtrar aun las respuestas correctas (lo hace
  // el controlador, ver aprendizaje.controlador.ts).
  async obtenerEvaluacion(
    idUsuario: number,
    idModulo: number
  ): Promise<Evaluacion> {
    await this.buscarRutaModulo(idUsuario, idModulo);
    return this.buscarEvaluacionDisponible(idModulo);
  }

  // RF-24: califica la evaluacion, aplica el limite de intentos y el bloqueo tras aprobar, y
  // recalcula el progreso combinado (CalculadorProgreso) solo cuando el intento aprueba.
  async responderEvaluacion(
    idUsuario: number,
    idModulo: number,
    respuestas: number[]
  ): Promise<RetroalimentacionEvaluacion> {
    const { ruta, rutaModulo } = await this.buscarRutaModulo(idUsuario, idModulo);
    const evaluacion = await this.buscarEvaluacionDisponible(idModulo);

    const preguntas = evaluacion.preguntas as unknown as PreguntaEvaluacion[];
    if (respuestas.length !== preguntas.length) {
      throw new RespuestasIncompletasError();
    }

    const yaAprobada = await this.dep.resultadoRepo.existeAprobadaPorUsuarioYEvaluacion(
      idUsuario,
      evaluacion.idEvaluacion,
      UMBRAL_APROBACION_EVALUACION
    );
    if (yaAprobada) {
      throw new EvaluacionYaAprobadaError();
    }

    const intentosPrevios =
      await this.dep.resultadoRepo.contarIntentosPorUsuarioYEvaluacion(
        idUsuario,
        evaluacion.idEvaluacion
      );
    if (intentosPrevios >= MAXIMO_INTENTOS_EVALUACION) {
      throw new IntentosAgotadosError();
    }

    const detalle = preguntas.map((pregunta, indice) => ({
      correcta: respuestas[indice] === pregunta.respuestaCorrecta,
    }));
    const aciertos = detalle.filter((item) => item.correcta).length;
    const puntuacion = Math.round((aciertos / preguntas.length) * 10000) / 100;
    const aprobado = puntuacion >= UMBRAL_APROBACION_EVALUACION;
    const intentos = intentosPrevios + 1;

    await this.dep.resultadoRepo.crearParaEvaluacion({
      idUsuario,
      idEvaluacion: evaluacion.idEvaluacion,
      puntuacion,
      tiempoEmpleado: this.tiempoEmpleadoDesde(rutaModulo),
      intentos,
    });

    if (aprobado) {
      await this.dep.calculadorProgreso.recalcular(idUsuario, ruta);
    }

    return {
      puntuacion,
      aprobado,
      intentosRestantes: Math.max(0, MAXIMO_INTENTOS_EVALUACION - intentos),
      detalle,
    };
  }

  private async buscarRutaModulo(
    idUsuario: number,
    idModulo: number
  ): Promise<{
    ruta: RutaAprendizajeConModulosDetalle;
    rutaModulo: RutaModulo & { modulo: Modulo };
  }> {
    const ruta = await this.dep.rutaRepo.buscarUltimaPorUsuario(idUsuario);
    const rutaModulo = ruta?.rutaModulos.find((rm) => rm.idModulo === idModulo);
    if (!ruta || !rutaModulo) {
      throw new ModuloNoAsignadoError();
    }
    return { ruta, rutaModulo };
  }

  private async buscarEvaluacionDisponible(
    idModulo: number
  ): Promise<Evaluacion> {
    const evaluacion = await this.dep.evaluacionRepo.buscarPorModulo(idModulo);
    if (!evaluacion) {
      throw new EvaluacionNoEncontradaError();
    }
    if (evaluacion.fechaDisponible.getTime() > Date.now()) {
      throw new EvaluacionNoDisponibleError();
    }
    return evaluacion;
  }

  private tiempoEmpleadoDesde(rutaModulo: RutaModulo): number {
    return rutaModulo.fechaInicio
      ? Math.max(
          0,
          Math.floor((Date.now() - rutaModulo.fechaInicio.getTime()) / 1000)
        )
      : 0;
  }
}
