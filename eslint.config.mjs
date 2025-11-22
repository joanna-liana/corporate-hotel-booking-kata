import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { defineConfig } from 'eslint/config';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default defineConfig([{
  extends: compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ),

  plugins: {
    '@typescript-eslint': typescriptEslint,
    'simple-import-sort': simpleImportSort,
    // "member-delimiter-style": memberDelimiterStyle
  },

  languageOptions: {
    globals: {
      ...globals.node,
    },

    parser: tsParser,
  },

  rules: {
    quotes: ['error', 'single'],
    semi: 'error',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    // "@typescript-eslint/member-delimiter-style": "error",

    indent: ['error', 2, {
      ignoredNodes: ['PropertyDefinition'],
    }],

    'max-len': ['error', 120],
    'function-call-argument-newline': ['error', 'consistent'],
    'function-paren-newline': ['error', 'multiline-arguments'],
    'no-unused-vars': 'off',

    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
    }],

    'object-curly-newline': ['error', {
      ObjectExpression: 'always',

      ObjectPattern: {
        multiline: true,
      },

      ExportDeclaration: {
        multiline: true,
        minProperties: 3,
      },
    }],

    'newline-before-return': 'error',
  },
}]);
