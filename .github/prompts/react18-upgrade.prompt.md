---
name: react18-upgrade
description: 'Phase 1 of chassis-react migration: upgrade packages/react from React 17 to React 18, remove prop-types, migrate legacy test patterns. Run this prompt to execute Phase 1.'
---

# Phase 1 — React 18 Upgrade

**Prerequisite**: None — this is the first phase.  
**Completion marker**: Update Phase 1 status to `[x]` in `.github/skills/react-migration/references/phase-status.md`

## Context

Read [codebase-facts.md](../skills/react-migration/references/codebase-facts.md) before starting. The library (`packages/react`) uses React 17, TypeScript 4, Rollup 2, and has `prop-types` imported in ~90 source files. There are no deprecated lifecycle methods or class components — the upgrade path is clean.

## Step 1 — Audit current versions

Run in `packages/react`:
```sh
cd packages/react && cat package.json
```
Note the exact current versions of: `react`, `react-dom`, `@types/react`, `@types/react-dom`, `@testing-library/react`, `@testing-library/jest-dom`, `typescript`, `rollup`, `ts-jest`.

## Step 2 — Update `packages/react/package.json`

Apply these version changes:

| Package | From | To |
|---------|------|----|
| `react` (devDep) | `^17.x` | `^18.0.0` |
| `react-dom` (devDep) | `^17.x` | `^18.0.0` |
| `@types/react` | `^17.x` | `^18.0.0` |
| `@types/react-dom` | `^17.x` | `^18.0.0` |
| `@testing-library/react` | `^12.x` | `^14.0.0` |
| `@testing-library/jest-dom` | `^5.x` | `^6.0.0` |
| `typescript` | `^4.x` | `^5.0.0` |
| `rollup` | `^2.x` | `^4.0.0` |
| `@rollup/plugin-commonjs` | current | latest compatible with Rollup 4 |
| `@rollup/plugin-node-resolve` | current | latest compatible with Rollup 4 |
| `@rollup/plugin-typescript` | current | latest compatible with Rollup 4 |
| `rollup-plugin-peer-deps-external` | current | latest |
| `ts-jest` | `^27.x` | `^29.0.0` |

**Peer dependencies** — update to support both React 17 and 18:
```json
"peerDependencies": {
  "react": ">=17",
  "react-dom": ">=17"
}
```

## Step 3 — Remove `prop-types` from all source files

`prop-types` are redundant — all components have full TypeScript interfaces. Remove from all ~90 files in `src/`.

**Do this systematically:**

1. Remove the `import PropTypes from 'prop-types'` line from every file
2. Remove every `ComponentName.propTypes = { ... }` block from every file  
3. Remove `import { ... } from '../Types'` references that only imported PropTypes validators (like `contextPropType`, `placementPropType`, `triggerPropType`) — but only if they're used solely in `.propTypes = {}` blocks, not in interface definitions
4. Check `src/components/Types.tsx` — clean up any PropTypes-only exports, keep the TypeScript union types
5. Remove `prop-types` from `devDependencies` in `package.json`

**Important**: Do NOT remove TypeScript type exports from `Types.tsx` (`Colors`, `Shapes`, `Triggers`, `Placements`, etc.) — only remove the PropTypes validators.

## Step 4 — Migrate legacy test patterns

File: `src/components/tooltip/__tests__/CxTooltip.spec.tsx`

Replace the two `ReactDOM.render()` calls with `createRoot()`:

```tsx
// OLD pattern:
import ReactDOM from 'react-dom'
ReactDOM.render(<Component />, container)

// NEW pattern:
import { createRoot } from 'react-dom/client'
let root: ReturnType<typeof createRoot>
// inside beforeEach or the test:
root = createRoot(container!)
act(() => { root.render(<Component />) })
// inside afterEach:
act(() => { root.unmount() })
```

Also update the `act` import:
```tsx
// OLD: import { act } from 'react-dom/test-utils'
// NEW: import { act } from 'react'
```

## Step 5 — Update `jest.config.js`

Ensure `ts-jest` config is compatible with TypeScript 5 and `@testing-library/jest-dom` v6:

```js
// jest.config.js at repo root — verify these settings:
moduleNameMapper: {
  '\\.(css|scss)$': '<rootDir>/packages/react/test/styleMock.js',
},
transform: {
  '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'packages/react/tsconfig.json' }]
}
```

For `@testing-library/jest-dom` v6, the import changed:
```tsx
// OLD: import '@testing-library/jest-dom/extend-expect'
// NEW: import '@testing-library/jest-dom'
```
Update any test files using the old import.

## Step 6 — Verify Rollup config

Check `packages/react/rollup.config.js` for any Rollup v2-specific syntax that changed in v4. Key changes in Rollup 4:
- Plugin options may have changed — verify `@rollup/plugin-typescript` config
- `output.exports` default changed — ensure `'named'` is set explicitly

## Step 7 — Install and test

```sh
# From repo root
yarn install   # still using yarn at this point (Phase 2 migrates to pnpm)

# Run tests
yarn test

# Build the library
yarn lib:build
```

All tests must pass. Build must produce `packages/react/dist/`.

## Step 8 — Mark complete

Update `phase-status.md`:
- Change Phase 1 status from `[ ]` to `[x]`
- Fill in any notes about unexpected issues

## Verification Checklist

- [ ] `packages/react/dist/index.js` exists after build
- [ ] `packages/react/dist/index.es.js` exists after build  
- [ ] `packages/react/dist/index.d.ts` exists after build
- [ ] All Jest tests pass (`yarn test`)
- [ ] No `prop-types` imports remain in `src/`
- [ ] No `ReactDOM.render` calls remain in `src/`
- [ ] `packages/react/package.json` peer deps show `"react": ">=17"`
