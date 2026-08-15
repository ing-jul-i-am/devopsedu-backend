// src/repositorios/servicio-repo.ts
// Repositorio de acceso a datos para servicios y su historico de configuraciones.
// La configuracion vigente de un servicio es la mas reciente (RF-08, ver DT-04).
// Cubre: RF-05, RF-08, RF-19

import type {
  PrismaClient,
  Servicio,
  ConfiguracionServicio,
  Prisma,
} from "@prisma/client";

export interface DatosConfiguracion {
  imagenDocker: string;
  cpuAsignado: number;
  memoriaAsignada: number;
  almacenamientoAsignado: number;
  puertos: Prisma.InputJsonValue;
  variablesEntorno: Prisma.InputJsonValue;
  volumenes: Prisma.InputJsonValue;
}

export interface DatosNuevoServicio {
  idUsuario: number;
  nombre: string;
  descripcion?: string;
  configuracion: DatosConfiguracion;
}

export type ServicioConConfiguraciones = Servicio & {
  configuraciones: ConfiguracionServicio[];
};

export class ServicioRepo {
  constructor(private readonly prisma: PrismaClient) {}

  // Crea el servicio (estado inicial "configurado") y su configuracion inicial en una sola
  // operacion atomica (create anidado de Prisma).
  async crearConConfiguracion(
    datos: DatosNuevoServicio
  ): Promise<ServicioConConfiguraciones> {
    return this.prisma.servicio.create({
      data: {
        nombre: datos.nombre,
        descripcion: datos.descripcion ?? null,
        estado: "configurado",
        idUsuario: datos.idUsuario,
        configuraciones: { create: this.aDatosPersistencia(datos.configuracion) },
      },
      include: { configuraciones: true },
    });
  }

  // Devuelve el servicio junto con su configuracion vigente (la mas reciente). El desempate por
  // idConfiguracion garantiza determinismo cuando dos configuraciones comparten marca de tiempo.
  async buscarPorIdConConfiguracionVigente(
    idServicio: number
  ): Promise<ServicioConConfiguraciones | null> {
    return this.prisma.servicio.findUnique({
      where: { idServicio },
      include: {
        configuraciones: {
          orderBy: [{ fechaCreacion: "desc" }, { idConfiguracion: "desc" }],
          take: 1,
        },
      },
    });
  }

  // Actualiza el estado del servicio conforme a la maquina de estados (seccion 4.2.14).
  async actualizarEstado(
    idServicio: number,
    estado: string
  ): Promise<Servicio> {
    return this.prisma.servicio.update({
      where: { idServicio },
      data: { estado },
    });
  }

  // Servicios en ejecucion de todos los usuarios. Lo usa el monitor periodico para recolectar
  // metricas de consumo (RF-16, RF-18).
  async listarEnEjecucion(): Promise<Servicio[]> {
    return this.prisma.servicio.findMany({
      where: { estado: "en_ejecucion" },
    });
  }

  // Servicios detenidos de todos los usuarios. El monitor periodico los revisa para detectar
  // contenedores iniciados fuera de la plataforma y resincronizar el estado (RF-19).
  async listarDetenidos(): Promise<Servicio[]> {
    return this.prisma.servicio.findMany({
      where: { estado: "detenido" },
    });
  }

  // RF-16: servicios no eliminados del usuario con su configuracion vigente, para el panel.
  async listarActivosPorUsuario(
    idUsuario: number
  ): Promise<ServicioConConfiguraciones[]> {
    return this.prisma.servicio.findMany({
      where: { idUsuario, estado: { not: "eliminado" } },
      include: {
        configuraciones: {
          orderBy: [{ fechaCreacion: "desc" }, { idConfiguracion: "desc" }],
          take: 1,
        },
      },
      orderBy: { idServicio: "asc" },
    });
  }

  // RF-08: registra una nueva version de configuracion para un servicio existente. No modifica
  // ni elimina las anteriores; la mas reciente pasa a ser la vigente.
  async agregarConfiguracion(
    idServicio: number,
    configuracion: DatosConfiguracion
  ): Promise<ConfiguracionServicio> {
    return this.prisma.configuracionServicio.create({
      data: { ...this.aDatosPersistencia(configuracion), idServicio },
    });
  }

  private aDatosPersistencia(
    c: DatosConfiguracion
  ): Prisma.ConfiguracionServicioCreateWithoutServicioInput {
    return {
      imagenDocker: c.imagenDocker,
      cpuAsignado: c.cpuAsignado,
      memoriaAsignada: c.memoriaAsignada,
      almacenamientoAsignado: c.almacenamientoAsignado,
      puertos: c.puertos,
      variablesEntorno: c.variablesEntorno,
      volumenes: c.volumenes,
    };
  }
}
