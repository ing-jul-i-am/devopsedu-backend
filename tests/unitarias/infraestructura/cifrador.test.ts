// tests/unitarias/infraestructura/cifrador.test.ts
// Pruebas unitarias del cifrador de contrasenas basado en bcrypt.
// Cubre: RNF-10

import { describe, it, expect } from "vitest";
import { Cifrador } from "@/infraestructura/cifrador.js";

describe("Cifrador", () => {
  const cifrador = new Cifrador();

  it("cifra una clave y luego la verifica correctamente", async () => {
    // Arrange + Act
    const hash = await cifrador.cifrar("Clave_segura_1");

    // Assert
    expect(hash).not.toBe("Clave_segura_1");
    await expect(cifrador.verificar("Clave_segura_1", hash)).resolves.toBe(true);
  });

  it("la verificacion falla cuando la clave no coincide", async () => {
    // Arrange
    const hash = await cifrador.cifrar("Clave_segura_1");

    // Act + Assert
    await expect(cifrador.verificar("clave_incorrecta", hash)).resolves.toBe(
      false
    );
  });

  it("aplica un factor de coste de al menos 12 rondas (RNF-10)", async () => {
    // Act
    const hash = await cifrador.cifrar("cualquier-clave");

    // Assert: el prefijo del hash bcrypt codifica el coste, p. ej. $2b$12$
    expect(hash).toMatch(/^\$2[aby]\$12\$/);
  });
});
