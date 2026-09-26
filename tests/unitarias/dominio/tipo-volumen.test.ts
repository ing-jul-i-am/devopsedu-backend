// tests/unitarias/dominio/tipo-volumen.test.ts
// Prueba la regla que distingue un bind mount de un volumen nombrado a partir del origen
// declarado. La distincion importa porque al recrear un contenedor solo se destruyen los
// volumenes nombrados; los bind mounts viven en el host y se conservan (ver DT-15).
// Cubre: RF-08, RF-11, RF-14

import { describe, it, expect } from "vitest";
import { clasificarVolumen } from "@/dominio/tipo-volumen.js";

describe("clasificarVolumen", () => {
  it("clasifica como bind mount un origen con ruta absoluta del host", () => {
    // Arrange
    const origen = "/datos/postgres";

    // Act
    const tipo = clasificarVolumen(origen);

    // Assert
    expect(tipo).toBe("bind");
  });

  it("clasifica como bind mount un origen con ruta relativa", () => {
    expect(clasificarVolumen("./datos")).toBe("bind");
    expect(clasificarVolumen("../compartido")).toBe("bind");
  });

  it("clasifica como bind mount un origen anclado al directorio del usuario", () => {
    expect(clasificarVolumen("~/datos")).toBe("bind");
  });

  it("clasifica como bind mount una ruta de Windows con letra de unidad", () => {
    expect(clasificarVolumen("C:\\datos\\postgres")).toBe("bind");
    expect(clasificarVolumen("d:/datos")).toBe("bind");
  });

  it("clasifica como volumen nombrado un origen sin separadores de ruta", () => {
    // Arrange
    const origen = "datos-redis";

    // Act
    const tipo = clasificarVolumen(origen);

    // Assert
    expect(tipo).toBe("volumen");
  });

  it("ignora los espacios alrededor del origen al clasificar", () => {
    expect(clasificarVolumen("  /datos/pg  ")).toBe("bind");
    expect(clasificarVolumen("  datos-redis  ")).toBe("volumen");
  });
});
