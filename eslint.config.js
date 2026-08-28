// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook'

import { defineConfig } from 'eslint/config'
import eslint from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'
import unicornPlugin from 'eslint-plugin-unicorn'
import prettierPlugin from 'eslint-plugin-prettier/recommended'
import astroPlugin from 'eslint-plugin-astro'
import testingLibraryPlugin from 'eslint-plugin-testing-library'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'

// The recommended preset is all error-level. It originally would have failed ~620 pre-existing
// violations across a then-mostly-snapshot-only spec suite; a subsequent test-modernization pass
// (see .claude/plans/abstract-snacking-tome.md and .claude/plans/frolicking-roaming-snowglobe.md)
// cleared the entire backlog to zero, including no-node-access/no-container — this library has
// plenty of plain presentational wrappers (divs, spans) with no accessible role/name, but nearly
// every one of those turned out to have a real query available (screen.getByText on the given
// children, an explicit role prop, an ancestor with a role) once actually looked at. The
// remaining handful of genuinely inaccessible cases (hidden form-submission inputs, decorative
// icons, closed <dialog> elements, class-only wrapper divs) are suppressed per-line with a
// reasoned `eslint-disable-next-line`, not by turning a rule off wholesale. Kept at warn rather
// than error, matching the rest of this preset, so it nudges new/touched tests toward better
// patterns without hard-blocking a build over a single missed query.
const testingLibraryWarnRules = Object.fromEntries(
  Object.entries(testingLibraryPlugin.configs['flat/react'].rules).map(([rule, config]) =>
    Array.isArray(config) ? [rule, ['warn', ...config.slice(1)]] : [rule, 'warn']
  )
)

export default defineConfig([
  // Global ignores
  {
    ignores: [
      '**/dist/',
      '**/coverage/',
      '_site/',
      '_storybook/',
      'packages/site/.astro/',
      'packages/site/public/',
      'vendor/'
    ]
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
  // Plain-JS shared Vitest support files (packages/react/test/*.ts, e.g. axeMatchers.ts,
  // dialogPolyfill.ts) reference DOM globals (`HTMLDialogElement`) and Vitest's injected test
  // globals (`expect`, via vitest.config.ts's `test.globals: true`). `.spec.tsx` files don't need
  // this block — `tseslint.configs.eslintRecommended` already turns `no-undef` off for TS-parsed
  // files, since TS's own type checker (not ESLint) is the real authority there — but these are
  // plain `.js`, still checked by core `no-undef`, and the generic `**/*.js` block above only
  // grants Node globals.
  {
    files: ['packages/react/test/*.ts'],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser, ...globals.vitest }
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.astro/*.js'],
    plugins: { '@typescript-eslint': tseslint.plugin },
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
      parser: tseslint.parser
    },
    rules: {
      // Superseded by the TS-aware version below, which understands type-only bindings.
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'warn'
    }
  },
  {
    files: ['**/*.tsx', '**/*.jsx'],
    plugins: { react: reactPlugin, 'react-hooks': reactHooksPlugin },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^(_|React)$' }
      ],
      'react-hooks/rules-of-hooks': 'error',
      // `additionalHooks` teaches the rule that `useIsomorphicLayoutEffect` (packages/react/src/
      // hooks/useIsomorphicLayoutEffect.ts) is itself an effect hook needing dependency-array
      // checking — without this the rule silently stops validating any call to it at all (it only
      // recognizes the literal names `useEffect`/`useLayoutEffect`/etc. by default).
      'react-hooks/exhaustive-deps': ['warn', { additionalHooks: '^useIsomorphicLayoutEffect$' }],
      'react/no-array-index-key': 'warn'
    }
  },
  {
    plugins: testingLibraryPlugin.configs['flat/react'].plugins,
    rules: testingLibraryWarnRules,
    files: ['**/*.spec.ts', '**/*.spec.tsx']
  }, // Enterprise migration (see .claude/plans/chassis-react-enterprise-migration.md, Phase 0/1):
  // `Cx`-prefixed identifiers were dropped from packages/react/src by Phase 1's scripted rename.
  // Flipped from `warn` to `error` in Phase 1 Batch G, once the rename actually cleared the
  // ~870 pre-existing occurrences — this now guards against reintroducing the prefix rather than
  // tracking a migration in progress. Neither this nor the rule below catches string literals
  // (`cx-*` class names, `data-cx-*` attributes) — see CONVENTIONS.md and the plan's Ground Truth
  // section for those.
  {
    files: ['packages/react/src/**/*.ts', 'packages/react/src/**/*.tsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Identifier[name=/^Cx[A-Z]/]',
          message: "Cx-prefixed identifiers aren't allowed — see packages/react/CONVENTIONS.md."
        },
        {
          selector: 'JSXIdentifier[name=/^Cx[A-Z]/]',
          message: "Cx-prefixed identifiers aren't allowed — see packages/react/CONVENTIONS.md."
        }
      ]
    }
  }, // `onValueChange` and `tone` aren't part of this library's vocabulary (see CONVENTIONS.md —
  // change props are `onChange`, colors/variants are `color`/`variant`). Zero existing uses as of
  // the Phase 0 audit, so this starts at `error` with nothing to grandfather in.
  {
    files: ['packages/react/src/**/*.ts', 'packages/react/src/**/*.tsx'],
    rules: {
      'id-denylist': ['error', 'onValueChange', 'tone']
    }
  }, // A markup-snapshot removal pass (see packages/react/AGENTS.md's Tests section) deleted every
  // `toMatchSnapshot()` call from packages/react/test/components/**: first the 105 files carrying
  // the named `test('matches the baseline markup snapshot', ...)` pattern, then a follow-up pass
  // over 11 files that still called `toMatchSnapshot()` in a differently-named test the first pass
  // deliberately left alone. Every single one turned out to be a blind-diffable duplicate of
  // assertions already made explicitly a few lines away, or was made so after a one-line backfill —
  // zero needed real visual-regression coverage instead, including the portal/positioning-heavy
  // families (menu, popover, tooltip), which already have Storybook + Playwright coverage for the
  // pixel-level concern a DOM snapshot can't validate anyway. `error`, not `warn` (matching the
  // Cx-prefix ban above once its backlog hit zero) — there's no remaining exception to grandfather.
  {
    files: ['packages/react/test/components/**/*.spec.tsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.property.name="toMatchSnapshot"]',
          message:
            "DOM markup snapshots aren't allowed here — assert structure/behavior explicitly " +
            '(toHaveClass/toHaveAttribute/role queries) instead, or add Storybook + Playwright ' +
            'visual-regression coverage for a genuinely pixel-level concern. See ' +
            "packages/react/AGENTS.md's Tests section."
        }
      ]
    }
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
    files: ['packages/site/**/*.js', 'packages/site/**/*.mjs'],
    languageOptions: {
      globals: { ...globals.browser }
    }
  },
  ...storybook.configs['flat/recommended']
])
