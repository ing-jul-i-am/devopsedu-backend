# CLAUDE.md — Backend de DevOpsEdu

Este archivo orienta a Claude Code en el desarrollo del backend de la plataforma educativa para gestión DevOps (DevOpsEdu). Las decisiones aquí registradas se derivan directamente del documento de diseño técnico del proyecto y deben respetarse a lo largo de toda la implementación.

**El proyecto sigue una metodología de desarrollo guiada por pruebas (TDD). Antes de leer el resto de este documento, revisa el skill `ciclo-tdd` en `.claude/skills/`. Toda funcionalidad nueva comienza por una prueba que falla.**

---

## 1. Identidad del proyecto

- **Nombre:** Plataforma Educativa para Gestión DevOps (DevOpsEdu)
- **Autor:** Julian Andrés Barrera García — Universidad Mariano Gálvez de Guatemala
- **Repositorio asociado:** Backend (`devopsedu-backend`). El frontend vive en `devopsedu-frontend`.
- **Propósito:** Permitir a estudiantes desplegar y monitorear contenedores Docker desde una interfaz gráfica educativa, con verificación previa de recursos y registro de operaciones para análisis comparativo.

El diseño formal se encuentra en `Diseño_tecnico_de_proyecto.pdf`. Cuando una decisión técnica no esté cubierta por este CLAUDE.md, consulta primero esa fuente.

---

## 2. Stack tecnológico

| Capa | Tecnología | Versión objetivo |
| --- | --- | --- |
| Lenguaje | TypeScript | 5.x estricto |
| Runtime | Node.js | 20 LTS |
| Framework HTTP | Express.js | 4.x |
| ORM | Prisma | 5.x |
| Base de datos | PostgreSQL | 16 |
| Cliente Docker | Dockerode | última estable |
| Validación | Zod | 3.x |
| Autenticación | JWT (jsonwebtoken) + bcrypt | últimas estables |
| Logging | Pino | 8.x o superior |
| **Framework de pruebas** | **Vitest** | **última estable** |
| **Tests HTTP de integración** | **Supertest** | **última estable** |
| **Mocking** | **vi.mock + vi.fn (incluidos en Vitest)** | — |

No agregues nuevas dependencias sin justificar el aporte respecto al alcance del prototipo (RNF-20).

---

## 3. Arquitectura por capas (regla central)

El backend cubre cuatro de las cinco capas del diseño (sección 4.2.3).

```
┌───────────────────────────────────────────────┐
│  Capa de Servicios (API REST + Adaptador Docker)
│  src/api/         src/docker/
├───────────────────────────────────────────────┤
│  Capa de Lógica de Negocio
│  src/dominio/     src/servicios-aplicacion/
├───────────────────────────────────────────────┤
│  Capa de Acceso a Datos (Repositorios + Prisma)
│  src/repositorios/
├───────────────────────────────────────────────┤
│  Capa de Base de Datos (PostgreSQL)
│  prisma/schema.prisma   docker-compose.yml
└───────────────────────────────────────────────┘
```

**Regla obligatoria de dependencias:** una capa solo puede importar de la capa inmediatamente inferior. Toda violación compromete el RNF-15.

---

## 4. Estructura de carpetas

```
devopsedu-backend/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── scripts/
│   └── preparar-bd-test.ts
├── src/
│   ├── api/
│   │   ├── rutas/
│   │   ├── controladores/
│   │   ├── middlewares/
│   │   └── validadores/
│   ├── dominio/
│   │   ├── modelos/
│   │   ├── errores/
│   │   └── reglas/
│   ├── servicios-aplicacion/
│   │   ├── autenticador.ts
│   │   ├── gestor-docker.ts
│   │   ├── verificador-recursos.ts
│   │   └── evaluador-actividad.ts
│   ├── repositorios/
│   │   ├── usuario-repo.ts
│   │   ├── servicio-repo.ts
│   │   └── ...
│   ├── docker/
│   │   ├── cliente-docker.ts
│   │   └── monitor-periodico.ts
│   ├── infraestructura/
│   │   ├── prisma-cliente.ts
│   │   ├── logger.ts
│   │   └── configuracion.ts
│   └── index.ts
├── tests/
│   ├── unitarias/                 # mockean dependencias externas
│   │   ├── dominio/
│   │   ├── servicios-aplicacion/
│   │   └── api/
│   ├── integracion/               # usan la base de pruebas y supertest
│   │   ├── api/
│   │   └── repositorios/
│   ├── fixtures/                  # funciones de fabrica (factories)
│   │   ├── usuario.factory.ts
│   │   ├── servicio.factory.ts
│   │   └── ...
│   ├── ayudas/                    # utilidades comunes para tests
│   │   ├── limpiar-bd.ts
│   │   ├── construir-app.ts
│   │   └── token-de-prueba.ts
│   └── configuracion/
│       ├── setup-global.ts        # corre antes de toda la suite
│       └── setup-cada-test.ts     # corre antes de cada test
├── .claude/
│   └── skills/
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

Crea las carpetas a medida que cada etapa lo requiera, no todas de golpe.

---

## 5. Configuración de Vitest

El archivo `vitest.config.ts` se configura desde la Etapa 0:

```typescript
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    globals: false,
    setupFiles: ["./tests/configuracion/setup-cada-test.ts"],
    globalSetup: "./tests/configuracion/setup-global.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/*.d.ts",
        "src/index.ts",
        "src/infraestructura/configuracion.ts",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
    testTimeout: 10_000,
    hookTimeout: 10_000,
  },
  resolve: {
    alias: {
      "@/": path.resolve(__dirname, "./src/"),
    },
  },
});
```

Justificación de los umbrales: 80% en líneas, funciones y declaraciones, y 75% en ramas, son objetivos razonables para un prototipo académico que practica TDD. Si una métrica está por debajo, el commit no debe cerrarse hasta entender por qué.

---

## 6. Convenciones obligatorias

### 6.1 Idioma del código

- **Comentarios, mensajes de log, errores hacia el usuario, descripciones de tests:** en español.
- **Identificadores en código:** en español, coherente con los nombres del diseño (`GestorDocker`, `VerificadorRecursos`, `Autenticador`, `EvaluadorActividad`).
- **Archivos:** `kebab-case` (`gestor-docker.ts`, `verificador-recursos.test.ts`).
- **Tipos y clases:** `PascalCase`.
- **Variables y funciones:** `camelCase`.
- **Columnas BD:** `snake_case` (manejado por Prisma con `@map`).

### 6.2 Convención de archivos de pruebas

- Tests unitarios: junto al archivo de origen no, sino en `tests/unitarias/` espejando la estructura de `src/`. Ejemplo: `src/servicios-aplicacion/autenticador.ts` se prueba en `tests/unitarias/servicios-aplicacion/autenticador.test.ts`.
- Tests de integración: `tests/integracion/<area>/<caso>.test.ts`.
- Nombres descriptivos en español: `cuando_credenciales_invalidas.test.ts`, `cuando_recursos_insuficientes.test.ts`. Un archivo por escenario amplio, con varios `it` dentro.

### 6.3 TypeScript estricto

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "resolveJsonModule": true,
    "skipLibCheck": true
  }
}
```

### 6.4 Validación de entrada

Todo endpoint que reciba un cuerpo, parámetros de ruta o query strings valida con un esquema Zod en `src/api/validadores/`.

### 6.5 Manejo de errores

- Clases de error de dominio en `src/dominio/errores/`.
- El middleware global de errores traduce las clases a códigos HTTP apropiados.
- Nunca devolver al cliente trazas internas (RNF-12, RNF-14).

### 6.6 Logging

- Pino con configuración pretty solo en desarrollo.
- Eventos del RNF-14 (intentos fallidos, accesos no autorizados, operaciones administrativas) con nivel `warn` y campo `evento` estructurado.
- En tests, el logger se silencia automáticamente para no contaminar la salida (configurado en `setup-global.ts`).
- Todo error que llega al middleware global de errores (`manejador-errores.ts`) deja un registro: `warn` para errores de dominio (4xx) y `error`/`fatal` para fallos internos (5xx) o de proceso. Los manejadores `process.on("uncaughtException"|"unhandledRejection")` en `src/index.ts` garantizan que ningún error escape sin registro, incluso fuera del ciclo de petición/respuesta (DT-12).

### 6.7 Variables de entorno

- Claves sensibles en `.env`, listado en `.gitignore`.
- `.env.example` sincronizado, sin valores reales.
- Lectura centralizada en `src/infraestructura/configuracion.ts` con validación Zod al arranque (RNF-21).

### 6.8 Seguridad

- Bcrypt con 12 rondas mínimo (RNF-10).
- JWT con expiración y registro en tabla `sesion` para revocación explícita.
- Middleware de autenticación y middleware de autorización por rol.
- Parámetros estructurados a Dockerode, nunca concatenación de cadenas (RNF-13).

---

## 7. Política de TDD

### 7.1 Cuándo aplica TDD obligatoriamente

TDD se aplica de forma obligatoria a:

- Toda lógica del dominio (`src/dominio/`).
- Todo servicio de aplicación (`src/servicios-aplicacion/`).
- Todo controlador HTTP (`src/api/controladores/`).
- Todo método de repositorio que contenga lógica más allá de un `prisma.modelo.create` directo.
- Todo middleware con lógica condicional.
- Todo wrapper de Docker que traduzca errores o realice transformaciones.

### 7.2 Cuándo NO aplica TDD

- Archivos de tipos puros (interfaces, type aliases).
- Configuración (variables de entorno, configuración de Vitest, configuración de Prisma).
- Archivos de arranque (`src/index.ts`).
- Migraciones de Prisma (se validan al ejecutarlas).
- Constantes y enums sin comportamiento.

### 7.3 Pirámide de pruebas

| Nivel | Cantidad esperada | Velocidad | Aislamiento |
| --- | --- | --- | --- |
| Unitarias | Muchas (60-70% del total) | < 50 ms cada una | Total: dependencias mockeadas |
| Integración | Algunas (25-35%) | < 500 ms cada una | Usan la base de pruebas y Supertest |
| End-to-end | Ninguna en el prototipo | — | Fuera de alcance |

### 7.4 Convención AAA (Arrange-Act-Assert)

Toda prueba sigue el patrón:

```typescript
it("rechaza el ingreso cuando las credenciales son invalidas", async () => {
  // Arrange
  const repoMock = crearRepoUsuarioMock();
  repoMock.buscarPorCorreo.mockResolvedValue(null);
  const autenticador = new Autenticador(repoMock, configFalsa);

  // Act
  const resultado = autenticador.iniciarSesion("inexistente@ejemplo.com", "clave");

  // Assert
  await expect(resultado).rejects.toBeInstanceOf(CredencialesInvalidasError);
});
```

Si una prueba mezcla las tres fases sin separación clara, se considera mal escrita y debe refactorizarse.

### 7.5 Funciones de fábrica (factories)

Todo dato de prueba se construye con funciones de fábrica en `tests/fixtures/`:

```typescript
// tests/fixtures/usuario.factory.ts
export function crearUsuarioDePrueba(
  parciales: Partial<Usuario> = {}
): Usuario {
  return {
    idUsuario: 1,
    nombre: "Estudiante de prueba",
    correo: "estudiante@devopsedu.local",
    contrasenaCifrada: "hash_falso",
    fechaRegistro: new Date("2026-01-01"),
    idRol: 1,
    ...parciales,
  };
}
```

Prohibido construir literales de datos extensos dentro de los tests. Eso oscurece la intención y genera duplicación.

### 7.6 Aislamiento entre tests

- Cada test es independiente: no se confía en orden de ejecución ni en datos dejados por otros.
- Antes de cada test de integración, las tablas relevantes se limpian mediante `tests/ayudas/limpiar-bd.ts`.
- No se permiten estados globales mutables entre tests.

---

## 8. Mapeo entre endpoints y requerimientos

| Grupo | Endpoint base | RF | CU |
| --- | --- | --- | --- |
| Identidad | `/api/auth` | RF-01, RF-02, RF-03 | CU-01, CU-02 |
| Usuarios | `/api/usuarios` | RF-01, RF-04 | — |
| Servicios | `/api/servicios` | RF-05 a RF-08, RF-11 a RF-15, RF-17 | CU-03, CU-05, CU-06, CU-07 |
| Recursos | `/api/servidor/capacidad` | RF-09, RF-10 | CU-04 |
| Monitoreo | `/api/metricas`, `/api/historico` | RF-16, RF-18, RF-19 | CU-08, CU-09 |
| Aprendizaje (estudiante) | `/api/aprendizaje` | RF-22 a RF-24 | CU-12, CU-13, CU-14 |
| Aprendizaje (docente) | `/api/modulos`, `/api/rutas`, `/api/reportes` | RF-20, RF-21, RF-25, RF-26 | CU-10, CU-11, CU-15, CU-16 |

Al crear un nuevo endpoint, registra en un comentario al inicio del controlador y de su archivo de pruebas los RF y CU que cubre.

---

## 9. Skills disponibles

En `.claude/skills/`:

- **`ciclo-tdd`** — flujo Red-Green-Refactor obligatorio. Consúltalo antes de cualquier otro skill cuando vayas a escribir código nuevo.
- **`nuevo-endpoint`** — crear un endpoint respetando las cinco capas, con TDD desde la prueba.
- **`nueva-entidad-prisma`** — agregar o modificar entidades del modelo de datos y sus migraciones.
- **`integracion-docker`** — patrones para operaciones sobre Docker mediante Dockerode con manejo de errores y pruebas con mocks.
- **`trazabilidad-requerimientos`** — formato de mensajes de commit y comentarios para mantener la referencia con RF, RNF y CU.

Si una tarea solicitada coincide con el alcance de un skill, léelo y síguelo antes de improvisar.

---

## 10. Comandos comunes

| Acción | Comando |
| --- | --- |
| Instalar dependencias | `npm install` |
| Levantar PostgreSQL (dev + test) | `docker compose up -d` |
| Generar cliente Prisma | `npx prisma generate` |
| Aplicar migraciones (desarrollo) | `npx prisma migrate dev` |
| Preparar base de pruebas | `npm run bd:test:preparar` |
| Resetear base de desarrollo | `npx prisma migrate reset` |
| Cargar datos semilla | `npx prisma db seed` |
| Prisma Studio | `npx prisma studio` |
| Servidor de desarrollo | `npm run dev` |
| Compilar | `npm run build` |
| Iniciar compilado | `npm start` |
| **Correr todas las pruebas** | **`npm test`** |
| **Pruebas en modo watch** | **`npm run test:watch`** |
| **Pruebas con cobertura** | **`npm run test:coverage`** |
| **Solo unitarias** | **`npm run test:unit`** |
| **Solo integración** | **`npm run test:integration`** |
| Lintar y formatear | `npm run lint`, `npm run format` |

Scripts esperados en `package.json`:

```json
"scripts": {
  "dev": "tsx watch src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js",
  "test": "npm run bd:test:preparar && vitest run",
  "test:watch": "vitest",
  "test:coverage": "npm run bd:test:preparar && vitest run --coverage",
  "test:unit": "vitest run tests/unitarias",
  "test:integration": "npm run bd:test:preparar && vitest run tests/integracion",
  "bd:test:preparar": "dotenv -e .env -- tsx scripts/preparar-bd-test.ts",
  "lint": "eslint . --ext .ts",
  "format": "prettier --write \"src/**/*.ts\" \"tests/**/*.ts\""
}
```

---

## 11. Mapa de etapas de implementación

| Etapa | Alcance | RF / RNF principales | Práctica TDD |
| --- | --- | --- | --- |
| 0 | Cimientos del repositorio + Vitest + linting + CI local | RNF-15, RNF-17, RNF-18, RNF-20, RNF-21 | Configurar el primer test "humo" que valide el arranque |
| 1 | Base de datos, repositorios base | 4.2.3.4, 4.2.3.5 | Tests de integración para cada método de repositorio antes de implementarlo |
| 2 | Gestión de identidad | RF-01 a RF-04, RNF-10, RNF-12, RNF-14 | Tests unitarios para Autenticador, integración para endpoints |
| 3 | Esqueleto de presentación | (vive en frontend) | — |
| 4 | Gestión de servicios y verificación de recursos | RF-05 a RF-10 | Tests unitarios para VerificadorRecursos con dependencias mockeadas |
| 5 | Despliegue, control, monitoreo | RF-11 a RF-19, RNF-08, RNF-09 | Tests unitarios mockeando Dockerode; integración con BD para registros |
| 6 | Componente educativo | RF-20 a RF-24 | Tests para EvaluadorActividad y reglas de validación |
| 7 | Reportes, exportación, endurecimiento | RF-25, RF-26, RNF-06, RNF-22 a RNF-25 | Tests de carga ligeros (RNF-24) |

No comiences una etapa sin que las pruebas de la etapa anterior estén en verde.

---

## 12. Reglas para Claude Code al modificar este repositorio

1. **Antes de escribir código de producción, escribe la prueba que lo justifique.** Si no puedes escribir la prueba, no entiendes aún el requerimiento. Detente y aclara antes de continuar. (Excepciones documentadas en sección 7.2.)
2. **Antes de escribir código nuevo, identifica la capa afectada.** Si la tarea cruza varias capas, descompónla y trabaja capa por capa, desde la inferior hacia la superior.
3. **Antes de cambiar el esquema, lee `nueva-entidad-prisma`.** Las migraciones son inmutables una vez aplicadas.
4. **No introduzcas dependencias nuevas sin justificación explícita.**
5. **Cada cambio funcional acompaña su referencia a RF, RNF o CU** en el comentario inicial del archivo y en el mensaje del commit.
6. **No uses emojis en código, comentarios, mensajes de commit ni documentación generada.** El proyecto es un trabajo académico y mantiene un registro formal escrito.
7. **No marques un cambio como terminado si las pruebas no pasan localmente.** Tampoco si la cobertura cae por debajo de los umbrales.
8. **Si una decisión técnica no está cubierta aquí ni en el diseño técnico, detente y pregunta al desarrollador antes de improvisar.**

---

## 13. Referencias rápidas

- Diagrama ER: sección 4.2.17.
- Catálogo de RF: sección 4.2.6.1.1.
- Catálogo de RNF: sección 4.2.6.1.2.
- Casos de uso: sección 4.2.8.
- Diagrama de estados: sección 4.2.14.
- Diagrama de componentes: sección 4.2.16.
- Manual de configuración de la base de datos: `manual-DB.md`.
