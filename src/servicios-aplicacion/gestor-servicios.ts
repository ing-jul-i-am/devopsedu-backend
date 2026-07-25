// src/servicios-aplicacion/gestor-servicios.ts
// Servicio de aplicacion para la gestion de servicios contenedorizados. En esta etapa cubre la
// creacion: verifica la disponibilidad de recursos antes de persistir la configuracion.
// Cubre: RF-05, RF-09 — CU-03, CU-04

import type { RegistroDespliegue, Metrica } from "@prisma/client";
import type {
  ServicioRepo,
  DatosConfiguracion,
  ServicioConConfiguraciones,
} from "../repositorios/servicio-repo.js";
import type { RegistroDespliegueRepo } from "../repositorios/registro-despliegue-repo.js";
import type {
  MetricaRepo,
  RangoFechas,
} from "../repositorios/metrica-repo.js";
import type { VerificadorRecursos } from "./verificador-recursos.js";
import { RecursosInsuficientesError } from "../dominio/errores/recursos-insuficientes-error.js";
import { ServicioNoEncontradoError } from "../dominio/errores/servicio-no-encontrado-error.js";

export interface DatosCrearServicio {
  nombre: string;
  descripcion?: string;
  configuracion: DatosConfiguracion;
}

export interface DetalleServicio {
  servicio: ServicioConConfiguraciones;
  registros: RegistroDespliegue[];
}

export interface DependenciasGestorServicios {
  servicioRepo: Pick<
    ServicioRepo,
    | "crearConConfiguracion"
    | "buscarPorIdConConfiguracionVigente"
    | "agregarConfiguracion"
    | "listarActivosPorUsuario"
  >;
  registroRepo: Pick<RegistroDespliegueRepo, "listarPorServicio">;
  metricaRepo: Pick<MetricaRepo, "listarPorServicio">;
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

  // RF-08: registra una nueva version de configuracion para un servicio propio del usuario. La
  // verificacion de recursos no se aplica aqui, sino en el despliegue (RF-09/RF-11).
  async editarConfiguracion(
    idUsuario: number,
    idServicio: number,
    configuracion: DatosConfiguracion
  ): Promise<ServicioConConfiguraciones> {
    const servicio =
      await this.dep.servicioRepo.buscarPorIdConConfiguracionVigente(idServicio);
    if (!servicio || servicio.idUsuario !== idUsuario) {
      throw new ServicioNoEncontradoError();
    }

    await this.dep.servicioRepo.agregarConfiguracion(idServicio, configuracion);

    const actualizado =
      await this.dep.servicioRepo.buscarPorIdConConfiguracionVigente(idServicio);
    if (!actualizado) {
      throw new ServicioNoEncontradoError();
    }
    return actualizado;
  }

  // RF-16: panel de servicios activos del usuario.
  async listarPanel(idUsuario: number): Promise<ServicioConConfiguraciones[]> {
    return this.dep.servicioRepo.listarActivosPorUsuario(idUsuario);
  }

  // RF-17: detalle del servicio con su configuracion vigente y su historico de operaciones.
  async obtenerDetalle(
    idUsuario: number,
    idServicio: number
  ): Promise<DetalleServicio> {
    const servicio =
      await this.dep.servicioRepo.buscarPorIdConConfiguracionVigente(idServicio);
    if (!servicio || servicio.idUsuario !== idUsuario) {
      throw new ServicioNoEncontradoError();
    }
    const registros = await this.dep.registroRepo.listarPorServicio(idServicio);
    return { servicio, registros };
  }

  // RF-18: historico de metricas de consumo del servicio (filtrable por rango de fechas).
  async obtenerMetricas(
    idUsuario: number,
    idServicio: number,
    rango: RangoFechas
  ): Promise<Metrica[]> {
    const servicio =
      await this.dep.servicioRepo.buscarPorIdConConfiguracionVigente(idServicio);
    if (!servicio || servicio.idUsuario !== idUsuario) {
      throw new ServicioNoEncontradoError();
    }
    return this.dep.metricaRepo.listarPorServicio(idServicio, rango);
  }
}
