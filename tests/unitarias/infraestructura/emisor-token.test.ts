// tests/unitarias/infraestructura/emisor-token.test.ts
// Pruebas unitarias del emisor/verificador de tokens JWT.
// Cubre: RF-02, RF-03, RNF-14

import { describe, it, expect, vi, afterEach } from "vitest";
import { EmisorToken } from "@/infraestructura/emisor-token.js";
import { TokenInvalidoError } from "@/dominio/errores/token-invalido-error.js";

describe("EmisorToken", () => {
  const emisor = new EmisorToken({
    secreto: "secreto-de-prueba",
    expiracionSegundos: 3600,
  });

  afterEach(() => {
    vi.useRealTimers();
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

  // DT-19: sesion.token es unico; dos inicios de sesion del mismo usuario dentro del mismo
  // segundo no pueden producir el mismo token.
  it("emite tokens distintos para el mismo usuario aunque se emitan en el mismo segundo", () => {
    // Arrange
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-23T12:00:00.000Z"));

    // Act
    const primero = emisor.emitir({ idUsuario: 7 });
    const segundo = emisor.emitir({ idUsuario: 7 });

    // Assert
    expect(primero).not.toBe(segundo);
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
