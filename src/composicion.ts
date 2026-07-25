// src/composicion.ts
// Raiz de composicion: ensambla repositorios, wrappers y servicios de aplicacion a partir de
// un cliente Prisma y una configuracion. La usan tanto el arranque real como las pruebas.

import type { PrismaClient } from "@prisma/client";
import { UsuarioRepo } from "./repositorios/usuario-repo.js";
import { SesionRepo } from "./repositorios/sesion-repo.js";
import { RolRepo } from "./repositorios/rol-repo.js";
import { Cifrador } from "./infraestructura/cifrador.js";
import { EmisorToken } from "./infraestructura/emisor-token.js";
import { Autenticador } from "./servicios-aplicacion/autenticador.js";

export interface ConfigAutenticacion {
  jwtSecreto: string;
  jwtExpiracionSegundos: number;
  rolPorDefecto: string;
}

export function construirAutenticador(
  prisma: PrismaClient,
  config: ConfigAutenticacion
): Autenticador {
  const usuarioRepo = new UsuarioRepo(prisma);
  const sesionRepo = new SesionRepo(prisma);
  const rolRepo = new RolRepo(prisma);
  const cifrador = new Cifrador();
  const emisor = new EmisorToken({
    secreto: config.jwtSecreto,
    expiracionSegundos: config.jwtExpiracionSegundos,
  });

  return new Autenticador({
    usuarioRepo,
    sesionRepo,
    rolRepo,
    cifrador,
    emisor,
    rolPorDefecto: config.rolPorDefecto,
    expiracionTokenSegundos: config.jwtExpiracionSegundos,
  });
}
