// Configuracion de ESLint (flat config) para el backend de DevOpsEdu.
// Cubre: RNF-18 (calidad y consistencia del codigo)
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "coverage/**",
      "node_modules/**",
      "prisma/migrations/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {
      // Permite parametros/variables intencionalmente sin usar cuando llevan prefijo "_"
      // (p. ej. el 4o parametro obligatorio de los manejadores de error de Express).
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  }
);
