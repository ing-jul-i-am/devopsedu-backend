// tests/unitarias/infraestructura/capacidad-servidor.test.ts
// Pruebas unitarias del lector de capacidad del servidor (mockea os para ser determinista).
// Cubre: RF-09, RF-10

import { describe, it, expect, vi } from "vitest";

vi.mock("node:os", () => ({
  default: {
    cpus: () => [{}, {}, {}, {}], // 4 nucleos
    totalmem: () => 8 * 1024 * 1024 * 1024, // 8 GB
  },
}));

import { crearLectorCapacidad } from "@/infraestructura/capacidad-servidor.js";

describe("crearLectorCapacidad", () => {
  it("reporta CPU en nucleos, memoria en MB y el almacenamiento configurado", () => {
    // Arrange
    const leerCapacidad = crearLectorCapacidad(50_000);

    // Act
    const capacidad = leerCapacidad();

    // Assert
    expect(capacidad.cpu).toBe(4);
    expect(capacidad.memoria).toBe(8192);
    expect(capacidad.almacenamiento).toBe(50_000);
  });
});
