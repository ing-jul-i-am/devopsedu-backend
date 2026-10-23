// tests/fixtures/reporte.factory.ts
// Funciones de fabrica en memoria para la entrada del calculo del reporte de progreso
// (src/dominio/reporte-progreso.ts). Evitan literales extensos en las pruebas (CLAUDE.md 7.5).
// Cubre: RF-25

import type {
  ActividadEntradaReporte,
  EntradaReporteEstudiante,
  EvaluacionEntradaReporte,
  ResultadoEntradaReporte,
  RutaModuloEntradaReporte,
} from "@/dominio/reporte-progreso.js";

export function rutaModuloDeReporte(
  parciales: Partial<RutaModuloEntradaReporte> = {}
): RutaModuloEntradaReporte {
  return {
    idModulo: 1,
    ordenSecuencia: 1,
    fechaInicio: new Date("2026-03-01"),
    modulo: { nombre: "Introduccion a contenedores" },
    ...parciales,
  };
}

export function actividadDeReporte(
  parciales: Partial<ActividadEntradaReporte> = {}
): ActividadEntradaReporte {
  return {
    idActividad: 1,
    idModulo: 1,
    descripcion: "Despliega un servicio con Docker",
    ...parciales,
  };
}

export function evaluacionDeReporte(
  parciales: Partial<EvaluacionEntradaReporte> = {}
): EvaluacionEntradaReporte {
  return {
    idEvaluacion: 1,
    idModulo: 1,
    titulo: "Evaluacion del modulo",
    ...parciales,
  };
}

export function resultadoDeReporte(
  parciales: Partial<ResultadoEntradaReporte> = {}
): ResultadoEntradaReporte {
  return {
    idActividad: null,
    idEvaluacion: null,
    puntuacion: 100,
    fechaFinalizacion: new Date("2026-03-02"),
    ...parciales,
  };
}

// Por defecto: un estudiante con una ruta de un modulo, sin actividades, evaluaciones ni
// resultados.
export function entradaReporteEstudiante(
  parciales: Partial<EntradaReporteEstudiante> = {}
): EntradaReporteEstudiante {
  return {
    usuario: {
      idUsuario: 1,
      nombre: "Ana Estudiante",
      correo: "ana@devopsedu.local",
      fechaRegistro: new Date("2026-01-15"),
    },
    ruta: {
      idRuta: 1,
      fechaAsignacion: new Date("2026-02-01"),
      rutaModulos: [rutaModuloDeReporte()],
    },
    actividades: [],
    evaluaciones: [],
    resultados: [],
    ...parciales,
  };
}
