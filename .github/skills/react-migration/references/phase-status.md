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
| 3 | Scaffold `packages/site`, delete `packages/docs` | `[x]` | Complete — Astro 5 scaffold builds, 2 pages generated, old content stashed in `content.gatsby/` for Phase 5 |
| 4 | `<ReactExample>` island component | `[x]` | Complete — ReactExample.astro + ReactExamplePreview.tsx island; Button, Dropdown, Tooltip all build |
| 5 | MDX content migration (25 files) | `[x]` | Complete — 43 MDX files migrated, 44 pages build. Export blocks extracted to tsx files in `src/examples/`. Inline Example blocks in table.mdx extracted too. |
| 6 | API docs generation pipeline | `[x]` | Complete — `build/generate-api.ts` generates 102 JSON files; `PropTable.astro` renders in all 35 component pages |
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

- [x] Remove `yarn.lock`, `node_modules` from root
- [x] Replace root `package.json` workspaces (yarn→pnpm syntax stays the same)
- [x] Replace Lerna scripts with pnpm workspace filter commands
- [x] Remove `lerna.json`
- [x] Create root `pnpm-workspace.yaml`
- [x] Update root `package.json` scripts (`lerna run --scope` → `pnpm --filter`)
- [x] Run `pnpm install` — workspace links correctly
- [x] Verify `pnpm run lib:build` works
- [x] Verify `pnpm run test` works

## Phase 3 Checklist — Astro Site Scaffold

- [x] Delete `packages/docs` entirely
- [x] Create `packages/site` directory
- [x] Scaffold Astro project following chassis-website pattern
- [x] Add `@astrojs/react` integration
- [x] Configure `base: '/react/'` in astro.config.ts
- [x] Set up SCSS with `@chassis-ui/css` dependency
- [~] Configure `@chassis-ui/docs` shared package (inlined `rehypeStripIsRaw`; full integration deferred to Phase 7)
- [x] Set `outDir: '../../_site'`
- [x] Add content collection schema for React docs (extends docsSchema)
- [x] Add to root `pnpm-workspace.yaml`
- [x] Verify `pnpm --filter @chassis-ui/react-site build` succeeds (2 pages built)
- [x] Stash Gatsby MDX source in `content.gatsby/` for Phase 5 migration

## Phase 4 Checklist — ReactExample Island

- [x] Design `ReactExample.tsx` component API
- [x] Implement live preview pane (renders children as React island via `ReactExamplePreview.tsx`)
- [x] Implement code block pane (syntax-highlighted JSX source via `astro:components` `<Code />`)
- [x] Handle `client:visible` directive for lazy hydration
- [x] Handle interactive components (modals, tooltips) — children hydrated within island
- [x] Create `<ReactExample>` Astro wrapper component
- [x] Test with `CxButton` examples (simple)
- [x] Test with `CxDropdown` examples (interactive, Popper.js)
- [x] Test with `CxTooltip` examples (Popper.js, hover trigger)
- [x] Delete test page
- Note: uses explicit `code` prop (same pattern as chassis-website `Example.astro`)

## Phase 5 Checklist — MDX Content Migration

- [x] Audit all 25 component MDX files for MDX v1 patterns
- [x] Add explicit `import` statements for `ReactExample` and `Callout`
- [x] Fix any `export default` usage (not valid in MDX v3 body)
- [x] Update frontmatter to match new `docsSchema`
- [x] Rename `<Example>` → `<ReactExample>` throughout
- [x] Handle `getting-started/`, `forms/`, `layout/`, `patterns/` sections
- [x] Verify all MDX files parse without errors in Astro

## Phase 6 Checklist — API Docs Generation

- [x] Create `build/generate-api.ts` script using `react-docgen-typescript`
- [x] Output one JSON file per component to `packages/site/src/data/api/`
- [x] Create Astro content collection for API data
- [x] Create `<PropTable>` Astro component consuming collection
- [x] Wire `generate-api` into `pnpm --filter @chassis-ui/react-site build` pre-step
- [x] Test with `CxButton` (simple props)
- [x] Test with `CxModal` (complex props, union types)

## Phase 7 Checklist — Nav, Search, Deploy

- [x] Implement sidebar nav data structure (mirrors content sections)
- [x] Create sidebar nav Astro component (`Sidebar.astro`)
- [x] Create `Toc.astro` (right-hand table of contents)
- [x] Complete `DocsLayout.astro` (3-column layout with topbar, sidebar, TOC)
- [x] Update `[...slug].astro` to use completed layout
- [x] Update `index.astro` to redirect to getting-started/introduction
- [x] Create `vercel.json` at repo root (`buildCommand: pnpm docs:build`, `outputDirectory: _site`)
- [x] Create `packages/site/public/robots.txt`
- [x] Update root `README.md` with `docs:dev`, `docs:build`, `api:generate` commands
- [x] Full build verified: `pnpm docs:build` — 44 pages built successfully
