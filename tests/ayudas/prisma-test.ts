// tests/ayudas/prisma-test.ts
// Cliente Prisma dedicado a las pruebas de integracion, apuntando a la base de datos de
// pruebas (DATABASE_URL_TEST). Nunca debe apuntar a la base de desarrollo o produccion.

import { PrismaClient } from "@prisma/client";

const url = process.env["DATABASE_URL_TEST"];
if (!url) {
  throw new Error(
    "Falta DATABASE_URL_TEST en el entorno. Las pruebas de integracion requieren la base de pruebas."
  );
}

export const prismaTest = new PrismaClient({ datasourceUrl: url });
