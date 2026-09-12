// tests/integracion/repositorios/resultado-repo.test.ts
// Pruebas de integracion del repositorio de resultados de actividades y evaluaciones.
// Cubre: RF-23 — CU-12

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { ResultadoRepo } from "@/repositorios/resultado-repo.js";
import { prismaTest } from "../../ayudas/prisma-test.js";
import { limpiarBd } from "../../ayudas/limpiar-bd.js";
import { crearUsuarioEnBd } from "../../fixtures/usuario.factory.js";
import { crearActividadEnBd } from "../../fixtures/actividad.factory.js";

describe("ResultadoRepo", () => {
  const repo = new ResultadoRepo(prismaTest);

  beforeEach(async () => {
    await limpiarBd();
  });

  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  describe("crearParaActividad", () => {
    it("persiste el resultado de una actividad completada", async () => {
      // Arrange
      const usuario = await crearUsuarioEnBd();
      const actividad = await crearActividadEnBd();

      // Act
      const resultado = await repo.crearParaActividad({
        idUsuario: usuario.idUsuario,
        idActividad: actividad.idActividad,
        puntuacion: 100,
        tiempoEmpleado: 120,
        intentos: 2,
      });

      // Assert
      expect(resultado.idResultado).toBeTypeOf("number");
      expect(Number(resultado.puntuacion)).toBe(100);
      expect(resultado.tiempoEmpleado).toBe(120);
      expect(resultado.intentos).toBe(2);
      expect(resultado.idActividad).toBe(actividad.idActividad);
    });
  });

  describe("existePorUsuarioYActividad", () => {
    it("devuelve true cuando el usuario ya completo la actividad", async () => {
      // Arrange
      const usuario = await crearUsuarioEnBd();
      const actividad = await crearActividadEnBd();
      await repo.crearParaActividad({
        idUsuario: usuario.idUsuario,
        idActividad: actividad.idActividad,
        puntuacion: 100,
        tiempoEmpleado: 60,
        intentos: 1,
      });

      // Act
      const existe = await repo.existePorUsuarioYActividad(
        usuario.idUsuario,
        actividad.idActividad
      );

      // Assert
      expect(existe).toBe(true);
    });

    it("devuelve false cuando el usuario no ha completado la actividad", async () => {
      // Arrange
      const usuario = await crearUsuarioEnBd();
      const actividad = await crearActividadEnBd();

      // Act
      const existe = await repo.existePorUsuarioYActividad(
        usuario.idUsuario,
        actividad.idActividad
      );

      // Assert
      expect(existe).toBe(false);
    });
  });

  describe("contarActividadesCompletadasEnRuta", () => {
    it("cuenta solo las actividades completadas por ese usuario dentro de la lista dada", async () => {
      // Arrange
      const usuario = await crearUsuarioEnBd();
      const otroUsuario = await crearUsuarioEnBd();
      const actividadA = await crearActividadEnBd();
      const actividadB = await crearActividadEnBd();
      const actividadC = await crearActividadEnBd();
      await repo.crearParaActividad({
        idUsuario: usuario.idUsuario,
        idActividad: actividadA.idActividad,
        puntuacion: 100,
        tiempoEmpleado: 60,
        intentos: 1,
      });
      await repo.crearParaActividad({
        idUsuario: otroUsuario.idUsuario,
        idActividad: actividadB.idActividad,
        puntuacion: 100,
        tiempoEmpleado: 60,
        intentos: 1,
      });

      // Act
      const cantidad = await repo.contarActividadesCompletadasEnRuta(
        usuario.idUsuario,
        [actividadA.idActividad, actividadB.idActividad, actividadC.idActividad]
      );

      // Assert
      expect(cantidad).toBe(1);
    });
  });
});
