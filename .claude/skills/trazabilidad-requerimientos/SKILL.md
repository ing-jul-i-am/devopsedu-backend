---
name: trazabilidad-requerimientos
description: "Usa este skill cuando vayas a crear un commit, redactar un mensaje de Git, escribir un comentario de cabecera para un archivo, funcion o componente nuevo, o cuando se solicite mantener la conexion entre codigo y requerimientos del documento de diseño. Tambien aplica cuando se pida 'commit con trazabilidad', 'menciona el RF', 'agrega la referencia al CU' o frases similares. Define el formato obligatorio para commits, cabeceras y referencias a RF, RNF y CU en este proyecto academico, incluyendo el tipo de commit dedicado a pruebas (test). Aplicalo SIEMPRE antes de proponer un mensaje de commit en este repositorio."
---

# Skill: trazabilidad con requerimientos

Este skill define cómo mantener visible la conexión entre el código del proyecto y los requerimientos, casos de uso y secciones del documento de diseño técnico. La trazabilidad no es decorativa: es lo que permite defender el prototipo en la fase de pruebas y argumentar formalmente cada decisión técnica.

## 1. Convención de Conventional Commits ajustada

Formato del mensaje de commit:

```
<tipo>(<ámbito>): <resumen en imperativo, sin punto final> (<referencias>)

<descripción opcional, en líneas de máximo 100 caracteres>
```

Tipos aceptados:

| Tipo | Uso |
| --- | --- |
| `feat` | Funcionalidad nueva visible para el usuario |
| `fix` | Corrección de defecto |
| `refactor` | Reorganización de código sin cambio funcional |
| `chore` | Configuración, dependencias, infraestructura |
| `docs` | Cambios en documentación |
| `test` | Cambios o adiciones a pruebas que NO acompañan código de producción nuevo |
| `bd` | Cambios al esquema de la base de datos |
| `style` | Cambios de formato sin efecto en el código |

Importante sobre `test`: cuando agregas pruebas como parte de TDD para una funcionalidad nueva, **no uses `test`**; usa `feat` (o `fix`, `refactor`, etc.) porque la prueba forma parte indivisible del cambio. Reserva `test` para casos donde estás agregando cobertura a código preexistente sin pruebas, o cuando refactorizas las pruebas mismas (movimientos, renombres, mejoras a fixtures).

Ámbitos sugeridos: `auth`, `servicios`, `monitoreo`, `aprendizaje`, `admin`, `bd`, `docker`, `api`, `seguridad`, `infra`, `pruebas`.

Referencias entre paréntesis al final del resumen, separadas por coma. Formatos válidos:

- `RF-XX` para requerimientos funcionales
- `RNF-XX` para no funcionales
- `CU-XX` para casos de uso
- `S-X.X.X` para secciones del documento de diseño cuando no haya RF/CU directo
- `DT-XX` para decisiones técnicas registradas en `docs/decisiones-tecnicas.md`

Ejemplos correctos:

```
feat(auth): implementa registro de usuarios con cifrado bcrypt (RF-01, RNF-10)
feat(servicios): agrega verificacion de recursos previa al despliegue (RF-09, CU-04)
fix(monitoreo): corrige fuga en intervalo de actualizacion (RNF-09)
bd(servicios): agrega indice en metrica por marca_tiempo (RNF-06)
refactor(api): extrae middleware de validacion zod (RNF-15)
chore: configura ESLint y Prettier (RNF-18)
test(auth): agrega cobertura para escenarios de token expirado (RF-03)
chore(infra): configura vitest con cobertura minima 80% (RNF-24)
```

Anti-ejemplos a evitar:

- `feat: cambios varios` — sin ámbito y sin referencias.
- `Update file` — sin tipo, sin referencia, en inglés sin justificación.
- `feat(auth): RF-01 implementacion` — referencia mal colocada y resumen pobre.
- `test(servicios): agrega endpoint nuevo` — usa `feat`, no `test`, si el endpoint es nuevo.

## 2. Cabecera obligatoria en archivos nuevos

Todo archivo de código relevante (controladores, validadores, repositorios, servicios de aplicación, componentes de UI complejos) comienza con un comentario que indica:

- Una línea de propósito.
- Los RF, RNF y CU que cubre.

```typescript
// crear-servicio.controlador.ts
// Punto de entrada HTTP para la creacion de servicios contenedorizados.
// Cubre: RF-05, RF-06, RF-07, RF-09 — CU-03
```

Los **archivos de pruebas** llevan la misma cabecera con las mismas referencias que el archivo que prueban. Esto facilita la auditoría cruzada: si un RF no aparece en ninguna cabecera de prueba, hay un hueco de cobertura conceptual.

```typescript
// crear-servicio.test.ts
// Pruebas de integracion para POST /api/servicios.
// Cubre: RF-05, RF-06, RF-07, RF-09 — CU-03
```

Archivos triviales (configuraciones, tipos puros, utilidades genéricas) pueden omitir el bloque.

## 3. Referencias dentro del código

Cuando una regla del negocio responde directamente a un requerimiento, déjalo anotado en el lugar exacto:

```typescript
// RNF-10: cifrado con bcrypt, 12 rondas
const passwordHash = await bcrypt.hash(password, 12);
```

```typescript
// RF-09 y CU-04: verificacion previa de recursos antes de invocar a Docker
const disponibilidad = await verificadorRecursos.verificarDisponibilidad(...);
```

No abuses: solo referencia las decisiones que sustentan el cumplimiento de un requerimiento concreto.

## 4. Trazabilidad TDD: vincular RF a sus pruebas

Como el proyecto sigue TDD, cada RF y CU debe poder rastrearse hasta los archivos de prueba que lo verifican. Mantén esta correspondencia visible:

- El archivo de prueba lleva los mismos `Cubre:` en su cabecera.
- El nombre del archivo o de los `describe` refleja el comportamiento que valida el requerimiento.
- En la descripción del PR (si aplica el flujo), enumera las pruebas que prueban cada RF.

Esto convierte la suite de pruebas en una **matriz de trazabilidad ejecutable**: un RF sin pruebas que lo nombren explícitamente es un riesgo documental.

## 5. Etiquetas de pull request

Si el flujo del proyecto incluye pull requests, la descripción debe contener:

```
Resumen
-------
Una o dos oraciones describiendo el cambio.

Requerimientos cubiertos
------------------------
- RF-XX: cómo lo satisface
- RNF-XX: cómo lo satisface
- CU-XX: qué flujo del caso de uso implementa

Pruebas agregadas
-----------------
- tests/unitarias/<ruta>/<archivo>: describe brevemente cada test
- tests/integracion/<ruta>/<archivo>: describe brevemente cada test

Verificación local
------------------
- npm test pasa (cobertura: X% líneas, Y% ramas).
- Verificación manual: (si aplica).
```

## 6. Lista de verificación antes del commit

- [ ] El mensaje sigue el formato `<tipo>(<ámbito>): <resumen> (<referencias>)`.
- [ ] Las referencias existen en el catálogo (sección 4.2.6 del diseño) o están registradas como DT en `docs/decisiones-tecnicas.md`.
- [ ] Los archivos nuevos llevan cabecera con propósito y referencias.
- [ ] Los archivos de prueba llevan las mismas referencias que el código que prueban.
- [ ] Las pruebas pasan localmente (`npm test`).
- [ ] La cobertura no cayó por debajo de los umbrales.
- [ ] No hay emojis en mensajes, comentarios ni documentación.
- [ ] El mensaje está en español, en imperativo, sin punto final.

## 7. Decisiones técnicas no cubiertas por el catálogo

Si una tarea no encaja con ningún RF, RNF o CU, no inventes una referencia ficticia. Documenta la decisión en `docs/decisiones-tecnicas.md` con el formato:

```markdown
## DT-01: Centralización de la lectura de variables de entorno

**Fecha:** 2026-06-XX
**Contexto:** Múltiples módulos leían variables de `process.env` directamente.
**Decisión:** Centralizar la lectura en `src/infraestructura/configuracion.ts` con validación Zod al arranque.
**Consecuencias:** Si falta una variable, el servidor no inicia. Más fácil de auditar (RNF-21).
**Alternativas consideradas:** Validar bajo demanda en cada módulo. Descartada por inconsistencia.
```

Y referencia la entrada en el commit:

```
refactor(infra): centraliza configuracion en modulo unico (DT-01)
```

Esto preserva la auditabilidad sin contaminar el catálogo formal de requerimientos.
