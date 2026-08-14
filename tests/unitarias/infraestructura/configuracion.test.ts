// tests/unitarias/infraestructura/configuracion.test.ts
// Prueba de humo de la Etapa 0: valida la carga y validacion de la configuracion al arranque.
// Si falta una variable obligatoria, el servidor no debe iniciar.
// Cubre: RNF-21

import { describe, it, expect } from "vitest";
import {
  cargarConfiguracion,
  ConfiguracionInvalidaError,
} from "@/infraestructura/configuracion.js";

describe("cargarConfiguracion", () => {
  it("carga una configuracion valida y expone los valores tipados", () => {
    // Arrange
    const entorno = {
      NODE_ENV: "test",
      DATABASE_URL: "postgresql://u:p@localhost:5432/db?schema=public",
      JWT_SECRET: "una-clave-secreta-de-prueba-larga",
    };

    // Act
    const config = cargarConfiguracion(entorno);

    // Assert
    expect(config.NODE_ENV).toBe("test");
    expect(config.DATABASE_URL).toBe(
      "postgresql://u:p@localhost:5432/db?schema=public"
    );
  });

  it("aplica los valores por defecto de NODE_ENV, puerto y rol", () => {
    // Arrange
    const entorno = {
      DATABASE_URL: "postgresql://u:p@localhost:5432/db",
      JWT_SECRET: "una-clave-secreta-de-prueba-larga",
    };

    // Act
    const config = cargarConfiguracion(entorno);

    // Assert
    expect(config.NODE_ENV).toBe("development");
    expect(config.PORT).toBe(3000);
    expect(config.ROL_POR_DEFECTO).toBe("estudiante");
  });

  it("lanza ConfiguracionInvalidaError cuando falta JWT_SECRET", () => {
    // Arrange
    const entorno = { DATABASE_URL: "postgresql://u:p@localhost:5432/db" };

    // Act
    const intento = () => cargarConfiguracion(entorno);

    // Assert
    expect(intento).toThrow(ConfiguracionInvalidaError);
  });

  it("lanza ConfiguracionInvalidaError cuando falta DATABASE_URL", () => {
    // Arrange
    const entorno = {};

    // Act
    const intento = () => cargarConfiguracion(entorno);

    // Assert
    expect(intento).toThrow(ConfiguracionInvalidaError);
  });
});
