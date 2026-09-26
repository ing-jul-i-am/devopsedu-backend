# Contrato de API — DevOpsEdu Backend

Estado del backend a partir del cual se genera este contrato: rama `segunda-semana`,
commit `04f88c2` ("feat(servicios): verificacion de recursos basada en disponibilidad
real del SO (RF-09, RF-10, DT-06)").

**Actualizaciones posteriores** (rama `cuarta-semana`, RF-19): el `MonitorPeriodico`
detecta en ambas direcciones cuando el estado real de Docker diverge del estado en
base de datos y resincroniza automaticamente (ver 3.6):

- commits `c29e55a` / `c08d2b8`: contenedores detenidos fuera de la plataforma se
  marcan `fallido`, y `reiniciar` (3.9) acepta `fallido` como estado de origen para
  recuperarlos.
- commit `412b900`: servicios `detenido` cuyo contenedor se inicio fuera de la
  plataforma se resincronizan a `en_ejecucion`.
- Etapa 6 (RF-20, CU-10): se agrega el grupo `/api/modulos`, exclusivo del rol
  docente, para la gestion de modulos de aprendizaje (crear, listar, editar).
  Ver seccion 4.
- Etapa 6 (RF-21, CU-11): se agrega el grupo `/api/rutas`, exclusivo del rol
  docente, para asignar a un estudiante una ruta de aprendizaje ordenada de
  modulos existentes. Ver seccion 5.
- Etapa 6 (RF-22, CU-13): se agrega `GET /api/aprendizaje/mi-ruta`, exclusivo
  del rol estudiante, para consultar la ruta asignada y su progreso. Ver
  seccion 6.
- DT-08: se agrega el grupo `/api/usuarios`, exclusivo del rol docente, con
  un unico endpoint de reseteo manual de contrasena. Ver seccion 7.
- Etapa 6 (RF-23, CU-12, DT-10): se agrega `POST /api/modulos/:idModulo/actividades`
  (docente, ver 4.6) y `POST /api/aprendizaje/modulos/:idModulo/iniciar`
  (estudiante, ver 6.2). `RutaAprendizaje.progreso` ahora lo actualiza
  `EvaluadorActividad` tras cada actividad completada.
- Etapa 6 (RF-24, CU-14, DT-11): se agrega `POST /api/modulos/:idModulo/evaluacion`
  (docente, ver 4.7) y `GET`/`POST /api/aprendizaje/modulos/:idModulo/evaluacion`
  (estudiante, ver 6.3). Con esto la Etapa 6 (componente educativo) queda
  completa. `RutaAprendizaje.progreso` ahora combina actividades y
  evaluaciones aprobadas (`CalculadorProgreso`).
- RF-22, DT-13: `GET /api/aprendizaje/mi-ruta` agrega `estado` a cada modulo
  de `modulos[]` (`"completado" | "en_progreso" | "sin_iniciar"`). Ver 6.1.
- RF-22, DT-14: `RutaAprendizaje.progreso` pasa a ser el porcentaje de modulos
  completados (incluye los modulos de solo lectura, que antes dejaban la ruta
  en 0). Se recalcula tambien al iniciar un modulo (6.2) y en cada consulta de
  `mi-ruta` (6.1). La forma de las respuestas no cambia.
- RF-08, RF-11, DT-15: `POST /api/servicios/:id/desplegar` recrea el contenedor
  cuando ya existe, de modo que una configuracion editada surte efecto. Al
  recrear (y al eliminar) se destruyen los volumenes que no son bind mount.
  `desplegar` y `eliminar` agregan `recreado`, `volumenesEliminados` y
  `volumenesOmitidos` a su respuesta (3.2), y los volumenes de la configuracion
  incorporan el campo derivado de solo lectura `tipo` (3.1). Ver 3.9.1.
- RF-05, RF-14, DT-16: el nombre de un servicio solo esta reservado mientras el
  servicio esta activo; al eliminarlo queda libre para reutilizarse (3.5, 3.9.1).
  Un nombre duplicado entre servicios activos ahora responde `409` con
  `NombreServicioDuplicadoError`; antes provocaba un `500`.
- RF-17, DT-17: `GET /api/servicios/:idServicio` agrega el objeto `contenedor` con
  los volumenes que el contenedor tiene montados **realmente** (3.6). El dialogo de
  confirmacion previo a desplegar o eliminar debe construirse con ese campo y no con
  `configuracion.volumenes`, que puede diferir y no ve los volumenes anonimos. Ver
  3.9.1. Ademas, `volumenesEliminados` ahora incluye los volumenes anonimos, que
  antes se omitian del reporte pese a destruirse.

El resto del documento no ha sido re-auditado desde el commit base.

Este documento describe **unicamente los endpoints ya implementados**. El
`/api/reportes` (docente, RF-25, RF-26) todavia no existe en el backend y no
debe asumirse disponible por el frontend. Cuando se implemente, este
documento se actualizara.

- URL base (desarrollo): `http://localhost:3000` — puerto por defecto de
  `PORT` en `.env.example`, configurable via variable de entorno.
- Formato: JSON en cuerpo de peticion y respuesta (`Content-Type: application/json`).
- Autenticacion: JWT tipo `Bearer` en el encabezado `Authorization`.

---

## 1. Convenciones generales

### 1.1 Autenticacion

Todas las rutas de `/api/servicios/*` y `/api/servidor/*` requieren el encabezado:

```
Authorization: Bearer <token>
```

El token se obtiene de `POST /api/auth/login`. Si falta, es invalido, esta manipulado,
expiro, o la sesion fue revocada (logout), el backend responde `401` con
`TokenInvalidoError` (ver seccion 4).

### 1.2 Autorizacion por rol

Las rutas de `/api/servicios/*` ademas exigen que el usuario tenga rol `estudiante` o
`docente` (middleware `autorizar`). Actualmente ambos roles semilla cumplen esta
condicion, pero el contrato deja explicito que la ruta esta protegida por rol y podria
restringirse mas adelante.

### 1.3 Forma general de error

Todo error de dominio pasa por el middleware global (`manejador-errores.ts`) y produce
como minimo:

```json
{ "error": "mensaje en espanol" }
```

Nunca se exponen trazas internas (stack traces) al cliente. Ver seccion 4 para el
catalogo completo de errores, sus codigos HTTP y campos adicionales.

### 1.4 Forma general de error de validacion (400)

Cuando el cuerpo de la peticion no cumple el esquema Zod (`middlewares/validar.ts`):

```json
{
  "error": "Datos de entrada invalidos",
  "detalles": [
    { "campo": "nombre.de.campo", "mensaje": "mensaje especifico del campo" }
  ]
}
```

`campo` usa notacion de punto para campos anidados; si el error aplica a la raiz del
cuerpo, `campo` es la cadena literal `"(raiz)"`.

Para `GET /api/servicios/:idServicio/metricas`, si el *query string* es invalido, la
forma difiere (ver seccion 3.6): `{ "error": "Parametros de consulta invalidos" }` sin
`detalles`.

### 1.5 Tipos y serializacion a tener en cuenta

- Las fechas (`fechaCreacion`, `fechaRegistro`, `marcaTiempo`, `fechaHora`, etc.) se
  serializan como cadenas ISO 8601 (comportamiento por defecto de `JSON.stringify`
  sobre `Date`).
- `idMetrica` es `BigInt` en base de datos pero se convierte a `number` antes de
  serializar (ver `aMetricaRespuesta`), igual que `consumoCpu` y `cpuAsignado`
  (`Decimal` de Prisma) que tambien se convierten a `number`.
- No hay envoltorio `{ data: ... }` global: cada endpoint documenta su forma exacta de
  respuesta tal cual la produce el controlador.

---

## 2. Identidad — `/api/auth`

Cubre RF-01, RF-02, RF-03 — CU-01, CU-02. Ninguna ruta de este grupo requiere
autenticacion previa (login/registro son de acceso publico; logout acepta el token si
esta presente pero no falla si no lo esta).

### 2.1 `POST /api/auth/registro`

Auto-registro. El rol **no** se acepta desde el cliente: el servidor asigna siempre el
rol `estudiante` (rol por defecto configurado en el backend).

**Request body**

```json
{
  "nombre": "string, 2-120 caracteres",
  "correo": "string, formato email valido, maximo 160 caracteres",
  "contrasena": "string, 8-128 caracteres"
}
```

**Response `201 Created`**

```json
{
  "usuario": {
    "idUsuario": 1,
    "nombre": "Estudiante de prueba",
    "correo": "estudiante@devopsedu.local",
    "fechaRegistro": "2026-08-07T00:00:00.000Z",
    "idRol": 1
  }
}
```

Nota: `contrasenaCifrada` nunca se incluye en ninguna respuesta.

**Errores posibles**

| Codigo | Cuando |
| --- | --- |
| `400` | Cuerpo invalido (ver 1.4) |
| `409` | `CorreoYaRegistradoError` — el correo ya esta registrado |
| `500` | `RolNoDisponibleError` — condicion de configuracion del servidor (rol por defecto ausente); se responde con el mensaje generico `"Error interno del servidor"` |

### 2.2 `POST /api/auth/login`

**Request body**

```json
{
  "correo": "string, formato email valido",
  "contrasena": "string, minimo 1 caracter"
}
```

**Response `200 OK`**

```json
{
  "token": "jwt-firmado",
  "usuario": {
    "idUsuario": 1,
    "nombre": "Estudiante de prueba",
    "correo": "estudiante@devopsedu.local",
    "fechaRegistro": "2026-08-07T00:00:00.000Z",
    "idRol": 1
  }
}
```

Notese que la respuesta de login **no** anida `usuario` bajo otra clave adicional; el
objeto raiz tiene directamente `token` y `usuario`.

**Errores posibles**

| Codigo | Cuando |
| --- | --- |
| `400` | Cuerpo invalido (ver 1.4) |
| `401` | `CredencialesInvalidasError` — correo inexistente o contrasena incorrecta (mensaje generico deliberado, no distingue el caso) |

### 2.3 `POST /api/auth/logout`

No tiene cuerpo. Si el encabezado `Authorization: Bearer <token>` esta presente, revoca
la sesion asociada a ese token. Si no esta presente, no falla (idempotente).

**Response `200 OK`**

```json
{ "mensaje": "Sesion cerrada" }
```

No produce errores propios de dominio; una revocacion de un token ya invalido no
produce error (la operacion es un `revocarPorToken` silencioso).

---

## 3. Servicios — `/api/servicios`

Cubre RF-05 a RF-08, RF-11 a RF-14, RF-16 a RF-18 — CU-03, CU-05. **Todas** las rutas de
este grupo requieren `Authorization: Bearer <token>` y rol `estudiante` o `docente`
(ver 1.1 y 1.2). Los recursos son siempre del usuario autenticado: intentar acceder a un
servicio de otro usuario responde `404` (mismo error que "no existe", ver 4).

### 3.1 Forma comun: objeto Servicio

Usada por `crear`, `editarConfiguracion`, `listar` (panel) y como base de `detalle`.

```json
{
  "idServicio": 1,
  "nombre": "mi-postgres",
  "descripcion": "Base de datos para el curso",
  "estado": "configurado",
  "fechaCreacion": "2026-08-07T00:00:00.000Z",
  "configuracion": {
    "imagenDocker": "postgres:16-alpine",
    "cpuAsignado": 1,
    "memoriaAsignada": 512,
    "almacenamientoAsignado": 1024,
    "puertos": [
      { "host": 5432, "contenedor": 5432, "protocolo": "tcp" }
    ],
    "variablesEntorno": { "POSTGRES_PASSWORD": "ejemplo" },
    "volumenes": [
      { "origen": "/datos/pg", "destino": "/var/lib/postgresql/data", "modo": "rw", "tipo": "bind" },
      { "origen": "datos-redis", "destino": "/data", "modo": "rw", "tipo": "volumen" }
    ]
  }
}
```

`configuracion` es `null` solo en un caso teoricamente inalcanzable desde la API actual
(un servicio sin ninguna version de configuracion); en la practica siempre habra al
menos la version creada junto con el servicio.

**`volumenes[].tipo` es un campo derivado de solo lectura** (DT-15). El backend lo calcula
al responder a partir de `origen`, reproduciendo la misma inferencia que hace Docker: es
`"bind"` cuando el origen es una ruta del host (empieza con `/`, `./`, `../`, `~` o una
letra de unidad de Windows) y `"volumen"` en cualquier otro caso. **No se envia en las
peticiones**; si se incluye, se ignora. El frontend lo usa para advertir al estudiante,
antes de confirmar un redespliegue o una eliminacion, que los volumenes con
`tipo: "volumen"` se destruyen y los `tipo: "bind"` se conservan (ver 3.9).

Valores posibles de `estado` (maquina de estados, seccion 4.2.14 del diseno):
`configurado`, `desplegando`, `en_ejecucion`, `detenido`, `reiniciando`, `fallido`,
`eliminado`.

### 3.2 Forma comun: objeto ServicioBasico

Usada por las operaciones de control `detener` y `reiniciar`:

```json
{ "idServicio": 1, "nombre": "mi-postgres", "estado": "en_ejecucion" }
```

Notese que **no** incluye `descripcion`, `fechaCreacion` ni `configuracion`.

`desplegar` y `eliminar` devuelven esta misma forma **mas tres campos** sobre la limpieza
del contenedor anterior (DT-15):

```json
{
  "idServicio": 1,
  "nombre": "mi-postgres",
  "estado": "en_ejecucion",
  "recreado": true,
  "volumenesEliminados": ["datos-redis"],
  "volumenesOmitidos": []
}
```

| Campo | Significado |
| --- | --- |
| `recreado` | `true` si ya existia un contenedor y hubo que eliminarlo antes de crear el nuevo. En `eliminar` es siempre `false` (no se crea nada). |
| `volumenesEliminados` | Nombres de los volumenes destruidos junto con el contenedor. Su contenido se perdio. |
| `volumenesOmitidos` | Volumenes que no se pudieron eliminar porque otro contenedor los sigue montando. Sus datos siguen intactos. |

Las tres listas son siempre arreglos; vacios cuando no hubo nada que retirar.

### 3.3 `GET /api/servicios/imagenes`

RF-07: catalogo curado de imagenes sugeridas. El usuario puede elegir una de estas o
escribir manualmente otra imagen valida en `configuracion.imagenDocker` al crear un
servicio (no hay restriccion de backend a este catalogo).

**Response `200 OK`**

```json
[
  { "nombre": "postgres:16-alpine", "descripcion": "Base de datos PostgreSQL 16" },
  { "nombre": "mysql:8", "descripcion": "Base de datos MySQL 8" },
  { "nombre": "mongo:7", "descripcion": "Base de datos MongoDB 7" },
  { "nombre": "redis:7-alpine", "descripcion": "Almacen en memoria Redis 7" },
  { "nombre": "nginx:1.27-alpine", "descripcion": "Servidor web Nginx" },
  { "nombre": "httpd:2.4-alpine", "descripcion": "Servidor web Apache HTTP" },
  { "nombre": "node:20-alpine", "descripcion": "Entorno de ejecucion Node.js 20" }
]
```

### 3.4 `GET /api/servicios`

RF-16: panel de servicios activos (no eliminados) del usuario autenticado.

**Response `200 OK`**: arreglo de objetos Servicio (seccion 3.1).

### 3.5 `POST /api/servicios`

RF-05, RF-06, RF-09: creacion de un servicio. Verifica disponibilidad de recursos del
servidor antes de persistir.

**Request body**

```json
{
  "nombre": "string, 3-120 caracteres",
  "descripcion": "string, hasta 500 caracteres (opcional)",
  "configuracion": {
    "imagenDocker": "string, 1-255 caracteres",
    "cpuAsignado": "number > 0, maximo 8 (nucleos)",
    "memoriaAsignada": "entero > 0, maximo 131072 (MB)",
    "almacenamientoAsignado": "entero > 0, maximo 1048576 (MB)",
    "puertos": [
      { "host": "entero 1-65535", "contenedor": "entero 1-65535", "protocolo": "tcp | udp" }
    ],
    "variablesEntorno": { "CLAVE": "valor (Record<string,string>)" },
    "volumenes": [
      { "origen": "string no vacio", "destino": "string no vacio", "modo": "ro | rw" }
    ]
  }
}
```

`puertos`, `variablesEntorno` y `volumenes` pueden ser arreglos/objeto vacios, pero los
tres campos son obligatorios en el cuerpo (no opcionales).

El `nombre` debe ser unico **entre los servicios activos** del usuario. Los servicios en
estado `eliminado` no lo reservan, asi que un nombre vuelve a estar disponible en cuanto
se elimina el servicio que lo usaba (DT-16). Usuarios distintos pueden usar el mismo
nombre sin conflicto.

**Response `201 Created`**: objeto Servicio (seccion 3.1), con `estado: "configurado"`.

**Errores posibles**

| Codigo | Cuando |
| --- | --- |
| `400` | Cuerpo invalido (ver 1.4) |
| `401` | Token ausente/invalido/expirado |
| `403` | Rol sin permiso |
| `409` | `NombreServicioDuplicadoError` — el usuario ya tiene un servicio **activo** con ese nombre |
| `422` | `RecursosInsuficientesError` — ver forma extendida en 8.2 |

### 3.6 `GET /api/servicios/:idServicio`

RF-17: detalle del servicio con su historico de operaciones de despliegue.

**Response `200 OK`**

```json
{
  "idServicio": 1,
  "nombre": "mi-postgres",
  "descripcion": "Base de datos para el curso",
  "estado": "en_ejecucion",
  "fechaCreacion": "2026-08-07T00:00:00.000Z",
  "configuracion": { "...": "igual a 3.1" },
  "contenedor": {
    "existe": true,
    "volumenes": [
      { "nombre": "datos-redis", "destino": "/data", "anonimo": false },
      {
        "nombre": "55cc6130e6b6b881f5353f86065017a2eccd6a6f88bbdc1d606b28e377edc537",
        "destino": "/var/lib/postgresql/data",
        "anonimo": true
      }
    ]
  },
  "registros": [
    {
      "idRegistro": 10,
      "fechaHora": "2026-08-07T00:05:00.000Z",
      "operacion": "desplegar",
      "resultado": "exito",
      "mensajeError": null,
      "idServicio": 1,
      "idUsuario": 1
    }
  ]
}
```

#### `contenedor`: lo que el contenedor tiene montado ahora mismo (DT-17)

Estado real consultado a Docker en el momento de la peticion. **Es la unica base exacta para
advertir al estudiante que perdera al desplegar o eliminar** (ver 3.9.1); `configuracion.volumenes`
describe lo que se pidio, no lo que esta montado, y los dos pueden diferir.

`contenedor.volumenes` lista solo los montajes de tipo volumen; los bind mount nunca aparecen,
porque nunca se destruyen. Cada elemento trae:

| Campo | Significado |
| --- | --- |
| `nombre` | Nombre del volumen en Docker. Para uno anonimo es un hash de 64 caracteres. |
| `destino` | Ruta dentro del contenedor. Es la etiqueta legible: para un volumen anonimo es lo unico que dice que contiene. |
| `anonimo` | `true` si lo creo la imagen por su instruccion `VOLUME` y el estudiante nunca lo declaro. |

El campo tiene tres formas posibles:

| Valor | Significado |
| --- | --- |
| `{ "existe": true, "volumenes": [...] }` | Hay contenedor; esos son sus volumenes (la lista puede estar vacia). |
| `{ "existe": false, "volumenes": [] }` | No hay contenedor: el servicio nunca se desplego, esta eliminado, o el contenedor se borro por fuera. No hay nada que perder. |
| `null` | No se pudo preguntar a Docker (motor caido u otro fallo de consulta). El resto del detalle es valido y la respuesta sigue siendo `200`: el frontend debe mostrar una advertencia generica en lugar de afirmar que no se perdera nada. |

Cuando el estado es `configurado` o `eliminado` el backend responde
`{ "existe": false, "volumenes": [] }` sin llegar a consultar a Docker, porque por la maquina de
estados no puede haber contenedor.

`registros` es el arreglo crudo de `RegistroDespliegue` de Prisma (sin transformar):
`operacion` es una de `desplegar | detener | reiniciar | eliminar | monitorear`;
`resultado` es `exito | fallo`; `mensajeError` es `string | null`.

`monitorear` no la origina una peticion del usuario: la genera automaticamente
`MonitorPeriodico` (RF-19) en su barrido cada 5 s, en dos escenarios:

- Un servicio marcado `en_ejecucion` en la base de datos ya no esta corriendo en
  Docker (se detuvo fuera de la plataforma, crasheo, o el contenedor fue removido):
  `resultado: "fallo"`, `mensajeError` describe el motivo, y el `estado` del servicio
  cambia a `fallido`.
- Un servicio marcado `detenido` en la base de datos aparece corriendo en Docker
  (se inicio fuera de la plataforma, por ejemplo con `docker start` desde la
  terminal): `resultado: "exito"`, sin `mensajeError`, y el `estado` del servicio
  cambia a `en_ejecucion`.

En ambos casos `idUsuario` en ese registro es el dueno del servicio, no un usuario
que ejecuto la accion.

**Errores posibles**: `401`, `403`, `404` (`ServicioNoEncontradoError` — no existe o no
pertenece al usuario).

### 3.7 `GET /api/servicios/:idServicio/metricas`

RF-18: historico de metricas de consumo, opcionalmente filtrado por rango de fechas.

**Query params (opcionales)**

| Parametro | Tipo | Descripcion |
| --- | --- | --- |
| `desde` | fecha coercible (ISO 8601 recomendado) | limite inferior inclusive |
| `hasta` | fecha coercible (ISO 8601 recomendado) | limite superior inclusive |

**Response `200 OK`**

```json
[
  {
    "idMetrica": 1,
    "consumoCpu": 0.35,
    "consumoMemoria": 128,
    "estadoEjecucion": "en_ejecucion",
    "marcaTiempo": "2026-08-07T00:10:00.000Z"
  }
]
```

**Errores posibles**

| Codigo | Cuando |
| --- | --- |
| `400` | Query string invalido — forma: `{ "error": "Parametros de consulta invalidos" }` (sin `detalles`, distinto del 400 de body, ver 1.4) |
| `401` / `403` | Igual que el resto del grupo |
| `404` | `ServicioNoEncontradoError` |

### 3.8 `PUT /api/servicios/:idServicio/configuracion`

RF-08: registra una nueva version de configuracion para un servicio propio. No
verifica recursos en este paso (la verificacion ocurre al desplegar). **No permite
cambiar `nombre` ni `descripcion`**, solo la configuracion tecnica.

**Request body**

```json
{ "configuracion": { "...": "mismo esquema que 3.5" } }
```

**Response `200 OK`**: objeto Servicio (seccion 3.1) con la configuracion actualizada
(la mas reciente pasa a ser la vigente).

Editar la configuracion **no modifica por si solo el contenedor en marcha**: la nueva
version queda registrada, pero solo surte efecto en el proximo despliegue, que recrea el
contenedor (ver 3.9). Para un servicio en ejecucion el flujo es `detener` y luego
`desplegar`.

**Errores posibles**: `400`, `401`, `403`, `404` (`ServicioNoEncontradoError`).

### 3.9 Operaciones de control del ciclo de vida

RF-11 a RF-14 — CU-05. Ninguna de estas rutas recibe cuerpo. Todas responden
`200 OK` en exito: `detener` y `reiniciar` con un objeto ServicioBasico, `desplegar` y
`eliminar` con la forma extendida que informa la limpieza (ambas en la seccion 3.2).

| Metodo y ruta | RF | Transiciones de origen validas | Estado resultante en exito |
| --- | --- | --- | --- |
| `POST /api/servicios/:idServicio/desplegar` | RF-11 | `configurado`, `detenido`, `fallido` | `en_ejecucion` |
| `POST /api/servicios/:idServicio/detener` | RF-12 | `en_ejecucion` | `detenido` |
| `POST /api/servicios/:idServicio/reiniciar` | RF-13 | `detenido`, `en_ejecucion`, `fallido` | `en_ejecucion` |
| `DELETE /api/servicios/:idServicio` | RF-14 | `configurado`, `desplegando`, `en_ejecucion`, `detenido`, `reiniciando`, `fallido` | `eliminado` (eliminacion logica; el registro se conserva) |

`desplegar` ademas verifica disponibilidad de recursos (RF-09) antes de invocar a
Docker; si la operacion Docker falla, el servicio queda en `fallido` y el error
original se propaga al cliente (no se enmascara).

`reiniciar` acepta `fallido` como origen (RF-19) porque el contenedor Docker
subyacente puede seguir existiendo aunque el servicio haya quedado `fallido` — por
ejemplo, si `MonitorPeriodico` lo marco asi tras detectar que se detuvo fuera de la
plataforma (ver 3.6). En ese caso `reiniciar` equivale a un `docker start`/`docker
restart` sobre el contenedor existente, sin recrearlo ni tocar sus volumenes.

#### 3.9.1 Recreacion del contenedor y perdida de volumenes

`desplegar` **recrea el contenedor cuando ya existe** (DT-15). Antes de crear el nuevo
comprueba contra Docker si el contenedor del servicio sigue presente y, en tal caso, lo
elimina. Esto es lo que hace que una configuracion editada con `PUT .../configuracion`
(3.8) surta efecto: la imagen, los puertos, las variables de entorno y los volumenes
del contenedor nuevo son los de la **configuracion vigente**.

Al retirar el contenedor se destruyen tambien sus volumenes:

| Tipo de montaje | Que ocurre |
| --- | --- |
| `tipo: "volumen"` (volumen nombrado, por ejemplo `datos-redis`) | **Se elimina. Su contenido se pierde de forma irreversible.** |
| Volumen anonimo (declarado por la imagen con `VOLUME`) | Se elimina junto con el contenedor. |
| `tipo: "bind"` (ruta del host, por ejemplo `/datos/pg`) | **Se conserva.** Es un directorio del host y Docker no lo toca. |

Que volumenes se eliminan se determina preguntandole a Docker que tiene montado el
contenedor en ese momento, no leyendo la configuracion guardada: si el estudiante edito
la configuracion despues de desplegar, la guardada ya no describe lo que esta montado.

Los volumenes anonimos cuentan como eliminados aunque Docker los arrastre junto con el
contenedor: estaban montados antes de la operacion y despues ya no existen.

Los nombres de volumen son globales en Docker, de modo que un volumen puede estar
compartido con otro contenedor. Si Docker se niega a eliminarlo por estar en uso, la
operacion **no falla**: el volumen se conserva y su nombre aparece en
`volumenesOmitidos`.

`DELETE /api/servicios/:idServicio` aplica exactamente la misma limpieza, y ademas
**libera el nombre del servicio** (DT-16): tras eliminarlo, `POST /api/servicios` acepta
de nuevo ese nombre. Es la via para corregir un nombre mal escrito cuando una actividad
exige uno concreto, ya que 3.8 no permite renombrar.

#### Como debe construir el frontend la advertencia (DT-17)

**El dialogo de confirmacion se construye con `contenedor.volumenes` del detalle (3.6), no con
`configuracion.volumenes`.** Antes de abrir el dialogo de `desplegar` o `eliminar`, pedir
`GET /api/servicios/:idServicio` y enumerar lo que ese campo devuelva. Tras la respuesta de la
operacion, mostrar `volumenesEliminados` y, si no esta vacio, `volumenesOmitidos`.

Usar la configuracion para ese dialogo produce avisos falsos en los dos sentidos, porque
describe lo que se pidio y no lo que esta montado:

| Situacion | Diria la configuracion | Ocurre en realidad |
| --- | --- | --- |
| El estudiante quito un volumen de la configuracion sin redesplegar | No se pierde nada | El contenedor viejo aun lo monta: se destruye |
| El estudiante agrego un volumen sin redesplegar | Se perdera ese volumen | No existe todavia: no se pierde nada |
| **Volumen anonimo** (el caso silencioso) | No se pierde nada | Se destruye, y suele contener todos los datos |

El tercer caso es el mas grave y el mas comun. Cuatro de las siete imagenes del catalogo (3.3)
declaran `VOLUME`: `postgres:16-alpine` (`/var/lib/postgresql/data`), `mysql:8`
(`/var/lib/mysql`), `mongo:7` (`/data/db`, `/data/configdb`) y `redis:7-alpine` (`/data`). Si el
estudiante despliega cualquiera de ellas con `volumenes: []`, Docker crea un volumen **anonimo**
con la base de datos entera dentro. Su configuracion lista cero volumenes, asi que un dialogo
basado en ella afirmaria "no se perdera nada" justo antes de borrarla.

Para presentarlos, apoyarse en `destino` y no en `nombre`: el nombre de un volumen anonimo es un
hash sin significado. Por ejemplo, "se perdera el contenido de /var/lib/postgresql/data (volumen
creado por la imagen)".

`configuracion.volumenes[].tipo` (3.1) sigue siendo util, pero para otra cosa: orientar al
estudiante **mientras edita la configuracion**, mostrandole cuales de los volumenes que esta
declarando sobreviviran a un redespliegue y cuales no. Para el dialogo de confirmacion no sirve.

Un servicio `en_ejecucion` no es origen valido de `desplegar`: para aplicarle cambios hay
que `detener` primero. Es deliberado, para que el estudiante no destruya por accidente un
contenedor en marcha y para que el ciclo de vida siga siendo visible.

**Errores posibles (comunes a las cuatro operaciones)**

| Codigo | Cuando |
| --- | --- |
| `401` / `403` | Igual que el resto del grupo |
| `404` | `ServicioNoEncontradoError` (no existe o no es del usuario) o `ContenedorNoEncontradoError` (el contenedor Docker subyacente no existe, en `detener`/`reiniciar`) |
| `409` | `TransicionInvalidaError` — la operacion no es valida desde el estado actual |
| `422` | `RecursosInsuficientesError` — solo en `desplegar` (ver forma extendida en 8.2); o `ImagenDockerNoDisponibleError` — solo en `desplegar` |
| `503` | `MotorDockerNoDisponibleError` — el socket de Docker no responde |

Notas sobre los errores desde DT-15:

- `desplegar` ya **no** devuelve `409 NombreContenedorEnUsoError` por un contenedor
  preexistente del propio servicio: ese es justamente el caso que ahora se recrea.
- `eliminar` ya no devuelve `404 ContenedorNoEncontradoError`: un servicio sin contenedor
  (nunca desplegado, o borrado por fuera) se marca `eliminado` igualmente.
- `VolumenEnUsoError` (409) y `VolumenNoEncontradoError` (404) estan en el catalogo de
  errores (seccion 9) pero **no llegan al cliente** en estas rutas: la limpieza los
  absorbe y los refleja en `volumenesOmitidos`.

---

## 4. Modulos de aprendizaje — `/api/modulos`

Cubre RF-20, RF-23 — CU-10, CU-12. Todas las rutas requieren autenticacion y estan
restringidas al rol `docente` (`autorizar("docente")`); un estudiante recibe `403`
en cualquiera de ellas.

### 4.1 Forma comun: objeto Modulo

El contenido del modulo es un arreglo ordenado de bloques (el orden del arreglo
es el orden de lectura); cada bloque es uno de cuatro tipos discriminados por el
campo `tipo` (ver DT-09, DT-10):

```json
{
  "idModulo": 1,
  "nombre": "Introduccion a contenedores",
  "contenido": [
    { "tipo": "texto", "contenido": "Los contenedores empaquetan una aplicacion y sus dependencias (Markdown)." },
    { "tipo": "imagen", "url": "/archivos/modulos/3f2a...c1.png", "textoAlternativo": "Diagrama de arquitectura" },
    { "tipo": "enlace", "url": "https://docs.docker.com/", "titulo": "Documentacion oficial de Docker", "descripcion": "Referencia completa" },
    { "tipo": "actividad", "idActividad": 7 }
  ],
  "orden": 1
}
```

Formas de bloque:

| Tipo | Campos |
| --- | --- |
| `texto` | `contenido: string` (Markdown, no vacio) |
| `imagen` | `url: string` (ruta devuelta por 4.5), `textoAlternativo?: string` |
| `enlace` | `url: string` (URL absoluta), `titulo: string`, `descripcion?: string` |
| `actividad` | `idActividad: number` (entero positivo; referencia una Actividad creada con 4.6 para el mismo modulo) |

### 4.2 `GET /api/modulos`

Lista todos los modulos existentes, ordenados por `orden` ascendente.

**Response `200 OK`**: arreglo de objetos Modulo (seccion 4.1).

**Errores posibles**: `401`, `403`.

### 4.2b `GET /api/modulos/:idModulo`

Devuelve un modulo individual con su `contenido` completo (los bloques crudos,
sin enriquecer — el docente ya conoce sus propias actividades).

**Response `200 OK`**: objeto Modulo (seccion 4.1).

**Errores posibles**

| Codigo | Cuando |
| --- | --- |
| `401` / `403` | Igual que el resto del grupo |
| `404` | `ModuloNoEncontradoError` — no existe un modulo con ese id |

### 4.3 `POST /api/modulos`

**Request body**

```json
{
  "nombre": "string, 3-160 caracteres",
  "contenido": "arreglo de 1 a 50 bloques (ver 4.1)",
  "orden": "entero > 0"
}
```

**Response `201 Created`**: objeto Modulo (seccion 4.1).

**Errores posibles**

| Codigo | Cuando |
| --- | --- |
| `400` | Cuerpo invalido (ver 1.4): arreglo `contenido` vacio o con mas de 50 bloques, bloque con `tipo` no reconocido, o bloque sin sus campos obligatorios |
| `401` / `403` | Igual que el resto del grupo |

### 4.4 `PUT /api/modulos/:idModulo`

Edita un modulo existente. Todos los campos del cuerpo son opcionales; solo se
actualizan los enviados.

**Request body**

```json
{ "...": "subconjunto de los campos de 4.3, todos opcionales" }
```

**Response `200 OK`**: objeto Modulo (seccion 4.1) con los campos actualizados.

**Errores posibles**

| Codigo | Cuando |
| --- | --- |
| `400` | Cuerpo invalido (ver 1.4) |
| `401` / `403` | Igual que el resto del grupo |
| `404` | `ModuloNoEncontradoError` — no existe un modulo con ese id |

### 4.5 `POST /api/modulos/imagenes`

Sube una imagen para usarla en un bloque de tipo `imagen` (ver 4.1). Recibe un
`multipart/form-data` con un unico campo de archivo llamado `imagen`.

**Limites**: tamano maximo 5 MB; tipos MIME permitidos `image/png`,
`image/jpeg`, `image/webp`, `image/gif` (validado por el `Content-Type`
declarado, no por los bytes reales del archivo — ver DT-09). El archivo se
guarda con un nombre generado (UUID), nunca con el nombre original.

**Response `201 Created`**

```json
{ "url": "/archivos/modulos/3f2a1b7c-....png" }
```

La `url` devuelta se sirve mediante `GET` sin autenticacion (montaje estatico
en `/archivos/modulos/*`, fuera de `/api` — ver DT-09), porque un `<img src>`
del frontend no puede adjuntar el header `Authorization`.

**Errores posibles**

| Codigo | Cuando |
| --- | --- |
| `400` | No se adjunto ningun archivo, el tipo MIME no esta permitido, o el archivo excede 5 MB |
| `401` / `403` | Igual que el resto del grupo |

### 4.6 `POST /api/modulos/:idModulo/actividades`

Crea una actividad practica dentro de un modulo, con los criterios que
`EvaluadorActividad` aplicara automaticamente para marcarla completada (RF-23,
ver DT-10). El `idActividad` devuelto se referencia luego desde un bloque
`actividad` del `contenido` del modulo (ver 4.1).

**Request body**

```json
{
  "descripcion": "string, minimo 3 caracteres",
  "criteriosValidacion": {
    "operacion": "desplegar | detener | reiniciar | eliminar",
    "condiciones": {
      "imagenDocker": "string (opcional)",
      "volumenesMinimos": "entero >= 0 (opcional)",
      "puertosMinimos": "entero >= 0 (opcional)",
      "cpuMinimo": "numero > 0 (opcional)",
      "memoriaMinima": "entero > 0 (opcional)"
    }
  },
  "orden": "entero > 0"
}
```

`condiciones` es opcional en su totalidad; cada campo dentro de ella tambien lo
es. Si se omite `condiciones`, el criterio se cumple con solo ejecutar la
`operacion` indicada sobre cualquier servicio propio del estudiante.

**Response `201 Created`**

```json
{
  "idActividad": 7,
  "descripcion": "Despliega un servicio con nginx y al menos un volumen",
  "criteriosValidacion": {
    "operacion": "desplegar",
    "condiciones": { "imagenDocker": "nginx", "volumenesMinimos": 1 }
  },
  "orden": 1,
  "idModulo": 3
}
```

**Errores posibles**

| Codigo | Cuando |
| --- | --- |
| `400` | Cuerpo invalido (ver 1.4): falta algun campo requerido, `operacion` no reconocida, o algun campo de `condiciones` con tipo o rango invalido |
| `401` / `403` | Igual que el resto del grupo |
| `404` | `ModuloNoEncontradoError` — no existe un modulo con ese `idModulo` |

### 4.7 `POST /api/modulos/:idModulo/evaluacion`

Crea la evaluacion del modulo (RF-24, ver DT-11). Cardinalidad 0-o-1 con el
modulo: un segundo intento de creacion falla.

**Request body**

```json
{
  "titulo": "string, minimo 3 caracteres",
  "preguntas": [
    {
      "pregunta": "string, minimo 3 caracteres",
      "opciones": ["string, 2 a 5 opciones"],
      "respuestaCorrecta": "entero >= 0, indice dentro de opciones"
    }
  ],
  "fechaDisponible": "fecha ISO 8601"
}
```

`preguntas` requiere al menos un elemento. Antes de esa fecha, el estudiante
no puede consultar ni responder la evaluacion (ver 6.3).

**Response `201 Created`**

```json
{
  "idEvaluacion": 12,
  "titulo": "Evaluacion: Redes en Docker",
  "preguntas": [
    {
      "pregunta": "¿Cual es la diferencia entre un volumen y un bind mount?",
      "opciones": ["...", "...", "...", "..."],
      "respuestaCorrecta": 1
    }
  ],
  "fechaDisponible": "2026-01-01T00:00:00.000Z",
  "idModulo": 3
}
```

Nota: esta respuesta es para el **docente** e incluye `respuestaCorrecta`. La
respuesta que ve el **estudiante** (6.3) la oculta.

**Errores posibles**

| Codigo | Cuando |
| --- | --- |
| `400` | Cuerpo invalido (ver 1.4): falta algun campo, menos de 2 u mas de 5 opciones en una pregunta, o `respuestaCorrecta` fuera de rango |
| `401` / `403` | Igual que el resto del grupo |
| `404` | `ModuloNoEncontradoError` — no existe un modulo con ese `idModulo` |
| `409` | `EvaluacionYaExisteError` — el modulo ya tiene una evaluacion |

---

## 5. Rutas de aprendizaje — `/api/rutas`

Cubre RF-21 — CU-11. Todas las rutas requieren autenticacion y estan restringidas
al rol `docente`; un estudiante recibe `403`.

### 5.1 `POST /api/rutas`

Asigna a un estudiante una ruta de aprendizaje compuesta por modulos existentes, en
el orden recibido. `ordenSecuencia` se deriva de la posicion de cada `idModulo`
dentro del arreglo (base 1); no se puede repetir un mismo `idModulo` en la misma
ruta (viola la llave primaria compuesta de `ruta_modulo`).

**Request body**

```json
{
  "idUsuario": "entero positivo (id del estudiante destino)",
  "idModulos": "arreglo de enteros positivos, minimo 1 elemento, en el orden deseado"
}
```

**Response `201 Created`**

```json
{
  "idRuta": 1,
  "idUsuario": 5,
  "progreso": 0,
  "fechaAsignacion": "2026-08-28T00:00:00.000Z",
  "modulos": [
    { "idModulo": 3, "ordenSecuencia": 1 },
    { "idModulo": 1, "ordenSecuencia": 2 }
  ]
}
```

**Errores posibles**

| Codigo | Cuando |
| --- | --- |
| `400` | Cuerpo invalido (ver 1.4) — por ejemplo, `idModulos` vacio |
| `401` / `403` | Igual que el resto del grupo |
| `404` | `UsuarioNoEncontradoError` — el `idUsuario` no existe; o `ModuloNoEncontradoError` — alguno de los `idModulos` no existe |

---

## 6. Aprendizaje del estudiante — `/api/aprendizaje`

Cubre RF-22, RF-23, RF-24 — CU-13, CU-12, CU-14. Todas las rutas requieren
autenticacion y estan restringidas al rol `estudiante`; un docente recibe `403`.

### 6.1 `GET /api/aprendizaje/mi-ruta`

Devuelve la ruta de aprendizaje mas reciente asignada al estudiante autenticado
(ver 5.1), con sus modulos en el orden de la secuencia y el nombre de cada uno.
`progreso` es el porcentaje de modulos de la ruta cuyo `estado` es
`"completado"` (ver DT-14): `modulos completados / total de modulos * 100`,
redondeado a dos decimales. Un modulo de solo lectura (sin actividades ni
evaluacion) cuenta como completado en cuanto se inicia. `CalculadorProgreso` lo
recalcula y persiste en `RutaAprendizaje` al iniciar un modulo (6.2), al
completarse una actividad (RF-23), al aprobarse una evaluacion (RF-24) y en
cada llamada a este endpoint (solo escribe si el valor cambio), por lo que
siempre coincide con los `estado` devueltos.

Cada modulo trae ademas `estado`: `"sin_iniciar"` si `fechaInicio` es null;
si el modulo ya fue iniciado, `"completado"` cuando todas sus actividades
tienen resultado y (si tiene evaluacion) esta fue aprobada, o `"en_progreso"`
en caso contrario (ver DT-13).

**Response `200 OK`** (con ruta asignada)

```json
{
  "idRuta": 1,
  "progreso": 0,
  "fechaAsignacion": "2026-08-28T00:00:00.000Z",
  "modulos": [
    { "idModulo": 3, "nombre": "Redes en Docker", "ordenSecuencia": 1, "estado": "en_progreso" },
    { "idModulo": 1, "nombre": "Introduccion a contenedores", "ordenSecuencia": 2, "estado": "sin_iniciar" }
  ]
}
```

**Response `200 OK`** (sin ninguna ruta asignada todavia): `null`.

**Errores posibles**: `401`, `403`.

### 6.1b `GET /api/aprendizaje/modulos/:idModulo`

Devuelve el contenido de un modulo asignado a la ruta activa del estudiante
(RF-23, ver DT-10). Los bloques `texto`, `imagen` y `enlace` se devuelven tal
cual (ver 4.1); cada bloque `actividad` se enriquece con la `descripcion` de la
actividad referenciada, para que el frontend no necesite otra llamada.
Deliberadamente **no** incluye `criteriosValidacion`: es informacion de
validacion automatica, no contenido educativo.

**Response `200 OK`**

```json
{
  "idModulo": 3,
  "nombre": "Redes en Docker",
  "orden": 1,
  "fechaInicio": "2026-08-28T10:00:00.000Z",
  "contenido": [
    { "tipo": "texto", "contenido": "Los contenedores empaquetan una aplicacion y sus dependencias (Markdown)." },
    { "tipo": "actividad", "idActividad": 7, "descripcion": "Despliega un servicio con nginx y al menos un volumen" }
  ]
}
```

`fechaInicio` es `null` si el estudiante aun no ha llamado a 6.2 para este
modulo.

**Errores posibles**

| Codigo | Cuando |
| --- | --- |
| `401` / `403` | Igual que el resto del grupo |
| `404` | `ModuloNoAsignadoError` — el `idModulo` no pertenece a la ruta activa del estudiante (o no tiene ninguna ruta asignada) |

### 6.2 `POST /api/aprendizaje/modulos/:idModulo/iniciar`

Marca que el estudiante llego al modulo indicado, para que `EvaluadorActividad`
pueda calcular `tiempoEmpleado` de sus actividades (RF-23, ver DT-10). Es
idempotente: llamarlo varias veces no reinicia la fecha ya registrada.
Ademas recalcula `RutaAprendizaje.progreso`: un modulo de solo lectura queda
completado al iniciarse, asi que el porcentaje sube en ese momento (DT-14).

**Response `200 OK`**

```json
{ "mensaje": "Modulo iniciado" }
```

**Errores posibles**

| Codigo | Cuando |
| --- | --- |
| `401` / `403` | Igual que el resto del grupo |
| `404` | `ModuloNoAsignadoError` — el `idModulo` no pertenece a la ruta activa del estudiante (o no tiene ninguna ruta asignada) |

### 6.3 `GET` y `POST /api/aprendizaje/modulos/:idModulo/evaluacion`

RF-24 (ver DT-11). Ambos exigen que `idModulo` pertenezca a la ruta activa del
estudiante y que la evaluacion ya haya alcanzado su `fechaDisponible`.

**`GET`** — devuelve las preguntas **sin** `respuestaCorrecta`:

```json
{
  "idEvaluacion": 12,
  "titulo": "Evaluacion: Redes en Docker",
  "fechaDisponible": "2026-01-01T00:00:00.000Z",
  "preguntas": [
    { "pregunta": "¿Cual es la diferencia entre un volumen y un bind mount?", "opciones": ["...", "...", "...", "..."] }
  ]
}
```

**`POST`** — envia las respuestas y devuelve la retroalimentacion inmediata
(RF-24), sin revelar cual era la opcion correcta en las preguntas falladas:

```json
{ "respuestas": [1, 0, 2, 3, 1] }
```

```json
{
  "puntuacion": 80,
  "aprobado": true,
  "intentosRestantes": 1,
  "detalle": [
    { "correcta": true },
    { "correcta": false }
  ]
}
```

`puntuacion` es el porcentaje de aciertos; `aprobado` compara contra
`UMBRAL_APROBACION_EVALUACION` (70, fijo — ver DT-11). Una vez aprobada, la
evaluacion se bloquea para nuevos intentos. `intentosRestantes` cuenta contra
`MAXIMO_INTENTOS_EVALUACION` (2, fijo).

**Errores posibles**

| Codigo | Cuando |
| --- | --- |
| `400` | (solo `POST`) `respuestas` no coincide en cantidad con las preguntas de la evaluacion, o el cuerpo es invalido (ver 1.4) |
| `401` / `403` | Igual que el resto del grupo |
| `404` | `ModuloNoAsignadoError` (el modulo no pertenece a la ruta del estudiante) o `EvaluacionNoEncontradaError` (el modulo no tiene evaluacion) |
| `409` | (solo `POST`) `EvaluacionYaAprobadaError` (ya se habia aprobado) o `IntentosAgotadosError` (se agoto el maximo de intentos) |
| `422` | `EvaluacionNoDisponibleError` — todavia no se alcanza `fechaDisponible` |

---

## 7. Usuarios — `/api/usuarios`

Recurso agregado por DT-08, fuera del catalogo formal de RF (no hay un RF de
reseteo administrativo de contrasena). Todas las rutas requieren autenticacion
y estan restringidas al rol `docente` (`autorizar("docente")`); un estudiante
recibe `403`. Reutiliza el mecanismo transversal de RF-04.

### 7.1 `PATCH /api/usuarios/:id/contrasena`

Reemplaza directamente la contrasena del usuario indicado por `:id`. No exige
la contrasena anterior, no envia confirmacion ni notifica al usuario afectado:
es una funcion minima pensada para uso durante el desarrollo (ver DT-08 para
el contexto y las limitaciones aceptadas).

**Request body**

```json
{ "contrasenaNueva": "string no vacio" }
```

**Response `200 OK`**

```json
{ "mensaje": "Contrasena actualizada" }
```

**Errores posibles**

| Codigo | Cuando |
| --- | --- |
| `400` | Cuerpo invalido: falta `contrasenaNueva` o es una cadena vacia (ver 1.4) |
| `401` / `403` | Igual que el resto del grupo |
| `404` | `UsuarioNoEncontradoError` — no existe un usuario con ese id |

---

## 8. Recursos del servidor — `/api/servidor`

Cubre RF-10 — CU-04. Requiere solo autenticacion (`autenticar`), sin restriccion de
rol adicional (cualquier usuario autenticado, estudiante o docente).

### `GET /api/servidor/capacidad`

**Response `200 OK`**

```json
{
  "total": { "cpu": 8, "memoria": 16384, "almacenamiento": 512000 },
  "comprometido": { "cpu": 2.5, "memoria": 4096, "almacenamiento": 20480 },
  "disponible": { "cpu": 5.5, "memoria": 12288, "almacenamiento": 491520 }
}
```

`cpu` esta en nucleos (puede tener decimales), `memoria` y `almacenamiento` en MB
(enteros). Estos valores provienen de una medicion real del sistema operativo
(memoria/disco libres, carga de CPU), no de una suma logica de lo asignado a cada
servicio: reflejan el uso de toda la maquina (SO, otros procesos, contenedores Docker).

**Errores posibles**: `401` (token ausente/invalido).

---

## 9. Catalogo de errores de dominio

Referencia completa de las clases en `src/dominio/errores/`, su codigo HTTP y el
`evento` que registran en bitacora (irrelevante para el frontend salvo como contexto).

| Clase | HTTP | Mensaje (`error`) | Campos extra en la respuesta |
| --- | --- | --- | --- |
| `CredencialesInvalidasError` | 401 | `Credenciales invalidas` | — |
| `TokenInvalidoError` | 401 | `Token invalido o expirado` | — |
| `PermisoDenegadoError` | 403 | `No tiene permiso para realizar esta accion` | — |
| `ServicioNoEncontradoError` | 404 | `Servicio no encontrado` | — |
| `ModuloNoEncontradoError` | 404 | `Modulo no encontrado` | — |
| `ModuloNoAsignadoError` | 404 | `El modulo no pertenece a tu ruta de aprendizaje` | — |
| `EvaluacionNoEncontradaError` | 404 | `Evaluacion no encontrada` | — |
| `ContenedorNoEncontradoError` | 404 | `El contenedor del servicio no existe` | — |
| `VolumenNoEncontradoError` | 404 | `El volumen <nombre> no existe` | — |
| `UsuarioNoEncontradoError` | 404 | `Usuario no encontrado` | — |
| `CorreoYaRegistradoError` | 409 | `El correo ya esta registrado` | — |
| `NombreServicioDuplicadoError` | 409 | `Ya tienes un servicio activo llamado <nombre>` | — |
| `VolumenEnUsoError` | 409 | `El volumen <nombre> esta en uso por otro contenedor` | — |
| `TransicionInvalidaError` | 409 | `No se puede <operacion> un servicio en estado '<estado>'` | — |
| `NombreContenedorEnUsoError` | 409 | `Ya existe un contenedor para este servicio` | Desde DT-15 es practicamente inalcanzable: el contenedor preexistente del propio servicio se recrea |
| `EvaluacionYaExisteError` | 409 | `El modulo ya tiene una evaluacion asociada` | — |
| `EvaluacionYaAprobadaError` | 409 | `Ya aprobaste esta evaluacion` | — |
| `IntentosAgotadosError` | 409 | `Se agotaron los intentos permitidos para esta evaluacion` | — |
| `TipoArchivoNoPermitidoError` | 400 | `Tipo de archivo no permitido` | — |
| `ArchivoDemasiadoGrandeError` | 400 | `El archivo excede el tamano maximo permitido` | — |
| `ArchivoNoProporcionadoError` | 400 | `No se proporciono ningun archivo` | — |
| `RespuestasIncompletasError` | 400 | `La cantidad de respuestas no coincide con la cantidad de preguntas` | — |
| `RecursosInsuficientesError` | 422 | `Recursos insuficientes para la configuracion solicitada` | `solicitado`, `disponible` (ver 9.2) |
| `ImagenDockerNoDisponibleError` | 422 | `La imagen Docker '<imagen>' no esta disponible` | — |
| `EvaluacionNoDisponibleError` | 422 | `La evaluacion todavia no esta disponible` | — |
| `MotorDockerNoDisponibleError` | 503 | `El motor Docker no esta disponible` | — |
| `RolNoDisponibleError` | 500 | Se responde con el mensaje generico `Error interno del servidor` (el mensaje real no se expone) | — |
| Cualquier otro error no controlado | 500 | `Error interno del servidor` | — |

### 9.2 Forma extendida de `RecursosInsuficientesError` (422)

```json
{
  "error": "Recursos insuficientes para la configuracion solicitada",
  "solicitado": { "cpu": 4, "memoria": 8192, "almacenamiento": 20480 },
  "disponible": { "cpu": 2, "memoria": 4096, "almacenamiento": 10240 }
}
```

---

## 10. Pendiente / fuera de alcance de este contrato

No implementado aun en el backend (no invocar desde el frontend todavia):

- Gestion de perfil propio del usuario (RF-04 como endpoint de autoservicio, p. ej.
  `GET/PUT /api/usuarios/yo`). El unico endpoint implementado en `/api/usuarios` es
  el reseteo administrativo de contrasena por el docente (DT-08, ver seccion 7).
- Flujo de autoservicio "olvide mi contrasena" (sin RF asignado en el catalogo; ver
  DT-08 para la relacion con el reseteo administrativo actual).
- `/api/reportes` (docente, RF-25, RF-26, CU-15, CU-16). Con RF-24 (ver
  seccion 6.3) la Etapa 6 queda completa; `/api/reportes` es lo unico
  pendiente de la Etapa 7.
- WebSockets o *polling* de metricas en vivo: por ahora `GET
  /api/servicios/:id/metricas` solo expone el historico persistido por
  `MonitorPeriodico` (RF-16, RF-18, RF-19); no hay endpoint de "metrica actual" fuera
  de ese historico.

Cuando el backend avance a la Etapa 7 (ver CLAUDE.md seccion 11), este documento
debe actualizarse antes de que el frontend dependa de esos endpoints.
