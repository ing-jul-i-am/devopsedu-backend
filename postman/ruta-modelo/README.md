# Ruta modelo: cuerpos para Postman

Cuerpos JSON listos para pegar en Postman (Body > raw > JSON) y armar una ruta de aprendizaje
de demostración con cuatro módulos. Cada módulo tiene contenido teórico en Markdown, enlaces
a la documentación oficial y una evaluación de 5 preguntas (aprobación con 70, máximo 2
intentos). El cuarto módulo incluye además una actividad práctica que se valida sola al
desplegar un servicio. Todos los cuerpos se validaron contra los esquemas Zod del backend.

Todas las peticiones requieren el token de un usuario con rol **docente**.

| Paso | Método y ruta | Cuerpo |
| --- | --- | --- |
| 1 | `POST /api/modulos` | `1a-modulo-introduccion-contenedores.json` |
| 2 | `POST /api/modulos/{idModulo}/evaluacion` | `1b-evaluacion-introduccion-contenedores.json` |
| 3 | `POST /api/modulos` | `2a-modulo-redes-docker.json` |
| 4 | `POST /api/modulos/{idModulo}/evaluacion` | `2b-evaluacion-redes-docker.json` |
| 5 | `POST /api/modulos` | `3a-modulo-imagenes-docker.json` |
| 6 | `POST /api/modulos/{idModulo}/evaluacion` | `3b-evaluacion-imagenes-docker.json` |
| 7 | `POST /api/modulos` | `4a-modulo-volumenes-persistencia.json` |
| 8 | `POST /api/modulos/{idModulo}/actividades` | `4b-actividad-volumenes-persistencia.json` |
| 9 | `PUT /api/modulos/{idModulo}` | `4c-contenido-con-actividad-volumenes.json` |
| 10 | `POST /api/modulos/{idModulo}/evaluacion` | `4d-evaluacion-volumenes-persistencia.json` |
| 11 | `POST /api/rutas` | `{ "idUsuario": <id del estudiante>, "idModulos": [<id 1>, <id 2>, <id 3>, <id 4>] }` |

`{idModulo}` es el `idModulo` que devuelve el `POST /api/modulos` del paso anterior.

## Módulo 4: por qué son tres pasos

El bloque de tipo `actividad` del contenido referencia un `idActividad`, y la actividad solo
puede crearse cuando el módulo ya existe. Por eso:

1. El paso 7 crea el módulo con todo su contenido, sin el bloque de la actividad.
2. El paso 8 crea la actividad y devuelve su `idActividad`.
3. El paso 9 reemplaza el contenido por la versión que incluye el bloque de la actividad en su
   lugar de lectura. El cuerpo trae `"idActividad": {{idActividad}}`: define una variable de
   Postman `idActividad` con el valor del paso 8, o reemplaza el texto por el número. Si se
   envía sin sustituir, el backend responde `400`.

## Módulo 4: cómo completar la actividad en la demo

La actividad se valida sola (RF-23): al terminar con éxito el despliegue, el backend compara la
configuración del servicio con el criterio y registra el resultado. El criterio exige:

- operación `desplegar`;
- imagen exactamente `redis:7-alpine` (se compara el texto literal);
- al menos 1 volumen y al menos 1 puerto.

Configuración que la cumple (es la que indica la descripción de la actividad):

| Campo | Valor |
| --- | --- |
| Imagen | `redis:7-alpine` |
| Puerto | host `6379`, contenedor `6379`, `tcp` |
| Volumen | origen `datos-redis`, destino `/data`, modo `rw` |
| CPU / memoria / almacenamiento | `0.5` / `256` MB / `512` MB |

Solo se evalúa la primera actividad pendiente de la ruta más reciente del estudiante. Como los
módulos 1 a 3 no tienen actividades, esta será la que se evalúe. La imagen `redis:7-alpine` ya
está descargada en el servidor y el puerto 6379 está libre (los puertos 5432 y 5433 los usan
las bases de desarrollo y pruebas).

`datos-redis` es un **volumen nombrado**, no un bind mount. Desde DT-15, volver a desplegar el
servicio recrea el contenedor y destruye ese volumen, así que los datos que el estudiante haya
escrito en Redis se pierden en cada redespliegue y también al eliminar el servicio. Es
didácticamente deseable para el módulo de persistencia: deja ver la diferencia con un bind mount
como `/datos/redis:/data:rw`, que sobrevive. El criterio de la actividad solo cuenta cuántos
volúmenes hay, no de qué tipo son, de modo que ambas variantes la aprueban.

Si el nombre del servicio se escribió mal, basta con eliminarlo y volver a crearlo con el nombre
correcto: desde DT-16 el nombre queda libre al eliminar.

## Reutilizar los módulos que ya existen

Los cuerpos `a` también sirven para `PUT /api/modulos/{idModulo}`: reemplazan nombre, orden y
contenido de un módulo existente. Luego se crea su evaluación con el cuerpo `b`
correspondiente. Cada módulo admite una sola evaluación: si ya tiene una, el `POST` responde
`409`.

Si se hace esto sobre los módulos de una ruta ya asignada, esos módulos pasan de
`completado` a `en_progreso` (ahora tienen una evaluación pendiente) y el progreso de la ruta
baja hasta que el estudiante apruebe cada evaluación.

## Clave de respuestas (índice base 0)

| Evaluación | P1 | P2 | P3 | P4 | P5 |
| --- | --- | --- | --- | --- | --- |
| Introducción a contenedores | 1 | 2 | 0 | 3 | 2 |
| Redes en Docker | 2 | 1 | 2 | 0 | 3 |
| Imágenes en Docker | 3 | 2 | 1 | 2 | 0 |
| Volúmenes y persistencia de datos | 1 | 3 | 0 | 2 | 3 |
