// tests/unitarias/api/middlewares/subida-imagen.test.ts
// Pruebas unitarias de las funciones puras del middleware de subida de imagenes (sin invocar
// a multer ni tocar el sistema de archivos).
// Cubre: RF-20 — CU-10

import { describe, it, expect } from "vitest";
import {
  esTipoMimePermitido,
  nombreDeArchivoPara,
} from "@/api/middlewares/subida-imagen.js";

describe("esTipoMimePermitido", () => {
  it("acepta los tipos MIME de imagen soportados", () => {
    expect(esTipoMimePermitido("image/png")).toBe(true);
    expect(esTipoMimePermitido("image/jpeg")).toBe(true);
    expect(esTipoMimePermitido("image/webp")).toBe(true);
    expect(esTipoMimePermitido("image/gif")).toBe(true);
  });

  it("rechaza tipos MIME no soportados", () => {
    expect(esTipoMimePermitido("application/pdf")).toBe(false);
    expect(esTipoMimePermitido("text/plain")).toBe(false);
    expect(esTipoMimePermitido("image/svg+xml")).toBe(false);
  });
});

describe("nombreDeArchivoPara", () => {
  it("genera un nombre con extension acorde al tipo MIME", () => {
    expect(nombreDeArchivoPara("image/png")).toMatch(/\.png$/);
    expect(nombreDeArchivoPara("image/jpeg")).toMatch(/\.jpg$/);
  });

  it("genera nombres distintos en cada llamada", () => {
    const primero = nombreDeArchivoPara("image/png");
    const segundo = nombreDeArchivoPara("image/png");
    expect(primero).not.toBe(segundo);
  });

  it("devuelve null cuando el tipo MIME no esta permitido", () => {
    expect(nombreDeArchivoPara("application/pdf")).toBeNull();
  });
});
