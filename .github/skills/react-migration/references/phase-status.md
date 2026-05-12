# Phase Status — Chassis React Migration

Last updated: 2026-05-12

## Status Legend
- `[ ]` Not started
- `[~]` In progress
- `[x]` Complete

## Phases

| # | Phase | Status | Notes |
|---|-------|--------|-------|
| 1 | React 18 upgrade (`packages/react`) | `[x]` | Complete — all 242 tests pass, build succeeds |
| 2 | Monorepo: Lerna/Yarn → pnpm workspaces | `[x]` | Complete — pnpm install, build, and 242 tests pass |
| 3 | Scaffold `packages/site`, delete `packages/docs` | `[ ]` | |
| 4 | `<ReactExample>` island component | `[ ]` | |
| 5 | MDX content migration (25 files) | `[ ]` | |
| 6 | API docs generation pipeline | `[ ]` | |
| 7 | Nav, search, deploy config, integration | `[ ]` | |

## Phase 1 Checklist — React 18 Upgrade

- [x] Bump `react`, `react-dom` deps to `^18` in `packages/react/package.json`
- [x] Update `peerDependencies` to `react: ">=17"` (support both 17+18 consumers)
- [x] Bump `@types/react`, `@types/react-dom` to `^18`
- [x] Bump `@testing-library/react` to `^14`
- [x] Bump `@testing-library/jest-dom` to `^6`
- [x] Bump TypeScript to `^5`
- [x] Bump Rollup to `^4` + update rollup plugins
- [x] Remove `prop-types` from all ~90 source files
- [x] Remove `prop-types` package from `devDependencies`
- [x] Migrate `CxTooltip.spec.tsx`: replace `ReactDOM.render` with `createRoot`
- [x] Update `jest.config.js` + `ts-jest` for TS 5 / React 18 compat
- [x] Run `yarn test` — all tests pass (242/242)
- [x] Run `yarn lib:build` — build succeeds (`dist/index.js`, `dist/index.es.js`, `dist/index.d.ts`)

## Phase 2 Checklist — pnpm Migration

- [ ] Remove `yarn.lock`, `node_modules` from root
- [ ] Replace root `package.json` workspaces (yarn→pnpm syntax stays the same)
- [ ] Replace Lerna scripts with pnpm workspace filter commands
- [ ] Remove `lerna.json`
- [ ] Create root `pnpm-workspace.yaml`
- [ ] Update root `package.json` scripts (`lerna run --scope` → `pnpm --filter`)
- [ ] Run `pnpm install` — workspace links correctly
- [ ] Verify `pnpm run lib:build` works
- [ ] Verify `pnpm run test` works

## Phase 3 Checklist — Astro Site Scaffold

- [ ] Delete `packages/docs` entirely
- [ ] Create `packages/site` directory
- [ ] Scaffold Astro project following chassis-website pattern
- [ ] Add `@astrojs/react` integration
- [ ] Configure `base: '/react/'` in astro.config.ts
- [ ] Set up SCSS with `@chassis-ui/css` dependency
- [ ] Configure `@chassis-ui/docs` shared package
- [ ] Set `outDir: '../../_site'`
- [ ] Add content collection schema for React docs (extends docsSchema)
- [ ] Add to root `pnpm-workspace.yaml`
- [ ] Verify `pnpm --filter @chassis-ui/react-site dev` launches

## Phase 4 Checklist — ReactExample Island

- [ ] Design `ReactExample.tsx` component API
- [ ] Implement live preview pane (renders children as React island)
- [ ] Implement code block pane (syntax-highlighted JSX source)
- [ ] Handle `client:visible` directive for lazy hydration
- [ ] Handle interactive components (modals, tooltips) that need `client:load`
- [ ] Create `<ReactExample>` Astro wrapper component
- [ ] Test with `CxButton` examples (simple)
- [ ] Test with `CxModal` examples (interactive, portal)
- [ ] Test with `CxTooltip` examples (Popper.js)

## Phase 5 Checklist — MDX Content Migration

- [ ] Audit all 25 component MDX files for MDX v1 patterns
- [ ] Add explicit `import` statements for `ReactExample` and `Callout`
- [ ] Fix any `export default` usage (not valid in MDX v3 body)
- [ ] Update frontmatter to match new `docsSchema`
- [ ] Rename `<Example>` → `<ReactExample>` throughout
- [ ] Handle `getting-started/`, `forms/`, `layout/`, `patterns/` sections
- [ ] Verify all MDX files parse without errors in Astro

## Phase 6 Checklist — API Docs Generation

- [ ] Create `build/generate-api.ts` script using `react-docgen-typescript`
- [ ] Output one JSON file per component to `packages/site/src/data/api/`
- [ ] Create Astro content collection for API data
- [ ] Create `<PropTable>` Astro component consuming collection
- [ ] Wire `generate-api` into `pnpm --filter @chassis-ui/react-site build` pre-step
- [ ] Test with `CxButton` (simple props)
- [ ] Test with `CxModal` (complex props, union types)

## Phase 7 Checklist — Nav, Search, Deploy

- [ ] Implement sidebar nav data structure (mirrors content sections)
- [ ] Create sidebar nav Astro component
- [ ] Configure Algolia integration (following chassis-website pattern)
- [ ] Create `vercel.json` for `packages/site` (base path rewrites)
- [ ] Test full build: `pnpm --filter @chassis-ui/react-site build`
- [ ] Verify `_site/` output is correct
- [ ] Confirm chassis-ui.com/react/ routing works
