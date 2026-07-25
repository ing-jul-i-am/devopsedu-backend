// tests/configuracion/setup-global.ts
// Configuracion global de la suite de pruebas: se ejecuta una sola vez antes de toda la suite.
// Cubre: RNF-15, RNF-17
//
// Nota: el silenciado del logger (CLAUDE.md 6.6) se agregara en esta funcion cuando
// exista src/infraestructura/logger.ts, para no contaminar la salida de las pruebas.

export default function setupGlobal(): void {
  process.env["NODE_ENV"] = "test";
}
