// src/servicios-aplicacion/gestor-servicios.ts
// Servicio de aplicacion para la gestion de servicios contenedorizados. En esta etapa cubre la
// creacion: verifica la disponibilidad de recursos antes de persistir la configuracion.
// Cubre: RF-05, RF-09 — CU-03, CU-04

import type {
  ServicioRepo,
  DatosConfiguracion,
  ServicioConConfiguraciones,
} from "../repositorios/servicio-repo.js";
import type { VerificadorRecursos } from "./verificador-recursos.js";
import { RecursosInsuficientesError } from "../dominio/errores/recursos-insuficientes-error.js";

export interface DatosCrearServicio {
  nombre: string;
  descripcion?: string;
  configuracion: DatosConfiguracion;
}

export interface DependenciasGestorServicios {
  servicioRepo: Pick<ServicioRepo, "crearConConfiguracion">;
  verificador: Pick<VerificadorRecursos, "verificarDisponibilidad">;
}

export class GestorServicios {
  constructor(private readonly dep: DependenciasGestorServicios) {}

  async crearServicio(
    idUsuario: number,
    dto: DatosCrearServicio
  ): Promise<ServicioConConfiguraciones> {
    const config = dto.configuracion;

    // RF-09 y CU-04: verificacion previa de recursos antes de persistir.
    const disponibilidad = await this.dep.verificador.verificarDisponibilidad({
      cpu: config.cpuAsignado,
      memoria: config.memoriaAsignada,
      almacenamiento: config.almacenamientoAsignado,
    });

    if (!disponibilidad.aprobado) {
      throw new RecursosInsuficientesError(
        disponibilidad.solicitado,
        disponibilidad.disponible
      );
    }

    return this.dep.servicioRepo.crearConConfiguracion({
      idUsuario,
      nombre: dto.nombre,
      ...(dto.descripcion !== undefined ? { descripcion: dto.descripcion } : {}),
      configuracion: config,
    });
  }
}
