import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Ignore build artifacts and external folders
  {
    ignores: [
      "**/.next/**",
      "**/node_modules/**",
      "**/.turbo/**",
      "**/coverage/**",
      "**/out/**",
      "**/build/**",
      "**/.vercel/**",
    ],
  },
  // Apply Next.js + TypeScript + Testing Library + Jest DOM rules
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "plugin:testing-library/react",
    "plugin:jest-dom/recommended"
  ),
];

export default eslintConfig;
