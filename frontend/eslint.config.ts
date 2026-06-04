import eslint from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import prettierPlugin from 'eslint-plugin-prettier'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unicorn from 'eslint-plugin-unicorn'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  // Global ignores — only lint src/ TypeScript files
  {
    ignores: [
      'dist/**',
      'dist-*/**',
      'node_modules/**',
      'src/Mocks/**',
      // Root config files — not part of the app source
      '*.config.ts',
      '*.config.js',
      '*.config.cjs',
      '.prettierrc.cjs',
      'commitlint.config.cjs',
      '*.d.ts',
    ],
  },

  // Base configs
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  {
    files: ['src/**/*.{ts,tsx}'],

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: { project: './tsconfig.json' },
      },
    },

    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
      unicorn,
      prettier: prettierPlugin,
    },

    rules: {
      // Prettier
      ...prettierConfig.rules,
      'prettier/prettier': 'error',

      // React
      ...(reactPlugin.configs['recommended']?.rules ?? {}),
      ...(reactPlugin.configs['jsx-runtime']?.rules ?? {}),
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // Console
      'no-console': 'error',

      // Unused imports / vars
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-unused-vars': 'off', // handled by unused-imports

      // Import sorting
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^react$', '^react-dom$'],
            ['^react-', '^@?\\w'],
            ['^\\u0000'],
            ['^@project'],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ['^.+\\.?(css|scss)$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      // Unicorn — filename casing
      // Allow PascalCase (components/pages), camelCase (utils/hooks), and
      // kebab-case (config files like auth.schema.ts, auth.slice.ts).
      'unicorn/filename-case': [
        'error',
        {
          cases: { pascalCase: true, camelCase: true, kebabCase: true },
          ignore: [
            /^index\.(ts|tsx)$/,
            /^main\.tsx$/,
            /\.test\.(ts|tsx)$/,
            /\.d\.ts$/,
          ],
        },
      ],

      // react/prop-types is redundant when using TypeScript — TS types serve the same purpose
      'react/prop-types': 'off',

      // TypeScript strictness
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',

      // Accessibility — selectively relaxed
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
    },
  }
)
