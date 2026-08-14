# Contrato de API — DevOpsEdu Backend

Estado del backend a partir del cual se genera este contrato: rama `segunda-semana`,
commit `04f88c2` ("feat(servicios): verificacion de recursos basada en disponibilidad
real del SO (RF-09, RF-10, DT-06)").

Este documento describe **unicamente los endpoints ya implementados**. Los grupos
`/api/aprendizaje`, `/api/modulos`, `/api/rutas` y `/api/reportes` (etapa 6-7, RF-20 a
RF-26) todavia no existen en el backend y no deben asumirse disponibles por el
frontend. Cuando se implementen, este documento se actualizara.

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
      { "origen": "/datos/pg", "destino": "/var/lib/postgresql/data", "modo": "rw" }
    ]
  }
}
```

`configuracion` es `null` solo en un caso teoricamente inalcanzable desde la API actual
(un servicio sin ninguna version de configuracion); en la practica siempre habra al
menos la version creada junto con el servicio.

Valores posibles de `estado` (maquina de estados, seccion 4.2.14 del diseno):
`configurado`, `desplegando`, `en_ejecucion`, `detenido`, `reiniciando`, `fallido`,
`eliminado`.

### 3.2 Forma comun: objeto ServicioBasico

Usada por las operaciones de control (`desplegar`, `detener`, `reiniciar`, `eliminar`):

```json
{ "idServicio": 1, "nombre": "mi-postgres", "estado": "en_ejecucion" }
```

Notese que **no** incluye `descripcion`, `fechaCreacion` ni `configuracion`.

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

**Response `201 Created`**: objeto Servicio (seccion 3.1), con `estado: "configurado"`.

**Errores posibles**

| Codigo | Cuando |
| --- | --- |
| `400` | Cuerpo invalido (ver 1.4) |
| `401` | Token ausente/invalido/expirado |
| `403` | Rol sin permiso |
| `422` | `RecursosInsuficientesError` — ver forma extendida en 4.2 |

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

`registros` es el arreglo crudo de `RegistroDespliegue` de Prisma (sin transformar):
`operacion` es una de `desplegar | detener | reiniciar | eliminar`; `resultado` es
`exito | fallo`; `mensajeError` es `string | null`.

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
verifica recursos en este paso (la verificacion ocurre al desplegar).

**Request body**

```json
{ "configuracion": { "...": "mismo esquema que 3.5" } }
```

**Response `200 OK`**: objeto Servicio (seccion 3.1) con la configuracion actualizada
(la mas reciente pasa a ser la vigente).

**Errores posibles**: `400`, `401`, `403`, `404` (`ServicioNoEncontradoError`).

### 3.9 Operaciones de control del ciclo de vida

RF-11 a RF-14 — CU-05. Ninguna de estas rutas recibe cuerpo. Todas responden
`200 OK` con un objeto ServicioBasico (seccion 3.2) en exito.

| Metodo y ruta | RF | Transiciones de origen validas | Estado resultante en exito |
| --- | --- | --- | --- |
| `POST /api/servicios/:idServicio/desplegar` | RF-11 | `configurado`, `detenido`, `fallido` | `en_ejecucion` |
| `POST /api/servicios/:idServicio/detener` | RF-12 | `en_ejecucion` | `detenido` |
| `POST /api/servicios/:idServicio/reiniciar` | RF-13 | `detenido`, `en_ejecucion` | `en_ejecucion` |
| `DELETE /api/servicios/:idServicio` | RF-14 | `configurado`, `desplegando`, `en_ejecucion`, `detenido`, `reiniciando`, `fallido` | `eliminado` (eliminacion logica; el registro se conserva) |

`desplegar` ademas verifica disponibilidad de recursos (RF-09) antes de invocar a
Docker; si la operacion Docker falla, el servicio queda en `fallido` y el error
original se propaga al cliente (no se enmascara).

**Errores posibles (comunes a las cuatro operaciones)**

| Codigo | Cuando |
| --- | --- |
| `401` / `403` | Igual que el resto del grupo |
| `404` | `ServicioNoEncontradoError` (no existe o no es del usuario) o `ContenedorNoEncontradoError` (el contenedor Docker subyacente no existe, en `detener`/`reiniciar`/`eliminar`) |
| `409` | `TransicionInvalidaError` — la operacion no es valida desde el estado actual; o `NombreContenedorEnUsoError` — solo en `desplegar` |
| `422` | `RecursosInsuficientesError` — solo en `desplegar` (ver forma extendida en 4.2); o `ImagenDockerNoDisponibleError` — solo en `desplegar` |
| `503` | `MotorDockerNoDisponibleError` — el socket de Docker no responde |

---

## 4. Recursos del servidor — `/api/servidor`

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

## 5. Catalogo de errores de dominio

Referencia completa de las clases en `src/dominio/errores/`, su codigo HTTP y el
`evento` que registran en bitacora (irrelevante para el frontend salvo como contexto).

| Clase | HTTP | Mensaje (`error`) | Campos extra en la respuesta |
| --- | --- | --- | --- |
| `CredencialesInvalidasError` | 401 | `Credenciales invalidas` | — |
| `TokenInvalidoError` | 401 | `Token invalido o expirado` | — |
| `PermisoDenegadoError` | 403 | `No tiene permiso para realizar esta accion` | — |
| `ServicioNoEncontradoError` | 404 | `Servicio no encontrado` | — |
| `ContenedorNoEncontradoError` | 404 | `El contenedor del servicio no existe` | — |
| `CorreoYaRegistradoError` | 409 | `El correo ya esta registrado` | — |
| `TransicionInvalidaError` | 409 | `No se puede <operacion> un servicio en estado '<estado>'` | — |
| `NombreContenedorEnUsoError` | 409 | `Ya existe un contenedor para este servicio` | — |
| `RecursosInsuficientesError` | 422 | `Recursos insuficientes para la configuracion solicitada` | `solicitado`, `disponible` (ver 4.2) |
| `ImagenDockerNoDisponibleError` | 422 | `La imagen Docker '<imagen>' no esta disponible` | — |
| `MotorDockerNoDisponibleError` | 503 | `El motor Docker no esta disponible` | — |
| `RolNoDisponibleError` | 500 | Se responde con el mensaje generico `Error interno del servidor` (el mensaje real no se expone) | — |
| Cualquier otro error no controlado | 500 | `Error interno del servidor` | — |

### 4.2 Forma extendida de `RecursosInsuficientesError` (422)

```json
{
  "error": "Recursos insuficientes para la configuracion solicitada",
  "solicitado": { "cpu": 4, "memoria": 8192, "almacenamiento": 20480 },
  "disponible": { "cpu": 2, "memoria": 4096, "almacenamiento": 10240 }
}
```

---

## 6. Pendiente / fuera de alcance de este contrato

No implementado aun en el backend (no invocar desde el frontend todavia):

- `PUT /api/usuarios/*` (gestion de perfil, RF-04)
- `/api/aprendizaje/*` (estudiante, RF-22 a RF-24, CU-12 a CU-14)
- `/api/modulos`, `/api/rutas`, `/api/reportes` (docente, RF-20, RF-21, RF-25, RF-26,
  CU-10, CU-11, CU-15, CU-16)
- WebSockets o *polling* de metricas en vivo: por ahora `GET
  /api/servicios/:id/metricas` solo expone el historico persistido por
  `MonitorPeriodico` (RF-16, RF-18, RF-19); no hay endpoint de "metrica actual" fuera
  de ese historico.

Cuando el backend avance a las etapas 6-7 (ver CLAUDE.md seccion 11), este documento
debe actualizarse antes de que el frontend dependa de esos endpoints.
