// src/infraestructura/exportador-csv.ts
// Generador de CSV sin dependencias externas para la exportacion del reporte de progreso:
// RFC 4180 (coma, CRLF, comillas dobles), con BOM UTF-8 para que las hojas de calculo muestren
// bien tildes y enies, y con neutralizacion de formulas (ver docs/decisiones-tecnicas.md DT-22).
// Cubre: RF-25 — CU-16

export type CeldaCsv = string | number | null;

const BOM = "﻿";
const FIN_DE_REGISTRO = "\r\n";

// Inyeccion de formulas (CSV injection): una celda de texto que empieza con alguno de estos
// caracteres se ejecutaria como formula al abrir el archivo en una hoja de calculo.
const INICIO_DE_FORMULA = /^[=+\-@\t\r]/;
const REQUIERE_COMILLAS = /[",\r\n]/;

export class ExportadorCsv {
  generar(encabezados: readonly string[], filas: CeldaCsv[][]): Buffer {
    const registros = [encabezados, ...filas].map((registro) =>
      registro.map(formatearCelda).join(",")
    );
    return Buffer.from(
      BOM + registros.join(FIN_DE_REGISTRO) + FIN_DE_REGISTRO,
      "utf8"
    );
  }
}

function formatearCelda(celda: CeldaCsv): string {
  if (celda === null) {
    return "";
  }
  if (typeof celda === "number") {
    return String(celda);
  }
  const segura = INICIO_DE_FORMULA.test(celda) ? `'${celda}` : celda;
  return REQUIERE_COMILLAS.test(segura)
    ? `"${segura.replace(/"/g, '""')}"`
    : segura;
}
