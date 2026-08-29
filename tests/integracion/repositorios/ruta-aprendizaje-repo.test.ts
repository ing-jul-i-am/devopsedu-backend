// tests/integracion/repositorios/ruta-aprendizaje-repo.test.ts
// Pruebas de integracion del repositorio de rutas de aprendizaje contra la base de pruebas.
// Cubre: RF-21, RF-22

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { RutaAprendizajeRepo } from "@/repositorios/ruta-aprendizaje-repo.js";
import { prismaTest } from "../../ayudas/prisma-test.js";
import { limpiarBd } from "../../ayudas/limpiar-bd.js";
import { crearUsuarioEnBd } from "../../fixtures/usuario.factory.js";

async function crearModulo(orden: number) {
  return prismaTest.modulo.create({
    data: { nombre: `Modulo ${orden}`, contenidoTeorico: "c", orden },
  });
}

describe("RutaAprendizajeRepo", () => {
  const repo = new RutaAprendizajeRepo(prismaTest);

  beforeEach(async () => {
    await limpiarBd();
  });

  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  describe("asignar", () => {
    it("crea la ruta con los modulos asignados en el orden dado", async () => {
      // Arrange
      const usuario = await crearUsuarioEnBd();
      const moduloA = await crearModulo(1);
      const moduloB = await crearModulo(2);

      // Act
      const ruta = await repo.asignar(usuario.idUsuario, [
        moduloB.idModulo,
        moduloA.idModulo,
      ]);

      // Assert
      expect(ruta.idUsuario).toBe(usuario.idUsuario);
      expect(Number(ruta.progreso)).toBe(0);
      expect(ruta.rutaModulos).toHaveLength(2);
      const ordenados = [...ruta.rutaModulos].sort(
        (a, b) => a.ordenSecuencia - b.ordenSecuencia
      );
      expect(ordenados[0]?.idModulo).toBe(moduloB.idModulo);
      expect(ordenados[0]?.ordenSecuencia).toBe(1);
      expect(ordenados[1]?.idModulo).toBe(moduloA.idModulo);
      expect(ordenados[1]?.ordenSecuencia).toBe(2);
    });

    it("rechaza cuando alguno de los modulos no existe", async () => {
      // Arrange
      const usuario = await crearUsuarioEnBd();

      // Act + Assert
      await expect(
        repo.asignar(usuario.idUsuario, [999_999])
      ).rejects.toThrow();
    });
  });

  describe("buscarUltimaPorUsuario", () => {
    it("devuelve la ruta mas reciente del usuario con sus modulos ordenados", async () => {
      // Arrange
      const usuario = await crearUsuarioEnBd();
      const moduloA = await crearModulo(1);
      const moduloB = await crearModulo(2);
      await repo.asignar(usuario.idUsuario, [moduloA.idModulo]);
      const masReciente = await repo.asignar(usuario.idUsuario, [
        moduloB.idModulo,
        moduloA.idModulo,
      ]);

      // Act
      const encontrada = await repo.buscarUltimaPorUsuario(usuario.idUsuario);

      // Assert
      expect(encontrada?.idRuta).toBe(masReciente.idRuta);
      expect(encontrada?.rutaModulos.map((rm) => rm.modulo.nombre)).toEqual([
        "Modulo 2",
        "Modulo 1",
      ]);
    });

    it("devuelve null cuando el usuario no tiene ninguna ruta asignada", async () => {
      // Arrange
      const usuario = await crearUsuarioEnBd();

      // Act
      const encontrada = await repo.buscarUltimaPorUsuario(usuario.idUsuario);

      // Assert
      expect(encontrada).toBeNull();
    });
  });
});
