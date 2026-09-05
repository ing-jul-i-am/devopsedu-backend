// tests/ayudas/ruta-uploads-prueba.ts
// Carpeta exclusiva para los archivos subidos durante las pruebas de integracion, separada de
// la carpeta de subida real (RUTA_ALMACENAMIENTO_MODULOS) para no mezclar datos de prueba con
// datos de desarrollo. Se limpia al finalizar toda la suite (ver setup-global.ts).

import path from "node:path";

export const RUTA_UPLOADS_PRUEBAS = path.resolve(
  process.cwd(),
  "tests-tmp/uploads"
);
