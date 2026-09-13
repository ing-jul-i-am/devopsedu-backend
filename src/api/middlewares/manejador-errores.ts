// src/api/middlewares/manejador-errores.ts
// Middleware global de errores: traduce las clases de error de dominio a codigos HTTP y
// registra los eventos relevantes (RNF-14). Nunca expone trazas internas al cliente (RNF-12).

import type { ErrorRequestHandler } from "express";
import { CredencialesInvalidasError } from "../../dominio/errores/credenciales-invalidas-error.js";
import { CorreoYaRegistradoError } from "../../dominio/errores/correo-ya-registrado-error.js";
import { TokenInvalidoError } from "../../dominio/errores/token-invalido-error.js";
import { PermisoDenegadoError } from "../../dominio/errores/permiso-denegado-error.js";
import { RolNoDisponibleError } from "../../dominio/errores/rol-no-disponible-error.js";
import { RecursosInsuficientesError } from "../../dominio/errores/recursos-insuficientes-error.js";
import { ServicioNoEncontradoError } from "../../dominio/errores/servicio-no-encontrado-error.js";
import { ModuloNoEncontradoError } from "../../dominio/errores/modulo-no-encontrado-error.js";
import { ModuloNoAsignadoError } from "../../dominio/errores/modulo-no-asignado-error.js";
import { UsuarioNoEncontradoError } from "../../dominio/errores/usuario-no-encontrado-error.js";
import { TransicionInvalidaError } from "../../dominio/errores/transicion-invalida-error.js";
import { ImagenDockerNoDisponibleError } from "../../dominio/errores/imagen-docker-no-disponible-error.js";
import { NombreContenedorEnUsoError } from "../../dominio/errores/nombre-contenedor-en-uso-error.js";
import { ContenedorNoEncontradoError } from "../../dominio/errores/contenedor-no-encontrado-error.js";
import { MotorDockerNoDisponibleError } from "../../dominio/errores/motor-docker-no-disponible-error.js";
import { TipoArchivoNoPermitidoError } from "../../dominio/errores/tipo-archivo-no-permitido-error.js";
import { ArchivoDemasiadoGrandeError } from "../../dominio/errores/archivo-demasiado-grande-error.js";
import { ArchivoNoProporcionadoError } from "../../dominio/errores/archivo-no-proporcionado-error.js";
import { EvaluacionNoEncontradaError } from "../../dominio/errores/evaluacion-no-encontrada-error.js";
import { EvaluacionYaExisteError } from "../../dominio/errores/evaluacion-ya-existe-error.js";
import { EvaluacionNoDisponibleError } from "../../dominio/errores/evaluacion-no-disponible-error.js";
import { RespuestasIncompletasError } from "../../dominio/errores/respuestas-incompletas-error.js";
import { IntentosAgotadosError } from "../../dominio/errores/intentos-agotados-error.js";
import { EvaluacionYaAprobadaError } from "../../dominio/errores/evaluacion-ya-aprobada-error.js";
import { logger } from "../../infraestructura/logger.js";

export const manejadorErrores: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof CredencialesInvalidasError) {
    logger.warn({ evento: "intento_login_fallido", ruta: req.path });
    res.status(401).json({ error: err.message });
    return;
  }

  if (err instanceof TokenInvalidoError) {
    logger.warn({ evento: "token_invalido", ruta: req.path });
    res.status(401).json({ error: err.message });
    return;
  }

  if (err instanceof PermisoDenegadoError) {
    logger.warn({ evento: "acceso_no_autorizado", ruta: req.path });
    res.status(403).json({ error: err.message });
    return;
  }

  if (
    err instanceof ServicioNoEncontradoError ||
    err instanceof ModuloNoEncontradoError ||
    err instanceof ModuloNoAsignadoError ||
    err instanceof UsuarioNoEncontradoError ||
    err instanceof EvaluacionNoEncontradaError
  ) {
    logger.warn({
      evento: "recurso_no_encontrado",
      tipo: err.constructor.name,
      ruta: req.path,
    });
    res.status(404).json({ error: err.message });
    return;
  }

  if (
    err instanceof CorreoYaRegistradoError ||
    err instanceof EvaluacionYaExisteError ||
    err instanceof IntentosAgotadosError ||
    err instanceof EvaluacionYaAprobadaError
  ) {
    logger.warn({
      evento: "conflicto_estado",
      tipo: err.constructor.name,
      ruta: req.path,
    });
    res.status(409).json({ error: err.message });
    return;
  }

  if (err instanceof RecursosInsuficientesError) {
    // RF-09: se informa al usuario los valores solicitados y los disponibles.
    logger.warn({
      evento: "recursos_insuficientes",
      ruta: req.path,
      solicitado: err.solicitado,
      disponible: err.disponible,
    });
    res.status(422).json({
      error: err.message,
      solicitado: err.solicitado,
      disponible: err.disponible,
    });
    return;
  }

  if (
    err instanceof ImagenDockerNoDisponibleError ||
    err instanceof EvaluacionNoDisponibleError
  ) {
    logger.warn({
      evento: "recurso_no_disponible",
      tipo: err.constructor.name,
      ruta: req.path,
    });
    res.status(422).json({ error: err.message });
    return;
  }

  if (
    err instanceof TransicionInvalidaError ||
    err instanceof NombreContenedorEnUsoError
  ) {
    logger.warn({
      evento: "transicion_rechazada",
      tipo: err.constructor.name,
      ruta: req.path,
    });
    res.status(409).json({ error: err.message });
    return;
  }

  if (err instanceof RespuestasIncompletasError) {
    logger.warn({ evento: "respuestas_incompletas", ruta: req.path });
    res.status(400).json({ error: err.message });
    return;
  }

  if (err instanceof ContenedorNoEncontradoError) {
    logger.warn({ evento: "contenedor_no_encontrado", ruta: req.path });
    res.status(404).json({ error: err.message });
    return;
  }

  if (err instanceof MotorDockerNoDisponibleError) {
    logger.error({ evento: "motor_docker_no_disponible" });
    res.status(503).json({ error: err.message });
    return;
  }

  if (
    err instanceof TipoArchivoNoPermitidoError ||
    err instanceof ArchivoDemasiadoGrandeError
  ) {
    logger.warn({ evento: "subida_archivo_rechazada", ruta: req.path });
    res.status(400).json({ error: err.message });
    return;
  }

  if (err instanceof ArchivoNoProporcionadoError) {
    logger.warn({ evento: "archivo_no_proporcionado", ruta: req.path });
    res.status(400).json({ error: err.message });
    return;
  }

  if (err instanceof RolNoDisponibleError) {
    logger.error({ evento: "rol_por_defecto_ausente", detalle: err.message });
    res.status(500).json({ error: "Error interno del servidor" });
    return;
  }

  logger.error({ evento: "error_no_controlado", err });
  res.status(500).json({ error: "Error interno del servidor" });
};
