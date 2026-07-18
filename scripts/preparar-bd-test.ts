// scripts/preparar-bd-test.ts
// Aplica el esquema mas reciente a la base de datos de pruebas.
// Se ejecuta antes de cada corrida de tests de integracion.
import { execSync } from "node:child_process";

const databaseUrlTest = process.env.DATABASE_URL_TEST;
if (!databaseUrlTest) {
  throw new Error("Falta DATABASE_URL_TEST en el entorno");
}

execSync("npx prisma migrate deploy", {
  env: { ...process.env, DATABASE_URL: databaseUrlTest },
  stdio: "inherit",
});

console.log("Base de pruebas lista.");
