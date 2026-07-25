// src/infraestructura/prisma-cliente.ts
// Instancia unica del cliente Prisma para la aplicacion en ejecucion. Usa DATABASE_URL del
// entorno. Las pruebas usan su propio cliente (tests/ayudas/prisma-test.ts).

import { PrismaClient } from "@prisma/client";

export const prismaCliente = new PrismaClient();
