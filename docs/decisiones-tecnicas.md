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

---

## DT-02: Separacion de la configuracion de typecheck y de compilacion

**Fecha:** 2026-07-25

**Contexto:** El `CLAUDE.md` seccion 10 define `"build": "tsc"`. Para tener buena verificacion
de tipos, `tsconfig.json` incluye `src`, `tests` y `scripts`. Con esa inclusion, `tsc` calcula
la raiz comun del proyecto y emite preservando la estructura (`dist/src/index.js`), de modo que
`"start": "node dist/index.js"` (tambien definido en el `CLAUDE.md`) no encuentra el archivo.

**Decision:** Separar responsabilidades en dos configuraciones:

- `tsconfig.json`: verificacion de tipos de todo el codigo (`src`, `tests`, `scripts`) con
  `noEmit: true`. Lo usan el editor y `tsc --noEmit`.
- `tsconfig.build.json`: compilacion de produccion con `rootDir: "src"`, `outDir: "dist"` e
  `include` solo de `src`. El script pasa a `"build": "tsc -p tsconfig.build.json"`.

Asi `dist/index.js` queda en la ruta que espera `npm start`, sin renunciar a la verificacion
de tipos de las pruebas.

**Consecuencias:** El script `build` deja de ser exactamente `tsc`, pero produce la estructura
correcta. Los tests se siguen verificando con tipos mediante `tsconfig.json`.

**Alternativas consideradas:**
- Fijar `rootDir: "src"` e `include: ["src"]` en `tsconfig.json`. Descartada porque dejaria las
  pruebas fuera de la verificacion de tipos de `tsc`.
- Mover las pruebas dentro de `src`. Descartada por contradecir la estructura de carpetas del
  `CLAUDE.md` seccion 4.
