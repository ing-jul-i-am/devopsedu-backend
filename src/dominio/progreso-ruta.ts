// src/dominio/progreso-ruta.ts
// Regla de negocio pura para el progreso de una ruta de aprendizaje: porcentaje de modulos en
// estado "completado" (ver estado-modulo.ts). Medir por modulo incluye a los modulos de solo
// lectura, que no tienen actividades ni evaluacion (ver docs/decisiones-tecnicas.md DT-14).
// Cubre: RF-22, RF-23, RF-24 — CU-13, CU-12, CU-14

import type { EstadoModulo } from "./estado-modulo.js";

export function calcularProgresoRuta(estados: EstadoModulo[]): number {
  if (estados.length === 0) {
    return 0;
  }

  const completados = estados.filter((estado) => estado === "completado").length;
  return Math.round((completados / estados.length) * 10000) / 100;
}
