// src/infraestructura/logger.ts
// Logger estructurado basado en Pino. En pruebas se silencia por completo para no contaminar
// la salida (CLAUDE.md 6.6). En desarrollo usa formato legible; en produccion, JSON plano.

import pino from "pino";

const entorno = process.env["NODE_ENV"];
const nivel = entorno === "test" ? "silent" : (process.env["LOG_LEVEL"] ?? "info");
const esDesarrollo = entorno !== "production" && entorno !== "test";

export const logger = pino({
  level: nivel,
  ...(esDesarrollo
    ? { transport: { target: "pino-pretty", options: { colorize: true } } }
    : {}),
});
