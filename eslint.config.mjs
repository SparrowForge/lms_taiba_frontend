import {dirname} from 'path';
import {fileURLToPath} from 'url';

import {FlatCompat} from '@eslint/eslintrc';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginImport from 'eslint-plugin-import';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    plugins: {
      import: pluginImport,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'react-hooks/exhaustive-deps': 'warn',

      // Import sorting/newlines
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'object',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          pathGroups: [
            { pattern: '@/components/**', group: 'internal', position: 'after' },
            { pattern: '@/app/**', group: 'internal', position: 'after' },
            { pattern: '@/hooks/**', group: 'internal', position: 'after' },
            { pattern: '@/types/**', group: 'internal', position: 'after' },
            { pattern: '@/services/**', group: 'internal', position: 'after' },
            { pattern: '@/store/**', group: 'internal', position: 'after' },
            { pattern: '@/lib/**', group: 'internal', position: 'after' },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
      'import/newline-after-import': ['warn', { count: 1 }],
    },
  },
  // Disable stylistic rules that conflict with Prettier
  eslintConfigPrettier,
];

export default eslintConfig;
