// tests/unitarias/api/middlewares/autorizar.test.ts
// Pruebas unitarias del middleware de autorizacion por rol.
// Cubre: RNF-14

import { describe, it, expect, vi } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { autorizar } from "@/api/middlewares/autorizar.js";
import { PermisoDenegadoError } from "@/dominio/errores/permiso-denegado-error.js";
import { TokenInvalidoError } from "@/dominio/errores/token-invalido-error.js";

const RES = {} as Response;

function reqConRol(rol?: string): Request {
  return {
    usuario: rol ? { idUsuario: 1, idRol: 1, rol } : undefined,
    path: "/protegida",
  } as unknown as Request;
}

describe("autorizar", () => {
  it("llama next() sin error cuando el rol esta permitido", () => {
    const next = vi.fn();

    autorizar("docente", "estudiante")(
      reqConRol("estudiante"),
      RES,
      next as unknown as NextFunction
    );

    expect(next).toHaveBeenCalledWith();
  });

  it("llama next(PermisoDenegadoError) cuando el rol no esta permitido", () => {
    const next = vi.fn();

    autorizar("docente")(
      reqConRol("estudiante"),
      RES,
      next as unknown as NextFunction
    );

    expect(next).toHaveBeenCalledWith(expect.any(PermisoDenegadoError));
  });

  it("llama next(TokenInvalidoError) cuando no hay usuario autenticado", () => {
    const next = vi.fn();

    autorizar("docente")(reqConRol(), RES, next as unknown as NextFunction);

    expect(next).toHaveBeenCalledWith(expect.any(TokenInvalidoError));
  });
});
