// src/servicios-aplicacion/gestor-reportes.ts
// Servicio de aplicacion para los reportes de progreso que consulta el docente. Carga los datos
// de todos los estudiantes del reporte con un numero fijo de consultas (sin una por estudiante
// ni por modulo) y delega el calculo en la regla pura de src/dominio/reporte-progreso.ts. Es de
// solo lectura: a diferencia de GET /api/aprendizaje/mi-ruta, no persiste el progreso
// recalculado (ver docs/decisiones-tecnicas.md DT-20). Tambien exporta el reporte en CSV o PDF
// (DT-22).
// Cubre: RF-25 — CU-15, CU-16

import type { UsuarioRepo } from "../repositorios/usuario-repo.js";
import type { RutaAprendizajeRepo } from "../repositorios/ruta-aprendizaje-repo.js";
import type { ActividadRepo } from "../repositorios/actividad-repo.js";
import type { EvaluacionRepo } from "../repositorios/evaluacion-repo.js";
import type { ResultadoRepo } from "../repositorios/resultado-repo.js";
import type { ExportadorCsv } from "../infraestructura/exportador-csv.js";
import type { ExportadorPdf } from "../infraestructura/exportador-pdf.js";
import {
  COLUMNAS_REPORTE,
  aFilasReporte,
  construirReporteEstudiante,
  type ReporteEstudiante,
  type ResultadoEntradaReporte,
} from "../dominio/reporte-progreso.js";
import { UsuarioNoEncontradoError } from "../dominio/errores/usuario-no-encontrado-error.js";
import { logger } from "../infraestructura/logger.js";

const ROL_ESTUDIANTE = "estudiante";

export interface DependenciasGestorReportes {
  usuarioRepo: Pick<UsuarioRepo, "listarPorRol" | "buscarPorIdConRol">;
  rutaRepo: Pick<RutaAprendizajeRepo, "buscarUltimasPorUsuarios">;
  actividadRepo: Pick<ActividadRepo, "listarPorModulos">;
  evaluacionRepo: Pick<EvaluacionRepo, "listarPorModulos">;
  resultadoRepo: Pick<ResultadoRepo, "listarPorUsuarios">;
  exportadorCsv: Pick<ExportadorCsv, "generar">;
  exportadorPdf: Pick<ExportadorPdf, "generar">;
}

export interface FiltroReporte {
  idUsuario?: number;
}

export type FormatoExportacion = "csv" | "pdf";

export interface SolicitudExportacion extends FiltroReporte {
  formato: FormatoExportacion;
}

export interface ArchivoExportado {
  contenido: Buffer;
  tipoContenido: string;
  nombreArchivo: string;
}

const TIPO_CONTENIDO: Record<FormatoExportacion, string> = {
  csv: "text/csv; charset=utf-8",
  pdf: "application/pdf",
};

export class GestorReportes {
  constructor(private readonly dep: DependenciasGestorReportes) {}

  async generarProgreso(filtro: FiltroReporte): Promise<ReporteEstudiante[]> {
    const estudiantes = await this.buscarEstudiantes(filtro);
    if (estudiantes.length === 0) {
      return [];
    }

    const idsUsuario = estudiantes.map((estudiante) => estudiante.idUsuario);
    const rutas = await this.dep.rutaRepo.buscarUltimasPorUsuarios(idsUsuario);
    const idsModulo = [
      ...new Set(
        [...rutas.values()].flatMap((ruta) =>
          ruta.rutaModulos.map((rutaModulo) => rutaModulo.idModulo)
        )
      ),
    ];
    const [actividades, evaluaciones, resultados] = await Promise.all([
      this.dep.actividadRepo.listarPorModulos(idsModulo),
      this.dep.evaluacionRepo.listarPorModulos(idsModulo),
      this.dep.resultadoRepo.listarPorUsuarios(idsUsuario),
    ]);

    const resultadosPorUsuario = new Map<number, ResultadoEntradaReporte[]>();
    for (const resultado of resultados) {
      const propios = resultadosPorUsuario.get(resultado.idUsuario) ?? [];
      propios.push({
        idActividad: resultado.idActividad,
        idEvaluacion: resultado.idEvaluacion,
        puntuacion: Number(resultado.puntuacion),
        fechaFinalizacion: resultado.fechaFinalizacion,
      });
      resultadosPorUsuario.set(resultado.idUsuario, propios);
    }

    return estudiantes.map((estudiante) =>
      construirReporteEstudiante({
        usuario: {
          idUsuario: estudiante.idUsuario,
          nombre: estudiante.nombre,
          correo: estudiante.correo,
          fechaRegistro: estudiante.fechaRegistro,
        },
        ruta: rutas.get(estudiante.idUsuario) ?? null,
        actividades,
        evaluaciones,
        resultados: resultadosPorUsuario.get(estudiante.idUsuario) ?? [],
      })
    );
  }

  // RF-25, CU-16: el CSV lleva una fila por estudiante y modulo; el PDF, una seccion por
  // estudiante. La fecha del nombre del archivo es la de generacion, en UTC.
  async exportarProgreso(
    idDocente: number,
    solicitud: SolicitudExportacion
  ): Promise<ArchivoExportado> {
    const filtro: FiltroReporte =
      solicitud.idUsuario !== undefined ? { idUsuario: solicitud.idUsuario } : {};
    const reportes = await this.generarProgreso(filtro);
    const fechaGeneracion = new Date();

    const contenido =
      solicitud.formato === "csv"
        ? this.dep.exportadorCsv.generar(COLUMNAS_REPORTE, aFilasReporte(reportes))
        : await this.dep.exportadorPdf.generar(reportes, fechaGeneracion);

    // RNF-14, CLAUDE.md 6.6: exportar datos de estudiantes es una operacion administrativa.
    logger.warn({
      evento: "reporte_exportado",
      idDocente,
      formato: solicitud.formato,
      idUsuario: solicitud.idUsuario ?? null,
      estudiantes: reportes.length,
    });

    const alcance =
      solicitud.idUsuario !== undefined ? `estudiante-${solicitud.idUsuario}-` : "";
    return {
      contenido,
      tipoContenido: TIPO_CONTENIDO[solicitud.formato],
      nombreArchivo: `reporte-progreso-${alcance}${fechaGeneracion
        .toISOString()
        .slice(0, 10)}.${solicitud.formato}`,
    };
  }

  // Con filtro, solo se acepta un estudiante: pedir el reporte de un docente se responde igual
  // que un id inexistente, para no revelar que usuarios existen con otro rol.
  private async buscarEstudiantes(filtro: FiltroReporte) {
    if (filtro.idUsuario === undefined) {
      return this.dep.usuarioRepo.listarPorRol(ROL_ESTUDIANTE);
    }
    const usuario = await this.dep.usuarioRepo.buscarPorIdConRol(
      filtro.idUsuario
    );
    if (!usuario || usuario.rol.nombre !== ROL_ESTUDIANTE) {
      throw new UsuarioNoEncontradoError();
    }
    return [usuario];
  }
}
