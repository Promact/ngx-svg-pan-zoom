/* eslint-disable no-undef */
module.exports = {
    env: {
        browser: true,
        es2021: true,
        jasmine: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
        "plugin:jasmine/recommended",
        "eslint-plugin-import",
        "eslint-plugin-eslint-comments",
        "eslint-plugin-promise"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["@typescript-eslint", "prettier"],
    rules: {},
    overrides: [
        {
            files: ["*.spec.ts"],
            plugins: ["jasmine"],
            rules: {
                "@typescript-eslint/unbound-method": "off",
                MicrosoftEdge: "off",
                "axe/forms": "off",
            },
        },
    ],
};
