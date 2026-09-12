// src/servicios-aplicacion/evaluador-actividad.ts
// Servicio de aplicacion que evalua automaticamente el cumplimiento de las actividades
// practicas de un modulo, tras cada operacion exitosa que el estudiante ejecuta sobre uno de
// sus servicios. Cubre: RF-23 — CU-12 (ver docs/decisiones-tecnicas.md DT-10)

import type { Actividad, RutaModulo } from "@prisma/client";
import type {
  RutaAprendizajeRepo,
  RutaAprendizajeConModulos,
} from "../repositorios/ruta-aprendizaje-repo.js";
import type { ActividadRepo } from "../repositorios/actividad-repo.js";
import type { ResultadoRepo } from "../repositorios/resultado-repo.js";
import type {
  ServicioRepo,
  ServicioConConfiguraciones,
} from "../repositorios/servicio-repo.js";
import type { RegistroDespliegueRepo } from "../repositorios/registro-despliegue-repo.js";
import type {
  CriteriosValidacion,
  CondicionesValidacion,
} from "../dominio/modelos/criterios-validacion.js";

export interface DependenciasEvaluadorActividad {
  rutaRepo: Pick<
    RutaAprendizajeRepo,
    "buscarUltimaPorUsuario" | "actualizarProgreso"
  >;
  actividadRepo: Pick<ActividadRepo, "listarPorModulo">;
  resultadoRepo: Pick<
    ResultadoRepo,
    | "existePorUsuarioYActividad"
    | "crearParaActividad"
    | "contarActividadesCompletadasEnRuta"
  >;
  servicioRepo: Pick<ServicioRepo, "buscarPorIdConConfiguracionVigente">;
  registroRepo: Pick<RegistroDespliegueRepo, "contarPorServicioYOperacion">;
}

type ConfiguracionVigente = ServicioConConfiguraciones["configuraciones"][number];

export class EvaluadorActividad {
  constructor(private readonly dep: DependenciasEvaluadorActividad) {}

  async evaluarTrasOperacion(
    idUsuario: number,
    idServicio: number,
    operacion: string
  ): Promise<void> {
    const ruta = await this.dep.rutaRepo.buscarUltimaPorUsuario(idUsuario);
    if (!ruta) {
      return;
    }

    const actividadesPorModulo = await this.cargarActividadesPorModulo(ruta);
    const enCurso = await this.buscarActividadEnCurso(
      idUsuario,
      ruta,
      actividadesPorModulo
    );
    if (!enCurso) {
      return;
    }

    const criterios =
      enCurso.actividad.criteriosValidacion as unknown as CriteriosValidacion;
    if (criterios.operacion !== operacion) {
      return;
    }

    const servicio =
      await this.dep.servicioRepo.buscarPorIdConConfiguracionVigente(
        idServicio
      );
    const config = servicio?.configuraciones[0];
    if (!config || !this.cumpleCondiciones(criterios.condiciones, config)) {
      return;
    }

    const intentos = await this.dep.registroRepo.contarPorServicioYOperacion(
      idServicio,
      operacion
    );
    const tiempoEmpleado = enCurso.modulo.fechaInicio
      ? Math.max(
          0,
          Math.floor(
            (Date.now() - enCurso.modulo.fechaInicio.getTime()) / 1000
          )
        )
      : 0;

    await this.dep.resultadoRepo.crearParaActividad({
      idUsuario,
      idActividad: enCurso.actividad.idActividad,
      puntuacion: 100,
      tiempoEmpleado,
      intentos,
    });

    await this.actualizarProgreso(idUsuario, ruta, actividadesPorModulo);
  }

  private async cargarActividadesPorModulo(
    ruta: RutaAprendizajeConModulos
  ): Promise<Actividad[][]> {
    const actividadesPorModulo: Actividad[][] = [];
    for (const rutaModulo of ruta.rutaModulos) {
      actividadesPorModulo.push(
        await this.dep.actividadRepo.listarPorModulo(rutaModulo.idModulo)
      );
    }
    return actividadesPorModulo;
  }

  private async buscarActividadEnCurso(
    idUsuario: number,
    ruta: RutaAprendizajeConModulos,
    actividadesPorModulo: Actividad[][]
  ): Promise<{ actividad: Actividad; modulo: RutaModulo } | undefined> {
    for (let i = 0; i < ruta.rutaModulos.length; i++) {
      const modulo = ruta.rutaModulos[i];
      const actividades = actividadesPorModulo[i];
      if (!modulo || !actividades) {
        continue;
      }
      for (const actividad of actividades) {
        const completada = await this.dep.resultadoRepo.existePorUsuarioYActividad(
          idUsuario,
          actividad.idActividad
        );
        if (!completada) {
          return { actividad, modulo };
        }
      }
    }
    return undefined;
  }

  private cumpleCondiciones(
    condiciones: CondicionesValidacion | undefined,
    config: ConfiguracionVigente
  ): boolean {
    if (!condiciones) {
      return true;
    }
    if (
      condiciones.imagenDocker !== undefined &&
      config.imagenDocker !== condiciones.imagenDocker
    ) {
      return false;
    }
    if (
      condiciones.volumenesMinimos !== undefined &&
      this.longitudDe(config.volumenes) < condiciones.volumenesMinimos
    ) {
      return false;
    }
    if (
      condiciones.puertosMinimos !== undefined &&
      this.longitudDe(config.puertos) < condiciones.puertosMinimos
    ) {
      return false;
    }
    if (
      condiciones.cpuMinimo !== undefined &&
      Number(config.cpuAsignado) < condiciones.cpuMinimo
    ) {
      return false;
    }
    if (
      condiciones.memoriaMinima !== undefined &&
      config.memoriaAsignada < condiciones.memoriaMinima
    ) {
      return false;
    }
    return true;
  }

  private longitudDe(valor: unknown): number {
    return Array.isArray(valor) ? valor.length : 0;
  }

  private async actualizarProgreso(
    idUsuario: number,
    ruta: RutaAprendizajeConModulos,
    actividadesPorModulo: Actividad[][]
  ): Promise<void> {
    const idsActividad = actividadesPorModulo
      .flat()
      .map((actividad) => actividad.idActividad);
    const completadas =
      await this.dep.resultadoRepo.contarActividadesCompletadasEnRuta(
        idUsuario,
        idsActividad
      );
    const progreso =
      idsActividad.length === 0
        ? 0
        : Math.round((completadas / idsActividad.length) * 10000) / 100;
    await this.dep.rutaRepo.actualizarProgreso(ruta.idRuta, progreso);
  }
}
