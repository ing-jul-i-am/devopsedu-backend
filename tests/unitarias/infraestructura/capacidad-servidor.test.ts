// tests/unitarias/infraestructura/capacidad-servidor.test.ts
// Pruebas unitarias del medidor de recursos del servidor. Mide capacidad TOTAL y DISPONIBLE
// consultando al sistema operativo, por lo que lo disponible refleja el uso de todos los
// procesos (SO, otros programas y Docker). Se mockean os y fs/promises para determinismo.
// Cubre: RF-09, RF-10

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("node:os", () => ({
  default: {
    cpus: () => [{}, {}, {}, {}], // 4 nucleos
    totalmem: () => 8 * 1024 * 1024 * 1024, // 8 GB
    freemem: () => 4 * 1024 * 1024 * 1024, // 4 GB libres
    loadavg: () => [1.5, 1, 1], // carga de 1.5 nucleos
  },
}));

vi.mock("node:fs/promises", () => ({ statfs: vi.fn() }));

import { statfs } from "node:fs/promises";
import { crearMedidorRecursos } from "@/infraestructura/capacidad-servidor.js";

describe("crearMedidorRecursos", () => {
  // Se re-establece en cada test porque el setup global restaura los mocks entre pruebas.
  beforeEach(() => {
    vi.mocked(statfs).mockResolvedValue({
      bsize: 4096,
      blocks: 1_000_000, // total = 1M * 4096 bytes
      bavail: 500_000, // libre = 500k * 4096 bytes
    } as never);
  });
  it("reporta la capacidad total del servidor", async () => {
    const medir = crearMedidorRecursos("/");

    const { total } = await medir();

    expect(total.cpu).toBe(4);
    expect(total.memoria).toBe(8192);
    expect(total.almacenamiento).toBe(3906); // floor(1_000_000 * 4096 / MB)
  });

  it("reporta lo disponible descontando el uso real del sistema", async () => {
    const medir = crearMedidorRecursos("/");

    const { disponible } = await medir();

    // CPU libre = nucleos - carga = 4 - 1.5
    expect(disponible.cpu).toBeCloseTo(2.5);
    // Memoria libre real del SO (incluye SO, otros programas y Docker)
    expect(disponible.memoria).toBe(4096);
    // Disco libre real
    expect(disponible.almacenamiento).toBe(1953); // floor(500_000 * 4096 / MB)
  });
});
