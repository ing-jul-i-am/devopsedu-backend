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
import { Cifrador } from "./infraestructura/cifrador.js";
import { EmisorToken } from "./infraestructura/emisor-token.js";
import { crearLectorCapacidad } from "./infraestructura/capacidad-servidor.js";
import { Autenticador } from "./servicios-aplicacion/autenticador.js";
import { VerificadorRecursos } from "./servicios-aplicacion/verificador-recursos.js";
import { GestorServicios } from "./servicios-aplicacion/gestor-servicios.js";
import { GestorDocker } from "./servicios-aplicacion/gestor-docker.js";
import { crearAutenticar } from "./api/middlewares/autenticar.js";
import type { DependenciasApp } from "./api/app.js";

export interface ConfigApp {
  jwtSecreto: string;
  jwtExpiracionSegundos: number;
  rolPorDefecto: string;
  almacenamientoTotalMb: number;
}

export function construirDependencias(
  prisma: PrismaClient,
  config: ConfigApp
): DependenciasApp {
  const usuarioRepo = new UsuarioRepo(prisma);
  const sesionRepo = new SesionRepo(prisma);
  const rolRepo = new RolRepo(prisma);
  const servicioRepo = new ServicioRepo(prisma);
  const registroRepo = new RegistroDespliegueRepo(prisma);

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

  const verificador = new VerificadorRecursos({
    servicioRepo,
    capacidadTotal: crearLectorCapacidad(config.almacenamientoTotalMb),
  });
  const gestorServicios = new GestorServicios({
    servicioRepo,
    registroRepo,
    verificador,
  });
  const gestorDocker = new GestorDocker({
    servicioRepo,
    registroRepo,
    verificador,
  });

  const autenticar = crearAutenticar({ emisor, sesionRepo, usuarioRepo });

  return {
    autenticador,
    gestorServicios,
    gestorDocker,
    verificador,
    autenticar,
  };
}
