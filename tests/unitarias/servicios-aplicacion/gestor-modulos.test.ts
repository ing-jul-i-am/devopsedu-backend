// tests/unitarias/servicios-aplicacion/gestor-modulos.test.ts
// Cubre: RF-20, RF-23, RF-24 — CU-10, CU-12, CU-14

import { describe, it, expect, vi } from "vitest";
import { GestorModulos } from "@/servicios-aplicacion/gestor-modulos.js";
import { ModuloNoEncontradoError } from "@/dominio/errores/modulo-no-encontrado-error.js";
import { EvaluacionYaExisteError } from "@/dominio/errores/evaluacion-ya-existe-error.js";
import { datosModuloValidos } from "../../fixtures/modulo.factory.js";
import { criteriosValidacionDePrueba } from "../../fixtures/actividad.factory.js";
import { preguntasDePrueba } from "../../fixtures/evaluacion.factory.js";

function crearDependenciasMock() {
  return {
    moduloRepo: {
      crear: vi.fn(),
      listarTodos: vi.fn(),
      buscarPorId: vi.fn(),
      actualizar: vi.fn(),
    },
    actividadRepo: {
      crear: vi.fn(),
    },
    evaluacionRepo: {
      crear: vi.fn(),
      buscarPorModulo: vi.fn(),
    },
  };
}

describe("GestorModulos", () => {
  describe("crear", () => {
    it("delega la creacion en el repositorio y devuelve el modulo creado", async () => {
      // Arrange
      const dep = crearDependenciasMock();
      const datos = datosModuloValidos();
      dep.moduloRepo.crear.mockResolvedValue({ idModulo: 1, ...datos });
      const gestor = new GestorModulos(dep as any);

      // Act
      const modulo = await gestor.crear(datos);

      // Assert
      expect(dep.moduloRepo.crear).toHaveBeenCalledWith(datos);
      expect(modulo).toMatchObject({ idModulo: 1, ...datos });
    });
  });

  describe("listarTodos", () => {
    it("delega el listado en el repositorio", async () => {
      // Arrange
      const dep = crearDependenciasMock();
      dep.moduloRepo.listarTodos.mockResolvedValue([]);
      const gestor = new GestorModulos(dep as any);

      // Act
      await gestor.listarTodos();

      // Assert
      expect(dep.moduloRepo.listarTodos).toHaveBeenCalled();
    });
  });

  describe("obtenerPorId", () => {
    it("devuelve el modulo cuando existe", async () => {
      // Arrange
      const dep = crearDependenciasMock();
      dep.moduloRepo.buscarPorId.mockResolvedValue({
        idModulo: 1,
        ...datosModuloValidos(),
      });
      const gestor = new GestorModulos(dep as any);

      // Act
      const modulo = await gestor.obtenerPorId(1);

      // Assert
      expect(dep.moduloRepo.buscarPorId).toHaveBeenCalledWith(1);
      expect(modulo.idModulo).toBe(1);
    });

    it("lanza ModuloNoEncontradoError cuando el modulo no existe", async () => {
      // Arrange
      const dep = crearDependenciasMock();
      dep.moduloRepo.buscarPorId.mockResolvedValue(null);
      const gestor = new GestorModulos(dep as any);

      // Act
      const intento = gestor.obtenerPorId(999);

      // Assert
      await expect(intento).rejects.toBeInstanceOf(ModuloNoEncontradoError);
    });
  });

  describe("editar", () => {
    it("actualiza el modulo cuando existe", async () => {
      // Arrange
      const dep = crearDependenciasMock();
      dep.moduloRepo.buscarPorId.mockResolvedValue({
        idModulo: 1,
        ...datosModuloValidos(),
      });
      dep.moduloRepo.actualizar.mockResolvedValue({
        idModulo: 1,
        ...datosModuloValidos({ nombre: "Redes en Docker", orden: 2 }),
      });
      const gestor = new GestorModulos(dep as any);

      // Act
      const modulo = await gestor.editar(1, { nombre: "Redes en Docker", orden: 2 });

      // Assert
      expect(dep.moduloRepo.actualizar).toHaveBeenCalledWith(1, {
        nombre: "Redes en Docker",
        orden: 2,
      });
      expect(modulo.nombre).toBe("Redes en Docker");
    });

    it("lanza ModuloNoEncontradoError cuando el modulo no existe", async () => {
      // Arrange
      const dep = crearDependenciasMock();
      dep.moduloRepo.buscarPorId.mockResolvedValue(null);
      const gestor = new GestorModulos(dep as any);

      // Act
      const intento = gestor.editar(999, { nombre: "No existe" });

      // Assert
      await expect(intento).rejects.toBeInstanceOf(ModuloNoEncontradoError);
      expect(dep.moduloRepo.actualizar).not.toHaveBeenCalled();
    });
  });

  describe("crearActividad", () => {
    it("crea la actividad cuando el modulo existe", async () => {
      // Arrange
      const dep = crearDependenciasMock();
      dep.moduloRepo.buscarPorId.mockResolvedValue({
        idModulo: 1,
        ...datosModuloValidos(),
      });
      const criterios = criteriosValidacionDePrueba();
      dep.actividadRepo.crear.mockResolvedValue({
        idActividad: 10,
        descripcion: "Despliega nginx",
        criteriosValidacion: criterios,
        orden: 1,
        idModulo: 1,
      });
      const gestor = new GestorModulos(dep as any);

      // Act
      const actividad = await gestor.crearActividad(1, {
        descripcion: "Despliega nginx",
        criteriosValidacion: criterios,
        orden: 1,
      });

      // Assert
      expect(dep.actividadRepo.crear).toHaveBeenCalledWith({
        descripcion: "Despliega nginx",
        criteriosValidacion: criterios,
        orden: 1,
        idModulo: 1,
      });
      expect(actividad.idActividad).toBe(10);
    });

    it("lanza ModuloNoEncontradoError cuando el modulo no existe", async () => {
      // Arrange
      const dep = crearDependenciasMock();
      dep.moduloRepo.buscarPorId.mockResolvedValue(null);
      const gestor = new GestorModulos(dep as any);

      // Act
      const intento = gestor.crearActividad(999, {
        descripcion: "Despliega nginx",
        criteriosValidacion: criteriosValidacionDePrueba(),
        orden: 1,
      });

      // Assert
      await expect(intento).rejects.toBeInstanceOf(ModuloNoEncontradoError);
      expect(dep.actividadRepo.crear).not.toHaveBeenCalled();
    });
  });

  describe("crearEvaluacion", () => {
    it("crea la evaluacion cuando el modulo existe y no tiene una previa", async () => {
      // Arrange
      const dep = crearDependenciasMock();
      dep.moduloRepo.buscarPorId.mockResolvedValue({
        idModulo: 1,
        ...datosModuloValidos(),
      });
      dep.evaluacionRepo.buscarPorModulo.mockResolvedValue(null);
      const preguntas = preguntasDePrueba(5);
      const fechaDisponible = new Date("2026-01-01");
      dep.evaluacionRepo.crear.mockResolvedValue({
        idEvaluacion: 20,
        titulo: "Evaluacion del modulo",
        preguntas,
        fechaDisponible,
        idModulo: 1,
      });
      const gestor = new GestorModulos(dep as any);

      // Act
      const evaluacion = await gestor.crearEvaluacion(1, {
        titulo: "Evaluacion del modulo",
        preguntas,
        fechaDisponible,
      });

      // Assert
      expect(dep.evaluacionRepo.crear).toHaveBeenCalledWith({
        titulo: "Evaluacion del modulo",
        preguntas,
        fechaDisponible,
        idModulo: 1,
      });
      expect(evaluacion.idEvaluacion).toBe(20);
    });

    it("lanza ModuloNoEncontradoError cuando el modulo no existe", async () => {
      // Arrange
      const dep = crearDependenciasMock();
      dep.moduloRepo.buscarPorId.mockResolvedValue(null);
      const gestor = new GestorModulos(dep as any);

      // Act
      const intento = gestor.crearEvaluacion(999, {
        titulo: "Evaluacion del modulo",
        preguntas: preguntasDePrueba(1),
        fechaDisponible: new Date("2026-01-01"),
      });

      // Assert
      await expect(intento).rejects.toBeInstanceOf(ModuloNoEncontradoError);
      expect(dep.evaluacionRepo.crear).not.toHaveBeenCalled();
    });

    it("lanza EvaluacionYaExisteError cuando el modulo ya tiene una evaluacion", async () => {
      // Arrange
      const dep = crearDependenciasMock();
      dep.moduloRepo.buscarPorId.mockResolvedValue({
        idModulo: 1,
        ...datosModuloValidos(),
      });
      dep.evaluacionRepo.buscarPorModulo.mockResolvedValue({ idEvaluacion: 5 });
      const gestor = new GestorModulos(dep as any);

      // Act
      const intento = gestor.crearEvaluacion(1, {
        titulo: "Evaluacion del modulo",
        preguntas: preguntasDePrueba(1),
        fechaDisponible: new Date("2026-01-01"),
      });

      // Assert
      await expect(intento).rejects.toBeInstanceOf(EvaluacionYaExisteError);
      expect(dep.evaluacionRepo.crear).not.toHaveBeenCalled();
    });
  });
});
