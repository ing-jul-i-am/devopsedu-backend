---
name: nueva-entidad-prisma
description: "Usa este skill cuando se solicite agregar una nueva entidad al modelo de datos, modificar campos de una entidad existente, crear una migracion de Prisma, alterar el esquema de la base de datos, o frases como 'agrega la tabla X', 'añade un campo a Y', 'cambia el esquema de Z', 'nueva migracion'. Cubre el procedimiento completo con TDD: pruebas del repositorio primero, edicion de schema.prisma, generacion de migracion, sincronizacion con la base de pruebas, ajuste del repositorio, actualizacion del seed si aplica, y verificacion de la trazabilidad. Aplicalo SIEMPRE que la tarea implique tocar prisma/schema.prisma."
---

# Skill: agregar o modificar una entidad en el modelo de Prisma (TDD)

Este skill define el procedimiento obligatorio para alterar el esquema de la base de datos. Las migraciones son inmutables una vez aplicadas en otros entornos. **Antes de seguirlo, lee el skill `ciclo-tdd`.**

## 1. Identifica la justificación del cambio

- Determina a qué RF, CU o decisión de diseño responde.
- Revisa la sección 4.2.17 del diseño técnico y confirma alineación con el modelo conceptual.
- Si es una entidad nueva, ubícala en un grupo funcional: identidad, servicios, monitoreo, educativo.

Si el cambio contradice el diagrama ER, detente y consulta al desarrollador.

## 2. Escribe primero las pruebas del repositorio (RED)

Aunque la entidad no exista todavía, escribe las pruebas que describan cómo se va a usar.

```typescript
// tests/integracion/repositorios/imagen-docker-catalogo-repo.test.ts
// Cubre: RF-07 (catalogo de imagenes pre-verificadas)
import { describe, it, expect, beforeEach } from "vitest";
import { ImagenDockerCatalogoRepo } from "@/repositorios/imagen-docker-catalogo-repo.js";
import { prismaTest } from "../../ayudas/prisma-test.js";
import { limpiarBd } from "../../ayudas/limpiar-bd.js";

describe("ImagenDockerCatalogoRepo", () => {
  const repo = new ImagenDockerCatalogoRepo(prismaTest);

  beforeEach(async () => {
    await limpiarBd();
  });

  it("guarda una imagen y la recupera por nombre", async () => {
    await repo.guardar({
      nombre: "postgres:16-alpine",
      descripcion: "Base de datos PostgreSQL",
      habilitada: true,
    });

    const encontrada = await repo.buscarPorNombre("postgres:16-alpine");

    expect(encontrada).not.toBeNull();
    expect(encontrada?.descripcion).toBe("Base de datos PostgreSQL");
  });

  it("listar solo devuelve imagenes habilitadas por defecto", async () => {
    await repo.guardar({ nombre: "a:1", habilitada: true });
    await repo.guardar({ nombre: "b:1", habilitada: false });

    const habilitadas = await repo.listarHabilitadas();

    expect(habilitadas).toHaveLength(1);
    expect(habilitadas[0]?.nombre).toBe("a:1");
  });

  it("rechaza guardar dos imagenes con el mismo nombre", async () => {
    await repo.guardar({ nombre: "duplicada:1" });
    await expect(repo.guardar({ nombre: "duplicada:1" })).rejects.toThrow();
  });
});
```

Ejecuta `npm run test:watch`. Falla todo. Red.

## 3. Edita prisma/schema.prisma

Reglas:

- Modelos en `PascalCase` español.
- Campos del cliente en `camelCase`.
- Columnas BD en `snake_case` con `@map` y `@@map`.
- Claves foráneas con `onDelete` explícito:
  - `Cascade` para dependencias estructurales.
  - `Restrict` para referenciales sin acoplamiento de ciclo de vida.
  - `SetNull` solo en casos justificados.
- Índices explícitos en columnas de búsqueda frecuente.
- Restricciones de unicidad declaradas en el esquema cuando el diseño lo exige.

```prisma
model ImagenDockerCatalogo {
  idImagenCatalogo Int      @id @default(autoincrement()) @map("id_imagen_catalogo")
  nombre           String   @unique @db.VarChar(160)
  descripcion      String?  @db.Text
  habilitada       Boolean  @default(true)
  fechaCreacion    DateTime @default(now()) @map("fecha_creacion")

  @@map("imagen_docker_catalogo")
}
```

Tras editar:

```bash
npx prisma format
npx prisma validate
```

## 4. Genera la migración en desarrollo

```bash
npx prisma migrate dev --name <verbo_descriptivo_snake>
```

Nombres válidos: `agrega_catalogo_imagenes`, `agrega_indice_metrica_marca_tiempo`, `cambia_longitud_descripcion_servicio`.

Revisa el SQL generado en `prisma/migrations/<timestamp>_<nombre>/migration.sql`. Si hay cambios destructivos no esperados, detén y revisa.

## 5. Sincroniza la base de pruebas

```bash
npm run bd:test:preparar
```

Este paso es **obligatorio**: tus pruebas se ejecutan contra la base de pruebas, y si su esquema no está al día, las pruebas no reflejarán la realidad.

## 6. Implementa el repositorio (GREEN)

```typescript
// src/repositorios/imagen-docker-catalogo-repo.ts
// Cubre: RF-07 (catalogo de imagenes pre-verificadas)
import { PrismaClient } from "@prisma/client";

export class ImagenDockerCatalogoRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async guardar(input: { nombre: string; descripcion?: string; habilitada?: boolean }) {
    return this.prisma.imagenDockerCatalogo.create({
      data: {
        nombre: input.nombre,
        descripcion: input.descripcion,
        habilitada: input.habilitada ?? true,
      },
    });
  }

  async buscarPorNombre(nombre: string) {
    return this.prisma.imagenDockerCatalogo.findUnique({ where: { nombre } });
  }

  async listarHabilitadas() {
    return this.prisma.imagenDockerCatalogo.findMany({ where: { habilitada: true } });
  }
}
```

Ejecuta `npm test`. Todo en verde.

## 7. Actualiza el seed si aplica

Si la entidad requiere datos semilla (catálogo pre-verificado, valores enumerados, configuración inicial), agrega los `upsert` correspondientes en `prisma/seed.ts`. El seed debe ser idempotente.

```typescript
// prisma/seed.ts (fragmento)
const imagenes = [
  { nombre: "postgres:16-alpine", descripcion: "Base de datos PostgreSQL" },
  { nombre: "nginx:1.27-alpine", descripcion: "Servidor web Nginx" },
  { nombre: "redis:7-alpine", descripcion: "Cache Redis" },
];

for (const img of imagenes) {
  await prisma.imagenDockerCatalogo.upsert({
    where: { nombre: img.nombre },
    update: {},
    create: img,
  });
}
```

## 8. REFACTOR

Con todas las pruebas verdes:

- Extrae helpers si hay duplicación.
- Mejora nombres de columnas si el primer intento no quedó claro (recuerda que requeriría una nueva migración).
- Agrega índices que descubriste necesarios mientras escribías el repositorio.

## 9. Verifica el resultado

```bash
docker compose exec postgres psql -U devopsedu -d devopsedu -c "\dt"
docker compose exec postgres psql -U devopsedu -d devopsedu -c "\d imagen_docker_catalogo"
```

## 10. Trazabilidad

- El bloque del modelo lleva un comentario que indica su grupo funcional.
- Mensaje de commit: `bd(servicios): agrega tabla imagen_docker_catalogo (RF-07)`.
- Si el cambio difiere del diagrama ER original, registra la justificación en `docs/decisiones-tecnicas.md`.

## Lista de verificación final

- [ ] Pruebas del repositorio escritas primero (Red).
- [ ] Cambio justificado por un RF, CU o decisión de diseño.
- [ ] Esquema respeta convenciones (Pascal/camel/snake).
- [ ] Reglas `onDelete` explícitas en cada relación.
- [ ] Migración aplicada en base de desarrollo sin advertencias inesperadas.
- [ ] Base de pruebas sincronizada (`npm run bd:test:preparar`).
- [ ] Repositorio implementado.
- [ ] Todas las pruebas pasan (`npm test`).
- [ ] Seed ajustado si la entidad requiere datos iniciales.
- [ ] Tablas verificadas en `psql` coinciden con lo esperado.
- [ ] Commit con referencia al RF, CU o decisión.

## Recordatorios importantes

- Una vez que una migración se aplica en otro entorno, no la edites. Crea una migración correctiva.
- Si necesitas resetear durante desarrollo: `npx prisma migrate reset`. Esto borra los datos.
- Tras modificar el esquema, `npm run bd:test:preparar` no es opcional.
- Genera siempre el cliente tras cambios manuales: `npx prisma generate` (`migrate dev` lo hace automáticamente).
