// src/infraestructura/exportador-pdf.ts
// Envoltorio sobre pdfkit que genera el PDF del reporte de progreso: encabezado con la fecha de
// generacion y, por estudiante, sus datos, su ruta y una tabla de modulos. Usa la fuente estandar
// Helvetica (WinAnsi), que cubre tildes y enies sin archivos de fuentes (ver
// docs/decisiones-tecnicas.md DT-22).
// Cubre: RF-25 — CU-16

import PDFDocument from "pdfkit";
import type { EstadoModulo } from "../dominio/estado-modulo.js";
import type {
  ReporteEstudiante,
  ReporteModulo,
} from "../dominio/reporte-progreso.js";

const MARGEN = 50;
// Espacio minimo para el encabezado de un estudiante y las primeras filas de su tabla; si no
// alcanza, el estudiante empieza en una pagina nueva en vez de partirse al pie.
const ESPACIO_MINIMO_ESTUDIANTE = 120;

const ETIQUETA_ESTADO: Record<EstadoModulo, string> = {
  completado: "Completado",
  en_progreso: "En progreso",
  sin_iniciar: "Sin iniciar",
};

const COLUMNAS_MODULOS = [
  "#",
  "Modulo",
  "Estado",
  "Actividades",
  "Mejor nota",
  "Intentos",
  "Aprobada",
];

type Documento = InstanceType<typeof PDFDocument>;

export class ExportadorPdf {
  generar(
    reportes: ReporteEstudiante[],
    fechaGeneracion: Date
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: "LETTER",
        margin: MARGEN,
        info: {
          Title: "Reporte de progreso de estudiantes",
          Author: "DevOpsEdu",
          CreationDate: fechaGeneracion,
        },
      });
      const partes: Buffer[] = [];
      doc.on("data", (parte: Buffer) => partes.push(parte));
      doc.on("end", () => resolve(Buffer.concat(partes)));
      doc.on("error", reject);

      escribirEncabezado(doc, reportes.length, fechaGeneracion);
      for (const reporte of reportes) {
        escribirEstudiante(doc, reporte);
      }
      doc.end();
    });
  }
}

function escribirEncabezado(
  doc: Documento,
  totalEstudiantes: number,
  fechaGeneracion: Date
): void {
  doc
    .font("Helvetica-Bold")
    .fontSize(16)
    .text("Reporte de progreso de estudiantes")
    .font("Helvetica")
    .fontSize(10)
    .text(
      `Generado el ${fechaGeneracion.toISOString().slice(0, 16).replace("T", " ")} UTC. ` +
        `Estudiantes: ${totalEstudiantes}.`
    );
  if (totalEstudiantes === 0) {
    doc.moveDown().text("No hay estudiantes registrados.");
  }
}

function escribirEstudiante(doc: Documento, reporte: ReporteEstudiante): void {
  const limiteInferior = doc.page.height - doc.page.margins.bottom;
  if (doc.y + ESPACIO_MINIMO_ESTUDIANTE > limiteInferior) {
    doc.addPage();
  } else {
    doc.moveDown();
  }

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(`${reporte.nombre} (${reporte.correo})`, MARGEN)
    .font("Helvetica")
    .fontSize(10);

  const { ruta } = reporte;
  if (!ruta) {
    doc.text("Sin ruta asignada.", MARGEN);
    return;
  }
  doc.text(
    `Ruta ${ruta.idRuta}, asignada el ${fecha(ruta.fechaAsignacion)} (UTC). ` +
      `Progreso: ${ruta.progreso}%.`,
    MARGEN
  );
  if (ruta.modulos.length === 0) {
    doc.text("La ruta no tiene modulos.", MARGEN);
    return;
  }

  doc.moveDown(0.5).fontSize(9);
  doc.table({
    position: { x: MARGEN },
    columnStyles: [25, "*", 70, 65, 60, 50, 55],
    data: [
      COLUMNAS_MODULOS.map((titulo) => ({
        text: titulo,
        font: { src: "Helvetica-Bold" },
        backgroundColor: "#e8e8e8",
      })),
      ...ruta.modulos.map(aFilaModulo),
    ],
  });
  doc.fontSize(10);
}

function aFilaModulo(modulo: ReporteModulo): string[] {
  const { evaluacion } = modulo;
  return [
    String(modulo.ordenSecuencia),
    modulo.nombre,
    ETIQUETA_ESTADO[modulo.estado],
    `${modulo.actividades.completadas} de ${modulo.actividades.total}`,
    evaluacion?.mejorNota != null ? String(evaluacion.mejorNota) : "-",
    evaluacion ? `${evaluacion.intentos} de ${evaluacion.intentosMaximos}` : "-",
    evaluacion ? (evaluacion.aprobada ? "Si" : "No") : "-",
  ];
}

function fecha(valor: Date): string {
  return valor.toISOString().slice(0, 10);
}
