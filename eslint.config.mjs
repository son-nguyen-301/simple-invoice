import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import stylistic from "@stylistic/eslint-plugin";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    name: "project/import-conventions",
    rules: {
      // All imports hoisted to the top of the file - no statements between imports.
      "import/first": "error",
      // Prefer named imports over namespace imports
      // (e.g. `import { useState } from "react"`, not `import * as React`).
      "import/no-namespace": "error",
      // Exactly one blank line after the import block.
      "import/newline-after-import": "error",
      // Group external packages, then internal `@/` modules, blank line between groups.
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          pathGroups: [
            { pattern: "@/**", group: "internal", position: "after" },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: { order: "ignore" },
        },
      ],
    },
  },
  {
    // Type-aware linting: flag any usage of @deprecated APIs across the codebase.
    name: "project/deprecation-check",
    files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-deprecated": "error",
    },
  },
  {
    // Type conventions: prefer `type` aliases over `interface`, and ban
    // `as Type` assertions (use guards / zod / `satisfies` instead).
    name: "project/type-conventions",
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/consistent-type-assertions": [
        "error",
        { assertionStyle: "never" },
      ],
      // Ban the `any` type - prefer `unknown` + narrowing / zod parsing.
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  {
    // Breathing space: blank lines around control-flow blocks, before returns,
    // and after a group of declarations - keeps dense functions readable.
    name: "project/breathing-space",
    plugins: { "@stylistic": stylistic },
    rules: {
      "@stylistic/padding-line-between-statements": [
        "error",
        // A blank line before every `return`.
        { blankLine: "always", prev: "*", next: "return" },
        // A blank line around control-flow / block statements (if, for, while, switch, try, bare block).
        { blankLine: "always", prev: "*", next: "block-like" },
        { blankLine: "always", prev: "block-like", next: "*" },
        // Separate a run of declarations from the statements that follow it
        // (but keep consecutive declarations grouped together).
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        {
          blankLine: "any",
          prev: ["const", "let", "var"],
          next: ["const", "let", "var"],
        },
      ],
    },
  },
  {
    // shadcn-generated primitives use `import * as React` and the occasional
    // `as HTMLElement` DOM cast; leave them as the CLI emits them.
    name: "project/shadcn-ui-overrides",
    files: ["components/ui/**"],
    rules: {
      "import/no-namespace": "off",
      "@typescript-eslint/consistent-type-assertions": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
  ]),
]);

export default eslintConfig;
