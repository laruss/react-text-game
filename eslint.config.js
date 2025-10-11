import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default tseslint.config(
    { ignores: ["**/dist/**", "**/node_modules/**", "**/coverage/**", "**/.next/**", "**/build/**"] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ["**/*.{ts,tsx}"],
        ignores: ["**/dist/**", "**/node_modules/**", "**/coverage/**", "**/.next/**", "**/build/**"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
            "simple-import-sort": simpleImportSort,
            "eslint-config-prettier": eslintConfigPrettier,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true },
            ],

            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
        },
    }
);
