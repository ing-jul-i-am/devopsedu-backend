// src/api/controladores/servicios/servicios.controlador.ts
// Controladores HTTP de servicios: creacion, edicion, catalogo, panel, detalle y operaciones de
// control (desplegar/detener/reiniciar/eliminar). Delegan la logica a los gestores; requieren
// autenticacion previa (req.usuario).
// Cubre: RF-05, RF-06, RF-07, RF-11, RF-12, RF-13, RF-14, RF-16, RF-17 — CU-03, CU-05

import type { RequestHandler, Request } from "express";
import type { Servicio } from "@prisma/client";
import type { GestorServicios } from "../../../servicios-aplicacion/gestor-servicios.js";
import type { GestorDocker } from "../../../servicios-aplicacion/gestor-docker.js";
import type { ServicioConConfiguraciones } from "../../../repositorios/servicio-repo.js";
import type { UsuarioAutenticado } from "../../tipos/usuario-autenticado.js";
import { TokenInvalidoError } from "../../../dominio/errores/token-invalido-error.js";
import { ServicioNoEncontradoError } from "../../../dominio/errores/servicio-no-encontrado-error.js";
import { CATALOGO_IMAGENES } from "../../../dominio/catalogo-imagenes.js";

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
          volumenes: vigente.volumenes,
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

export function crearControladoresServicios(
  gestorServicios: GestorServicios,
  gestorDocker: GestorDocker
): {
  crear: RequestHandler;
  editarConfiguracion: RequestHandler;
  listarImagenes: RequestHandler;
  listar: RequestHandler;
  detalle: RequestHandler;
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
      const { servicio, registros } = await gestorServicios.obtenerDetalle(
        usuario.idUsuario,
        idServicio
      );
      res.status(200).json({ ...aServicioRespuesta(servicio), registros });
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

  return {
    crear,
    editarConfiguracion,
    listarImagenes,
    listar,
    detalle,
    desplegar: operacion((u, s) => gestorDocker.desplegar(u, s)),
    detener: operacion((u, s) => gestorDocker.detener(u, s)),
    reiniciar: operacion((u, s) => gestorDocker.reiniciar(u, s)),
    eliminar: operacion((u, s) => gestorDocker.eliminar(u, s)),
  };
}
