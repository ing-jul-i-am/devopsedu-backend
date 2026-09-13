// src/dominio/estado-modulo.ts
// Regla de negocio pura para el estado de progreso de un modulo dentro de la ruta de
// aprendizaje del estudiante. fechaInicio actua como requisito previo: sin iniciar el
// modulo no puede estar completado ni en progreso (ver docs/decisiones-tecnicas.md DT-13).
// Cubre: RF-22 — CU-13

export type EstadoModulo = "completado" | "en_progreso" | "sin_iniciar";

export interface DatosEstadoModulo {
  totalActividadesReferenciadas: number;
  actividadesCompletadas: number;
  tieneEvaluacion: boolean;
  evaluacionAprobada: boolean;
  fechaInicio: Date | null;
}

export function calcularEstadoModulo(datos: DatosEstadoModulo): EstadoModulo {
  if (datos.fechaInicio === null) {
    return "sin_iniciar";
  }

  const todasLasActividades =
    datos.actividadesCompletadas >= datos.totalActividadesReferenciadas;
  const evaluacionOk = !datos.tieneEvaluacion || datos.evaluacionAprobada;

  return todasLasActividades && evaluacionOk ? "completado" : "en_progreso";
}
