// src/api/controladores/servicios/servicios.controlador.ts
// Controladores HTTP de servicios: creacion, edicion, catalogo, panel, detalle y operaciones de
// control (desplegar/detener/reiniciar/eliminar). Delegan la logica a los gestores; requieren
// autenticacion previa (req.usuario).
// Desplegar y eliminar informan ademas si hubo recreacion y que volumenes se perdieron, para que
// el frontend pueda advertirlo (ver docs/decisiones-tecnicas.md DT-15).
// Cubre: RF-05, RF-06, RF-07, RF-08, RF-11, RF-12, RF-13, RF-14, RF-16, RF-17 — CU-03, CU-05

import type { RequestHandler, Request } from "express";
import type { Servicio, Metrica } from "@prisma/client";
import type { GestorServicios } from "../../../servicios-aplicacion/gestor-servicios.js";
import type {
  GestorDocker,
  ResultadoOperacionDocker,
} from "../../../servicios-aplicacion/gestor-docker.js";
import type { ServicioConConfiguraciones } from "../../../repositorios/servicio-repo.js";
import type { UsuarioAutenticado } from "../../tipos/usuario-autenticado.js";
import { TokenInvalidoError } from "../../../dominio/errores/token-invalido-error.js";
import { ServicioNoEncontradoError } from "../../../dominio/errores/servicio-no-encontrado-error.js";
import { CATALOGO_IMAGENES } from "../../../dominio/catalogo-imagenes.js";
import { clasificarVolumen } from "../../../dominio/tipo-volumen.js";
import { metricasQuerySchema } from "../../validadores/servicios/metricas.validador.js";

function usuarioDe(req: Request): UsuarioAutenticado {
  if (!req.usuario) {
    throw new TokenInvalidoError();
  }
  return req.usuario;
}

function idServicioDe(req: Request): number {
  const id = Number(req.params["idServicio"]);
  if (!Number.isInteger(id)) {
    throw new ServicioNoEncontradoError();
  }
  return id;
}

// El tipo de volumen es un campo derivado de solo lectura: se calcula al responder en lugar de
// persistirse, de modo que las configuraciones guardadas antes de DT-15 tambien lo traen. Permite
// al frontend advertir que al recrear el contenedor se pierden los volumenes no-bind.
function aVolumenesRespuesta(volumenes: unknown) {
  if (!Array.isArray(volumenes)) {
    return volumenes;
  }
  return volumenes.map((volumen) => {
    const origen = (volumen as { origen?: unknown }).origen;
    if (typeof origen !== "string") {
      return volumen;
    }
    return { ...(volumen as object), tipo: clasificarVolumen(origen) };
  });
}

function aServicioRespuesta(servicio: ServicioConConfiguraciones) {
  const vigente = servicio.configuraciones[0];
  return {
    idServicio: servicio.idServicio,
    nombre: servicio.nombre,
    descripcion: servicio.descripcion,
    estado: servicio.estado,
    fechaCreacion: servicio.fechaCreacion,
    configuracion: vigente
      ? {
          imagenDocker: vigente.imagenDocker,
          cpuAsignado: Number(vigente.cpuAsignado),
          memoriaAsignada: vigente.memoriaAsignada,
          almacenamientoAsignado: vigente.almacenamientoAsignado,
          puertos: vigente.puertos,
          variablesEntorno: vigente.variablesEntorno,
          volumenes: aVolumenesRespuesta(vigente.volumenes),
        }
      : null,
  };
}

function aServicioBasico(servicio: Servicio) {
  return {
    idServicio: servicio.idServicio,
    nombre: servicio.nombre,
    estado: servicio.estado,
  };
}

// idMetrica es BigInt y consumoCpu es Decimal: se convierten a number para poder serializar a
// JSON (JSON.stringify no admite BigInt).
function aMetricaRespuesta(metrica: Metrica) {
  return {
    idMetrica: Number(metrica.idMetrica),
    consumoCpu: Number(metrica.consumoCpu),
    consumoMemoria: metrica.consumoMemoria,
    estadoEjecucion: metrica.estadoEjecucion,
    marcaTiempo: metrica.marcaTiempo,
  };
}

export function crearControladoresServicios(
  gestorServicios: GestorServicios,
  gestorDocker: GestorDocker
): {
  crear: RequestHandler;
  editarConfiguracion: RequestHandler;
  listarImagenes: RequestHandler;
  listar: RequestHandler;
  detalle: RequestHandler;
  metricas: RequestHandler;
  desplegar: RequestHandler;
  detener: RequestHandler;
  reiniciar: RequestHandler;
  eliminar: RequestHandler;
} {
  const listarImagenes: RequestHandler = (_req, res) => {
    res.status(200).json(CATALOGO_IMAGENES);
  };

  const crear: RequestHandler = async (req, res, next) => {
    try {
      const usuario = usuarioDe(req);
      const servicio = await gestorServicios.crearServicio(
        usuario.idUsuario,
        req.body
      );
      res.status(201).json(aServicioRespuesta(servicio));
    } catch (error) {
      next(error);
    }
  };

  const editarConfiguracion: RequestHandler = async (req, res, next) => {
    try {
      const usuario = usuarioDe(req);
      const idServicio = idServicioDe(req);
      const servicio = await gestorServicios.editarConfiguracion(
        usuario.idUsuario,
        idServicio,
        req.body.configuracion
      );
      res.status(200).json(aServicioRespuesta(servicio));
    } catch (error) {
      next(error);
    }
  };

  const listar: RequestHandler = async (req, res, next) => {
    try {
      const usuario = usuarioDe(req);
      const servicios = await gestorServicios.listarPanel(usuario.idUsuario);
      res.status(200).json(servicios.map(aServicioRespuesta));
    } catch (error) {
      next(error);
    }
  };

  const detalle: RequestHandler = async (req, res, next) => {
    try {
      const usuario = usuarioDe(req);
      const idServicio = idServicioDe(req);
      // DT-17: el detalle agrega los volumenes realmente montados, que es lo unico exacto para
      // advertir al estudiante antes de confirmar un despliegue o una eliminacion. La consulta a
      // Docker la mantiene GestorDocker, porque GestorServicios no habla con el motor; ambas van
      // en paralelo para no sumar latencia.
      const [{ servicio, registros }, contenedor] = await Promise.all([
        gestorServicios.obtenerDetalle(usuario.idUsuario, idServicio),
        gestorDocker.consultarMontajes(usuario.idUsuario, idServicio),
      ]);
      res
        .status(200)
        .json({ ...aServicioRespuesta(servicio), contenedor, registros });
    } catch (error) {
      next(error);
    }
  };

  const metricas: RequestHandler = async (req, res, next) => {
    try {
      const usuario = usuarioDe(req);
      const idServicio = idServicioDe(req);
      const query = metricasQuerySchema.safeParse(req.query);
      if (!query.success) {
        res.status(400).json({ error: "Parametros de consulta invalidos" });
        return;
      }
      const resultado = await gestorServicios.obtenerMetricas(
        usuario.idUsuario,
        idServicio,
        {
          ...(query.data.desde ? { desde: query.data.desde } : {}),
          ...(query.data.hasta ? { hasta: query.data.hasta } : {}),
        }
      );
      res.status(200).json(resultado.map(aMetricaRespuesta));
    } catch (error) {
      next(error);
    }
  };

  const operacion = (
    accion: (idUsuario: number, idServicio: number) => Promise<Servicio>
  ): RequestHandler => {
    return async (req, res, next) => {
      try {
        const usuario = usuarioDe(req);
        const idServicio = idServicioDe(req);
        const servicio = await accion(usuario.idUsuario, idServicio);
        res.status(200).json(aServicioBasico(servicio));
      } catch (error) {
        next(error);
      }
    };
  };

  // Desplegar y eliminar retiran el contenedor anterior, asi que informan ademas si hubo
  // recreacion y que volumenes se destruyeron o se omitieron por estar en uso (DT-15).
  const operacionConLimpieza = (
    accion: (
      idUsuario: number,
      idServicio: number
    ) => Promise<ResultadoOperacionDocker>
  ): RequestHandler => {
    return async (req, res, next) => {
      try {
        const usuario = usuarioDe(req);
        const idServicio = idServicioDe(req);
        const resultado = await accion(usuario.idUsuario, idServicio);
        res.status(200).json({
          ...aServicioBasico(resultado.servicio),
          recreado: resultado.recreado,
          volumenesEliminados: resultado.volumenesEliminados,
          volumenesOmitidos: resultado.volumenesOmitidos,
        });
      } catch (error) {
        next(error);
      }
    };
  };

  return {
    crear,
    editarConfiguracion,
    listarImagenes,
    listar,
    detalle,
    metricas,
    desplegar: operacionConLimpieza((u, s) => gestorDocker.desplegar(u, s)),
    detener: operacion((u, s) => gestorDocker.detener(u, s)),
    reiniciar: operacion((u, s) => gestorDocker.reiniciar(u, s)),
    eliminar: operacionConLimpieza((u, s) => gestorDocker.eliminar(u, s)),
  };
}
