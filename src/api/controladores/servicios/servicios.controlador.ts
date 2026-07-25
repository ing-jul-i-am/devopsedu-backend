// src/api/controladores/servicios/servicios.controlador.ts
// Controladores HTTP de servicios. Delegan la logica al GestorServicios y el manejo de errores
// al middleware global. Requieren autenticacion previa (req.usuario).
// Cubre: RF-05, RF-06 — CU-03

import type { RequestHandler } from "express";
import type { GestorServicios } from "../../../servicios-aplicacion/gestor-servicios.js";
import type { ServicioConConfiguraciones } from "../../../repositorios/servicio-repo.js";
import { TokenInvalidoError } from "../../../dominio/errores/token-invalido-error.js";

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

export function crearControladoresServicios(gestor: GestorServicios): {
  crear: RequestHandler;
} {
  const crear: RequestHandler = async (req, res, next) => {
    try {
      const usuario = req.usuario;
      if (!usuario) {
        throw new TokenInvalidoError();
      }
      const servicio = await gestor.crearServicio(usuario.idUsuario, req.body);
      res.status(201).json(aServicioRespuesta(servicio));
    } catch (error) {
      next(error);
    }
  };

  return { crear };
}
