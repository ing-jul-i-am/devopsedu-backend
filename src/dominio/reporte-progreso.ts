// src/dominio/reporte-progreso.ts
// Regla de negocio pura que arma el reporte de progreso de un estudiante para el docente: ruta
// vigente, estado de cada modulo, actividades completadas y resumen de la evaluacion. El estado
// y el progreso se delegan en calcularEstadoModulo y calcularProgresoRuta, las mismas reglas de
// GET /api/aprendizaje/mi-ruta, para que el reporte y la vista del estudiante no se contradigan
// (ver docs/decisiones-tecnicas.md DT-20).
// Cubre: RF-25 — CU-15

import { calcularEstadoModulo, type EstadoModulo } from "./estado-modulo.js";
import { calcularProgresoRuta } from "./progreso-ruta.js";
import {
  MAXIMO_INTENTOS_EVALUACION,
  UMBRAL_APROBACION_EVALUACION,
} from "./reglas-evaluacion.js";

export interface RutaModuloEntradaReporte {
  idModulo: number;
  ordenSecuencia: number;
  fechaInicio: Date | null;
  modulo: { nombre: string };
}

export interface ActividadEntradaReporte {
  idActividad: number;
  idModulo: number;
  descripcion: string;
}

export interface EvaluacionEntradaReporte {
  idEvaluacion: number;
  idModulo: number;
  titulo: string;
}

export interface ResultadoEntradaReporte {
  idActividad: number | null;
  idEvaluacion: number | null;
  puntuacion: number;
  fechaFinalizacion: Date;
}

// actividades y evaluaciones pueden incluir las de modulos ajenos a la ruta del estudiante (el
// servicio las carga una sola vez para todos); resultados son solo los del estudiante.
export interface EntradaReporteEstudiante {
  usuario: {
    idUsuario: number;
    nombre: string;
    correo: string;
    fechaRegistro: Date;
  };
  ruta: {
    idRuta: number;
    fechaAsignacion: Date;
    rutaModulos: RutaModuloEntradaReporte[];
  } | null;
  actividades: ActividadEntradaReporte[];
  evaluaciones: EvaluacionEntradaReporte[];
  resultados: ResultadoEntradaReporte[];
}

export interface ResumenEvaluacion {
  idEvaluacion: number;
  titulo: string;
  mejorNota: number | null;
  intentos: number;
  intentosMaximos: number;
  aprobada: boolean;
}

export interface ActividadReporte {
  idActividad: number;
  descripcion: string;
  fechaCompletada: Date | null;
}

export interface ReporteModulo {
  idModulo: number;
  nombre: string;
  ordenSecuencia: number;
  estado: EstadoModulo;
  fechaInicio: Date | null;
  actividades: {
    completadas: number;
    total: number;
    detalle: ActividadReporte[];
  };
  evaluacion: ResumenEvaluacion | null;
}

export interface ReporteRuta {
  idRuta: number;
  fechaAsignacion: Date;
  progreso: number;
  modulos: ReporteModulo[];
}

export interface ReporteEstudiante {
  idUsuario: number;
  nombre: string;
  correo: string;
  fechaRegistro: Date;
  ruta: ReporteRuta | null;
}

export interface ResumenRuta {
  idRuta: number;
  fechaAsignacion: Date;
  progreso: number;
  totalModulos: number;
  modulosCompletados: number;
}

// RF-24, DT-11: se reporta la mejor nota porque es la que decide la aprobacion; el umbral y el
// maximo de intentos son las constantes del sistema.
export function resumirEvaluacion(
  evaluacion: Pick<EvaluacionEntradaReporte, "idEvaluacion" | "titulo">,
  puntuaciones: number[]
): ResumenEvaluacion {
  const mejorNota = puntuaciones.length > 0 ? Math.max(...puntuaciones) : null;
  return {
    idEvaluacion: evaluacion.idEvaluacion,
    titulo: evaluacion.titulo,
    mejorNota,
    intentos: puntuaciones.length,
    intentosMaximos: MAXIMO_INTENTOS_EVALUACION,
    aprobada: mejorNota !== null && mejorNota >= UMBRAL_APROBACION_EVALUACION,
  };
}

export function construirReporteEstudiante(
  entrada: EntradaReporteEstudiante
): ReporteEstudiante {
  const { usuario, ruta } = entrada;
  if (!ruta) {
    return { ...usuario, ruta: null };
  }

  const modulos = ruta.rutaModulos.map((rutaModulo) =>
    construirReporteModulo(rutaModulo, entrada)
  );

  return {
    ...usuario,
    ruta: {
      idRuta: ruta.idRuta,
      fechaAsignacion: ruta.fechaAsignacion,
      progreso: calcularProgresoRuta(modulos.map((modulo) => modulo.estado)),
      modulos,
    },
  };
}

function construirReporteModulo(
  rutaModulo: RutaModuloEntradaReporte,
  entrada: EntradaReporteEstudiante
): ReporteModulo {
  const detalle = entrada.actividades
    .filter((actividad) => actividad.idModulo === rutaModulo.idModulo)
    .map((actividad) => ({
      idActividad: actividad.idActividad,
      descripcion: actividad.descripcion,
      fechaCompletada: primeraFinalizacion(
        entrada.resultados,
        actividad.idActividad
      ),
    }));
  const completadas = detalle.filter(
    (actividad) => actividad.fechaCompletada !== null
  ).length;

  const evaluacion = entrada.evaluaciones.find(
    (candidata) => candidata.idModulo === rutaModulo.idModulo
  );
  const resumenEvaluacion = evaluacion
    ? resumirEvaluacion(
        evaluacion,
        entrada.resultados
          .filter((resultado) => resultado.idEvaluacion === evaluacion.idEvaluacion)
          .map((resultado) => resultado.puntuacion)
      )
    : null;

  return {
    idModulo: rutaModulo.idModulo,
    nombre: rutaModulo.modulo.nombre,
    ordenSecuencia: rutaModulo.ordenSecuencia,
    estado: calcularEstadoModulo({
      totalActividadesReferenciadas: detalle.length,
      actividadesCompletadas: completadas,
      tieneEvaluacion: resumenEvaluacion !== null,
      evaluacionAprobada: resumenEvaluacion?.aprobada ?? false,
      fechaInicio: rutaModulo.fechaInicio,
    }),
    fechaInicio: rutaModulo.fechaInicio,
    actividades: { completadas, total: detalle.length, detalle },
    evaluacion: resumenEvaluacion,
  };
}

// RF-25: resumen ligero de la ruta para el listado de estudiantes del docente (CU-15).
export function resumirRuta(ruta: ReporteRuta | null): ResumenRuta | null {
  if (!ruta) {
    return null;
  }
  return {
    idRuta: ruta.idRuta,
    fechaAsignacion: ruta.fechaAsignacion,
    progreso: ruta.progreso,
    totalModulos: ruta.modulos.length,
    modulosCompletados: ruta.modulos.filter(
      (modulo) => modulo.estado === "completado"
    ).length,
  };
}

// RF-25, CU-16: columnas de la exportacion tabular (CSV). Cada fila de aFilasReporte trae una
// celda por columna, en este mismo orden.
export const COLUMNAS_REPORTE = [
  "id_estudiante",
  "estudiante",
  "correo",
  "fecha_asignacion_ruta",
  "progreso_ruta",
  "orden_modulo",
  "modulo",
  "estado_modulo",
  "actividades_completadas",
  "actividades_totales",
  "evaluacion",
  "mejor_nota",
  "intentos_evaluacion",
  "evaluacion_aprobada",
] as const;

// null representa una celda vacia (dato que no aplica), distinta de un 0.
export type CeldaReporte = string | number | null;

// Una fila por (estudiante, modulo); un estudiante sin ruta ocupa una sola fila con las columnas
// de ruta y modulo vacias. Las fechas van en ISO 8601 (UTC) para que no dependan de la zona
// horaria de quien abre el archivo (DT-22).
export function aFilasReporte(reportes: ReporteEstudiante[]): CeldaReporte[][] {
  return reportes.flatMap((reporte) => {
    const estudiante: CeldaReporte[] = [
      reporte.idUsuario,
      reporte.nombre,
      reporte.correo,
    ];
    const { ruta } = reporte;
    if (!ruta) {
      return [
        [...estudiante, ...Array<null>(COLUMNAS_REPORTE.length - 3).fill(null)],
      ];
    }
    return ruta.modulos.map((modulo) => [
      ...estudiante,
      ruta.fechaAsignacion.toISOString(),
      ruta.progreso,
      modulo.ordenSecuencia,
      modulo.nombre,
      modulo.estado,
      modulo.actividades.completadas,
      modulo.actividades.total,
      modulo.evaluacion?.titulo ?? null,
      modulo.evaluacion?.mejorNota ?? null,
      modulo.evaluacion?.intentos ?? null,
      modulo.evaluacion ? (modulo.evaluacion.aprobada ? "si" : "no") : null,
    ]);
  });
}

// DT-18: una actividad se completo la primera vez que el estudiante obtuvo un resultado.
function primeraFinalizacion(
  resultados: ResultadoEntradaReporte[],
  idActividad: number
): Date | null {
  let primera: Date | null = null;
  for (const resultado of resultados) {
    if (
      resultado.idActividad === idActividad &&
      (primera === null || resultado.fechaFinalizacion < primera)
    ) {
      primera = resultado.fechaFinalizacion;
    }
  }
  return primera;
}
