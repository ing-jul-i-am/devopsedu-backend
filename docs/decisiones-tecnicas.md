# Decisiones tecnicas

Este documento registra las decisiones tecnicas que no encajan directamente con un RF, RNF
o CU del catalogo formal del diseño, o que se apartan de lo indicado en `CLAUDE.md`. Cada
entrada se referencia desde el commit correspondiente con el identificador `DT-XX`.

---

## DT-01: Reconciliacion del alias "@/" en Vitest con los imports .js de NodeNext

**Fecha:** 2026-07-24

**Contexto:** El `CLAUDE.md` seccion 5 define el alias de Vitest como un unico mapeo de
prefijo: `"@/": path.resolve(__dirname, "./src/")`. Al mismo tiempo, la seccion 6.3 exige
`moduleResolution: NodeNext` y los skills (`ciclo-tdd`, `nuevo-endpoint`, etc.) escriben los
imports con extension explicita `.js` (por ejemplo `@/infraestructura/configuracion.js`),
que es obligatoria bajo NodeNext. Con el alias de prefijo, Vitest resuelve
`@/infraestructura/configuracion.js` a la ruta literal `src/infraestructura/configuracion.js`,
que no existe (el fuente es `.ts`), y falla la carga del modulo.

**Decision:** Sustituir el alias de prefijo por un arreglo de dos reglas en `vitest.config.ts`:

1. `find: /^@\/(.*)\.js$/` → `src/$1.ts`, que mapea los imports con extension `.js` al fuente `.ts`.
2. `find: /^@\//` → `src/`, que cubre el resto de imports con prefijo `@/`.

De esta forma se conservan tanto la convencion de imports `.js` que exigen NodeNext y los
skills, como el alias `@/` documentado.

**Consecuencias:** Los tests pueden importar el codigo de produccion con la misma sintaxis
`.js` que usara el compilador `tsc`, sin divergencias entre entorno de pruebas y compilacion.
La configuracion de alias es ligeramente mas verbosa que el snippet original del `CLAUDE.md`.

**Alternativas consideradas:**
- Usar `moduleResolution: Bundler` y omitir la extension `.js` en los imports. Descartada por
  contradecir la seccion 6.3 del `CLAUDE.md` y la convencion de los skills.
- Agregar el plugin `vite-tsconfig-paths`. Descartada para no introducir una dependencia nueva
  sin justificacion de alcance (RNF-20).
