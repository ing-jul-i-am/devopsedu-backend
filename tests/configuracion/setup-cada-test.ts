// tests/configuracion/setup-cada-test.ts
// Se ejecuta antes de cada archivo de pruebas. Garantiza el aislamiento entre tests
// restaurando los mocks para que ninguno filtre estado hacia el siguiente (CLAUDE.md 7.6).

import { afterEach, vi } from "vitest";

afterEach(() => {
  vi.restoreAllMocks();
});
