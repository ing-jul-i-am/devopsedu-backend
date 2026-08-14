// src/servicios-aplicacion/gestor-docker.ts
// Servicio de aplicacion que concentra las operaciones sobre el motor Docker: desplegar,
// detener, reiniciar y eliminar. Aplica las transiciones de la maquina de estados (4.2.14),
// deja huella de cada operacion (RF-15) y verifica recursos antes de desplegar (RF-09/CU-04).
// Cubre: RF-11, RF-12, RF-13, RF-14, RF-15 — CU-05

import type { Servicio } from "@prisma/client";
import type {
  ServicioRepo,
  ServicioConConfiguraciones,
} from "../repositorios/servicio-repo.js";
import type { RegistroDespliegueRepo } from "../repositorios/registro-despliegue-repo.js";
import type { VerificadorRecursos } from "./verificador-recursos.js";
import type { ParametrosContenedor } from "../docker/cliente-docker.js";
import {
  nombreContenedor,
  crearContenedor,
  iniciarContenedor,
  detenerContenedor,
  reiniciarContenedor,
  eliminarContenedor,
} from "../docker/cliente-docker.js";
import { ServicioNoEncontradoError } from "../dominio/errores/servicio-no-encontrado-error.js";
import { RecursosInsuficientesError } from "../dominio/errores/recursos-insuficientes-error.js";
import { TransicionInvalidaError } from "../dominio/errores/transicion-invalida-error.js";
import { ContenedorNoEncontradoError } from "../dominio/errores/contenedor-no-encontrado-error.js";

// Estados de origen validos por operacion, conforme a la maquina de estados (seccion 4.2.14).
const ORIGENES_VALIDOS: Record<string, string[]> = {
  desplegar: ["configurado", "detenido", "fallido"],
  detener: ["en_ejecucion"],
  reiniciar: ["detenido", "en_ejecucion"],
  eliminar: [
    "configurado",
    "desplegando",
    "en_ejecucion",
    "detenido",
    "reiniciando",
    "fallido",
  ],
};

export interface DependenciasGestorDocker {
  servicioRepo: Pick<
    ServicioRepo,
    "buscarPorIdConConfiguracionVigente" | "actualizarEstado"
  >;
  registroRepo: Pick<RegistroDespliegueRepo, "registrar">;
  verificador: Pick<VerificadorRecursos, "verificarDisponibilidad">;
}

export class GestorDocker {
  constructor(private readonly dep: DependenciasGestorDocker) {}

  async desplegar(idUsuario: number, idServicio: number): Promise<Servicio> {
    const servicio = await this.cargarPropio(idUsuario, idServicio);
    this.validarTransicion("desplegar", servicio.estado);

    const config = servicio.configuraciones[0];
    if (!config) {
      throw new ServicioNoEncontradoError();
    }

    // RF-09 y CU-04: verificacion previa de recursos antes de invocar a Docker.
    const disponibilidad = await this.dep.verificador.verificarDisponibilidad({
      cpu: Number(config.cpuAsignado),
      memoria: config.memoriaAsignada,
      almacenamiento: config.almacenamientoAsignado,
    });
    if (!disponibilidad.aprobado) {
      throw new RecursosInsuficientesError(
        disponibilidad.solicitado,
        disponibilidad.disponible
      );
    }

    await this.dep.servicioRepo.actualizarEstado(idServicio, "desplegando");
    const nombre = nombreContenedor(idServicio, servicio.nombre);

    try {
      await crearContenedor(this.aParametros(nombre, config));
      await iniciarContenedor(nombre);
      const actualizado = await this.dep.servicioRepo.actualizarEstado(
        idServicio,
        "en_ejecucion"
      );
      await this.registrar(idServicio, idUsuario, "desplegar", "exito");
      return actualizado;
    } catch (error) {
      await this.dep.servicioRepo.actualizarEstado(idServicio, "fallido");
      await this.registrar(
        idServicio,
        idUsuario,
        "desplegar",
        "fallo",
        mensajeDe(error)
      );
      throw error;
    }
  }

  async detener(idUsuario: number, idServicio: number): Promise<Servicio> {
    const servicio = await this.cargarPropio(idUsuario, idServicio);
    this.validarTransicion("detener", servicio.estado);
    const nombre = nombreContenedor(idServicio, servicio.nombre);

    try {
      await detenerContenedor(nombre);
      const actualizado = await this.dep.servicioRepo.actualizarEstado(
        idServicio,
        "detenido"
      );
      await this.registrar(idServicio, idUsuario, "detener", "exito");
      return actualizado;
    } catch (error) {
      // La detencion fallida conserva el estado actual (seccion 4.2.14) y deja registro.
      await this.registrar(
        idServicio,
        idUsuario,
        "detener",
        "fallo",
        mensajeDe(error)
      );
      throw error;
    }
  }

  async reiniciar(idUsuario: number, idServicio: number): Promise<Servicio> {
    const servicio = await this.cargarPropio(idUsuario, idServicio);
    this.validarTransicion("reiniciar", servicio.estado);
    const nombre = nombreContenedor(idServicio, servicio.nombre);

    await this.dep.servicioRepo.actualizarEstado(idServicio, "reiniciando");

    try {
      await reiniciarContenedor(nombre);
      const actualizado = await this.dep.servicioRepo.actualizarEstado(
        idServicio,
        "en_ejecucion"
      );
      await this.registrar(idServicio, idUsuario, "reiniciar", "exito");
      return actualizado;
    } catch (error) {
      await this.dep.servicioRepo.actualizarEstado(idServicio, "fallido");
      await this.registrar(
        idServicio,
        idUsuario,
        "reiniciar",
        "fallo",
        mensajeDe(error)
      );
      throw error;
    }
  }

  async eliminar(idUsuario: number, idServicio: number): Promise<Servicio> {
    const servicio = await this.cargarPropio(idUsuario, idServicio);
    this.validarTransicion("eliminar", servicio.estado);
    const nombre = nombreContenedor(idServicio, servicio.nombre);

    try {
      await eliminarContenedor(nombre);
    } catch (error) {
      // Si el contenedor nunca existio, la eliminacion logica del servicio continua igual.
      if (!(error instanceof ContenedorNoEncontradoError)) {
        await this.registrar(
          idServicio,
          idUsuario,
          "eliminar",
          "fallo",
          mensajeDe(error)
        );
        throw error;
      }
    }

    // RF-14: el servicio deja de estar activo pero su informacion se preserva (marca eliminado).
    const actualizado = await this.dep.servicioRepo.actualizarEstado(
      idServicio,
      "eliminado"
    );
    await this.registrar(idServicio, idUsuario, "eliminar", "exito");
    return actualizado;
  }

  private async cargarPropio(
    idUsuario: number,
    idServicio: number
  ): Promise<ServicioConConfiguraciones> {
    const servicio =
      await this.dep.servicioRepo.buscarPorIdConConfiguracionVigente(idServicio);
    if (!servicio || servicio.idUsuario !== idUsuario) {
      throw new ServicioNoEncontradoError();
    }
    return servicio;
  }

  private validarTransicion(operacion: string, estado: string): void {
    const origenes = ORIGENES_VALIDOS[operacion] ?? [];
    if (!origenes.includes(estado)) {
      throw new TransicionInvalidaError(operacion, estado);
    }
  }

  private aParametros(
    nombre: string,
    config: ServicioConConfiguraciones["configuraciones"][number]
  ): ParametrosContenedor {
    return {
      nombre,
      imagen: config.imagenDocker,
      cpuAsignado: Number(config.cpuAsignado),
      memoriaAsignada: config.memoriaAsignada,
      almacenamientoAsignado: config.almacenamientoAsignado,
      puertos: config.puertos as unknown as ParametrosContenedor["puertos"],
      variablesEntorno:
        config.variablesEntorno as unknown as ParametrosContenedor["variablesEntorno"],
      volumenes: config.volumenes as unknown as ParametrosContenedor["volumenes"],
    };
  }

  private async registrar(
    idServicio: number,
    idUsuario: number,
    operacion: string,
    resultado: string,
    mensajeError?: string
  ): Promise<void> {
    await this.dep.registroRepo.registrar({
      idServicio,
      idUsuario,
      operacion,
      resultado,
      ...(mensajeError !== undefined ? { mensajeError } : {}),
    });
  }
}

function mensajeDe(error: unknown): string {
  return error instanceof Error ? error.message : "Error desconocido";
}
