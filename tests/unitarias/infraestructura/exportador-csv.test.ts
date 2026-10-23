// tests/unitarias/infraestructura/exportador-csv.test.ts
// Pruebas unitarias del generador de CSV para la exportacion del reporte de progreso.
// Cubre: RF-25 — CU-16 (DT-22)

import { describe, it, expect } from "vitest";
import { ExportadorCsv } from "@/infraestructura/exportador-csv.js";

const BOM = "﻿";

describe("ExportadorCsv", () => {
  const exportador = new ExportadorCsv();

  it("antepone el BOM UTF-8 y separa los registros con CRLF", () => {
    // Act
    const csv = exportador.generar(["a", "b"], [[1, "x"]]).toString("utf8");

    // Assert
    expect(csv).toBe(`${BOM}a,b\r\n1,x\r\n`);
  });

  it("conserva tildes y enies en UTF-8", () => {
    // Act
    const contenido = exportador.generar(["nombre"], [["Ñandú Pérez"]]);

    // Assert
    expect(contenido.toString("utf8")).toBe(`${BOM}nombre\r\nÑandú Pérez\r\n`);
  });

  it("escribe las celdas null como vacias", () => {
    // Act
    const csv = exportador.generar(["a", "b", "c"], [[null, 0, null]]).toString("utf8");

    // Assert
    expect(csv).toBe(`${BOM}a,b,c\r\n,0,\r\n`);
  });

  it("encierra entre comillas las celdas con comas, comillas o saltos de linea", () => {
    // Act
    const csv = exportador
      .generar(["a", "b", "c"], [["Perez, Ana", 'dijo "hola"', "linea 1\nlinea 2"]])
      .toString("utf8");

    // Assert
    expect(csv).toBe(
      `${BOM}a,b,c\r\n"Perez, Ana","dijo ""hola""","linea 1\nlinea 2"\r\n`
    );
  });

  // Los nombres los escribe el propio estudiante al registrarse; una hoja de calculo
  // ejecutaria como formula una celda que empiece con estos caracteres.
  it.each(["=1+1", "+1", "-1", "@SUMA(A1)", "\tTAB", "\rCR"])(
    "neutraliza la formula en la celda de texto %j anteponiendo un apostrofo",
    (valor) => {
      // Act
      const csv = exportador.generar(["a"], [[valor]]).toString("utf8");

      // Assert
      const celda = csv.slice(`${BOM}a\r\n`.length, -"\r\n".length);
      expect(celda.replace(/^"|"$/g, "").startsWith(`'${valor[0]}`)).toBe(true);
    }
  );

  it("no altera los numeros negativos", () => {
    // Act
    const csv = exportador.generar(["a"], [[-5]]).toString("utf8");

    // Assert
    expect(csv).toBe(`${BOM}a\r\n-5\r\n`);
  });

  it("genera solo la cabecera cuando no hay filas", () => {
    // Act
    const csv = exportador.generar(["a", "b"], []).toString("utf8");

    // Assert
    expect(csv).toBe(`${BOM}a,b\r\n`);
  });
});
