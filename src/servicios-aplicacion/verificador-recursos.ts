// src/servicios-aplicacion/verificador-recursos.ts
// Servicio de aplicacion que evalua la disponibilidad de recursos del servidor antes de
// autorizar el despliegue de un servicio. Lo disponible proviene de una medicion del sistema
// operativo (memoria y disco libres, carga de CPU), por lo que descuenta el uso real de toda la
// maquina: SO, otros programas y contenedores Docker (CU-04).
// Cubre: RF-09, RF-10, RNF-07

import type {
  MedicionRecursos,
  Recursos,
} from "../infraestructura/capacidad-servidor.js";

export type { Recursos };

export interface ResultadoVerificacion {
  aprobado: boolean;
  solicitado: Recursos;
  disponible: Recursos;
}

export interface CapacidadConsultada {
  total: Recursos;
  comprometido: Recursos;
  disponible: Recursos;
}

export interface DependenciasVerificador {
  medirRecursos: () => Promise<MedicionRecursos>;
}

export class VerificadorRecursos {
  constructor(private readonly dep: DependenciasVerificador) {}

  async verificarDisponibilidad(
    solicitado: Recursos
  ): Promise<ResultadoVerificacion> {
    const { disponible } = await this.dep.medirRecursos();
    const aprobado =
      solicitado.cpu <= disponible.cpu &&
      solicitado.memoria <= disponible.memoria &&
      solicitado.almacenamiento <= disponible.almacenamiento;

    return { aprobado, solicitado, disponible };
  }

  async consultarCapacidad(): Promise<CapacidadConsultada> {
    const { total, disponible } = await this.dep.medirRecursos();
    const comprometido: Recursos = {
      cpu: Number((total.cpu - disponible.cpu).toFixed(2)),
      memoria: total.memoria - disponible.memoria,
      almacenamiento: total.almacenamiento - disponible.almacenamiento,
    };
    return { total, comprometido, disponible };
  }
}
