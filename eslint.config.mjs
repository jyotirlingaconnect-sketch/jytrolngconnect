import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "prepare-frames.js",
  ]),
  {
    rules: {
      // This rule flags intentional patterns like `setMounted(true)` in useEffect,
      // which is the canonical pattern for hydration-safe code.
      // It also incorrectly flags Embla Carousel's initialization pattern.
      "react-hooks/set-state-in-effect": "off",

      // shadcn-style components use empty interface extension for documentation
      // and extensibility (e.g. `export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}`).
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
]);

export default eslintConfig;
