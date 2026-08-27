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

Ownership rule: a script whose target files live entirely inside one workspace package (build,
dev, test, lint, format, its own drift checks) is a real script on that package's own
`package.json`, invoked from the repo root via `pnpm --filter`/the `react:*`/`site:*` alias below —
not reimplemented at the root with the package path baked in as an argument. A script stays at the
root only when it's genuinely cross-package (reads from one package and writes into the other,
like `react:generate`) or operates on a repo-root-level artifact no single package owns (like
`_site/`, this repo's Astro output directory).

```bash
pnpm setup        # sync submodules + one-shot library build — run once after clone
pnpm dev          # lib watch build + astro dev server, together
pnpm start        # setup, then dev — the single command for a fresh clone
pnpm test         # @chassis-ui/react's vitest suite
pnpm lint         # react lint + site lint + HTML/vnu validation — the full local sweep
pnpm lint:eslint  # eslint across packages/**/src only — narrower, what CI actually gates on
pnpm site:build   # react:generate + sync-submodules + astro build + pagefind index
pnpm smoke:build  # react:build, then build every app under smoke-tests/*
```

`pnpm react:lint`/`pnpm site:lint` delegate to each package's own `lint` script (eslint + stylelint
+ prettier, scoped to that package); `pnpm react:check:api`/`:update`, `pnpm react:check:bundle`,
`pnpm react:check:package`, and `pnpm site:check` likewise delegate to real scripts on
`packages/react`/`packages/site`. `pnpm lint:html`/`pnpm lint:vnu` stay root-level because they
validate the root `_site/` build output, not anything inside `packages/site` itself.

`pnpm react:generate` (`build/generate-api.ts`) walks `packages/react/src/components`, extracts
prop tables with `react-docgen-typescript`, and writes JSON into `packages/site/content/api/` —
run this after changing any component's exported props so the docs site picks up the change.
`pnpm sync-submodules` (`build/sync-submodules.js`) updates the `vendor/assets` submodule the
site's static assets come from.

## CI

`.github/workflows/ci.yml` runs on push to `main`/`develop` and on PRs: `pnpm install
--frozen-lockfile`, then `pnpm lint:eslint` (the narrow eslint-only pass — CI deliberately doesn't
gate on the full `pnpm lint`, which also runs stylelint/Prettier/HTML validation and currently has
pre-existing, unrelated findings), then `pnpm test` (the react package's vitest suite,
including coverage thresholds — see [`packages/react/AGENTS.md`](packages/react/AGENTS.md)), then
`pnpm react:build` + `pnpm react:check:api` (fails if the public props/types surface drifted from
the checked-in `packages/react/api-report.md` — see that package's `AGENTS.md`), then
`pnpm site:check` (Astro/MDX type-checking — deliberately not the full `pnpm site:build`/
`astro build`, which currently fails on a pre-existing, external issue in the sibling
`../chassis-css` checkout's own in-progress Sass changes; `astro check` doesn't compile Sass so
it's unaffected), then `pnpm react:check:bundle` (`packages/react/.bundlewatch.config.json` — fails
if `dist/index.js`/`dist/index.es.js` grow past ~15% over their current gzip size, catching e.g. a
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
