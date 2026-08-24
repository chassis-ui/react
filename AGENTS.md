# Chassis React — monorepo guide

Chassis React is the React component library for [Chassis UI](https://chassis-ui.com), a CSS
framework (a separate repo, `@chassis-ui/css`). This repo hosts the component library itself and
the docs site that documents it. Both are pnpm workspace packages under `packages/`:

- **[`packages/react`](packages/react/AGENTS.md)** — `@chassis-ui/react`, the published component
  library. This is the actual product; almost all engineering work happens here.
- **[`packages/site`](packages/site/AGENTS.md)** — `chassis-react-site`, the Astro docs site
  published at chassis-ui.com/react. Consumes `@chassis-ui/react` via `workspace:*` and renders
  live component examples alongside prose docs.

Read the package-level `AGENTS.md` before working inside either package — this file only covers
what's shared across both.

## Toolchain

- Package manager: **pnpm** (workspace defined in `pnpm-workspace.yaml`, packages under
  `packages/*`). Always use `pnpm`, not `npm`/`yarn` — the lockfile and `workspace:*` /
  `overrides` links in `pnpm-workspace.yaml` depend on it.
- Node 24 (see `.github/workflows/ci.yml`).
- TypeScript, strict-ish: `tsconfig.json` at the root is extended by both packages
  (`noImplicitAny`, `strictNullChecks`, `noUnusedLocals`/`noUnusedParameters` all on).
- Root ESLint config (`eslint.config.js`) covers both packages (`.ts`/`.tsx`/`.astro`), with
  Prettier run as an ESLint rule rather than a separate check.

## Root scripts

Run from the repo root (delegates into the relevant package via `pnpm --filter`):

```bash
pnpm dev          # lib watch build + astro dev server, together
pnpm test         # @chassis-ui/react's vitest suite
pnpm lint         # eslint across packages/**/src
pnpm site:build   # react:generate + sync-submodules + astro build + pagefind index
```

`pnpm react:generate` (`build/generate-api.ts`) walks `packages/react/src/components`, extracts
prop tables with `react-docgen-typescript`, and writes JSON into `packages/site/content/api/` —
run this after changing any component's exported props so the docs site picks up the change.
`pnpm sync-submodules` (`build/sync-submodules.js`) updates the `vendor/assets` submodule the
site's static assets come from.

## Workspace linking

`pnpm-workspace.yaml` pins several `@chassis-ui/*` packages (`css`, `docs`, `icons`, `tokens`) to
sibling local checkouts via `overrides: 'link:../...'` — these are expected to exist as sibling
directories next to this repo, not resolved from the registry. If one of those imports fails to
resolve, check the sibling checkout exists rather than assuming a registry/version problem.

## CI

`.github/workflows/ci.yml` runs on push to `main`/`develop` and on PRs: `pnpm install
--frozen-lockfile`, then `pnpm lint`, then `pnpm test` (the react package's vitest suite,
including coverage thresholds — see [`packages/react/AGENTS.md`](packages/react/AGENTS.md)), then
`pnpm react:build` + `pnpm react:report` (fails if the public props/types surface drifted from the
checked-in `packages/react/api-report.md` — see that package's `AGENTS.md`), then
`pnpm check:astro` (Astro/MDX type-checking — deliberately not the full `pnpm site:build`/
`astro build`, which currently fails on a pre-existing, external issue in the sibling
`../chassis-css` checkout's own in-progress Sass changes; `astro check` doesn't compile Sass so
it's unaffected), then `pnpm check:bundle` (`packages/react/.bundlewatch.config.json` — fails if
`dist/index.js`/`dist/index.es.js` grow past ~15% over their current gzip size, catching e.g. a
real dependency silently getting bundled instead of externalized again), then `pnpm audit --prod`
(blocking — a vulnerable runtime dependency would ship to every consumer) and a non-blocking
`pnpm audit` covering devDependencies too (real findings worth tracking, but failing CI on every
disclosed build-tooling CVE would make the gate chronically red). The full `pnpm site:build`
(static site generation, not just type-checking) still isn't part of CI, for the Sass reason
above — run it locally before relying on it being caught automatically.

A separate `visual-regression` job runs `pnpm test:visual` (Storybook + Playwright screenshot
tests scoped to the calendar/datepicker family today — see
[`packages/react/AGENTS.md`](packages/react/AGENTS.md#visual-regression)) inside the official
Playwright Docker image, so the rendered pixels match the checked-in Linux baseline screenshots.
That image tag has to stay in lockstep with the `@playwright/test` devDependency version in
`packages/react/package.json` — bumping one without the other risks font/rendering drift that
looks like a regression but isn't.

A third workflow, `.github/workflows/release.yml`, is unrelated to the checks above — it's the
Changesets-based release pipeline (opens/updates a "Version Packages" PR, publishes to npm on
merge). See [`packages/react/VERSIONING.md`](packages/react/VERSIONING.md) for the full release
process and what a repo admin still needs to configure before it can actually publish.

## Where things live

- Component source + tests: `packages/react/src/components/**`
- Form-family components specifically have their own scoped guide — read
  [`packages/react/FORMS.md`](packages/react/FORMS.md) before
  touching any of the form-related components it lists.
- Docs prose (`.mdx`) + generated API JSON: `packages/site/content/**`
- Live docs examples (imported into `.mdx` via `<Example>`): `packages/site/examples/**`
- Sidebar nav structure: `packages/site/data/sidebar.yml` — new docs pages must be added here or
  they won't appear in the site nav even though the route exists.
