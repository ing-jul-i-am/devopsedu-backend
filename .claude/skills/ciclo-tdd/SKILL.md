---
name: ciclo-tdd
description: "Skill obligatorio antes de escribir cualquier codigo nuevo en este proyecto. Define el flujo Red-Green-Refactor que debe seguirse para cumplir con la metodologia TDD del proyecto. Usalo cuando se te pida 'implementa X', 'agrega la funcionalidad Y', 'crea el endpoint Z', 'agrega el servicio W', o cualquier solicitud de nueva funcionalidad, ANTES de comenzar a escribir codigo de produccion. Tambien aplica al corregir bugs, donde la primera accion es escribir una prueba que reproduzca el bug. Aplicalo SIEMPRE; los unicos casos exceptuados estan listados en el CLAUDE.md seccion 7.2."
---

# Skill: ciclo TDD (Red-Green-Refactor)

Este skill define el flujo obligatorio para escribir código nuevo en el proyecto. La metodología TDD no es opcional: es la base sobre la que se sustentan las verificaciones del prototipo en la fase de pruebas formales.

## El ciclo en tres pasos

**1. RED.** Escribe una prueba que describa el comportamiento deseado. La prueba debe fallar al ejecutarse, porque el código que probaría aún no existe o aún no hace lo que la prueba exige. Si la prueba pasa accidentalmente desde el inicio, está mal escrita.

**2. GREEN.** Implementa lo mínimo necesario para que la prueba pase. Nada más. No agregues funcionalidad no probada, aunque sea tentador. Si surge la idea, anótala como TODO y trátala como ciclo separado.

**3. REFACTOR.** Con la prueba en verde, mejora el código sin cambiar su comportamiento: nombres, estructura, duplicación, separación de responsabilidades. Las pruebas siguen pasando todo el tiempo.

Repite el ciclo para la siguiente porción pequeña de comportamiento.

## Tamaño correcto de cada ciclo

Un ciclo bien dimensionado dura entre 2 y 15 minutos. Si una iteración se extiende:

- Probablemente la prueba abarca demasiado. Divídela.
- Probablemente faltan piezas anteriores. Retrocede a probar algo más básico.
- Probablemente hay un error de diseño. Detente y discute con el desarrollador.

## Aplicación en el backend de DevOpsEdu

### Ejemplo 1: nuevo servicio de aplicación (Autenticador)

**Ciclo 1 — RED:**

```typescript
// tests/unitarias/servicios-aplicacion/autenticador.test.ts
// Cubre: RF-02 — CU-01
import { describe, it, expect, vi } from "vitest";
import { Autenticador } from "@/servicios-aplicacion/autenticador.js";
import { CredencialesInvalidasError } from "@/dominio/errores/credenciales-invalidas-error.js";

describe("Autenticador.iniciarSesion", () => {
  it("rechaza el ingreso cuando el correo no existe", async () => {
    const repoMock = {
      buscarPorCorreo: vi.fn().mockResolvedValue(null),
    };
    const autenticador = new Autenticador(repoMock as any, {} as any);

    const intento = autenticador.iniciarSesion(
      "inexistente@devopsedu.local",
      "clave"
    );

    await expect(intento).rejects.toBeInstanceOf(CredencialesInvalidasError);
  });
});
```

Ejecutar: `npm run test:watch`. El test falla porque `Autenticador` aún no existe. Esto es Red.

**Ciclo 1 — GREEN:**

```typescript
// src/dominio/errores/credenciales-invalidas-error.ts
export class CredencialesInvalidasError extends Error {
  constructor() {
    super("Credenciales invalidas");
    this.name = "CredencialesInvalidasError";
  }
}
```

```typescript
// src/servicios-aplicacion/autenticador.ts
import { CredencialesInvalidasError } from "../dominio/errores/credenciales-invalidas-error.js";

export class Autenticador {
  constructor(
    private readonly repoUsuario: any,
    private readonly config: any
  ) {}

  async iniciarSesion(correo: string, _clave: string): Promise<never> {
    const usuario = await this.repoUsuario.buscarPorCorreo(correo);
    if (!usuario) throw new CredencialesInvalidasError();
    throw new CredencialesInvalidasError(); // placeholder, lo mejoraremos en el proximo ciclo
  }
}
```

El test pasa. Verde.

**Ciclo 1 — REFACTOR:**

Aún hay poco código. No hay nada que refactorizar todavía. Pasamos al siguiente ciclo.

**Ciclo 2 — RED:**

```typescript
it("rechaza el ingreso cuando la contrasena no coincide", async () => {
  const repoMock = {
    buscarPorCorreo: vi.fn().mockResolvedValue({
      idUsuario: 1,
      contrasenaCifrada: "$2b$12$hashreal",
    }),
  };
  const autenticador = new Autenticador(repoMock as any, {} as any);

  const intento = autenticador.iniciarSesion(
    "estudiante@devopsedu.local",
    "clave_incorrecta"
  );

  await expect(intento).rejects.toBeInstanceOf(CredencialesInvalidasError);
});
```

El nuevo test falla porque el código actual siempre lanza el error, pero por la razón equivocada (devolverá el mismo error pero por el camino incorrecto). Para distinguir el escenario correctamente, ahora debemos comparar contraseñas con bcrypt.

**Ciclo 2 — GREEN:**

Ajusta el `Autenticador` para usar bcrypt y comparar la contraseña real.

**Ciclo 2 — REFACTOR:**

El código ya tiene más sustancia. Extrae el tipo del repositorio a una interfaz `RepoUsuario` para no usar `any`.

Y así sucesivamente, hasta cubrir todos los escenarios: éxito, sesión activa creada, registro de evento, etc.

### Ejemplo 2: nuevo endpoint HTTP (test de integración)

**RED:**

```typescript
// tests/integracion/api/iniciar-sesion.test.ts
// Cubre: RF-02 — CU-01
import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { construirApp } from "@/tests/ayudas/construir-app.js";
import { limpiarBd } from "@/tests/ayudas/limpiar-bd.js";
import { crearUsuarioEnBd } from "@/tests/fixtures/usuario.factory.js";

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    await limpiarBd();
  });

  it("devuelve token y datos del usuario con credenciales validas", async () => {
    await crearUsuarioEnBd({
      correo: "estudiante@devopsedu.local",
      claveSinCifrar: "Clave_segura_1",
    });
    const app = construirApp();

    const respuesta = await request(app)
      .post("/api/auth/login")
      .send({
        correo: "estudiante@devopsedu.local",
        contrasena: "Clave_segura_1",
      });

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toMatchObject({
      token: expect.any(String),
      usuario: { correo: "estudiante@devopsedu.local" },
    });
  });

  it("devuelve 401 con credenciales invalidas", async () => {
    const app = construirApp();

    const respuesta = await request(app)
      .post("/api/auth/login")
      .send({ correo: "x@x.com", contrasena: "x" });

    expect(respuesta.status).toBe(401);
  });
});
```

**GREEN:** crea el validador Zod, el controlador, registra la ruta y la conecta al `Autenticador`. Las dos pruebas pasan.

**REFACTOR:** extrae duplicación, mejora nombres, asegura que el manejo de errores delegue al middleware global.

## Aserciones útiles

| Necesidad | Aserción Vitest |
| --- | --- |
| Comparar valores | `expect(a).toBe(b)` (referencias) o `toEqual` (estructural) |
| Comparar objetos parcialmente | `expect(obj).toMatchObject({...})` |
| Verificar excepción asíncrona | `await expect(promesa).rejects.toBeInstanceOf(ClaseError)` |
| Verificar llamada a mock | `expect(mock).toHaveBeenCalledWith(...)` |
| Verificar tipo o forma | `expect(valor).toEqual(expect.any(String))` |
| Verificar elemento ausente | `expect(coleccion).toHaveLength(0)` |

## Mocks: principios

- **No mockear lo que se quiere probar.** Si pruebas `Autenticador`, mockeas su `RepoUsuario`, no al propio `Autenticador`.
- **No mockear código de terceros directamente desde tests.** Crea un wrapper en tu código y mockea el wrapper. Ejemplo: en lugar de mockear Dockerode, mockea `cliente-docker.ts`.
- **Verificar interacciones solo si la interacción es parte del contrato.** Si pruebas que el `Autenticador` registra un evento de auditoría, verificar que se llama al logger es parte de la prueba. Si pruebas que devuelve un token, no necesitas verificar internals del logger.

## Lista de verificación antes de cerrar un ciclo

- [ ] Escribí la prueba primero (Red).
- [ ] La prueba fallaba antes de implementar.
- [ ] El código mínimo hace que la prueba pase (Green).
- [ ] Refactoricé sin romper la prueba.
- [ ] Las pruebas previas siguen verdes.
- [ ] La prueba describe comportamiento, no implementación.
- [ ] Sigo el patrón AAA (Arrange-Act-Assert) visiblemente separado.
- [ ] No mockeé lo que estoy probando.
- [ ] Los datos de prueba vienen de un factory en `tests/fixtures/`, no construidos a mano dentro del test.

## Cuándo apartarse del flujo

Hay casos en los que el flujo TDD estricto se afloja sin abandonarlo:

- **Spike o exploración:** cuando hay una incertidumbre técnica grande (por ejemplo, descubrir cómo se comporta Dockerode con cierta versión de Docker), está permitido escribir código exploratorio sin pruebas para entender el terreno. Una vez aprendida la lección, el spike se descarta y se vuelve a empezar el ciclo desde Red.
- **Bug fix:** la primera acción ante un defecto es escribir una prueba que lo reproduzca. Esa prueba debe fallar con el código actual. Luego se corrige.
- **Configuración trivial:** los archivos listados en el CLAUDE.md sección 7.2 no requieren prueba.

Nunca apartarse del flujo por prisa o por considerar que "es tan simple que no requiere prueba". Lo simple cae con la misma frecuencia que lo complejo, solo que sin red de seguridad.
