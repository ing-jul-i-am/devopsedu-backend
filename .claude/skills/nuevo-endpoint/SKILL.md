---
name: nuevo-endpoint
description: "Usa este skill cuando se solicite agregar un endpoint nuevo al backend de DevOpsEdu, exponer una nueva operacion REST, crear una ruta de la API, o cualquier variacion como 'agrega un endpoint para X', 'expon X en la API', 'crea la ruta para X'. Cubre el procedimiento completo con TDD: prueba primero, luego validador Zod, controlador, servicio de aplicacion, repositorio, registro en el router, manejo de errores y trazabilidad con RF/CU. Aplicalo SIEMPRE que la tarea implique nuevas rutas HTTP en este backend. Lee primero el skill 'ciclo-tdd' si aun no lo has leido en esta sesion."
---

# Skill: crear un nuevo endpoint en el backend de DevOpsEdu (TDD)

Este skill define el procedimiento obligatorio para agregar un endpoint nuevo respetando la arquitectura por capas y la metodología TDD. **Antes de seguirlo, lee el skill `ciclo-tdd`.**

## 1. Identifica los requerimientos cubiertos

- A qué RF y CU corresponde el endpoint (ver `CLAUDE.md` sección 8).
- A qué recurso pertenece (`servicios`, `usuarios`, `modulos`, etc.).
- Qué rol puede invocarlo (estudiante, docente o ambos).

Si el endpoint no encaja con ningún RF documentado, detente y consulta al desarrollador.

## 2. Escribe primero el test de integración (RED)

Antes de cualquier código de producción, define el contrato del endpoint mediante una prueba de integración con Supertest. Ubicación: `tests/integracion/api/<recurso>/<accion>.test.ts`.

```typescript
// tests/integracion/api/servicios/crear-servicio.test.ts
// Cubre: RF-05, RF-06, RF-07 — CU-03
import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { construirApp } from "../../../ayudas/construir-app.js";
import { limpiarBd } from "../../../ayudas/limpiar-bd.js";
import { crearUsuarioEnBd } from "../../../fixtures/usuario.factory.js";
import { tokenDePrueba } from "../../../ayudas/token-de-prueba.js";

describe("POST /api/servicios", () => {
  beforeEach(async () => {
    await limpiarBd();
  });

  it("crea un servicio con configuracion valida y devuelve 201", async () => {
    const usuario = await crearUsuarioEnBd({ rol: "estudiante" });
    const token = tokenDePrueba(usuario);
    const app = construirApp();

    const respuesta = await request(app)
      .post("/api/servicios")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nombre: "postgres-clase-04",
        descripcion: "Base de datos para la practica",
        configuracion: {
          imagenDocker: "postgres:16-alpine",
          cpuAsignado: 1,
          memoriaAsignada: 512,
          almacenamientoAsignado: 1024,
          puertos: [{ host: 5440, contenedor: 5432, protocolo: "tcp" }],
          variablesEntorno: { POSTGRES_PASSWORD: "demo" },
          volumenes: [],
        },
      });

    expect(respuesta.status).toBe(201);
    expect(respuesta.body).toMatchObject({
      nombre: "postgres-clase-04",
      estado: "configurado",
    });
  });

  it("rechaza con 400 cuando el nombre esta vacio", async () => {
    const usuario = await crearUsuarioEnBd({ rol: "estudiante" });
    const token = tokenDePrueba(usuario);
    const app = construirApp();

    const respuesta = await request(app)
      .post("/api/servicios")
      .set("Authorization", `Bearer ${token}`)
      .send({ nombre: "", configuracion: { /* ... */ } });

    expect(respuesta.status).toBe(400);
    expect(respuesta.body.errores).toBeDefined();
  });

  it("rechaza con 401 sin token de autenticacion", async () => {
    const app = construirApp();
    const respuesta = await request(app).post("/api/servicios").send({});
    expect(respuesta.status).toBe(401);
  });

  it("rechaza con 422 cuando los recursos solicitados exceden la capacidad", async () => {
    // ... mock del VerificadorRecursos o configuracion de escenario
  });
});
```

Ejecuta `npm run test:watch`. Todos los casos fallan. Esto es esperado y correcto.

## 3. Define el contrato con Zod

```typescript
// src/api/validadores/servicios/crear-servicio.validador.ts
// Cubre: RF-05, RF-06, RF-07 — CU-03
import { z } from "zod";

export const crearServicioSchema = z.object({
  nombre: z.string().min(3).max(120),
  descripcion: z.string().max(500).optional(),
  configuracion: z.object({
    imagenDocker: z.string().min(1),
    cpuAsignado: z.number().positive().max(8),
    memoriaAsignada: z.number().int().positive(),
    almacenamientoAsignado: z.number().int().positive(),
    puertos: z.array(z.object({
      host: z.number().int().min(1).max(65535),
      contenedor: z.number().int().min(1).max(65535),
      protocolo: z.enum(["tcp", "udp"]),
    })),
    variablesEntorno: z.record(z.string(), z.string()),
    volumenes: z.array(z.object({
      origen: z.string(),
      destino: z.string(),
      modo: z.enum(["ro", "rw"]),
    })),
  }),
});

export type CrearServicioDTO = z.infer<typeof crearServicioSchema>;
```

## 4. Prueba unitaria del servicio de aplicación (RED)

Antes de implementar la lógica de negocio, escribe sus pruebas unitarias con dependencias mockeadas.

```typescript
// tests/unitarias/servicios-aplicacion/gestor-servicios.test.ts
// Cubre: RF-05, RF-09 — CU-03, CU-04
import { describe, it, expect, vi } from "vitest";
import { GestorServicios } from "@/servicios-aplicacion/gestor-servicios.js";
import { RecursosInsuficientesError } from "@/dominio/errores/recursos-insuficientes-error.js";

describe("GestorServicios.crearServicio", () => {
  it("verifica recursos antes de persistir el servicio", async () => {
    const verificadorMock = {
      verificarDisponibilidad: vi.fn().mockResolvedValue({ aprobado: true, faltantes: {} }),
    };
    const repoMock = {
      crearConConfiguracion: vi.fn().mockResolvedValue({ idServicio: 1, estado: "configurado" }),
    };
    const gestor = new GestorServicios(repoMock as any, verificadorMock as any);

    await gestor.crearServicio(1, { /* DTO valido */ } as any);

    expect(verificadorMock.verificarDisponibilidad).toHaveBeenCalled();
    expect(verificadorMock.verificarDisponibilidad).toHaveBeenCalledBefore(
      repoMock.crearConConfiguracion as any
    );
  });

  it("lanza RecursosInsuficientesError cuando el verificador desaprueba", async () => {
    const verificadorMock = {
      verificarDisponibilidad: vi.fn().mockResolvedValue({
        aprobado: false,
        faltantes: { memoriaLibre: 256 },
      }),
    };
    const repoMock = { crearConConfiguracion: vi.fn() };
    const gestor = new GestorServicios(repoMock as any, verificadorMock as any);

    await expect(
      gestor.crearServicio(1, { /* DTO valido */ } as any)
    ).rejects.toBeInstanceOf(RecursosInsuficientesError);

    expect(repoMock.crearConConfiguracion).not.toHaveBeenCalled();
  });
});
```

## 5. Implementa (GREEN)

Implementa el repositorio, el servicio de aplicación y el controlador en este orden:

**Repositorio** (`src/repositorios/servicio-repo.ts`):

- Métodos con nombres descriptivos del negocio.
- Únicos puntos que importan `prisma-cliente`.
- Operaciones multi-tabla con `prisma.$transaction`.
- Errores de Prisma traducidos a errores de dominio.

**Servicio de aplicación** (`src/servicios-aplicacion/gestor-servicios.ts`):

```typescript
import { CrearServicioDTO } from "@/api/validadores/servicios/crear-servicio.validador.js";

export class GestorServicios {
  constructor(
    private readonly repoServicio: ServicioRepo,
    private readonly verificadorRecursos: VerificadorRecursos
  ) {}

  async crearServicio(idUsuario: number, dto: CrearServicioDTO) {
    const disponibilidad = await this.verificadorRecursos.verificarDisponibilidad({
      cpu: dto.configuracion.cpuAsignado,
      memoria: dto.configuracion.memoriaAsignada,
      almacenamiento: dto.configuracion.almacenamientoAsignado,
    });

    if (!disponibilidad.aprobado) {
      throw new RecursosInsuficientesError(disponibilidad.faltantes);
    }

    return this.repoServicio.crearConConfiguracion({ idUsuario, ...dto });
  }
}
```

**Controlador** (`src/api/controladores/servicios/crear-servicio.controlador.ts`):

```typescript
// crear-servicio.controlador.ts
// Cubre: RF-05, RF-06, RF-07 — CU-03
import { RequestHandler } from "express";

export const crearServicio: RequestHandler = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.idUsuario;
    const servicio = await gestorServicios.crearServicio(usuarioId, req.body);
    res.status(201).json(servicio);
  } catch (error) {
    next(error);
  }
};
```

## 6. Registra la ruta

En `src/api/rutas/servicios.rutas.ts`:

```typescript
router.post(
  "/",
  middlewareAuth,
  middlewareRol(["estudiante", "docente"]),
  middlewareValidar(crearServicioSchema),
  crearServicio
);
```

Orden de middlewares: autenticación → autorización → validación → controlador.

## 7. Verifica que TODAS las pruebas pasen

```bash
npm test
```

Si alguna prueba falla, vuelve atrás. No marques el endpoint como completo con pruebas en rojo.

## 8. REFACTOR

Con todas las pruebas en verde:

- Extrae duplicación.
- Mejora nombres.
- Asegura que el manejo de errores delegue al middleware global.
- Verifica que no hay imports cruzados que violen la regla de capas.

## 9. Trazabilidad

- Controlador, validador y archivos de prueba con cabecera de RF/CU.
- Mensaje de commit con el formato del skill `trazabilidad-requerimientos`.
- Ejemplo: `feat(servicios): agrega endpoint POST /api/servicios (RF-05, RF-06, RF-07, CU-03)`.

## Lista de verificación final

- [ ] Pruebas de integración escritas primero (Red).
- [ ] Pruebas unitarias del servicio de aplicación escritas primero (Red).
- [ ] Esquema Zod creado.
- [ ] Método del repositorio implementado.
- [ ] Lógica del servicio de aplicación implementada.
- [ ] Controlador implementado y registrado.
- [ ] Middlewares de auth, rol y validación encadenados correctamente.
- [ ] TODAS las pruebas pasan (`npm test`).
- [ ] Cobertura no cayó por debajo de los umbrales.
- [ ] Comentarios de cabecera con RF y CU presentes.
- [ ] Casos de error traducidos a códigos HTTP apropiados.
- [ ] Mensaje de commit con trazabilidad.
