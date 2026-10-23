// tests/integracion/repositorios/resultado-repo.test.ts
// Pruebas de integracion del repositorio de resultados de actividades y evaluaciones.
// Cubre: RF-23, RF-24, RF-25 — CU-12, CU-14, CU-15

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { ResultadoRepo } from "@/repositorios/resultado-repo.js";
import { prismaTest } from "../../ayudas/prisma-test.js";
import { limpiarBd } from "../../ayudas/limpiar-bd.js";
import { crearUsuarioEnBd } from "../../fixtures/usuario.factory.js";
import { crearActividadEnBd } from "../../fixtures/actividad.factory.js";
import { crearEvaluacionEnBd } from "../../fixtures/evaluacion.factory.js";
import {
  crearResultadoActividadEnBd,
  crearResultadoEvaluacionEnBd,
} from "../../fixtures/resultado.factory.js";

const UMBRAL = 70;

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

  describe("buscarPrimeraFinalizacionPorActividades", () => {
    it("devuelve por actividad la fecha de finalizacion mas antigua del usuario", async () => {
      // Arrange
      const usuario = await crearUsuarioEnBd();
      const actividadA = await crearActividadEnBd();
      const actividadB = await crearActividadEnBd();
      const masAntigua = new Date("2026-10-01T10:00:00.000Z");
      await crearResultadoActividadEnBd({
        idUsuario: usuario.idUsuario,
        idActividad: actividadA.idActividad,
        fechaFinalizacion: new Date("2026-10-05T10:00:00.000Z"),
      });
      await crearResultadoActividadEnBd({
        idUsuario: usuario.idUsuario,
        idActividad: actividadA.idActividad,
        fechaFinalizacion: masAntigua,
      });

      // Act
      const fechas = await repo.buscarPrimeraFinalizacionPorActividades(
        usuario.idUsuario,
        [actividadA.idActividad, actividadB.idActividad]
      );

      // Assert
      expect(fechas).toEqual(new Map([[actividadA.idActividad, masAntigua]]));
    });

    it("ignora los resultados de otro usuario y de actividades fuera de la lista", async () => {
      // Arrange
      const usuario = await crearUsuarioEnBd();
      const otroUsuario = await crearUsuarioEnBd();
      const actividadA = await crearActividadEnBd();
      const actividadFuera = await crearActividadEnBd();
      await crearResultadoActividadEnBd({
        idUsuario: otroUsuario.idUsuario,
        idActividad: actividadA.idActividad,
      });
      await crearResultadoActividadEnBd({
        idUsuario: usuario.idUsuario,
        idActividad: actividadFuera.idActividad,
      });

      // Act
      const fechas = await repo.buscarPrimeraFinalizacionPorActividades(
        usuario.idUsuario,
        [actividadA.idActividad]
      );

      // Assert
      expect(fechas.size).toBe(0);
    });

    it("devuelve un mapa vacio cuando la lista de actividades esta vacia", async () => {
      // Arrange
      const usuario = await crearUsuarioEnBd();

      // Act
      const fechas = await repo.buscarPrimeraFinalizacionPorActividades(
        usuario.idUsuario,
        []
      );

      // Assert
      expect(fechas.size).toBe(0);
    });
  });

  describe("crearParaEvaluacion", () => {
    it("persiste el resultado de una evaluacion respondida", async () => {
      // Arrange
      const usuario = await crearUsuarioEnBd();
      const evaluacion = await crearEvaluacionEnBd();

      // Act
      const resultado = await repo.crearParaEvaluacion({
        idUsuario: usuario.idUsuario,
        idEvaluacion: evaluacion.idEvaluacion,
        puntuacion: 80,
        tiempoEmpleado: 300,
        intentos: 1,
      });

      // Assert
      expect(resultado.idResultado).toBeTypeOf("number");
      expect(Number(resultado.puntuacion)).toBe(80);
      expect(resultado.idEvaluacion).toBe(evaluacion.idEvaluacion);
      expect(resultado.idActividad).toBeNull();
    });
  });

  describe("contarIntentosPorUsuarioYEvaluacion", () => {
    it("cuenta todos los intentos previos del usuario para esa evaluacion", async () => {
      // Arrange
      const usuario = await crearUsuarioEnBd();
      const evaluacion = await crearEvaluacionEnBd();
      await repo.crearParaEvaluacion({
        idUsuario: usuario.idUsuario,
        idEvaluacion: evaluacion.idEvaluacion,
        puntuacion: 40,
        tiempoEmpleado: 100,
        intentos: 1,
      });
      await repo.crearParaEvaluacion({
        idUsuario: usuario.idUsuario,
        idEvaluacion: evaluacion.idEvaluacion,
        puntuacion: 60,
        tiempoEmpleado: 100,
        intentos: 2,
      });

      // Act
      const cantidad = await repo.contarIntentosPorUsuarioYEvaluacion(
        usuario.idUsuario,
        evaluacion.idEvaluacion
      );

      // Assert
      expect(cantidad).toBe(2);
    });

    it("devuelve 0 cuando el usuario nunca intento esa evaluacion", async () => {
      // Arrange
      const usuario = await crearUsuarioEnBd();
      const evaluacion = await crearEvaluacionEnBd();

      // Act
      const cantidad = await repo.contarIntentosPorUsuarioYEvaluacion(
        usuario.idUsuario,
        evaluacion.idEvaluacion
      );

      // Assert
      expect(cantidad).toBe(0);
    });
  });

  describe("existeAprobadaPorUsuarioYEvaluacion", () => {
    it("devuelve true cuando algun intento alcanzo el umbral", async () => {
      // Arrange
      const usuario = await crearUsuarioEnBd();
      const evaluacion = await crearEvaluacionEnBd();
      await repo.crearParaEvaluacion({
        idUsuario: usuario.idUsuario,
        idEvaluacion: evaluacion.idEvaluacion,
        puntuacion: 40,
        tiempoEmpleado: 100,
        intentos: 1,
      });
      await repo.crearParaEvaluacion({
        idUsuario: usuario.idUsuario,
        idEvaluacion: evaluacion.idEvaluacion,
        puntuacion: 80,
        tiempoEmpleado: 100,
        intentos: 2,
      });

      // Act
      const aprobada = await repo.existeAprobadaPorUsuarioYEvaluacion(
        usuario.idUsuario,
        evaluacion.idEvaluacion,
        UMBRAL
      );

      // Assert
      expect(aprobada).toBe(true);
    });

    it("devuelve false cuando ningun intento alcanzo el umbral", async () => {
      // Arrange
      const usuario = await crearUsuarioEnBd();
      const evaluacion = await crearEvaluacionEnBd();
      await repo.crearParaEvaluacion({
        idUsuario: usuario.idUsuario,
        idEvaluacion: evaluacion.idEvaluacion,
        puntuacion: 40,
        tiempoEmpleado: 100,
        intentos: 1,
      });

      // Act
      const aprobada = await repo.existeAprobadaPorUsuarioYEvaluacion(
        usuario.idUsuario,
        evaluacion.idEvaluacion,
        UMBRAL
      );

      // Assert
      expect(aprobada).toBe(false);
    });
  });

  // RF-25: carga los resultados de todos los estudiantes del reporte en una sola consulta.
  describe("listarPorUsuarios", () => {
    it("devuelve los resultados de los usuarios indicados del mas antiguo al mas reciente", async () => {
      // Arrange
      const ana = await crearUsuarioEnBd();
      const luis = await crearUsuarioEnBd();
      const otro = await crearUsuarioEnBd();
      const actividad = await crearActividadEnBd();
      const evaluacion = await crearEvaluacionEnBd();
      const reciente = await crearResultadoActividadEnBd({
        idUsuario: ana.idUsuario,
        idActividad: actividad.idActividad,
        fechaFinalizacion: new Date("2026-03-02"),
      });
      const antiguo = await crearResultadoActividadEnBd({
        idUsuario: luis.idUsuario,
        idActividad: actividad.idActividad,
        fechaFinalizacion: new Date("2026-03-01"),
      });
      await crearResultadoEvaluacionEnBd({
        idUsuario: otro.idUsuario,
        idEvaluacion: evaluacion.idEvaluacion,
      });

      // Act
      const resultados = await repo.listarPorUsuarios([
        ana.idUsuario,
        luis.idUsuario,
      ]);

      // Assert
      expect(resultados.map((r) => r.idResultado)).toEqual([
        antiguo.idResultado,
        reciente.idResultado,
      ]);
    });

    it("devuelve una lista vacia cuando no se indica ningun usuario", async () => {
      // Act
      const resultados = await repo.listarPorUsuarios([]);

      // Assert
      expect(resultados).toHaveLength(0);
    });
  });
});
