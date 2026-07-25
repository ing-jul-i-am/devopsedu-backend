// tests/ayudas/limpiar-bd.ts
// Deja la base de pruebas en un estado limpio antes de cada test de integracion,
// garantizando el aislamiento entre pruebas (CLAUDE.md 7.6).

import { prismaTest } from "./prisma-test.js";

/**
 * Vacia todas las tablas de la base de pruebas (salvo el historial de migraciones de Prisma)
 * y reinicia las secuencias de identidad. Usa TRUNCATE ... CASCADE para no depender del orden
 * de las llaves foraneas.
 */
export async function limpiarBd(): Promise<void> {
  const tablas = await prismaTest.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'
  `;

  if (tablas.length === 0) {
    return;
  }

  const lista = tablas.map((t) => `"public"."${t.tablename}"`).join(", ");
  await prismaTest.$executeRawUnsafe(
    `TRUNCATE TABLE ${lista} RESTART IDENTITY CASCADE`
  );
}
