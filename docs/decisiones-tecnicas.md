# Decisiones tecnicas

Este documento registra las decisiones tecnicas que no encajan directamente con un RF, RNF
o CU del catalogo formal del diseño, o que se apartan de lo indicado en `CLAUDE.md`. Cada
entrada se referencia desde el commit correspondiente con el identificador `DT-XX`.

---

## DT-01: Reconciliacion del alias "@/" en Vitest con los imports .js de NodeNext

**Fecha:** 2026-07-24

**Contexto:** El `CLAUDE.md` seccion 5 define el alias de Vitest como un unico mapeo de
prefijo: `"@/": path.resolve(__dirname, "./src/")`. Al mismo tiempo, la seccion 6.3 exige
`moduleResolution: NodeNext` y los skills (`ciclo-tdd`, `nuevo-endpoint`, etc.) escriben los
imports con extension explicita `.js` (por ejemplo `@/infraestructura/configuracion.js`),
que es obligatoria bajo NodeNext. Con el alias de prefijo, Vitest resuelve
`@/infraestructura/configuracion.js` a la ruta literal `src/infraestructura/configuracion.js`,
que no existe (el fuente es `.ts`), y falla la carga del modulo.

**Decision:** Sustituir el alias de prefijo por un arreglo de dos reglas en `vitest.config.ts`:

1. `find: /^@\/(.*)\.js$/` → `src/$1.ts`, que mapea los imports con extension `.js` al fuente `.ts`.
2. `find: /^@\//` → `src/`, que cubre el resto de imports con prefijo `@/`.

De esta forma se conservan tanto la convencion de imports `.js` que exigen NodeNext y los
skills, como el alias `@/` documentado.

**Consecuencias:** Los tests pueden importar el codigo de produccion con la misma sintaxis
`.js` que usara el compilador `tsc`, sin divergencias entre entorno de pruebas y compilacion.
La configuracion de alias es ligeramente mas verbosa que el snippet original del `CLAUDE.md`.

**Alternativas consideradas:**
- Usar `moduleResolution: Bundler` y omitir la extension `.js` en los imports. Descartada por
  contradecir la seccion 6.3 del `CLAUDE.md` y la convencion de los skills.
- Agregar el plugin `vite-tsconfig-paths`. Descartada para no introducir una dependencia nueva
  sin justificacion de alcance (RNF-20).

---

## DT-02: Separacion de la configuracion de typecheck y de compilacion

**Fecha:** 2026-07-25

**Contexto:** El `CLAUDE.md` seccion 10 define `"build": "tsc"`. Para tener buena verificacion
de tipos, `tsconfig.json` incluye `src`, `tests` y `scripts`. Con esa inclusion, `tsc` calcula
la raiz comun del proyecto y emite preservando la estructura (`dist/src/index.js`), de modo que
`"start": "node dist/index.js"` (tambien definido en el `CLAUDE.md`) no encuentra el archivo.

**Decision:** Separar responsabilidades en dos configuraciones:

- `tsconfig.json`: verificacion de tipos de todo el codigo (`src`, `tests`, `scripts`) con
  `noEmit: true`. Lo usan el editor y `tsc --noEmit`.
- `tsconfig.build.json`: compilacion de produccion con `rootDir: "src"`, `outDir: "dist"` e
  `include` solo de `src`. El script pasa a `"build": "tsc -p tsconfig.build.json"`.

Asi `dist/index.js` queda en la ruta que espera `npm start`, sin renunciar a la verificacion
de tipos de las pruebas.

**Consecuencias:** El script `build` deja de ser exactamente `tsc`, pero produce la estructura
correcta. Los tests se siguen verificando con tipos mediante `tsconfig.json`.

**Alternativas consideradas:**
- Fijar `rootDir: "src"` e `include: ["src"]` en `tsconfig.json`. Descartada porque dejaria las
  pruebas fuera de la verificacion de tipos de `tsc`.
- Mover las pruebas dentro de `src`. Descartada por contradecir la estructura de carpetas del
  `CLAUDE.md` seccion 4.

---

## DT-03: RF-04 es un requerimiento transversal de autorizacion, no un endpoint de /api/usuarios

**Fecha:** 2026-07-25

**Contexto:** La tabla de la seccion 8 del `CLAUDE.md` agrupa RF-04 bajo el recurso
`/api/usuarios`. Sin embargo, el texto del catalogo (seccion 4.2.6.1.1 del diseño) define
RF-04 como "Gestion de perfiles diferenciados": el sistema debe diferenciar las
funcionalidades segun el rol, restringiendo las operaciones administrativas al perfil docente,
y registrar en la bitacora los intentos denegados. Su criterio de aceptacion se refiere a que
un estudiante no pueda crear ni modificar modulos educativos.

**Decision:** RF-04 no se implementa como un recurso REST propio (`/api/usuarios`). Se
satisface con el mecanismo de autorizacion transversal:

- Middleware `autenticar` (valida el JWT y la vigencia de la sesion).
- Middleware `autorizar(...roles)` (restringe por rol y registra el acceso no autorizado).
- Traduccion de `PermisoDenegadoError` a HTTP 403 con registro en bitacora (RNF-14).

El punto de aplicacion concreto del criterio de aceptacion (bloquear al estudiante en la
creacion/modificacion de modulos) y su verificacion de integracion viven en la Etapa 6
(`/api/modulos`), donde esas rutas se protegen con `autorizar("docente")`.

**Consecuencias:** No se agrega un endpoint `/api/usuarios` especulativo. La Etapa 2 queda
completa en cuanto al mecanismo (RF-01, RF-02, RF-03, RF-04, RNF-10, RNF-12, RNF-14, RNF-21);
la prueba de aceptacion end-to-end de RF-04 se redacta al construir los endpoints de modulos.

**Alternativas consideradas:**
- Crear `GET /api/usuarios/yo` o `GET /api/usuarios`. Descartadas por no ser requeridas por
  RF-04 ni por ningun otro RF del catalogo en esta etapa (evita alcance especulativo).

**Nota posterior (2026-09-05):** DT-08 crea `/api/usuarios` con un endpoint concreto (reseteo
de contrasena por el docente), ante una necesidad real y ya no especulativa. La gestion de
perfil propio (`GET/PUT /api/usuarios/yo`) sigue sin implementarse y sigue sin RF asociado.

---

## DT-04: ConfiguracionServicio pasa a 1:N (historico de configuraciones) para cumplir RF-08

**Fecha:** 2026-07-25

**Contexto:** El documento de diseño es internamente inconsistente sobre la cardinalidad entre
`Servicio` y `ConfiguracionServicio`:

- RF-08 ("Edicion de configuracion de servicio") exige modificar la configuracion "generando un
  nuevo registro de configuracion asociado al mismo servicio", y su criterio de aceptacion pide
  que la modificacion "quede registrada en el historico de configuraciones". Esto implica 1:N.
- El modelo de clases (seccion 4.2.16) menciona "sus ConfiguracionServicio ... asociadas" en
  plural y como composicion, lo que tambien sugiere 1:N.
- El diagrama entidad-relacion (seccion 4.2.17) declara la relacion como 1:1 mediante un UNIQUE
  sobre `id_servicio`, "cada servicio mantenga exactamente una configuracion vigente".

El esquema Prisma inicial seguia el ER (1:1), lo que hace imposible cumplir el criterio de
aceptacion de RF-08.

**Decision:** Con aprobacion del autor del proyecto, se adopta el modelo 1:N para cumplir RF-08:

- Se elimina el UNIQUE sobre `id_servicio` en `configuracion_servicio`.
- Se agrega `fecha_creacion` a `configuracion_servicio` y un indice `(id_servicio, fecha_creacion)`.
- La configuracion vigente de un servicio es la mas reciente (desempate por `id_configuracion`).
- Editar la configuracion (RF-08) inserta un nuevo registro; no actualiza el existente.

Migracion: `20260725080415_agrega_historico_configuracion_servicio`.

**Consecuencias:** Se cumple RF-08 y el modelo de clases (plural). Se aparta del ER 1:1 del
documento; el diagrama ER debe actualizarse a 1:N en la proxima revision del diseño para
mantener la coherencia documental.

**Alternativas consideradas:**
- Mantener 1:1 y editar en sitio. Descartada porque incumple el criterio de aceptacion de RF-08
  (no habria historico de configuraciones).

---

## DT-05: registro_despliegue incorpora el campo 'operacion' para cumplir RF-15

**Fecha:** 2026-07-25

**Contexto:** RF-15 exige "registrar cada operacion de despliegue, detencion, reinicio o
eliminacion, incluyendo usuario, fecha y resultado", y RF-17 habla del "historico de
operaciones". Sin embargo, la entidad `RegistroDespliegue` del diagrama ER (seccion 4.2.17) solo
contempla `fecha_hora`, `resultado`, `mensaje_error`, `id_servicio` e `id_usuario`, sin un campo
que identifique el tipo de operacion. Con ese modelo no es posible distinguir en el historico si
un registro corresponde a un despliegue, una detencion, un reinicio o una eliminacion.

**Decision:** Con aprobacion del autor, se agrega la columna `operacion` (VarChar 20) a
`registro_despliegue`. Valores esperados: `desplegar`, `detener`, `reiniciar`, `eliminar`.

Migracion: `agrega_operacion_registro_despliegue`.

**Consecuencias:** Se cumple RF-15 y el historico de RF-17 distingue el tipo de operacion. Se
aparta del ER; el diagrama debe actualizarse para incluir el campo en la proxima revision.

**Alternativas consideradas:**
- Registrar solo `resultado` (como el ER y el skill integracion-docker). Descartada porque deja
  RF-15/RF-17 incompletos (el historico no distinguiria el tipo de operacion).

---

## DT-06: la verificacion de recursos mide la disponibilidad real del sistema operativo

**Fecha:** 2026-07-25

**Contexto:** El flujo CU-04 del diseno calcula los recursos disponibles como la capacidad total
del servidor menos "el consumo actual de los contenedores activos" consultado a Docker. Ese
modelo no descuenta el uso del propio sistema operativo ni de otros programas ajenos a la
plataforma, por lo que sobreestima lo realmente disponible en la maquina.

**Decision:** Con aprobacion del autor, el `VerificadorRecursos` mide la disponibilidad
directamente del sistema operativo:

- Memoria: `os.freemem()` (RAM libre real; incluye el uso del SO, otros programas y Docker).
- Disco: `fs.statfs(ruta)` (espacio libre real del sistema de archivos).
- CPU: `os.cpus().length` menos `os.loadavg()[0]` (demanda promedio del sistema).

Asi, lo disponible refleja el estado real de la maquina y `comprometido = total - disponible`
contempla todo el consumo. La medicion se inyecta como dependencia para que las pruebas sean
deterministas (no dependan del estado real del equipo). Se elimino
`ServicioRepo.sumarRecursosVigentes`, que quedo sin uso.

**Consecuencias:** La verificacion es realista respecto a la maquina completa. El resultado
fluctua con el uso del equipo y la parte de CPU es una aproximacion por carga. Se aparta de la
redaccion literal de CU-04 (que solo descuenta contenedores Docker); el diseno deberia
actualizarse en consecuencia.

**Alternativas consideradas:**
- Restar solo el consumo/reserva de los contenedores Docker (fiel a CU-04). Descartada porque no
  toma en cuenta el uso del SO ni de otros programas, como observo el autor.

---

## DT-07: middleware CORS explicito para permitir el consumo desde el frontend

**Fecha:** 2026-08-14

**Contexto:** El backend no tenia ningun middleware CORS. Postman no aplica la politica de mismo
origen, por lo que las pruebas manuales con esa herramienta funcionaban, pero el frontend
(servido en `http://localhost:5173` con Vite) es bloqueado por el navegador: el preflight
`OPTIONS` no recibe el encabezado `Access-Control-Allow-Origin` y la peticion real nunca llega
a la API. Esto no esta cubierto por ningun RF/RNF/CU especifico del catalogo, que asume la
interaccion pero no detalla el mecanismo de habilitacion entre origenes.

**Decision:** Se agrega el paquete `cors` y un middleware propio (`crearCors`, en
`src/api/middlewares/cors.ts`) que permite unicamente los origenes configurados via la variable
de entorno `CORS_ORIGENES` (lista separada por comas, con
`http://localhost:5173,http://127.0.0.1:5173` como valor por defecto para desarrollo). El
middleware se monta en `crearApp` antes que cualquier otro, para que tambien intercepte el
preflight `OPTIONS` de las rutas protegidas. No se habilitan credenciales (`credentials: true`)
porque la autenticacion viaja en el encabezado `Authorization: Bearer`, no por cookies.

**Consecuencias:** El frontend puede consumir la API desde el navegador. Agregar un nuevo origen
de despliegue (p. ej. produccion) requiere actualizar `CORS_ORIGENES` en el entorno, no el
codigo. Se agrega una dependencia nueva (`cors` + `@types/cors`), justificada porque reimplementar
a mano el manejo de preflight, headers de Vary y metodos serialize-correctos es propenso a errores
sutiles (RNF-15).

**Alternativas consideradas:**
- Middleware CORS escrito a mano sin dependencia nueva. Descartada por el riesgo de omitir
  detalles del protocolo (encabezado `Vary: Origin`, manejo de `Access-Control-Request-Headers`
  dinamico) que el paquete `cors` ya resuelve de forma probada.

---

## DT-08: se agrega `/api/usuarios` para el reseteo manual de contrasena por el docente

**Fecha:** 2026-09-05

**Contexto:** Durante el desarrollo, el desarrollador perdio el registro de las contrasenas en
texto plano de varios usuarios de prueba. Al ser bcrypt un cifrado de una sola via (RNF-10), no
existe forma de recuperarlas desde el hash almacenado. Se solicito una via operativa para
resetear la contrasena de un usuario conociendo su id, pensada para uso durante el desarrollo y
como base de un futuro flujo de "olvide mi contrasena" (visible en el mockup de la vista de
login del diseño, seccion 4.2, aunque sin RF asignado en el catalogo).

Esto reabre la decision DT-03, que descartaba explicitamente crear un recurso `/api/usuarios`
por considerarlo alcance especulativo. Aqui el alcance deja de ser especulativo: hay una
necesidad concreta y vigente.

**Decision:** Se crea el recurso `PATCH /api/usuarios/:id/contrasena`, restringido al rol
docente mediante los middlewares transversales ya existentes (`autenticar` + `autorizar`,
mecanismo de RF-04). El endpoint recibe unicamente `contrasenaNueva` en el cuerpo; no implementa
ninguna verificacion adicional (sin correo de confirmacion, sin token temporal, sin exigir la
contrasena anterior) porque el requerimiento explicito del desarrollador fue una funcion minima
de actualizacion directa. El nuevo `GestorUsuarios` (`src/servicios-aplicacion/gestor-usuarios.ts`)
verifica que el usuario exista, cifra la contrasena con `Cifrador` (bcrypt, 12 rondas) y delega en
`UsuarioRepo.actualizarContrasena`.

No se asocia a ningun RF del catalogo por no existir uno que cubra el reseteo administrativo de
contrasena; se documenta como decision tecnica siguiendo el skill `trazabilidad-requerimientos`
seccion 7. Se referencia informalmente junto a RF-04 en las cabeceras de codigo porque comparte
su mecanismo de autorizacion por rol, no porque el catalogo lo defina.

**Consecuencias:** Cualquier cuenta docente puede cambiar la contrasena de cualquier otro
usuario sin que este lo solicite ni lo confirme. Es aceptable para la etapa actual de desarrollo,
pero antes de un uso en produccion se deberia, como minimo: registrar el evento en bitacora
(RNF-14, hoy no implementado para este endpoint), y evaluar si conviene exigir un motivo o
notificar al usuario afectado. Si mas adelante se construye el flujo de autoservicio
"olvide mi contrasena", debera vivir en un endpoint distinto (no exige rol docente ni recibe el
id por URL) y probablemente reemplace este por uno mas restringido.

**Alternativas consideradas:**
- Mantener DT-03 y resolver la perdida de contrasenas unicamente reseteando datos a mano en la
  base de pruebas (`UPDATE` directo o script puntual fuera del ciclo TDD). Descartada porque el
  desarrollador pidio explicitamente una via reutilizable a traves de la API.
- Ubicar el endpoint en `/api/auth/resetear-contrasena` en vez de crear el recurso
  `/api/usuarios`. Descartada en favor de `/api/usuarios` porque el contrato ya anticipaba ese
  recurso como pendiente (`docs/contrato-api.md`, seccion 9) y porque la operacion actua sobre
  un usuario identificado por id, no sobre la sesion de quien invoca.

## DT-09: contenido de modulo pasa a bloques estructurados (Json) con subida de imagenes

**Fecha:** 2026-09-05

**Contexto:** El campo `Modulo.contenidoTeorico` (RF-20) solo admitia texto plano, lo que
limitaba el material didactico que un docente podia construir: sin imagenes, sin texto con
formato (negritas, listas, titulos) y sin enlaces de referencia. El desarrollador solicito
ampliar la gestion de modulos para soportar estas herramientas didacticas.

**Decision:**
1. **Contenido en bloques (Json).** `Modulo.contenidoTeorico` (`String`) se reemplaza por
   `Modulo.contenido` (`Json`), un arreglo ordenado de bloques discriminados por el campo
   `tipo`: `texto` (Markdown), `imagen` (url + texto alternativo opcional) y `enlace` (url +
   titulo + descripcion opcional). El orden del arreglo es el orden de lectura; no existe un
   campo de orden dentro de cada bloque. El tipo de dominio vive en
   `src/dominio/modelos/bloque-contenido.ts` y el esquema de validacion en
   `src/api/validadores/modulos/bloque-contenido.validador.ts` (`z.discriminatedUnion`).
   Es un reemplazo limpio sin retrocompatibilidad: la migracion
   (`20260905222745_reemplaza_contenido_teorico_por_bloques_json`) convierte el texto existente
   en un unico bloque de tipo `texto` para no perder los datos de desarrollo, pero no se ofrece
   ninguna via de "revertir" a texto plano.
2. **Subida real de imagenes.** Se agrega `POST /api/modulos/imagenes`
   (`multipart/form-data`, campo `imagen`) para que el docente suba un archivo y lo referencie
   luego desde un bloque `imagen`. Se incorpora `multer` como dependencia nueva: es el
   middleware estandar de facto para `multipart/form-data` en Express, evita reimplementar a
   mano el parseo de streams multipart (superficie de error y de seguridad no trivial), y no
   existia ninguna dependencia equivalente en el proyecto. El archivo se guarda en disco con un
   nombre generado por `randomUUID()` (nunca a partir del nombre original, para evitar
   colisiones y ataques de path traversal), validando tipo MIME (`image/png`, `image/jpeg`,
   `image/webp`, `image/gif`) y tamano maximo (5 MB) en `src/api/middlewares/subida-imagen.ts`.
3. **Servido publico sin autenticacion.** Las imagenes se sirven mediante `express.static` en
   `/archivos/modulos/*`, fuera de `/api` y sin pasar por `autenticar`. Es una desviacion
   deliberada del resto de la API (todo lo demas exige JWT): un `<img src>` del navegador no
   puede adjuntar el header `Authorization`, y el contenido educativo de un modulo no se
   considera sensible. La mitigacion de acceso no autorizado se apoya en que el nombre de
   archivo es un UUID no adivinable, no en autenticacion.

**Consecuencias:** La validacion del tipo de archivo confia en el `Content-Type` declarado por
el cliente en la peticion multipart, no en una inspeccion de los bytes reales (`magic numbers`);
para el alcance de este prototipo academico se considera un riesgo aceptable (RNF-20), pero un
uso en produccion deberia agregar esa verificacion. Los archivos subidos no se eliminan cuando
un modulo se edita o dejan de referenciarse desde ningun bloque (no hay recoleccion de huerfanos);
tampoco hay limite de espacio en disco mas alla del limite por archivo. La exposicion de
`contenido` al estudiante (endpoints `/api/aprendizaje/mi-ruta` y `/api/rutas`) queda fuera de
esta decision: por ahora solo se expande la gestion del lado del docente.

**Alternativas consideradas:**
- Mantener imagenes solo por URL externa (sin subida real). Descartada porque el desarrollador
  pidio explicitamente que el docente pudiera subir el archivo, no solo enlazarlo.
- Modelar cada tipo de bloque como una tabla relacional propia en vez de un campo `Json`.
  Descartada por ser un prototipo academico sin necesidad de consultar bloques de forma
  independiente del modulo; ademas el proyecto ya usa `Json` para estructuras variables
  similares (`ConfiguracionServicio.puertos/variablesEntorno/volumenes`).
- Servir las imagenes a traves de un endpoint autenticado dentro de `/api` en vez de
  `express.static` publico. Descartada porque un `<img src>` no adjunta headers personalizados
  sin trabajo adicional en el frontend (fetch + blob URL), y el contenido no se considera
  sensible en este prototipo.

## DT-10: criterios de validacion automatica de actividades (RF-23)

**Fecha:** 2026-09-12

**Contexto:** RF-23 (validacion automatica de actividades, CU-12) estaba pendiente porque el
documento de diseno no especifica que forma tiene `Actividad.criteriosValidacion` ni contra que
datos del sistema se evalua el cumplimiento de una actividad. Tampoco existia ningun mecanismo
para que el docente definiera actividades (RF-20 solo cubrio `Modulo`). Estas decisiones se
tomaron junto al desarrollador antes de iniciar TDD.

**Decision:**
1. **Forma de `criteriosValidacion` (Json).** `{ operacion: "desplegar"|"detener"|"reiniciar"|"eliminar", condiciones?: { imagenDocker?, volumenesMinimos?, puertosMinimos?, cpuMinimo?, memoriaMinima? } }`.
   Todas las condiciones son opcionales. El tipo de dominio vive en
   `src/dominio/modelos/criterios-validacion.ts` y el esquema Zod en
   `src/api/validadores/actividades/crear-actividad.validador.ts`.
2. **Disparador automatico.** `GestorDocker` invoca a `EvaluadorActividad.evaluarTrasOperacion`
   tras cada operacion exitosa (`desplegar`/`detener`/`reiniciar`/`eliminar`), envuelto en
   `try/catch`: un fallo en la evaluacion nunca revierte una operacion Docker que ya tuvo exito
   (se registra con `logger.warn`, evento `evaluacion_actividad_fallida`).
3. **Alcance de la evidencia.** No se vincula `Actividad` a un `Servicio` especifico. El
   criterio se evalua contra la configuracion vigente de cualquier servicio propio del
   estudiante sobre el que se acaba de ejecutar la operacion.
4. **Actividad en curso.** Dentro del modulo en curso (el primero, por
   `RutaModulo.ordenSecuencia`, con alguna actividad sin `Resultado`), la actividad en curso es
   la primera pendiente por campo `orden`. Solo esa se evalua en cada llamada.
5. **`intentos`.** Cantidad de `RegistroDespliegue` (exito + fallo) de esa `operacion` sobre ese
   `idServicio`, hasta el que cumple el criterio (`RegistroDespliegueRepo.contarPorServicioYOperacion`).
6. **`tiempoEmpleado` y nuevo campo `RutaModulo.fechaInicio`.** Se agrega
   `RutaModulo.fechaInicio` (`DateTime?`, migracion `20260912181406_agrega_fecha_inicio_ruta_modulo`)
   para marcar cuando el estudiante llega al modulo. Se marca mediante un endpoint explicito
   (`POST /api/aprendizaje/modulos/:idModulo/iniciar`), idempotente: no se sobrescribe si ya
   tenia fecha. `tiempoEmpleado` es la diferencia en segundos entre esa fecha y el momento en
   que se cumple el criterio; si no hay fecha registrada (caso borde), `tiempoEmpleado = 0`.
7. **Nuevo bloque de contenido `actividad`.** Se agrega a `BloqueContenido` (junto a
   `texto`/`imagen`/`enlace`), con forma `{ tipo: "actividad", idActividad: number }`, para
   marcar donde aparece la actividad dentro de la lectura lineal del modulo. Referencia una
   `Actividad` ya creada para el mismo modulo mediante `POST /api/modulos/:idModulo/actividades`
   (endpoint nuevo, exclusivo del rol docente, ya que RF-20 no lo cubria).
8. **Progreso de `RutaAprendizaje`.** `(actividades con Resultado del usuario) / (total de
   actividades en todos los modulos de la ruta) * 100`, recalculado por `EvaluadorActividad`
   tras cada actividad completada.

**Consecuencias:** El calculo de progreso no cuenta evaluaciones (RF-24, aun no implementado);
cuando se aborde RF-24 habra que decidir si se integra al mismo porcentaje o se reporta aparte.
`tiempoEmpleado` puede incluir tiempo en que el estudiante no estuvo activo en la plataforma
(no hay pausas), y si tiene mas de un modulo activo simultaneamente el tiempo se cuenta desde
que llego a ese modulo especifico, no desde el inicio de la ruta completa. La evaluacion no
distingue si el servicio usado ya existia antes de la actividad o fue creado especificamente
para ella (alcance "cualquier servicio propio" acordado con el desarrollador).

**Alternativas consideradas:**
- Vincular `Actividad` a un `Servicio` especifico mediante una FK. Descartada porque obligaria
  a crear el servicio antes de la actividad y complicaria el flujo del estudiante; el criterio
  por `operacion + condiciones` ya acota suficientemente que servicio cuenta.
- Evaluacion bajo demanda (endpoint que el estudiante llama para "verificar" su actividad).
  Descartada porque el flujo narrativo de CU-12 describe una evaluacion automatica inmediata
  tras la accion del estudiante, sin paso manual adicional.
- Contar `intentos` siempre como 1 (sin consultar el historico). Descartada porque el
  desarrollador prefirio una metrica mas fiel al numero real de intentos sobre el servicio
  usado, aun a costa de poder sobreestimar si ese servicio se reutilizo para otros fines.

## DT-11: evaluaciones de modulo (RF-24)

**Fecha:** 2026-09-12

**Contexto:** RF-24 (aplicacion de evaluaciones, CU-14) tampoco tiene tabla de especificacion
en el documento de diseno (la propia fuente lo deja explicito: "las especificaciones detalladas
de los casos de uso restantes pueden construirse siguiendo la misma estructura"). El unico
material es el mockup "VISTA 12 — EVALUACION DE MODULO", degradado por el OCR, que sugiere una
evaluacion de 5 preguntas de opcion multiple, un umbral visible como "70/100" y un limite de
"INTENTO 1 DE 2". Estas decisiones se acordaron con el desarrollador antes de iniciar TDD.

**Decision:**
1. **Preguntas de opcion multiple, una respuesta correcta.** `Evaluacion.preguntas` (Json):
   arreglo de `{ pregunta: string, opciones: string[], respuestaCorrecta: number }`. El tipo de
   dominio vive en `src/dominio/modelos/pregunta-evaluacion.ts` y el esquema Zod en
   `src/api/validadores/evaluaciones/crear-evaluacion.validador.ts`.
2. **Umbral (70) y maximo de intentos (2) son constantes fijas del sistema**, no configurables
   por evaluacion: `src/dominio/reglas-evaluacion.ts`
   (`UMBRAL_APROBACION_EVALUACION`, `MAXIMO_INTENTOS_EVALUACION`). No requirio migracion de
   Prisma.
3. **Una evaluacion aprobada se bloquea para nuevos intentos.**
   `ResultadoRepo.existeAprobadaPorUsuarioYEvaluacion` lo verifica antes de calificar un nuevo
   intento; si ya hay un resultado con `puntuacion >= UMBRAL_APROBACION_EVALUACION`, se lanza
   `EvaluacionYaAprobadaError` (409).
4. **El progreso de la ruta combina actividades y evaluaciones** en un solo porcentaje:
   `(actividades completadas + evaluaciones aprobadas) / (total actividades + total evaluaciones
   de la ruta) * 100`. Esto obligo a extraer el calculo de progreso —hasta ahora dentro de
   `EvaluadorActividad` (RF-23, DT-10)— a un servicio compartido nuevo, `CalculadorProgreso`
   (`src/servicios-aplicacion/calculador-progreso.ts`), usado tanto por `EvaluadorActividad`
   como por `GestorAprendizaje.responderEvaluacion`.
5. **Flujo de endpoints**, siguiendo el mismo patron que RF-23: el docente crea la evaluacion
   del modulo con `POST /api/modulos/:idModulo/evaluacion` (falla con `EvaluacionYaExisteError`,
   409, si el modulo ya tiene una, reflejando la cardinalidad 0-o-1 del diseno); el estudiante la
   consulta con `GET /api/aprendizaje/modulos/:idModulo/evaluacion` (la respuesta oculta
   `respuestaCorrecta` de cada pregunta) y la responde con
   `POST /api/aprendizaje/modulos/:idModulo/evaluacion`.
6. **`tiempoEmpleado` reutiliza `RutaModulo.fechaInicio`** (el mismo campo agregado en DT-10 para
   RF-23): segundos entre esa fecha y el momento en que se responde la evaluacion, `0` si no hay
   fecha registrada. No se agrego un campo de inicio propio de la evaluacion.
7. **Retroalimentacion sin filtrar respuestas.** La respuesta de
   `POST .../evaluacion` incluye `puntuacion`, `aprobado`, `intentosRestantes` y un `detalle` por
   pregunta (`{ correcta: boolean }`), pero nunca el indice de la opcion correcta — para no
   filtrarla de cara a un segundo intento.

**Consecuencias:** Si en el futuro se necesita un umbral o un limite de intentos distinto por
evaluacion, `reglas-evaluacion.ts` deja de ser suficiente y hara falta una migracion (agregar
campos a `Evaluacion`) mas los cambios de validacion correspondientes. El calculo de progreso ya
no vive en un unico lugar visible desde `EvaluadorActividad`; cualquier cambio a la formula debe
hacerse en `CalculadorProgreso` para que ambos flujos (RF-23 y RF-24) se mantengan consistentes.

**Alternativas consideradas:**
- Umbral y maximo de intentos configurables por evaluacion (campos nuevos en `Evaluacion`).
  Descartada por RNF-20: el documento de diseno no pide esa flexibilidad y el prototipo no la
  necesita todavia.
- Permitir reintentar despues de aprobar para subir la nota (progreso con la mejor puntuacion).
  Descartada por simplicidad: evita ambiguedad sobre cual resultado es "el" resultado de la
  evaluacion para efectos de progreso y reportes futuros (RF-25/26).
- Mantener el progreso de RF-23 sin tocar y reportar las evaluaciones aprobadas por separado.
  Descartada porque el desarrollador prefirio una sola metrica de progreso visible en
  `GET /api/aprendizaje/mi-ruta`, coherente con RF-22.

---

## DT-12: Cobertura completa de logging para errores controlados y no controlados

**Fecha:** 2026-09-12

**Contexto:** El desarrollador reporto que, al probar el servicio, no todos los errores dejaban
un rastro en consola para poder trazar que fallo. Al revisar
`src/api/middlewares/manejador-errores.ts` se confirmo que ya existia un catch-all
(`logger.error({ evento: "error_no_controlado", err })`) para cualquier error no controlado, y
que 6 de las ~17 ramas de errores de dominio ya llamaban al logger — pero las ramas restantes
(404, 409, 422 y varias 400) respondian al cliente sin registrar nada. Ademas,
`GestorDocker.desplegar/detener/reiniciar/eliminar` (`src/servicios-aplicacion/gestor-docker.ts`)
ya persistian el fallo en la tabla de registro de despliegue antes de relanzarlo, pero tampoco
llamaban al logger; y `src/index.ts` no tenia `process.on("uncaughtException"/"unhandledRejection")`,
por lo que un error fuera del ciclo de peticion/respuesta de Express podia perderse sin pasar por
Pino.

**Decision:**
1. Se agrego `logger.warn` a cada rama de `manejador-errores.ts` que aun no logueaba. Las ramas
   que agrupan varias clases de error con `instanceof ... || instanceof ...` no se separaron;
   se agrego una sola linea de log por rama con un campo `tipo: err.constructor.name` para no
   perder granularidad sobre cual clase especifica ocurrio, evitando expandir el archivo con
   ramas nuevas.
2. Se agrego `logger.warn` dentro de los `catch` ya existentes de `GestorDocker`, junto a la
   llamada a `this.registrar(...)` que ya persistia el fallo en BD, sin tocar esa persistencia
   ni el `throw`.
3. Se agregaron `process.on("uncaughtException")` y `process.on("unhandledRejection")` en
   `src/index.ts` (archivo exento de TDD segun `CLAUDE.md` 7.2), que registran con
   `logger.fatal` y terminan el proceso — el mismo desenlace que ya ocurria por defecto en Node,
   solo que ahora queda capturado por Pino antes de salir.
4. `src/servicios-aplicacion/verificador-recursos.ts` y `src/repositorios/*` no se modificaron:
   no tienen `try/catch` propio, por lo que cualquier falla inesperada sube sin tocar hasta el
   catch-all de `manejador-errores.ts`, que ya la registra. `src/api/middlewares/autorizar.ts`
   tampoco se toco: su `logger.warn` de `acceso_no_autorizado` queda duplicado con el mismo
   evento en `manejador-errores.ts`, pero es una duplicacion menor y no una ausencia de log, por
   lo que se dejo fuera de alcance de este cambio.

**Consecuencias:** Todo error que llega al middleware global de errores deja un registro en
consola, sea de dominio (4xx, nivel `warn`) o interno/de proceso (5xx o fatal, nivel
`error`/`fatal`). No se modifico ningun codigo de estado HTTP, mensaje al cliente, dato
persistido ni excepcion relanzada: el cambio es puramente aditivo. No se agregaron pruebas
nuevas que verifiquen llamadas al logger (decision explicita del desarrollador); las lineas
agregadas quedan cubiertas por las pruebas existentes que ya ejercitan esas mismas ramas
verificando el codigo de estado HTTP.

**Alternativas consideradas:**
- Separar cada rama agrupada de `manejador-errores.ts` en un `if` por clase de error, con un
  `evento` distinto por clase. Descartada por aumentar innecesariamente el tamano del archivo
  para una sesion que buscaba ser puramente aditiva; el campo `tipo` ya distingue la clase
  exacta dentro de la rama agrupada.
- Agregar pruebas unitarias que mockeen el logger y verifiquen cada llamada. Descartada por
  decision explicita del desarrollador: esta sesion se limito a agregar logs, no a ampliar la
  suite de pruebas.
- Dejar que `process.on("unhandledRejection")` solo loguee sin terminar el proceso. Descartada
  para no dejar el proceso en un estado inconsistente distinto al comportamiento por defecto de
  Node ante una promesa rechazada sin manejar.
