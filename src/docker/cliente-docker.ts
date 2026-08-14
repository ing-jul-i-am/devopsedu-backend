// src/docker/cliente-docker.ts
// Wrapper unico sobre Dockerode (capa de servicios). Toda operacion sobre el motor Docker pasa
// por aqui: usa parametros estructurados (nunca concatenacion, RNF-13) y traduce los errores de
// la libreria a errores de dominio. Las capas superiores mockean este modulo, no dockerode.
// Cubre: RF-11, RF-12, RF-13, RF-14, RNF-13

import Docker from "dockerode";
import { logger } from "../infraestructura/logger.js";
import { ImagenDockerNoDisponibleError } from "../dominio/errores/imagen-docker-no-disponible-error.js";
import { NombreContenedorEnUsoError } from "../dominio/errores/nombre-contenedor-en-uso-error.js";
import { ContenedorNoEncontradoError } from "../dominio/errores/contenedor-no-encontrado-error.js";
import { MotorDockerNoDisponibleError } from "../dominio/errores/motor-docker-no-disponible-error.js";

const docker = new Docker();

const BYTES_POR_MB = 1024 * 1024;

export interface ParametrosContenedor {
  nombre: string;
  imagen: string;
  cpuAsignado: number; // nucleos
  memoriaAsignada: number; // MB
  almacenamientoAsignado: number; // MB (no se aplica como limite de disco en esta etapa)
  puertos: Array<{ host: number; contenedor: number; protocolo: "tcp" | "udp" }>;
  variablesEntorno: Record<string, string>;
  volumenes: Array<{ origen: string; destino: string; modo: "ro" | "rw" }>;
}

export interface ConsumoContenedor {
  cpu: number; // porcentaje
  memoria: number; // MB
}

// Nombre de contenedor deterministico y reproducible a partir del servicio (RNF-13). Evita
// tener que persistir el id del contenedor: siempre se puede reconstruir desde el servicio.
export function nombreContenedor(idServicio: number, nombre: string): string {
  const normalizado = nombre
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `devopsedu-${idServicio}-${normalizado}`;
}

export async function crearContenedor(
  params: ParametrosContenedor
): Promise<string> {
  try {
    const contenedor = await docker.createContainer({
      name: params.nombre,
      Image: params.imagen,
      Env: Object.entries(params.variablesEntorno).map(
        ([clave, valor]) => `${clave}=${valor}`
      ),
      ExposedPorts: construirExposedPorts(params.puertos),
      HostConfig: {
        NanoCpus: Math.floor(params.cpuAsignado * 1e9),
        Memory: params.memoriaAsignada * BYTES_POR_MB,
        PortBindings: construirPortBindings(params.puertos),
        Binds: params.volumenes.map((v) => `${v.origen}:${v.destino}:${v.modo}`),
        RestartPolicy: { Name: "no" },
      },
    });
    return contenedor.id;
  } catch (error) {
    throw traducirErrorCreacion(error, params.imagen);
  }
}

export async function iniciarContenedor(idOnombre: string): Promise<void> {
  await ejecutarOperacion(() => docker.getContainer(idOnombre).start());
}

export async function detenerContenedor(idOnombre: string): Promise<void> {
  await ejecutarOperacion(() => docker.getContainer(idOnombre).stop());
}

export async function reiniciarContenedor(idOnombre: string): Promise<void> {
  await ejecutarOperacion(() => docker.getContainer(idOnombre).restart());
}

export async function eliminarContenedor(idOnombre: string): Promise<void> {
  await ejecutarOperacion(() =>
    docker.getContainer(idOnombre).remove({ force: true })
  );
}

export async function obtenerEstadisticas(
  idOnombre: string
): Promise<ConsumoContenedor> {
  try {
    const stats = await docker.getContainer(idOnombre).stats({ stream: false });
    return calcularConsumo(stats);
  } catch (error) {
    throw traducirErrorOperacion(error);
  }
}

async function ejecutarOperacion(operacion: () => Promise<unknown>): Promise<void> {
  try {
    await operacion();
  } catch (error) {
    throw traducirErrorOperacion(error);
  }
}

function construirExposedPorts(
  puertos: ParametrosContenedor["puertos"]
): Docker.ContainerCreateOptions["ExposedPorts"] {
  const exposed: Record<string, Record<string, never>> = {};
  for (const p of puertos) {
    exposed[`${p.contenedor}/${p.protocolo}`] = {};
  }
  return exposed;
}

function construirPortBindings(
  puertos: ParametrosContenedor["puertos"]
): Docker.HostConfig["PortBindings"] {
  const bindings: Record<string, Array<{ HostPort: string }>> = {};
  for (const p of puertos) {
    bindings[`${p.contenedor}/${p.protocolo}`] = [{ HostPort: String(p.host) }];
  }
  return bindings;
}

function calcularConsumo(stats: Docker.ContainerStats): ConsumoContenedor {
  const cpuDelta =
    stats.cpu_stats.cpu_usage.total_usage -
    stats.precpu_stats.cpu_usage.total_usage;
  const systemDelta =
    stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
  const online = stats.cpu_stats.online_cpus ?? 1;

  const cpu =
    systemDelta > 0 && cpuDelta > 0 ? (cpuDelta / systemDelta) * online * 100 : 0;
  const memoria = Math.round((stats.memory_stats.usage ?? 0) / BYTES_POR_MB);

  return { cpu: Number(cpu.toFixed(2)), memoria };
}

function esErrorConexion(error: unknown): boolean {
  const codigo = (error as { code?: string }).code;
  return (
    codigo === "ECONNREFUSED" || codigo === "ENOENT" || codigo === "EACCES"
  );
}

function traducirErrorCreacion(error: unknown, imagen: string): Error {
  logger.error({ error, evento: "docker_crear_contenedor_falla" });
  if (esErrorConexion(error)) {
    return new MotorDockerNoDisponibleError();
  }
  const statusCode = (error as { statusCode?: number }).statusCode;
  if (statusCode === 404) {
    return new ImagenDockerNoDisponibleError(imagen);
  }
  if (statusCode === 409) {
    return new NombreContenedorEnUsoError();
  }
  return error instanceof Error ? error : new Error("Error del motor Docker");
}

function traducirErrorOperacion(error: unknown): Error {
  logger.error({ error, evento: "docker_operacion_falla" });
  if (esErrorConexion(error)) {
    return new MotorDockerNoDisponibleError();
  }
  const statusCode = (error as { statusCode?: number }).statusCode;
  if (statusCode === 404) {
    return new ContenedorNoEncontradoError();
  }
  return error instanceof Error ? error : new Error("Error del motor Docker");
}
