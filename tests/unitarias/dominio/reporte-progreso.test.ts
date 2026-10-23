// tests/unitarias/dominio/reporte-progreso.test.ts
// Pruebas unitarias del calculo puro del reporte de progreso por estudiante.
// Cubre: RF-25 — CU-15

import { describe, it, expect } from "vitest";
import {
  construirReporteEstudiante,
  resumirEvaluacion,
  resumirRuta,
} from "@/dominio/reporte-progreso.js";
import {
  actividadDeReporte,
  entradaReporteEstudiante,
  evaluacionDeReporte,
  resultadoDeReporte,
  rutaModuloDeReporte,
} from "../../fixtures/reporte.factory.js";

describe("resumirEvaluacion", () => {
  it("toma la mejor nota, cuenta los intentos y marca aprobada si supera el umbral", () => {
    // Act
    const resumen = resumirEvaluacion(evaluacionDeReporte(), [55, 80]);

    // Assert
    expect(resumen).toEqual({
      idEvaluacion: 1,
      titulo: "Evaluacion del modulo",
      mejorNota: 80,
      intentos: 2,
      intentosMaximos: 2,
      aprobada: true,
    });
  });

  it("aprueba cuando la mejor nota es exactamente el umbral", () => {
    // Act
    const resumen = resumirEvaluacion(evaluacionDeReporte(), [70]);

    // Assert
    expect(resumen.aprobada).toBe(true);
  });

  it("no aprueba cuando ninguna nota alcanza el umbral", () => {
    // Act
    const resumen = resumirEvaluacion(evaluacionDeReporte(), [40, 69.99]);

    // Assert
    expect(resumen.mejorNota).toBe(69.99);
    expect(resumen.aprobada).toBe(false);
  });

  it("deja la nota en null y cero intentos cuando aun no la presenta", () => {
    // Act
    const resumen = resumirEvaluacion(evaluacionDeReporte(), []);

    // Assert
    expect(resumen.mejorNota).toBeNull();
    expect(resumen.intentos).toBe(0);
    expect(resumen.aprobada).toBe(false);
  });
});

describe("construirReporteEstudiante", () => {
  it("devuelve ruta null cuando el estudiante no tiene ruta asignada", () => {
    // Arrange
    const entrada = entradaReporteEstudiante({ ruta: null });

    // Act
    const reporte = construirReporteEstudiante(entrada);

    // Assert
    expect(reporte).toEqual({
      idUsuario: 1,
      nombre: "Ana Estudiante",
      correo: "ana@devopsedu.local",
      fechaRegistro: new Date("2026-01-15"),
      ruta: null,
    });
  });

  it("marca las actividades completadas con la fecha de su primer resultado", () => {
    // Arrange
    const entrada = entradaReporteEstudiante({
      actividades: [
        actividadDeReporte({ idActividad: 10 }),
        actividadDeReporte({ idActividad: 11, descripcion: "Detiene el servicio" }),
      ],
      resultados: [
        resultadoDeReporte({
          idActividad: 10,
          fechaFinalizacion: new Date("2026-03-05"),
        }),
        resultadoDeReporte({
          idActividad: 10,
          fechaFinalizacion: new Date("2026-03-03"),
        }),
      ],
    });

    // Act
    const modulo = construirReporteEstudiante(entrada).ruta?.modulos[0];

    // Assert
    expect(modulo?.actividades).toEqual({
      completadas: 1,
      total: 2,
      detalle: [
        {
          idActividad: 10,
          descripcion: "Despliega un servicio con Docker",
          fechaCompletada: new Date("2026-03-03"),
        },
        {
          idActividad: 11,
          descripcion: "Detiene el servicio",
          fechaCompletada: null,
        },
      ],
    });
  });

  it("resume la evaluacion del modulo con los intentos del estudiante", () => {
    // Arrange
    const entrada = entradaReporteEstudiante({
      evaluaciones: [evaluacionDeReporte({ idEvaluacion: 7 })],
      resultados: [
        resultadoDeReporte({ idEvaluacion: 7, puntuacion: 50 }),
        resultadoDeReporte({ idEvaluacion: 7, puntuacion: 90 }),
      ],
    });

    // Act
    const modulo = construirReporteEstudiante(entrada).ruta?.modulos[0];

    // Assert
    expect(modulo?.evaluacion).toMatchObject({
      idEvaluacion: 7,
      mejorNota: 90,
      intentos: 2,
      aprobada: true,
    });
  });

  it("deja la evaluacion en null cuando el modulo no tiene evaluacion", () => {
    // Act
    const modulo = construirReporteEstudiante(entradaReporteEstudiante()).ruta
      ?.modulos[0];

    // Assert
    expect(modulo?.evaluacion).toBeNull();
  });

  it("calcula el estado de cada modulo y el progreso de la ruta con las reglas de mi-ruta", () => {
    // Arrange
    const entrada = entradaReporteEstudiante({
      ruta: {
        idRuta: 3,
        fechaAsignacion: new Date("2026-02-01"),
        rutaModulos: [
          rutaModuloDeReporte({ idModulo: 1, ordenSecuencia: 1 }),
          rutaModuloDeReporte({
            idModulo: 2,
            ordenSecuencia: 2,
            modulo: { nombre: "Redes en Docker" },
          }),
          rutaModuloDeReporte({
            idModulo: 3,
            ordenSecuencia: 3,
            fechaInicio: null,
          }),
        ],
      },
      actividades: [actividadDeReporte({ idActividad: 20, idModulo: 2 })],
      evaluaciones: [evaluacionDeReporte({ idEvaluacion: 8, idModulo: 1 })],
      resultados: [resultadoDeReporte({ idEvaluacion: 8, puntuacion: 75 })],
    });

    // Act
    const ruta = construirReporteEstudiante(entrada).ruta;

    // Assert
    expect(ruta?.idRuta).toBe(3);
    expect(ruta?.modulos.map((m) => [m.idModulo, m.nombre, m.estado])).toEqual([
      [1, "Introduccion a contenedores", "completado"],
      [2, "Redes en Docker", "en_progreso"],
      [3, "Introduccion a contenedores", "sin_iniciar"],
    ]);
    expect(ruta?.progreso).toBe(33.33);
  });

  it("ignora actividades, evaluaciones y resultados de modulos que no estan en la ruta", () => {
    // Arrange
    const entrada = entradaReporteEstudiante({
      actividades: [actividadDeReporte({ idActividad: 30, idModulo: 99 })],
      evaluaciones: [evaluacionDeReporte({ idEvaluacion: 9, idModulo: 99 })],
      resultados: [
        resultadoDeReporte({ idActividad: 30 }),
        resultadoDeReporte({ idEvaluacion: 9 }),
      ],
    });

    // Act
    const modulo = construirReporteEstudiante(entrada).ruta?.modulos[0];

    // Assert
    expect(modulo?.actividades.total).toBe(0);
    expect(modulo?.evaluacion).toBeNull();
    expect(modulo?.estado).toBe("completado");
  });
});

// RF-25: resumen ligero de la ruta para el listado de estudiantes del docente (CU-15).
describe("resumirRuta", () => {
  it("cuenta los modulos completados sobre el total de la ruta", () => {
    // Arrange
    const reporte = construirReporteEstudiante(
      entradaReporteEstudiante({
        ruta: {
          idRuta: 3,
          fechaAsignacion: new Date("2026-02-01"),
          rutaModulos: [
            rutaModuloDeReporte({ idModulo: 1 }),
            rutaModuloDeReporte({ idModulo: 2, fechaInicio: null }),
          ],
        },
      })
    );

    // Act
    const resumen = resumirRuta(reporte.ruta);

    // Assert
    expect(resumen).toEqual({
      idRuta: 3,
      fechaAsignacion: new Date("2026-02-01"),
      progreso: 50,
      totalModulos: 2,
      modulosCompletados: 1,
    });
  });

  it("devuelve null cuando el estudiante no tiene ruta", () => {
    // Act
    const resumen = resumirRuta(null);

    // Assert
    expect(resumen).toBeNull();
  });
});
