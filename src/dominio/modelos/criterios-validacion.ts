// src/dominio/modelos/criterios-validacion.ts
// Modelo de dominio de los criterios que definen cuando una Actividad se considera completada.
// Se persisten en Actividad.criteriosValidacion (Json) y los evalua EvaluadorActividad contra
// el historial de RegistroDespliegue y la configuracion vigente del servicio del estudiante.
// Cubre: RF-23 — CU-12 (ver docs/decisiones-tecnicas.md DT-10)

export type OperacionDocker = "desplegar" | "detener" | "reiniciar" | "eliminar";

export interface CondicionesValidacion {
  imagenDocker?: string | undefined;
  volumenesMinimos?: number | undefined;
  puertosMinimos?: number | undefined;
  cpuMinimo?: number | undefined;
  memoriaMinima?: number | undefined;
}

export interface CriteriosValidacion {
  operacion: OperacionDocker;
  condiciones?: CondicionesValidacion | undefined;
}
