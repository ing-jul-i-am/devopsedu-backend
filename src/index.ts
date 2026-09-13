// src/index.ts
// Punto de arranque de la aplicacion. Lee y valida la configuracion, ensambla las
// dependencias y levanta el servidor HTTP.

import { crearApp } from "./api/app.js";
import { construirDependencias } from "./composicion.js";
import { prismaCliente } from "./infraestructura/prisma-cliente.js";
import { cargarConfiguracion } from "./infraestructura/configuracion.js";
import { logger } from "./infraestructura/logger.js";

const configuracion = cargarConfiguracion();

const dependencias = construirDependencias(prismaCliente, {
  jwtSecreto: configuracion.JWT_SECRET,
  jwtExpiracionSegundos: configuracion.JWT_EXPIRACION_SEGUNDOS,
  rolPorDefecto: configuracion.ROL_POR_DEFECTO,
  rutaDisco: configuracion.SERVIDOR_RUTA_DISCO,
  monitorIntervaloMs: configuracion.MONITOR_INTERVALO_MS,
  corsOrigenes: configuracion.CORS_ORIGENES,
  rutaAlmacenamientoModulos: configuracion.RUTA_ALMACENAMIENTO_MODULOS,
});

const app = crearApp(dependencias);

app.listen(configuracion.PORT, () => {
  logger.info({ evento: "servidor_iniciado", puerto: configuracion.PORT });
  // RF-16/RF-18/RNF-09: inicia la recoleccion periodica de metricas de los servicios activos.
  dependencias.monitor.iniciar();
});

// Garantiza que ningun error escape sin registro, incluso fuera del ciclo de peticion/respuesta.
process.on("uncaughtException", (error) => {
  logger.fatal({ evento: "excepcion_no_capturada", error });
  process.exit(1);
});

process.on("unhandledRejection", (razon) => {
  logger.fatal({ evento: "promesa_rechazada_no_manejada", razon });
  process.exit(1);
});
