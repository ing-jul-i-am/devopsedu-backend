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
    // El proyecto importa con extension .js (obligatorio por moduleResolution NodeNext),
    // pero los fuentes son .ts. La primera regla mapea "@/x.js" al fuente "src/x.ts";
    // la segunda cubre el resto de imports con prefijo "@/".
    alias: [
      {
        find: /^@\/(.*)\.js$/,
        replacement: path.resolve(__dirname, "./src/$1.ts"),
      },
      {
        find: /^@\//,
        replacement: `${path.resolve(__dirname, "./src")}/`,
      },
    ],
  },
});
