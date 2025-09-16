import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // Allow img elements for better performance in some cases
      "@next/next/no-img-element": "warn",
      // Allow any types in Supabase operations where type generation is complex
      "@typescript-eslint/no-explicit-any": "warn",
      // Allow @ts-ignore comments for complex type issues
      "@typescript-eslint/ban-ts-comment": "warn",
    },
  },
];

export default eslintConfig;
