// src/index.ts
// Punto de arranque de la aplicacion. Lee y valida la configuracion, ensambla las
// dependencias y levanta el servidor HTTP.

import { crearApp } from "./api/app.js";
import { construirAutenticador } from "./composicion.js";
import { prismaCliente } from "./infraestructura/prisma-cliente.js";
import { cargarConfiguracion } from "./infraestructura/configuracion.js";
import { logger } from "./infraestructura/logger.js";

const configuracion = cargarConfiguracion();

const autenticador = construirAutenticador(prismaCliente, {
  jwtSecreto: configuracion.JWT_SECRET,
  jwtExpiracionSegundos: configuracion.JWT_EXPIRACION_SEGUNDOS,
  rolPorDefecto: configuracion.ROL_POR_DEFECTO,
});

const app = crearApp({ autenticador });

app.listen(configuracion.PORT, () => {
  logger.info({ evento: "servidor_iniciado", puerto: configuracion.PORT });
});
