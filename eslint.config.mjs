import globals from "globals";
import tseslint from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{ts}"] },
  { languageOptions: { globals: globals.browser } },
  {
    rules: {
      ...tseslint.configs.recommended.rules, // Include recommended TypeScript rules

      // Custom rules
      "brace-style": ["error", "1tbs", { "allowSingleLine": true }], // Enforce one true brace style
      "indent": ["error", 2], // Enforce 2-space indentation
      "comma-dangle": ["error", "always-multiline"], // Require trailing commas for multiline statements
      "semi": ["error", "always"], // Require semicolons
      "space-before-blocks": ["error", "always"], // Require space before blocks
      "object-curly-spacing": ["error", "always"], // Enforce spaces inside curly braces
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }], // Warn on unused variables with exceptions
      "@typescript-eslint/explicit-function-return-type": "off", // Disable function return type enforcement
    },
  },
  ...tseslint.configs.recommended,
];

