// src/composicion.ts
// Raiz de composicion: ensambla repositorios, wrappers, servicios de aplicacion y middlewares a
// partir de un cliente Prisma y una configuracion. La usan tanto el arranque real como las
// pruebas de integracion.

import type { PrismaClient } from "@prisma/client";
import { UsuarioRepo } from "./repositorios/usuario-repo.js";
import { SesionRepo } from "./repositorios/sesion-repo.js";
import { RolRepo } from "./repositorios/rol-repo.js";
import { ServicioRepo } from "./repositorios/servicio-repo.js";
import { RegistroDespliegueRepo } from "./repositorios/registro-despliegue-repo.js";
import { MetricaRepo } from "./repositorios/metrica-repo.js";
import { ModuloRepo } from "./repositorios/modulo-repo.js";
import { RutaAprendizajeRepo } from "./repositorios/ruta-aprendizaje-repo.js";
import { ActividadRepo } from "./repositorios/actividad-repo.js";
import { EvaluacionRepo } from "./repositorios/evaluacion-repo.js";
import { ResultadoRepo } from "./repositorios/resultado-repo.js";
import { Cifrador } from "./infraestructura/cifrador.js";
import { EmisorToken } from "./infraestructura/emisor-token.js";
import {
  crearMedidorRecursos,
  type MedicionRecursos,
} from "./infraestructura/capacidad-servidor.js";
import { Autenticador } from "./servicios-aplicacion/autenticador.js";
import { VerificadorRecursos } from "./servicios-aplicacion/verificador-recursos.js";
import { GestorServicios } from "./servicios-aplicacion/gestor-servicios.js";
import { GestorDocker } from "./servicios-aplicacion/gestor-docker.js";
import { EvaluadorActividad } from "./servicios-aplicacion/evaluador-actividad.js";
import { CalculadorProgreso } from "./servicios-aplicacion/calculador-progreso.js";
import { GestorModulos } from "./servicios-aplicacion/gestor-modulos.js";
import { GestorRutas } from "./servicios-aplicacion/gestor-rutas.js";
import { GestorAprendizaje } from "./servicios-aplicacion/gestor-aprendizaje.js";
import { GestorUsuarios } from "./servicios-aplicacion/gestor-usuarios.js";
import { MonitorPeriodico } from "./docker/monitor-periodico.js";
import { crearAutenticar } from "./api/middlewares/autenticar.js";
import { crearCors } from "./api/middlewares/cors.js";
import { crearMiddlewareSubidaImagen } from "./api/middlewares/subida-imagen.js";
import type { DependenciasApp } from "./api/app.js";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

export interface ConfigApp {
  jwtSecreto: string;
  jwtExpiracionSegundos: number;
  rolPorDefecto: string;
  rutaDisco: string;
  monitorIntervaloMs: number;
  corsOrigenes: string[];
  rutaAlmacenamientoModulos: string;
}

export type DependenciasCompletas = DependenciasApp & {
  monitor: MonitorPeriodico;
};

export function construirDependencias(
  prisma: PrismaClient,
  config: ConfigApp,
  // Permite inyectar una medicion determinista en pruebas; en produccion se usa el medidor real
  // basado en el sistema operativo.
  medirRecursos: () => Promise<MedicionRecursos> = crearMedidorRecursos(
    config.rutaDisco
  )
): DependenciasCompletas {
  const usuarioRepo = new UsuarioRepo(prisma);
  const sesionRepo = new SesionRepo(prisma);
  const rolRepo = new RolRepo(prisma);
  const servicioRepo = new ServicioRepo(prisma);
  const registroRepo = new RegistroDespliegueRepo(prisma);
  const metricaRepo = new MetricaRepo(prisma);
  const moduloRepo = new ModuloRepo(prisma);
  const rutaAprendizajeRepo = new RutaAprendizajeRepo(prisma);
  const actividadRepo = new ActividadRepo(prisma);
  const evaluacionRepo = new EvaluacionRepo(prisma);
  const resultadoRepo = new ResultadoRepo(prisma);

  const cifrador = new Cifrador();
  const emisor = new EmisorToken({
    secreto: config.jwtSecreto,
    expiracionSegundos: config.jwtExpiracionSegundos,
  });

  const autenticador = new Autenticador({
    usuarioRepo,
    sesionRepo,
    rolRepo,
    cifrador,
    emisor,
    rolPorDefecto: config.rolPorDefecto,
    expiracionTokenSegundos: config.jwtExpiracionSegundos,
  });

  const verificador = new VerificadorRecursos({ medirRecursos });
  const gestorServicios = new GestorServicios({
    servicioRepo,
    registroRepo,
    metricaRepo,
    verificador,
  });
  const calculadorProgreso = new CalculadorProgreso({
    rutaRepo: rutaAprendizajeRepo,
    actividadRepo,
    evaluacionRepo,
    resultadoRepo,
  });
  const evaluador = new EvaluadorActividad({
    rutaRepo: rutaAprendizajeRepo,
    actividadRepo,
    resultadoRepo,
    servicioRepo,
    registroRepo,
    calculadorProgreso,
  });
  const gestorDocker = new GestorDocker({
    servicioRepo,
    registroRepo,
    verificador,
    evaluador,
  });
  const gestorModulos = new GestorModulos({
    moduloRepo,
    actividadRepo,
    evaluacionRepo,
  });
  const gestorRutas = new GestorRutas({
    rutaRepo: rutaAprendizajeRepo,
    usuarioRepo,
    moduloRepo,
  });
  const gestorAprendizaje = new GestorAprendizaje({
    rutaRepo: rutaAprendizajeRepo,
    evaluacionRepo,
    resultadoRepo,
    calculadorProgreso,
  });
  const gestorUsuarios = new GestorUsuarios({ usuarioRepo, cifrador });

  const autenticar = crearAutenticar({ emisor, sesionRepo, usuarioRepo });
  const cors = crearCors(config.corsOrigenes);

  const rutaArchivosModulos = resolve(config.rutaAlmacenamientoModulos);
  mkdirSync(rutaArchivosModulos, { recursive: true });
  const subirImagenModulo = crearMiddlewareSubidaImagen(rutaArchivosModulos);

  const monitor = new MonitorPeriodico({
    servicioRepo,
    metricaRepo,
    registroRepo,
    intervaloMs: config.monitorIntervaloMs,
  });

  return {
    autenticador,
    gestorServicios,
    gestorDocker,
    gestorModulos,
    gestorRutas,
    gestorAprendizaje,
    gestorUsuarios,
    verificador,
    autenticar,
    cors,
    subirImagenModulo,
    rutaArchivosModulos,
    monitor,
  };
}
