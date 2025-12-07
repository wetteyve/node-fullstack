import { default as defaultConfig } from '@epic-web/config/eslint';

/** @type {import("eslint").Linter.Config} */
export default [
  ...defaultConfig,
  // add custom config objects here:
  {
    files: ['**/tests/**/*.ts'],
    rules: { 'react-hooks/rules-of-hooks': 'off' },
  },
  {
    files: ['app/**/*.ts', 'app/**/*.tsx', '911rs/**/*.ts', '911rs/**/*.tsx', 'uht-herisau/**/*.ts', 'uht-herisau/**/*.tsx'],
    ignores: ['app/routes/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*', './*'],
              caseSensitive: true,
              message: 'Use path aliases (#app/*, #rs911/*, #uht-herisau/*) instead of relative imports.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['app/root.tsx', 'app/utils/middlewares/*.ts'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  {
    files: ['app/routes/**/*.ts', 'app/routes/**/*.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*'],
              caseSensitive: true,
              message: 'Use path aliases (#app/*, #rs911/*, #uht-herisau/*) instead of relative imports.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['server/**/*', 'other/**/*', 'vite.config.ts', 'react-router.config.ts', 'app/routes.ts'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  {
    ignores: ['.react-router/*'],
  },
];
