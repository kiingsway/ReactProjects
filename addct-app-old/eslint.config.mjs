import js from "@eslint/js";
import tseslint from "typescript-eslint";
import next from "eslint-plugin-next";

const eslintConfig = [
  // Regras base do JavaScript
  js.configs.recommended,

  // Regras para TypeScript
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.strictTypeChecked,

  // Regras do Next.js
  {
    plugins: {
      next: next,
    },
    rules: {
      ...next.configs["core-web-vitals"].rules,
    },
  },

  // Suas regras personalizadas
  {
    rules: {
      "@typescript-eslint/explicit-function-return-type": ["warn", {}],
      "no-unused-vars": "warn",
      "consistent-return": "warn",
      "semi": ["error", "always"],
      "quotes": ["warn", "double"],
    },
  },
];

export default eslintConfig;
