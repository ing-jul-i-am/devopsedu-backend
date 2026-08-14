// src/docker/monitor-periodico.ts
// Proceso periodico que recolecta las metricas de consumo de los servicios en ejecucion y las
// almacena por lote. Si la lectura de un contenedor falla, marca el servicio como fallido y
// registra el incidente (RF-19). Frecuencia por defecto: 5 s (RNF-09).
// Cubre: RF-16, RF-18, RF-19, RNF-09

import type { ServicioRepo } from "../repositorios/servicio-repo.js";
import type { MetricaRepo, DatosMetrica } from "../repositorios/metrica-repo.js";
import type { RegistroDespliegueRepo } from "../repositorios/registro-despliegue-repo.js";
import { obtenerEstadisticas, nombreContenedor } from "./cliente-docker.js";
import { logger } from "../infraestructura/logger.js";

const INTERVALO_POR_DEFECTO_MS = 5000;

export interface DependenciasMonitor {
  servicioRepo: Pick<ServicioRepo, "listarEnEjecucion" | "actualizarEstado">;
  metricaRepo: Pick<MetricaRepo, "registrarLote">;
  registroRepo: Pick<RegistroDespliegueRepo, "registrar">;
  intervaloMs?: number;
}

export class MonitorPeriodico {
  private intervalo: ReturnType<typeof setInterval> | null = null;

  constructor(private readonly dep: DependenciasMonitor) {}

  iniciar(): void {
    if (this.intervalo) {
      return;
    }
    const periodo = this.dep.intervaloMs ?? INTERVALO_POR_DEFECTO_MS;
    this.intervalo = setInterval(() => {
      void this.recolectar();
    }, periodo);
  }

  detener(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
      this.intervalo = null;
    }
  }

  async recolectar(): Promise<void> {
    const servicios = await this.dep.servicioRepo.listarEnEjecucion();
    const metricas: DatosMetrica[] = [];

    for (const servicio of servicios) {
      const nombre = nombreContenedor(servicio.idServicio, servicio.nombre);
      try {
        const consumo = await obtenerEstadisticas(nombre);
        metricas.push({
          idServicio: servicio.idServicio,
          consumoCpu: consumo.cpu,
          consumoMemoria: consumo.memoria,
          estadoEjecucion: "en_ejecucion",
        });
      } catch (error) {
        // RF-19: fallo de ejecucion detectado -> marcar fallido y dejar registro del incidente.
        logger.warn({
          evento: "servicio_fallo_detectado",
          idServicio: servicio.idServicio,
        });
        await this.dep.servicioRepo.actualizarEstado(
          servicio.idServicio,
          "fallido"
        );
        await this.dep.registroRepo.registrar({
          idServicio: servicio.idServicio,
          idUsuario: servicio.idUsuario,
          operacion: "monitorear",
          resultado: "fallo",
          mensajeError: error instanceof Error ? error.message : "Error desconocido",
        });
      }
    }

    if (metricas.length > 0) {
      await this.dep.metricaRepo.registrarLote(metricas);
    }
  }
}
