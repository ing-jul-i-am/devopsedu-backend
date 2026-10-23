// tests/unitarias/infraestructura/exportador-pdf.test.ts
// Pruebas unitarias del generador de PDF del reporte de progreso (envoltorio de pdfkit). El
// contenido de las paginas va comprimido, asi que se verifica la estructura del documento: que
// sea un PDF completo y cuantas paginas tiene.
// Cubre: RF-25 — CU-16 (DT-22)

import { describe, it, expect } from "vitest";
import { ExportadorPdf } from "@/infraestructura/exportador-pdf.js";
import { construirReporteEstudiante } from "@/dominio/reporte-progreso.js";
import {
  actividadDeReporte,
  entradaReporteEstudiante,
  evaluacionDeReporte,
  resultadoDeReporte,
} from "../../fixtures/reporte.factory.js";

const FECHA_GENERACION = new Date("2026-10-23T15:30:00.000Z");

function contarPaginas(pdf: Buffer): number {
  return pdf.toString("latin1").match(/\/Type \/Page(?!s)/g)?.length ?? 0;
}

function reporteCompleto(idUsuario: number) {
  return construirReporteEstudiante(
    entradaReporteEstudiante({
      usuario: {
        idUsuario,
        nombre: `Ñandú Pérez ${idUsuario}`,
        correo: `estudiante${idUsuario}@devopsedu.local`,
        fechaRegistro: new Date("2026-01-15"),
      },
      actividades: [actividadDeReporte({ idActividad: 10 })],
      evaluaciones: [evaluacionDeReporte({ idEvaluacion: 7 })],
      resultados: [
        resultadoDeReporte({ idActividad: 10 }),
        resultadoDeReporte({ idEvaluacion: 7, puntuacion: 90 }),
      ],
    })
  );
}

describe("ExportadorPdf", () => {
  const exportador = new ExportadorPdf();

  it("genera un PDF completo con estudiantes con y sin ruta", async () => {
    // Arrange
    const reportes = [
      reporteCompleto(1),
      construirReporteEstudiante(entradaReporteEstudiante({ ruta: null })),
    ];

    // Act
    const pdf = await exportador.generar(reportes, FECHA_GENERACION);

    // Assert
    expect(pdf.subarray(0, 5).toString("latin1")).toBe("%PDF-");
    expect(pdf.subarray(-6).toString("latin1")).toContain("%%EOF");
    expect(contarPaginas(pdf)).toBe(1);
  });

  it("genera una sola pagina cuando no hay estudiantes", async () => {
    // Act
    const pdf = await exportador.generar([], FECHA_GENERACION);

    // Assert
    expect(pdf.subarray(0, 5).toString("latin1")).toBe("%PDF-");
    expect(contarPaginas(pdf)).toBe(1);
  });

  it("genera el PDF cuando la ruta del estudiante no tiene modulos", async () => {
    // Arrange
    const reporte = construirReporteEstudiante(
      entradaReporteEstudiante({
        ruta: { idRuta: 1, fechaAsignacion: new Date("2026-02-01"), rutaModulos: [] },
      })
    );

    // Act
    const pdf = await exportador.generar([reporte], FECHA_GENERACION);

    // Assert
    expect(pdf.subarray(0, 5).toString("latin1")).toBe("%PDF-");
    expect(contarPaginas(pdf)).toBe(1);
  });

  it("agrega paginas cuando los estudiantes no caben en una", async () => {
    // Arrange
    const reportes = Array.from({ length: 30 }, (_, indice) =>
      reporteCompleto(indice + 1)
    );

    // Act
    const pdf = await exportador.generar(reportes, FECHA_GENERACION);

    // Assert
    expect(contarPaginas(pdf)).toBeGreaterThan(1);
  });
});
