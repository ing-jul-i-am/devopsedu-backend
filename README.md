# DevOpsEdu — Backend

API REST de la Plataforma Educativa para Gestion DevOps (DevOpsEdu). Permite a los
estudiantes configurar, desplegar y monitorear contenedores Docker desde una interfaz
grafica, con verificacion previa de los recursos del servidor, y ofrece al docente la
gestion de modulos y rutas de aprendizaje con validacion automatica de actividades.

- Autor: Julian Andres Barrera Garcia, Universidad Mariano Galvez de Guatemala.
- Frontend asociado: repositorio `devopsedu-frontend`.
- Cubre: RNF-16 (documentacion tecnica).

## Stack

| Capa | Tecnologia |
| --- | --- |
| Lenguaje y runtime | TypeScript 5 (modo estricto) sobre Node.js 20 LTS |
| HTTP | Express 4 |
| Datos | Prisma 6 sobre PostgreSQL 16 |
| Docker | Dockerode |
| Validacion | Zod |
| Seguridad | JWT (jsonwebtoken) y bcrypt con 12 rondas |
| Logging | Pino |
| Reportes en PDF | pdfkit |
| Pruebas | Vitest y Supertest |

## Arquitectura

El codigo se organiza en capas, y cada capa solo importa de la inmediatamente inferior
(RNF-15):

| Capa | Carpetas |
| --- | --- |
| Servicios (API REST y adaptador Docker) | `src/api/`, `src/docker/` |
| Logica de negocio | `src/dominio/`, `src/servicios-aplicacion/` |
| Acceso a datos | `src/repositorios/` |
| Base de datos | `prisma/schema.prisma`, `docker-compose.yml` |

`src/infraestructura/` agrupa piezas transversales (configuracion, logger, cliente
Prisma, cifrado y emision de tokens) y `src/composicion.ts` ensambla las dependencias.

## Requisitos

- Node.js 20 LTS y npm.
- Docker Engine con Docker Compose. El backend se conecta al socket local de Docker
  (`/var/run/docker.sock`), por lo que el usuario que lo ejecuta necesita permiso sobre el.
- Linux (o WSL2) como sistema anfitrion (RNF-19).

## Puesta en marcha

```bash
# 1. Dependencias
npm install

# 2. Variables de entorno: copiar la plantilla y completar JWT_SECRET (16 caracteres o mas)
cp .env.example .env

# 3. Bases de datos de desarrollo (puerto 5432) y de pruebas (puerto 5433)
docker compose up -d

# 4. Cliente Prisma, migraciones y datos semilla
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# 5. Servidor de desarrollo (http://localhost:3000 por defecto)
npm run dev
```

El seed crea los roles `estudiante` y `docente` y un docente administrador con correo
`admin@devopsedu.local`. Su contrasena se toma de `ADMIN_PASSWORD_INICIAL` si esta
definida al ejecutar el seed; si no, es `cambiar_en_primer_ingreso`, que debe cambiarse.

Las cuentas nuevas que se registran por `POST /api/auth/registro` reciben el rol
indicado en `ROL_POR_DEFECTO` (por defecto, `estudiante`).

## Variables de entorno

Se leen y validan con Zod al arranque en `src/infraestructura/configuracion.ts`; si una
variable obligatoria falta o es invalida, la aplicacion no inicia (RNF-21). La lista
completa, con valores de ejemplo, esta en `.env.example`.

| Variable | Obligatoria | Uso |
| --- | --- | --- |
| `DATABASE_URL` | Si | Conexion a la base de desarrollo |
| `DATABASE_URL_TEST` | Para pruebas | Conexion a la base de pruebas |
| `DB_USER`, `DB_PASSWORD`, `DB_NAME` (y sus variantes `_TEST`) | Para Compose | Credenciales de los contenedores de PostgreSQL |
| `JWT_SECRET` | Si | Secreto de firma de los tokens (minimo 16 caracteres) |
| `JWT_EXPIRACION_SEGUNDOS` | No (3600) | Vigencia de los tokens |
| `PORT` | No (3000) | Puerto HTTP |
| `ROL_POR_DEFECTO` | No (`estudiante`) | Rol asignado en el registro |
| `SERVIDOR_RUTA_DISCO` | No (`/`) | Ruta cuyo espacio libre se mide al verificar recursos |
| `MONITOR_INTERVALO_MS` | No (5000) | Frecuencia del monitor de metricas, maximo 5000 (RNF-09) |
| `CORS_ORIGENES` | No (servidor de Vite) | Origenes del frontend autorizados, separados por comas |
| `RUTA_ALMACENAMIENTO_MODULOS` | No (`uploads/modulos`) | Carpeta de imagenes subidas para los modulos |

## Pruebas

El proyecto sigue TDD (ver `.claude/skills/ciclo-tdd`). Las pruebas unitarias mockean
las dependencias externas; las de integracion usan la base de pruebas y Supertest.

| Accion | Comando |
| --- | --- |
| Toda la suite | `npm test` |
| Solo unitarias (no requieren base de datos) | `npm run test:unit` |
| Solo integracion | `npm run test:integration` |
| Con cobertura | `npm run test:coverage` |
| Modo watch | `npm run test:watch` |

`npm test`, `test:integration` y `test:coverage` aplican primero las migraciones a la
base de pruebas (`npm run bd:test:preparar`). Esa base vive en memoria (tmpfs), de modo
que queda vacia cada vez que se reinicia su contenedor y este paso es necesario.

Umbrales de cobertura: 80% en lineas, funciones y declaraciones, y 75% en ramas.

## Otros comandos

| Accion | Comando |
| --- | --- |
| Compilar | `npm run build` |
| Iniciar lo compilado | `npm start` |
| Lint | `npm run lint` |
| Formato | `npm run format` |
| Resetear la base de desarrollo | `npx prisma migrate reset` |
| Prisma Studio | `npx prisma studio` |

## Endpoints

| Grupo | Ruta base | Requerimientos |
| --- | --- | --- |
| Identidad | `/api/auth` | RF-01, RF-02, RF-03 |
| Usuarios | `/api/usuarios` | RF-04, RF-25 |
| Servicios y monitoreo | `/api/servicios` | RF-05 a RF-08, RF-11 a RF-19 |
| Recursos del servidor | `/api/servidor/capacidad` | RF-09, RF-10 |
| Modulos (docente) | `/api/modulos` | RF-20, RF-23, RF-24 |
| Rutas de aprendizaje (docente) | `/api/rutas` | RF-21 |
| Reportes (docente) | `/api/reportes` | RF-25 |
| Aprendizaje (estudiante) | `/api/aprendizaje` | RF-22, RF-23, RF-24 |

El detalle de cada endpoint (cuerpos, respuestas y errores) esta en
[`docs/contrato-api.md`](docs/contrato-api.md). En `postman/` hay una coleccion y un
entorno de Postman, y en `postman/ruta-modelo/` los cuerpos de una ruta de aprendizaje de
ejemplo con cuatro modulos.

## Estado

Implementadas las etapas 0 a 7 del plan: identidad, servicios, despliegue y monitoreo,
componente educativo, y reportes de progreso para el docente con exportacion en CSV o PDF
(`/api/reportes` y `/api/usuarios/estudiantes`, RF-25, CU-15, CU-16). RNF-06, RNF-23 y
RNF-24 quedaron postergados por decision del desarrollador. El mapa de etapas esta en
`CLAUDE.md`, seccion 11.

## Documentacion

- [`docs/contrato-api.md`](docs/contrato-api.md): contrato de la API para el frontend.
- [`docs/decisiones-tecnicas.md`](docs/decisiones-tecnicas.md): decisiones tecnicas
  (DT-01 en adelante) que complementan o ajustan el diseno.
- `CLAUDE.md`: convenciones, politica de TDD y mapa de etapas.
- Documento de diseno tecnico del proyecto: fuente de los RF, RNF y CU citados en el
  codigo.
