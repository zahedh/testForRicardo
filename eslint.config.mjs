import path from 'node:path';
import {fileURLToPath} from 'node:url';

import cspell from '@cspell/eslint-plugin';
import nx from '@nx/eslint-plugin';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import jsonc from 'eslint-plugin-jsonc';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import jsoncParser from 'jsonc-eslint-parser';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', 'node_modules'],
  },
  {
    files: ['**/package.json'],
    plugins: {
      jsonc,
    },
    languageOptions: {
      parser: jsoncParser,
    },
    rules: {
      'jsonc/sort-keys': [
        'error',
        {
          pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies$',
          order: {type: 'asc'},
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared', 'api-controller'],
            },
            {
              sourceTag: 'type:e2e',
              onlyDependOnLibsWithTags: ['scope:e2e', 'type:util'],
            },
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: [
                'scope:shared',
                'api-controller',
                'scope:dev-tools',
              ],
            },
            {
              // Only the apps may import the playground, so it can be removed for release.
              sourceTag: 'scope:dev-tools',
              onlyDependOnLibsWithTags: ['scope:shared', 'api-controller'],
            },
            {
              sourceTag: 'type:api',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },
            {
              sourceTag: 'api-controller',
              onlyDependOnLibsWithTags: ['type:api', 'scope:shared'],
            },
            {
              sourceTag: 'controls-basic',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.{js,jsx,ts,tsx,cjs,mjs,cts,mts}'],

    plugins: {
      'simple-import-sort': simpleImportSort,
      '@cspell': cspell,
    },

    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      quotes: [
        'error',
        'single',
        {
          avoidEscape: true,
          allowTemplateLiterals: false,
        },
      ],
      'prefer-template': 'error',
      '@typescript-eslint/no-extra-semi': 'error',
      'no-extra-semi': 'off',

      '@cspell/spellchecker': [
        'warn',
        {
          customWordListFile: path.join(__dirname, '.dictionary.txt'),
          generateSuggestions: true,
          ignoreImports: true,
        },
      ],

      'no-console': ['error', {allow: ['warn', 'error']}],

      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'lucide-react-native',
              message:
                'Import icons from `@smarty-app/assets` (add new ones to lucideIcons.ts). The package root bundles every icon on native.',
              allowTypeImports: true,
            },
            {
              name: 'lucide-react-native/icons',
              message:
                'This is the full icon barrel. Import icons from `@smarty-app/assets` instead.',
            },
            {
              name: 'lucide-react',
              message:
                'Use `lucide-react-native`, which works on both web and native via react-native-svg.',
            },
          ],
        },
      ],

      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    files: ['**/*.{js,jsx,ts,tsx,cjs,mjs,cts,mts}'],
    plugins: {
      jsdoc: jsdocPlugin,
    },
    rules: {
      ...jsdocPlugin.configs.recommended.rules,
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-returns-type': 'off',
      'jsdoc/require-jsdoc': [
        'error',
        {
          publicOnly: true,
          require: {MethodDefinition: true},
          contexts: [
            'VariableDeclaration > VariableDeclarator > ArrowFunctionExpression',
            'VariableDeclaration > VariableDeclarator > FunctionExpression',
          ],
        },
      ],
      'jsdoc/tag-lines': ['warn', 'always', {startLines: 1, count: 0}],
    },
  },
  reactHooks.configs.flat.recommended,
  eslintPluginPrettierRecommended,
];
