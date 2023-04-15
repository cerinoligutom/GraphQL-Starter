/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 'latest',
    project: ['./tsconfig.eslint.json'],
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  rules: {
    'no-console': ['warn', { allow: ['info', 'error'] }],
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
  overrides: [
    {
      files: ['./src/**/*.error.ts', './src/**/*.handler.ts', './src/**/*.factory.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
};
