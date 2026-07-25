---
name: integracion-docker
description: "Usa este skill cuando se solicite implementar o modificar operaciones sobre Docker desde el backend: crear contenedores, iniciarlos, detenerlos, reiniciarlos, eliminarlos, obtener metricas de consumo, listar imagenes, verificar disponibilidad de recursos del servidor, o frases como 'integra Docker', 'usa Dockerode', 'despliega un contenedor', 'consulta el estado de los contenedores', 'mide CPU y memoria'. Cubre los patrones obligatorios con TDD: prueba con mocks de Dockerode primero, parametros estructurados, traduccion de errores, registro en bitacora, mapeo a la maquina de estados. Aplicalo SIEMPRE que se vaya a tocar el archivo cliente-docker.ts, gestor-docker.ts o verificador-recursos.ts."
---

# Skill: integración con Docker mediante Dockerode (TDD)

Este skill define los patrones obligatorios para interactuar con el motor Docker. Toda operación que modifique el estado de un contenedor pasa por la clase `GestorDocker` (servicio de aplicación), que delega en el wrapper `cliente-docker.ts` (capa de servicios). **Antes de seguirlo, lee el skill `ciclo-tdd`.**

## 1. Reglas inquebrantables

1. **Solo parámetros estructurados.** Nunca construyas comandos concatenando cadenas (RNF-13).
2. **Cada operación deja huella** en `registro_despliegue` con fecha, usuario y resultado (RF-15).
3. **Sincroniza el estado del servicio** tras cada operación conforme a la sección 4.2.14: `configurado`, `desplegando`, `en_ejecucion`, `detenido`, `reiniciando`, `fallido`, `eliminado`.
4. **Verifica recursos antes de desplegar** invocando a `VerificadorRecursos` (RF-09, CU-04).
5. **Nombres de contenedor determinísticos**: `devopsedu-<idServicio>-<nombre_normalizado>`.

## 2. Estrategia de pruebas

Dockerode habla con un socket Unix; no es razonable invocarlo directamente desde pruebas unitarias. La estrategia es:

- **Tests unitarios**: mockear el módulo `dockerode` con `vi.mock`.
- **Tests de integración del wrapper**: opcionalmente, contra un contenedor Docker real, pero solo en una capa: el archivo `cliente-docker.ts`. El resto se prueba con mocks del wrapper.

### 2.1 Test unitario: traducción de errores

```typescript
// tests/unitarias/docker/cliente-docker.test.ts
// Cubre: RF-11, RNF-13
import { describe, it, expect, vi, beforeEach } from "vitest";

const docker = {
  createContainer: vi.fn(),
};

vi.mock("dockerode", () => ({
  default: vi.fn().mockImplementation(() => docker),
}));

import { crearContenedor } from "@/docker/cliente-docker.js";
import { ImagenDockerNoDisponibleError } from "@/dominio/errores/imagen-docker-no-disponible-error.js";

describe("cliente-docker.crearContenedor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("traduce error 404 de Docker a ImagenDockerNoDisponibleError", async () => {
    docker.createContainer.mockRejectedValue({ statusCode: 404, message: "No such image" });

    await expect(
      crearContenedor({
        nombre: "test-1",
        imagen: "inexistente:1",
        cpuAsignado: 1,
        memoriaAsignada: 256,
        almacenamientoAsignado: 1024,
        puertos: [],
        variablesEntorno: {},
        volumenes: [],
      })
    ).rejects.toBeInstanceOf(ImagenDockerNoDisponibleError);
  });

  it("convierte cpuAsignado a NanoCpus correctamente", async () => {
    docker.createContainer.mockResolvedValue({ id: "abc123" });

    await crearContenedor({
      nombre: "test-2",
      imagen: "postgres:16-alpine",
      cpuAsignado: 1.5,
      memoriaAsignada: 512,
      almacenamientoAsignado: 1024,
      puertos: [],
      variablesEntorno: {},
      volumenes: [],
    });

    expect(docker.createContainer).toHaveBeenCalledWith(
      expect.objectContaining({
        HostConfig: expect.objectContaining({
          NanoCpus: 1_500_000_000,
          Memory: 512 * 1024 * 1024,
        }),
      })
    );
  });
});
```

### 2.2 Test unitario del GestorDocker

`GestorDocker` se prueba mockeando el `cliente-docker`:

```typescript
// tests/unitarias/servicios-aplicacion/gestor-docker.test.ts
// Cubre: RF-11, RF-15 — CU-05
import { describe, it, expect, vi } from "vitest";

vi.mock("@/docker/cliente-docker.js", () => ({
  crearContenedor: vi.fn(),
  iniciarContenedor: vi.fn(),
}));

import { crearContenedor, iniciarContenedor } from "@/docker/cliente-docker.js";
import { GestorDocker } from "@/servicios-aplicacion/gestor-docker.js";

describe("GestorDocker.desplegar", () => {
  it("crea, inicia y registra el resultado exitoso", async () => {
    vi.mocked(crearContenedor).mockResolvedValue("contenedor-abc");
    vi.mocked(iniciarContenedor).mockResolvedValue();
    const repoServicio = { actualizarEstado: vi.fn() };
    const repoRegistro = { registrar: vi.fn() };
    const gestor = new GestorDocker(repoServicio as any, repoRegistro as any);

    await gestor.desplegar({ idServicio: 1, idUsuario: 5, /* ... */ } as any);

    expect(crearContenedor).toHaveBeenCalled();
    expect(iniciarContenedor).toHaveBeenCalledWith("contenedor-abc");
    expect(repoServicio.actualizarEstado).toHaveBeenCalledWith(1, "en_ejecucion");
    expect(repoRegistro.registrar).toHaveBeenCalledWith(
      expect.objectContaining({ resultado: "exito" })
    );
  });

  it("marca el servicio como fallido y registra el error cuando Docker falla", async () => {
    vi.mocked(crearContenedor).mockRejectedValue(new Error("falla generica"));
    const repoServicio = { actualizarEstado: vi.fn() };
    const repoRegistro = { registrar: vi.fn() };
    const gestor = new GestorDocker(repoServicio as any, repoRegistro as any);

    await expect(
      gestor.desplegar({ idServicio: 1, idUsuario: 5 } as any)
    ).rejects.toThrow();

    expect(repoServicio.actualizarEstado).toHaveBeenCalledWith(1, "fallido");
    expect(repoRegistro.registrar).toHaveBeenCalledWith(
      expect.objectContaining({ resultado: "fallo" })
    );
  });
});
```

## 3. Estructura del wrapper (implementación)

```typescript
// src/docker/cliente-docker.ts
import Docker from "dockerode";
import { logger } from "../infraestructura/logger.js";

const docker = new Docker();

export interface ParametrosContenedor {
  nombre: string;
  imagen: string;
  cpuAsignado: number;
  memoriaAsignada: number;
  almacenamientoAsignado: number;
  puertos: Array<{ host: number; contenedor: number; protocolo: "tcp" | "udp" }>;
  variablesEntorno: Record<string, string>;
  volumenes: Array<{ origen: string; destino: string; modo: "ro" | "rw" }>;
}

export async function crearContenedor(params: ParametrosContenedor): Promise<string> {
  try {
    const container = await docker.createContainer({
      name: params.nombre,
      Image: params.imagen,
      Env: Object.entries(params.variablesEntorno).map(([k, v]) => `${k}=${v}`),
      HostConfig: {
        NanoCpus: Math.floor(params.cpuAsignado * 1e9),
        Memory: params.memoriaAsignada * 1024 * 1024,
        PortBindings: construirPortBindings(params.puertos),
        Binds: params.volumenes.map((v) => `${v.origen}:${v.destino}:${v.modo}`),
        RestartPolicy: { Name: "no" },
      },
      ExposedPorts: construirExposedPorts(params.puertos),
    });
    return container.id;
  } catch (error) {
    logger.error({ error, evento: "docker_crear_contenedor_falla" });
    throw traducirErrorDocker(error);
  }
}
```

## 4. Traducción de errores

| Caso Docker | Error de dominio | Código HTTP |
| --- | --- | --- |
| Imagen no encontrada (404) | `ImagenDockerNoDisponibleError` | 422 |
| Conflicto de nombre (409) | `NombreContenedorEnUsoError` | 409 |
| Recursos insuficientes detectados por Docker | `RecursosInsuficientesError` | 422 |
| Contenedor inexistente | `ContenedorNoEncontradoError` | 404 |
| Fallo de conexión al socket | `MotorDockerNoDisponibleError` | 503 |

Las clases viven en `src/dominio/errores/`. Cada una debe tener su prueba de construcción y de propiedades (`message`, `name`, `cause` si aplica).

## 5. Verificación de recursos

`VerificadorRecursos` consulta dos fuentes (CU-04):

1. Capacidad total del servidor (`os.cpus()`, `os.totalmem()`, `fs.statvfs`).
2. Consumo agregado de contenedores activos vía Dockerode.

```typescript
export interface DisponibilidadRecursos {
  cpuLibre: number;
  memoriaLibre: number;
  almacenamientoLibre: number;
}

export async function verificarDisponibilidad(
  solicitud: { cpu: number; memoria: number; almacenamiento: number }
): Promise<{ aprobado: boolean; faltantes: Partial<DisponibilidadRecursos> }> {
  /* ... */
}
```

Debe completarse en menos de 3 segundos (RNF-07). Las pruebas unitarias mockean `os` y el cliente Docker para escenarios determinísticos.

## 6. Monitoreo periódico

`MonitorPeriodico` recolecta métricas cada 5 segundos (RNF-09).

Patrones:

- `setInterval` único, iterando servicios en `en_ejecucion`.
- `container.stats({ stream: false })` por contenedor.
- Inserción por lote con `prisma.metrica.createMany`.
- Manejo de fallos: marca el servicio como `fallido` y registra el incidente.

Las pruebas usan `vi.useFakeTimers()` para simular el paso del tiempo:

```typescript
import { vi } from "vitest";

it("recolecta metricas cada 5 segundos", async () => {
  vi.useFakeTimers();
  const monitor = new MonitorPeriodico(/* ... */);
  monitor.iniciar();

  await vi.advanceTimersByTimeAsync(5000);
  expect(/* ... */).toHaveBeenCalledTimes(1);

  await vi.advanceTimersByTimeAsync(5000);
  expect(/* ... */).toHaveBeenCalledTimes(2);

  monitor.detener();
  vi.useRealTimers();
});
```

## 7. Mapeo de estados (sección 4.2.14)

| Operación | Origen | Destino éxito | Destino fallo |
| --- | --- | --- | --- |
| Desplegar | `configurado` | `en_ejecucion` (vía `desplegando`) | `fallido` |
| Detener | `en_ejecucion` | `detenido` | se mantiene + registro |
| Reiniciar | `detenido` o `en_ejecucion` | `en_ejecucion` (vía `reiniciando`) | `fallido` |
| Eliminar | cualquiera salvo `eliminado` | `eliminado` | se mantiene + registro |

La actualización del estado y el registro se hacen en una transacción cuando aplica.

## Lista de verificación final

- [ ] Pruebas unitarias con mocks de Dockerode escritas primero.
- [ ] Pruebas unitarias del GestorDocker mockeando cliente-docker.
- [ ] Toda llamada a Docker pasa por `cliente-docker.ts`.
- [ ] Errores de Docker traducidos a clases de dominio.
- [ ] Cada operación deja un `RegistroDespliegue`.
- [ ] Estado del servicio actualizado tras cada operación.
- [ ] Operaciones de despliegue invocan al `VerificadorRecursos`.
- [ ] Parámetros estructurados, sin concatenación.
- [ ] Eventos en log estructurado con campo `evento`.
- [ ] Pruebas con valores límite (memoria negativa, imagen inexistente, conflicto de nombre).
- [ ] Todas las pruebas pasan (`npm test`).
