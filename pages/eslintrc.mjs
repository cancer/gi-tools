export default {
  root: true,
  env: {
    es6: true,
    browser: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  rules: {
    "no-else-return": "error",
    "no-lonely-if": "error",
    "no-self-compare": "error",
    "no-void": "error",

    "no-restricted-syntax": [
      "error",
      "TSEnumDeclaration",
      "TSInterfaceDeclaration",
    ],
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/consistent-type-imports": "error",
  },
};
