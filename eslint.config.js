// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

/**
 * @type {import('eslint').Linter.FlatConfig[]}
 */
const customConfig = [
  {
    rules: {
      'no-console': [
        'warn',
        {
          allow: ['info', 'error'],
        },
      ],

      quotes: ['error', 'single'],
      'arrow-body-style': ['error', 'as-needed'],
      'no-underscore-dangle': 'off',
      'no-restricted-syntax': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: 'ctx|args|req|res|next|^_',
        },
      ],

      '@typescript-eslint/no-empty-interface': 'off',
    },
  },
  {
    files: ['src/**/*.error.ts', 'src/**/*.handler.ts', 'src/**/*.factory.ts'],

    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];

export default tseslint.config(
  // Global ignores
  // https://eslint.org/docs/latest/use/configure/configuration-files#globally-ignoring-files-with-ignores
  {
    ignores: ['**/node_modules', 'build', 'docker-volumes', '.husky', 'src/db/**/*.d.ts'],
  },
  {
    languageOptions: {
      globals: {
        process: 'writable',
        console: 'readonly',
      },
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...customConfig,
  // ESLint Config last
  eslintConfigPrettier,
);
