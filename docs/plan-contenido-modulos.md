# Plan: contenido enriquecido en módulos de aprendizaje (RF-20, CU-10)

## Contexto

Hoy el docente solo puede definir un módulo con `nombre`, `contenidoTeorico` (texto plano) y `orden`. Esto limita el material didáctico a texto sin formato, sin posibilidad de imágenes, texto enriquecido (Markdown) o enlaces de referencia. El objetivo de este cambio es ampliar el modelo de `Modulo` para soportar contenido estructurado en bloques (texto, imagen, enlace), incluyendo un endpoint para que el docente suba archivos de imagen al servidor.

**Alcance:** solo gestión docente (`/api/modulos`). No se toca la exposición de módulos al estudiante (`aprendizaje.controlador.ts`, `rutas.controlador.ts` quedan intactos) — queda para una sesión futura.

Decisiones tomadas:
- Contenido modelado como **arreglo ordenado de bloques** en un campo `Json` (mismo patrón que `ConfiguracionServicio.puertos` en `src/repositorios/servicio-repo.ts`). El orden del arreglo es el orden de lectura.
- Tres tipos de bloque: **texto** (Markdown), **imagen** (URL + alt opcional), **enlace** (URL + título + descripción opcional).
- Imágenes: **subida real de archivo al servidor** (no solo URL externa), vía nuevo endpoint `POST /api/modulos/imagenes`. Requiere agregar `multer` como dependencia nueva (justificada: es el middleware estándar de facto para `multipart/form-data` en Express, evita reimplementar parsing de streams a mano).
- Reemplazo limpio de `contenidoTeorico` por `contenido Json` en el schema (sin migración de datos: es un prototipo académico, sin seed ni filas garantizadas).

## Diseño frontend (referencia, no se implementa en este backend)

- **Docente**: editor con lista ordenable de bloques; cada uno con selector de tipo. Bloque texto = textarea en Markdown con vista previa; bloque imagen = botón que sube el archivo a `/api/modulos/imagenes` y guarda la URL devuelta; bloque enlace = inputs de título/URL. Al guardar, se envía el arreglo como campo `contenido`.
- **Estudiante** (futuro): recorre `contenido` y hace switch por `tipo` — Markdown renderizado, `<img>`, o `<a>`.

## Cambios por capa

### 1. Esquema Prisma (`prisma/schema.prisma:151-162`)
```prisma
model Modulo {
  idModulo   Int    @id @default(autoincrement()) @map("id_modulo")
  nombre     String @db.VarChar(160)
  contenido  Json
  orden      Int

  rutaModulos RutaModulo[]
  actividades Actividad[]
  evaluacion  Evaluacion?

  @@map("modulo")
}
```
Seguir el skill `nueva-entidad-prisma`: `npx prisma format && npx prisma validate`, luego `npx prisma migrate dev --name reemplaza_contenido_teorico_por_bloques_json` (elimina `contenido_teorico`, agrega `contenido JSONB NOT NULL`), luego `npm run bd:test:preparar`.

### 2. Dominio nuevo
- `src/dominio/modelos/bloque-contenido.ts` — tipo puro (sin TDD, CLAUDE.md 7.2): discriminated union `BloqueTexto | BloqueImagen | BloqueEnlace` por campo `tipo`.
- `src/dominio/limites-contenido-modulo.ts` — constantes sin comportamiento (mismo nivel que `catalogo-imagenes.ts`, no en subfolder): `MIN_BLOQUES_CONTENIDO=1`, `MAX_BLOQUES_CONTENIDO=50`, `TAMANO_MAXIMO_IMAGEN_BYTES=5MB`, `EXTENSION_POR_MIME`/`TIPOS_MIME_IMAGEN_PERMITIDOS` (png/jpeg/webp/gif).
- `src/dominio/errores/`: `tipo-archivo-no-permitido-error.ts`, `archivo-demasiado-grande-error.ts`, `archivo-no-proporcionado-error.ts` (mismo patrón que `modulo-no-encontrado-error.ts`, mapeados a 400 en `manejador-errores.ts`, con `logger.warn({evento:...})` para los dos primeros, RNF-14).

### 3. Validación Zod
- Nuevo `src/api/validadores/modulos/bloque-contenido.validador.ts`: `bloqueTextoSchema`, `bloqueImagenSchema`, `bloqueEnlaceSchema`, combinados en `bloqueContenidoSchema: z.ZodType<BloqueContenido> = z.discriminatedUnion("tipo", [...])` (la anotación de tipo obliga a que el schema implemente exactamente el tipo de dominio).
- `crear-modulo.validador.ts`: reemplazar `contenidoTeorico: z.string().min(1)` por `contenido: z.array(bloqueContenidoSchema).min(MIN_BLOQUES_CONTENIDO).max(MAX_BLOQUES_CONTENIDO)`.
- `editar-modulo.validador.ts` no cambia (`crearModuloSchema.partial()` hereda el campo automáticamente).

### 4. Repositorio (`src/repositorios/modulo-repo.ts`)
`DatosModulo.contenidoTeorico: string` → `DatosModulo.contenido: Prisma.InputJsonValue` (mismo patrón que `DatosConfiguracion` en `servicio-repo.ts`). El resto de la clase no cambia.

### 5. Servicio de aplicación (`gestor-modulos.ts`)
Sin cambios de lógica — sigue siendo passthrough tipado por `DatosModulo`.

### 6. Controlador (`modulos.controlador.ts`)
- `aModuloRespuesta`: `contenidoTeorico` → `contenido: modulo.contenido` (sin cast, igual que `servicios.controlador.ts` con `puertos`).
- Nuevo handler `subirImagen` que lee `req.file` (puesto por el middleware de subida) y responde `201 { url: "/archivos/modulos/<filename>" }`.

### 7. Middleware de subida (nuevo `src/api/middlewares/subida-imagen.ts`)
- Envuelve `multer.diskStorage`: filename por `randomUUID()` + extensión derivada del MIME (nunca del nombre original, evita path traversal/colisiones), `fileFilter` valida MIME contra `TIPOS_MIME_IMAGEN_PERMITIDOS`, `limits.fileSize = TAMANO_MAXIMO_IMAGEN_BYTES`.
- Exporta funciones puras testeables sin invocar multer: `esTipoMimePermitido(mimetype)`, `nombreDeArchivoPara(mimetype)`.
- `crearMiddlewareSubidaImagen(rutaDestino)` traduce errores de multer/ausencia de archivo a los errores de dominio nuevos vía `next(error)`.
- Limitación documentada (no bloqueante para el prototipo, RNF-20): valida el `Content-Type` declarado por el cliente, no hace sniffing de bytes reales (magic numbers).

### 8. Rutas, app, composición, configuración
- `modulos.rutas.ts`: nueva firma `crearRutasModulos(gestorModulos, autenticar, subirImagenModulo)`, agrega `router.post("/imagenes", autenticar, rol, subirImagenModulo, c.subirImagen)`.
- `app.ts` (`DependenciasApp`): agrega `subirImagenModulo: RequestHandler` y `rutaArchivosModulos: string`; monta `app.use("/archivos/modulos", express.static(rutaArchivosModulos, { index: false, dotfiles: "ignore" }))` — **fuera de `/api` y sin autenticación**, porque un `<img src>` no puede mandar el header `Authorization` y el contenido educativo no es sensible. Documentar como DT-09.
- `composicion.ts` (`ConfigApp`): agrega `rutaAlmacenamientoModulos: string`; crea el directorio si no existe, construye `subirImagenModulo = crearMiddlewareSubidaImagen(ruta)`.
- `src/infraestructura/configuracion.ts`: agrega `RUTA_ALMACENAMIENTO_MODULOS` con default `"uploads/modulos"`.
- `.env.example`: documentar la variable nueva. `.gitignore`: agregar `uploads/` y `tests-tmp/`.
- Tests de integración: nuevo `tests/ayudas/ruta-uploads-prueba.ts` con una ruta exclusiva de pruebas (`tests-tmp/uploads`), inyectada en `tests/ayudas/construir-app.ts` sin cambiar su firma pública; `tests/configuracion/setup-global.ts` limpia esa carpeta al finalizar la suite.

### 9. Dependencia nueva
`package.json`: `multer@^2.3.0` + `@types/multer@^2.2.0` en devDependencies. Justificación documentada en `docs/decisiones-tecnicas.md` (DT-09).

## Plan de tests (TDD, de abajo hacia arriba)

1. **Fixture** `tests/fixtures/modulo.factory.ts` (nuevo): `bloqueTexto()`, `bloqueImagen()`, `bloqueEnlace()`, `datosModuloValidos()`. Elimina los literales `contenidoTeorico: "c"` repetidos en los tests actuales.
2. **Repositorio** — actualizar `tests/integracion/repositorios/modulo-repo.test.ts` con el factory. RED (falla porque el schema aún no cambió) → migración + repo → GREEN.
3. **Gestor** — actualizar `tests/unitarias/servicios-aplicacion/gestor-modulos.test.ts` (solo cambia el fixture usado).
4. **API** — actualizar `tests/integracion/api/modulos/{crear,editar,listar}-modulo.test.ts` para usar el factory; agregar casos negativos en `crear-modulo.test.ts`: `contenido: []` → 400, bloque con `tipo` inválido → 400, bloque `imagen` sin `url` → 400, bloque `enlace` sin `titulo` → 400.
5. **Middleware de subida** — nuevo `tests/unitarias/api/middlewares/subida-imagen.test.ts` para `esTipoMimePermitido` y `nombreDeArchivoPara` (sin invocar multer).
6. **Endpoint de subida** — nuevo `tests/integracion/api/modulos/subir-imagen-modulo.test.ts` con `.attach("imagen", buffer, { filename, contentType })` de Supertest: 201 con `url` válida (+ `GET` a esa url → 200, cierra el ciclo del montaje estático), 401 sin token, 403 con rol estudiante, 400 sin archivo, 400 con MIME no permitido, 400 con archivo demasiado grande.

## Documentación y trazabilidad

- `docs/contrato-api.md` sección 4: actualizar objeto Modulo (`contenido: BloqueContenido[]`), request bodies, y agregar 4.5 `POST /api/modulos/imagenes` + nota sobre el mount público `/archivos/modulos`.
- `docs/decisiones-tecnicas.md`: nueva entrada DT-09 (reemplazo limpio del campo, elección de `multer`, servido público sin auth).
- Cabeceras de archivos nuevos: `Cubre: RF-20 — CU-10`. Commits siguiendo el skill `trazabilidad-requerimientos`, en pasos pequeños (schema+repo, validación+controlador, subida de imagen, docs).

## Verificación

- `npm run test:unit` y `npm run test:integration` en verde tras cada paso del ciclo TDD.
- `npm run test:coverage` al final — confirmar que se mantienen los umbrales (80/80/75/80).
- Prueba manual: `POST /api/modulos` con un `contenido` de 3 bloques (texto+imagen+enlace) autenticado como docente; `POST /api/modulos/imagenes` con un archivo real vía `curl -F "imagen=@foto.png"`; verificar que la URL devuelta responde `GET` con la imagen.
