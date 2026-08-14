// tests/configuracion/setup-cada-test.ts
// Se ejecuta antes de cada archivo de pruebas. Garantiza el aislamiento entre tests
// restaurando los mocks para que ninguno filtre estado hacia el siguiente (CLAUDE.md 7.6).

// Carga .env en process.env para que las pruebas de integracion vean DATABASE_URL_TEST.
// No sobrescribe variables ya presentes en el entorno.
import "dotenv/config";
import { afterEach, vi } from "vitest";

afterEach(() => {
  vi.restoreAllMocks();
});
