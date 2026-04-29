import js from "@eslint/js";
import globals from "globals";

export default [
    js.configs.recommended,
    {
        files: ["frontend/src/js/**/*.js"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.jquery,
            },
        },
        rules: {
            "no-unused-vars": "warn",
            "no-console": "off",
            "indent": ["error", 4],
            "linebreak-style": ["error", "unix"],
            "quotes": ["error", "single", { "avoidEscape": true }],
            "semi": ["error", "always"],
            "curly": ["error", "all"],
            "one-var-declaration-per-line": ["error", "always"],
            "new-cap": "error",
        },
    },
];
