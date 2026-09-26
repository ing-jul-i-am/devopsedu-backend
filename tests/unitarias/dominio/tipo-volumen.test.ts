// tests/unitarias/dominio/tipo-volumen.test.ts
// Prueba las reglas de clasificacion de volumenes: distinguir un bind mount de un volumen
// nombrado a partir del origen declarado (DT-15), y reconocer un volumen anonimo por su nombre
// para poder describirselo al estudiante antes de destruirlo (DT-17).
// Cubre: RF-08, RF-11, RF-14, RF-17

import { describe, it, expect } from "vitest";
import { clasificarVolumen, esVolumenAnonimo } from "@/dominio/tipo-volumen.js";

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

describe("esVolumenAnonimo", () => {
  // Nombre real tomado del volumen que postgres:16-alpine crea por su instruccion VOLUME.
  const ANONIMO =
    "55cc6130e6b6b881f5353f86065017a2eccd6a6f88bbdc1d606b28e377edc537";

  it("reconoce el hash de 64 hexadecimales con que Docker nombra los volumenes anonimos", () => {
    // Arrange / Act
    const anonimo = esVolumenAnonimo(ANONIMO);

    // Assert
    expect(anonimo).toBe(true);
  });

  it("no considera anonimo un volumen que el estudiante nombro", () => {
    expect(esVolumenAnonimo("datos-redis")).toBe(false);
    expect(esVolumenAnonimo("datos_postgres_clase_04")).toBe(false);
  });

  it("no considera anonimo un hexadecimal de longitud distinta a 64", () => {
    expect(esVolumenAnonimo(ANONIMO.slice(0, 63))).toBe(false);
    expect(esVolumenAnonimo(ANONIMO + "a")).toBe(false);
  });

  it("no considera anonimo un nombre con caracteres fuera del alfabeto hexadecimal", () => {
    // Misma longitud que un hash, pero con una 'z' y con mayusculas: Docker no los genera asi.
    expect(esVolumenAnonimo("z".repeat(64))).toBe(false);
    expect(esVolumenAnonimo(ANONIMO.toUpperCase())).toBe(false);
  });
});
