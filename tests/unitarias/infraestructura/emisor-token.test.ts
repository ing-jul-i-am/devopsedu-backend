// tests/unitarias/infraestructura/emisor-token.test.ts
// Pruebas unitarias del emisor/verificador de tokens JWT.
// Cubre: RF-02, RF-03, RNF-14

import { describe, it, expect } from "vitest";
import { EmisorToken } from "@/infraestructura/emisor-token.js";
import { TokenInvalidoError } from "@/dominio/errores/token-invalido-error.js";

describe("EmisorToken", () => {
  const emisor = new EmisorToken({
    secreto: "secreto-de-prueba",
    expiracionSegundos: 3600,
  });

  it("emite un token que luego verifica y recupera el payload", () => {
    // Act
    const token = emisor.emitir({ idUsuario: 7 });
    const payload = emisor.verificar(token);

    // Assert
    expect(token).toBeTypeOf("string");
    expect(payload.idUsuario).toBe(7);
  });

  it("incluye la marca de expiracion en el token", () => {
    // Act
    const token = emisor.emitir({ idUsuario: 1 });
    const payload = emisor.verificar(token);

    // Assert
    expect(payload.exp).toBeTypeOf("number");
  });

  it("lanza TokenInvalidoError al verificar un token manipulado", () => {
    // Act + Assert
    expect(() => emisor.verificar("token.basura.invalida")).toThrow(
      TokenInvalidoError
    );
  });

  it("lanza TokenInvalidoError cuando el token fue firmado con otro secreto", () => {
    // Arrange
    const otroEmisor = new EmisorToken({
      secreto: "secreto-distinto",
      expiracionSegundos: 3600,
    });
    const token = otroEmisor.emitir({ idUsuario: 1 });

    // Act + Assert
    expect(() => emisor.verificar(token)).toThrow(TokenInvalidoError);
  });
});
