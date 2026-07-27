import { defineConfig } from 'eslint/config'
import eslint from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'
import unicornPlugin from 'eslint-plugin-unicorn'
import prettierPlugin from 'eslint-plugin-prettier/recommended'
import astroPlugin from 'eslint-plugin-astro'
import testingLibraryPlugin from 'eslint-plugin-testing-library'

// The recommended preset is all error-level, which would fail the ~620 pre-existing
// violations in the current (mostly snapshot-only) spec suite. Downgrade to warnings so it
// nudges new/touched tests toward better patterns without blocking on the existing backlog.
const testingLibraryWarnRules = Object.fromEntries(
  Object.entries(testingLibraryPlugin.configs['flat/react'].rules).map(([rule, config]) =>
    Array.isArray(config) ? [rule, ['warn', ...config.slice(1)]] : [rule, 'warn']
  )
)

export default defineConfig([
  // Global ignores
  {
    ignores: ['**/*.min.js', '**/dist/', '_site/', 'site/.astro/', 'site/public/', 'vendor/']
  },
  eslint.configs.recommended,
  tseslint.configs.eslintRecommended,
  astroPlugin.configs.recommended,
  astroPlugin.configs['jsx-a11y-recommended'],
  prettierPlugin,
  {
    plugins: { import: importPlugin, unicorn: unicornPlugin },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-useless-escape': 'warn',
      'prettier/prettier': 'warn'
    }
  },
  {
    files: ['**/*.js', '**/*.cjs'],
    languageOptions: {
      globals: globals.node
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.astro/*.js'],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
      parser: tseslint.parser
    }
  },
  {
    files: ['**/*.tsx', '**/*.jsx'],
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^React$' }]
    }
  },
  {
    plugins: testingLibraryPlugin.configs['flat/react'].plugins,
    rules: testingLibraryWarnRules,
    files: ['**/*.spec.ts', '**/*.spec.tsx']
  },
  {
    files: ['**/*.astro'],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
      parser: astroPlugin.parser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.astro']
      }
    }
  },
  {
    files: ['site/**/*.js', 'site/**/*.mjs'],
    languageOptions: {
      globals: { ...globals.browser }
    }
  }
])
