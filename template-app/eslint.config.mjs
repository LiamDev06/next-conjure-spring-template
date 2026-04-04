import { defineConfig, globalIgnores } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unicorn from "eslint-plugin-unicorn";

const templatePlugin = {
  rules: {
    "jsx-return-parens": {
      meta: {
        type: "layout",
        docs: {
          description:
            "Enforce wrapping returned JSX in parentheses and placing it on its own lines.",
        },
        schema: [],
        messages: {
          missingParens:
            "Wrap returned JSX in parentheses: `return ( ... );`",
          invalidLayout:
            "Place returned JSX on its own lines inside the parentheses.",
        },
      },
      create(context) {
        const sourceCode = context.sourceCode;

        return {
          ReturnStatement(node) {
            if (
              node.argument == null ||
              (node.argument.type !== "JSXElement" &&
                node.argument.type !== "JSXFragment")
            ) {
              return;
            }

            const tokenBeforeArgument = sourceCode.getTokenBefore(node.argument);
            const tokenAfterArgument = sourceCode.getTokenAfter(node.argument);
            const hasParens =
              tokenBeforeArgument?.value === "(" &&
              tokenAfterArgument?.value === ")";

            if (!hasParens) {
              context.report({
                node: node.argument,
                messageId: "missingParens",
              });
              return;
            }

            const hasExpectedLayout =
              node.loc.start.line === tokenBeforeArgument.loc.start.line &&
              node.argument.loc.start.line > tokenBeforeArgument.loc.end.line &&
              tokenAfterArgument.loc.start.line > node.argument.loc.end.line;

            if (!hasExpectedLayout) {
              context.report({
                node: node.argument,
                messageId: "invalidLayout",
              });
            }
          },
        };
      },
    },
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  reactHooks.configs.flat["recommended-latest"],
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs,cjs}"],
    plugins: {
      "@typescript-eslint": typescriptEslint,
      react,
      "simple-import-sort": simpleImportSort,
      template: templatePlugin,
      unicorn,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      curly: ["error", "all"],
      eqeqeq: ["error", "always"],
      "func-style": ["error", "declaration", { allowArrowFunctions: false }],
      "id-length": [
        "error",
        {
          min: 2,
          exceptions: ["_", "$", "i", "j", "k", "x", "y", "z"],
        },
      ],
      "max-lines": [
        "error",
        {
          max: 500,
          skipBlankLines: false,
          skipComments: false,
        },
      ],
      "max-len": [
        "error",
        {
          code: 100,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-else-return": ["error", { allowElseIf: false }],
      "no-var": "error",
      "object-shorthand": ["error", "always"],
      "prefer-const": "error",
      "prefer-template": "error",
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "function-declaration",
          unnamedComponents: "function-expression",
        },
      ],
      "react/jsx-pascal-case": [
        "error",
        {
          allowAllCaps: false,
          ignore: [],
        },
      ],
      "react/jsx-wrap-multilines": [
        "error",
        {
          declaration: "parens-new-line",
          assignment: "parens-new-line",
          return: "parens-new-line",
          arrow: "parens-new-line",
          condition: "parens-new-line",
          logical: "parens-new-line",
          prop: "ignore",
          propertyValue: "parens-new-line",
        },
      ],
      "template/jsx-return-parens": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector: "ExportDefaultDeclaration",
          message:
            "Use named exports by default. Reserve default exports for framework-required entry files.",
        },
        {
          selector:
            "JSXExpressionContainer > LogicalExpression[operator='&&']",
          message:
            "Do not use '&&' for JSX rendering. Use an explicit ternary so the false case is visible.",
        },
      ],
      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^react$", "^next", "^@?\\w"],
            ["^@/"],
            ["^\\u0000"],
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            ["^.+\\.?(css|scss|sass)$"],
          ],
        },
      ],
    },
  },
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    rules: {
      "@typescript-eslint/strict-boolean-expressions": [
        "error",
        {
          allowNullableBoolean: false,
          allowNullableNumber: false,
          allowNullableObject: false,
          allowNullableString: false,
          allowNumber: false,
          allowString: false,
        },
      ],
    },
  },
  {
    files: [
      "src/app/**/page.{ts,tsx,js,jsx}",
      "src/app/**/layout.{ts,tsx,js,jsx}",
      "src/app/**/loading.{ts,tsx,js,jsx}",
      "src/app/**/error.{ts,tsx,js,jsx}",
      "src/app/**/global-error.{ts,tsx,js,jsx}",
      "src/app/**/not-found.{ts,tsx,js,jsx}",
      "src/app/**/default.{ts,tsx,js,jsx}",
      "src/app/**/template.{ts,tsx,js,jsx}",
      "src/app/**/route.{ts,tsx,js,jsx}",
      "src/i18n/request.ts",
    ],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "JSXExpressionContainer > LogicalExpression[operator='&&']",
          message:
            "Do not use '&&' for JSX rendering. Use an explicit ternary so the false case is visible.",
        },
      ],
    },
  },
  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "unicorn/filename-case": [
        "error",
        {
          cases: {
            camelCase: true,
            pascalCase: true,
          },
          ignore: [
            "^index\\.[^.]+$",
            "^page\\.[^.]+$",
            "^layout\\.[^.]+$",
            "^loading\\.[^.]+$",
            "^error\\.[^.]+$",
            "^global-error\\.[^.]+$",
            "^not-found\\.[^.]+$",
            "^route\\.[^.]+$",
            "^default\\.[^.]+$",
            "^template\\.[^.]+$",
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "next-env.d.ts",
  ]),
  eslintConfigPrettier,
]);

export default eslintConfig;
