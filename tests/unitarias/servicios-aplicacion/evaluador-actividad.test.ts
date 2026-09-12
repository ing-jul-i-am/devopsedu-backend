// tests/unitarias/servicios-aplicacion/evaluador-actividad.test.ts
// Cubre: RF-23 — CU-12

import { describe, it, expect, vi } from "vitest";
import { EvaluadorActividad } from "@/servicios-aplicacion/evaluador-actividad.js";

function crearDependenciasMock() {
  return {
    rutaRepo: {
      buscarUltimaPorUsuario: vi.fn(),
    },
    actividadRepo: { listarPorModulo: vi.fn() },
    resultadoRepo: {
      existePorUsuarioYActividad: vi.fn(),
      crearParaActividad: vi.fn(),
    },
    servicioRepo: { buscarPorIdConConfiguracionVigente: vi.fn() },
    registroRepo: { contarPorServicioYOperacion: vi.fn() },
    calculadorProgreso: { recalcular: vi.fn() },
  };
}

function rutaConUnModulo(fechaInicio: Date | null = null) {
  return {
    idRuta: 10,
    idUsuario: 1,
    rutaModulos: [{ idRuta: 10, idModulo: 5, ordenSecuencia: 1, fechaInicio }],
  };
}

function actividad(parciales: Record<string, unknown> = {}) {
  return {
    idActividad: 100,
    descripcion: "Despliega nginx",
    orden: 1,
    idModulo: 5,
    criteriosValidacion: { operacion: "desplegar" },
    ...parciales,
  };
}

function servicioConConfiguracion(config: Record<string, unknown> = {}) {
  return {
    idServicio: 7,
    idUsuario: 1,
    configuraciones: [
      {
        imagenDocker: "nginx",
        cpuAsignado: 1,
        memoriaAsignada: 512,
        almacenamientoAsignado: 1024,
        puertos: [],
        volumenes: [],
        ...config,
      },
    ],
  };
}

describe("EvaluadorActividad.evaluarTrasOperacion", () => {
  it("no hace nada cuando el usuario no tiene ruta asignada", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    dep.rutaRepo.buscarUltimaPorUsuario.mockResolvedValue(null);
    const evaluador = new EvaluadorActividad(dep as any);

    // Act
    await evaluador.evaluarTrasOperacion(1, 7, "desplegar");

    // Assert
    expect(dep.resultadoRepo.crearParaActividad).not.toHaveBeenCalled();
  });

  it("no hace nada cuando ya no quedan actividades pendientes en la ruta", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    dep.rutaRepo.buscarUltimaPorUsuario.mockResolvedValue(rutaConUnModulo());
    dep.actividadRepo.listarPorModulo.mockResolvedValue([actividad()]);
    dep.resultadoRepo.existePorUsuarioYActividad.mockResolvedValue(true);
    const evaluador = new EvaluadorActividad(dep as any);

    // Act
    await evaluador.evaluarTrasOperacion(1, 7, "desplegar");

    // Assert
    expect(dep.resultadoRepo.crearParaActividad).not.toHaveBeenCalled();
  });

  it("no hace nada cuando la operacion no coincide con el criterio de la actividad en curso", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    dep.rutaRepo.buscarUltimaPorUsuario.mockResolvedValue(rutaConUnModulo());
    dep.actividadRepo.listarPorModulo.mockResolvedValue([
      actividad({ criteriosValidacion: { operacion: "detener" } }),
    ]);
    dep.resultadoRepo.existePorUsuarioYActividad.mockResolvedValue(false);
    const evaluador = new EvaluadorActividad(dep as any);

    // Act
    await evaluador.evaluarTrasOperacion(1, 7, "desplegar");

    // Assert
    expect(dep.resultadoRepo.crearParaActividad).not.toHaveBeenCalled();
  });

  it("no hace nada cuando la configuracion del servicio no cumple las condiciones", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    dep.rutaRepo.buscarUltimaPorUsuario.mockResolvedValue(rutaConUnModulo());
    dep.actividadRepo.listarPorModulo.mockResolvedValue([
      actividad({
        criteriosValidacion: {
          operacion: "desplegar",
          condiciones: { imagenDocker: "nginx", volumenesMinimos: 1 },
        },
      }),
    ]);
    dep.resultadoRepo.existePorUsuarioYActividad.mockResolvedValue(false);
    dep.servicioRepo.buscarPorIdConConfiguracionVigente.mockResolvedValue(
      servicioConConfiguracion({ volumenes: [] })
    );
    const evaluador = new EvaluadorActividad(dep as any);

    // Act
    await evaluador.evaluarTrasOperacion(1, 7, "desplegar");

    // Assert
    expect(dep.resultadoRepo.crearParaActividad).not.toHaveBeenCalled();
  });

  it("crea el resultado y actualiza el progreso cuando la operacion y las condiciones coinciden", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    const fechaInicio = new Date(Date.now() - 120_000);
    dep.rutaRepo.buscarUltimaPorUsuario.mockResolvedValue(
      rutaConUnModulo(fechaInicio)
    );
    dep.actividadRepo.listarPorModulo.mockResolvedValue([
      actividad({
        criteriosValidacion: {
          operacion: "desplegar",
          condiciones: { imagenDocker: "nginx", volumenesMinimos: 1 },
        },
      }),
    ]);
    dep.resultadoRepo.existePorUsuarioYActividad.mockResolvedValue(false);
    dep.servicioRepo.buscarPorIdConConfiguracionVigente.mockResolvedValue(
      servicioConConfiguracion({ volumenes: [{ origen: "a", destino: "b", modo: "rw" }] })
    );
    dep.registroRepo.contarPorServicioYOperacion.mockResolvedValue(2);
    const evaluador = new EvaluadorActividad(dep as any);

    // Act
    await evaluador.evaluarTrasOperacion(1, 7, "desplegar");

    // Assert
    expect(dep.resultadoRepo.crearParaActividad).toHaveBeenCalledWith(
      expect.objectContaining({
        idUsuario: 1,
        idActividad: 100,
        puntuacion: 100,
        intentos: 2,
      })
    );
    const llamada = dep.resultadoRepo.crearParaActividad.mock.calls[0]?.[0];
    expect(llamada.tiempoEmpleado).toBeGreaterThanOrEqual(120);
    expect(dep.calculadorProgreso.recalcular).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ idRuta: 10 })
    );
  });

  it("usa tiempoEmpleado 0 cuando el modulo no tiene fecha de inicio registrada", async () => {
    // Arrange
    const dep = crearDependenciasMock();
    dep.rutaRepo.buscarUltimaPorUsuario.mockResolvedValue(rutaConUnModulo(null));
    dep.actividadRepo.listarPorModulo.mockResolvedValue([actividad()]);
    dep.resultadoRepo.existePorUsuarioYActividad.mockResolvedValue(false);
    dep.servicioRepo.buscarPorIdConConfiguracionVigente.mockResolvedValue(
      servicioConConfiguracion()
    );
    dep.registroRepo.contarPorServicioYOperacion.mockResolvedValue(1);
    const evaluador = new EvaluadorActividad(dep as any);

    // Act
    await evaluador.evaluarTrasOperacion(1, 7, "desplegar");

    // Assert
    expect(dep.resultadoRepo.crearParaActividad).toHaveBeenCalledWith(
      expect.objectContaining({ tiempoEmpleado: 0 })
    );
  });
});
