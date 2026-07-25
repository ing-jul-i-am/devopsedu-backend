// src/servicios-aplicacion/verificador-recursos.ts
// Servicio de aplicacion que evalua la disponibilidad de recursos del servidor antes de
// autorizar la configuracion/despliegue de un servicio. En esta etapa lo disponible se calcula
// como la capacidad del servidor menos lo ya comprometido en la base de datos. Al cerrar la
// Etapa 5 esta medicion se hara realista consultando el consumo real via Dockerode (CU-04).
// Cubre: RF-09, RF-10, RNF-07

import type { ServicioRepo } from "../repositorios/servicio-repo.js";
import type { CapacidadServidor } from "../infraestructura/capacidad-servidor.js";

export interface Recursos {
  cpu: number;
  memoria: number;
  almacenamiento: number;
}

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
  servicioRepo: Pick<ServicioRepo, "sumarRecursosVigentes">;
  capacidadTotal: () => CapacidadServidor;
}

export class VerificadorRecursos {
  constructor(private readonly dep: DependenciasVerificador) {}

  async verificarDisponibilidad(
    solicitado: Recursos
  ): Promise<ResultadoVerificacion> {
    const disponible = await this.calcularDisponible();
    const aprobado =
      solicitado.cpu <= disponible.cpu &&
      solicitado.memoria <= disponible.memoria &&
      solicitado.almacenamiento <= disponible.almacenamiento;

    return { aprobado, solicitado, disponible };
  }

  async consultarCapacidad(): Promise<CapacidadConsultada> {
    const total = this.dep.capacidadTotal();
    const comprometido = await this.dep.servicioRepo.sumarRecursosVigentes();
    const disponible = this.restar(total, comprometido);
    return { total, comprometido, disponible };
  }

  private async calcularDisponible(): Promise<Recursos> {
    const total = this.dep.capacidadTotal();
    const comprometido = await this.dep.servicioRepo.sumarRecursosVigentes();
    return this.restar(total, comprometido);
  }

  private restar(total: Recursos, comprometido: Recursos): Recursos {
    return {
      cpu: total.cpu - comprometido.cpu,
      memoria: total.memoria - comprometido.memoria,
      almacenamiento: total.almacenamiento - comprometido.almacenamiento,
    };
  }
}
