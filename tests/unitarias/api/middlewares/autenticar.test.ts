// tests/unitarias/api/middlewares/autenticar.test.ts
// Pruebas unitarias del middleware de autenticacion: valida el JWT y que la sesion siga activa.
// Cubre: RF-03, RNF-14

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { crearAutenticar } from "@/api/middlewares/autenticar.js";
import { TokenInvalidoError } from "@/dominio/errores/token-invalido-error.js";

function crearDeps() {
  return {
    emisor: { emitir: vi.fn(), verificar: vi.fn() },
    sesionRepo: {
      crear: vi.fn(),
      buscarPorToken: vi.fn(),
      revocarPorToken: vi.fn(),
    },
    usuarioRepo: {
      buscarPorIdConRol: vi.fn(),
      buscarPorCorreo: vi.fn(),
      crear: vi.fn(),
      buscarPorId: vi.fn(),
    },
  };
}

type Deps = ReturnType<typeof crearDeps>;

function reqCon(authorization?: string): Request {
  return {
    headers: authorization ? { authorization } : {},
    path: "/protegida",
  } as unknown as Request;
}

const RES = {} as Response;

function sesionActiva() {
  return {
    idSesion: 1,
    token: "tok",
    estado: "activa",
    fechaInicio: new Date(),
    fechaExpiracion: new Date(Date.now() + 3_600_000),
    idUsuario: 5,
  };
}

function usuarioConRol() {
  return {
    idUsuario: 5,
    idRol: 1,
    nombre: "Ana",
    correo: "ana@devopsedu.local",
    contrasenaCifrada: "hash",
    fechaRegistro: new Date(),
    rol: { idRol: 1, nombre: "estudiante", permisos: [] },
  };
}

describe("crearAutenticar", () => {
  let deps: Deps;

  beforeEach(() => {
    deps = crearDeps();
  });

  it("adjunta el usuario y llama next() sin error con token y sesion validos", async () => {
    // Arrange
    deps.emisor.verificar.mockReturnValue({ idUsuario: 5 });
    deps.sesionRepo.buscarPorToken.mockResolvedValue(sesionActiva());
    deps.usuarioRepo.buscarPorIdConRol.mockResolvedValue(usuarioConRol());
    const middleware = crearAutenticar(deps as never);
    const req = reqCon("Bearer tok");
    const next = vi.fn() as unknown as NextFunction;

    // Act
    await middleware(req, RES, next);

    // Assert
    expect(req.usuario).toEqual({ idUsuario: 5, idRol: 1, rol: "estudiante" });
    expect(next).toHaveBeenCalledWith();
  });

  it("llama next(TokenInvalidoError) si no hay encabezado Authorization", async () => {
    const middleware = crearAutenticar(deps as never);
    const next = vi.fn();

    await middleware(reqCon(), RES, next as unknown as NextFunction);

    expect(next).toHaveBeenCalledWith(expect.any(TokenInvalidoError));
  });

  it("llama next(TokenInvalidoError) si el token es invalido", async () => {
    deps.emisor.verificar.mockImplementation(() => {
      throw new TokenInvalidoError();
    });
    const middleware = crearAutenticar(deps as never);
    const next = vi.fn();

    await middleware(reqCon("Bearer malo"), RES, next as unknown as NextFunction);

    expect(next).toHaveBeenCalledWith(expect.any(TokenInvalidoError));
  });

  it("llama next(TokenInvalidoError) si la sesion fue revocada", async () => {
    deps.emisor.verificar.mockReturnValue({ idUsuario: 5 });
    deps.sesionRepo.buscarPorToken.mockResolvedValue({
      ...sesionActiva(),
      estado: "revocada",
    });
    const middleware = crearAutenticar(deps as never);
    const next = vi.fn();

    await middleware(reqCon("Bearer tok"), RES, next as unknown as NextFunction);

    expect(next).toHaveBeenCalledWith(expect.any(TokenInvalidoError));
    expect(deps.usuarioRepo.buscarPorIdConRol).not.toHaveBeenCalled();
  });

  it("llama next(TokenInvalidoError) si la sesion expiro", async () => {
    deps.emisor.verificar.mockReturnValue({ idUsuario: 5 });
    deps.sesionRepo.buscarPorToken.mockResolvedValue({
      ...sesionActiva(),
      fechaExpiracion: new Date(Date.now() - 1_000),
    });
    const middleware = crearAutenticar(deps as never);
    const next = vi.fn();

    await middleware(reqCon("Bearer tok"), RES, next as unknown as NextFunction);

    expect(next).toHaveBeenCalledWith(expect.any(TokenInvalidoError));
  });
});
