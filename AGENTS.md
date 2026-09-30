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
- Node 24 for development and CI (`.nvmrc`, which CI reads); `engines` accepts `>=22.12.0`, the
  minimum of Astro 7.
- TypeScript, strict-ish: `tsconfig.json` at the root is extended by both packages
  (`noImplicitAny`, `strictNullChecks`, `noUnusedLocals`/`noUnusedParameters` all on).
- Root ESLint config (`eslint.config.js`) covers both packages (`.ts`/`.tsx`/`.astro`). It runs
  Prettier as an ESLint rule at `warn`, so ESLint alone never fails on formatting; each package's
  `lint:prettier` is the check that does.
- cspell (`.cspell.json`) checks every `.md`/`.mdx` file, with `en` and `en-GB` both accepted.
  Add a real word to `words`; for foreign-language examples in one page, put a
  `{/* cspell:ignore ... */}` comment in that page instead.

## Root scripts

Ownership rule: a script whose target files live entirely inside one workspace package (build,
dev, test, lint, format, its own drift checks) is a real script on that package's own
`package.json`, invoked from the repo root via `pnpm --filter`/the `react:*`/`site:*` alias below —
not reimplemented at the root with the package path baked in as an argument. A script stays at the
root only when it's genuinely cross-package (reads from one package and writes into the other,
like `react:generate`) or operates on a repo-root-level artifact no single package owns (like
`_site/`, this repo's Astro output directory).

```bash
pnpm setup        # build vendor/assets at its pinned commit + one-shot library build — run once after clone
pnpm dev          # lib watch build + astro dev server, together
pnpm start        # setup, then dev — the single command for a fresh clone
pnpm test         # @chassis-ui/react's vitest suite
pnpm lint         # react lint + site lint + spellcheck — exactly what CI's Lint job runs
pnpm lint:eslint  # eslint only, across both packages — the fast subset
pnpm spellcheck   # cspell over every .md/.mdx file
pnpm site:setup   # vendor + react:build + react:generate — what site:build needs first
pnpm site:build   # astro build + pagefind index
pnpm lint:html    # html-validate over the built _site/
pnpm lint:vnu     # the Nu Html Checker over the built _site/ (needs Java)
pnpm smoke:build  # react:build, then build every app under smoke-tests/*
pnpm smoke:test   # smoke:build, then load the apps' routes in Chromium with Playwright
```

`pnpm react:lint`/`pnpm site:lint` delegate to each package's own `lint` script (eslint + stylelint

- prettier, scoped to that package); `pnpm react:check:api`/`:update`, `pnpm react:check:bundle`,
  `pnpm react:check:types`, `pnpm react:check:rsc`, `pnpm react:check:package`, and `pnpm site:check`
  likewise delegate to real scripts on `packages/react`/`packages/site`. `pnpm lint:eslint` delegates
  to both packages' own `lint:eslint` — it used to glob `packages/**/src/**` directly, which left
  `stories/`, `test/`, `scripts/` and `.storybook/` unlinted in CI (that gap is how four broken
  Storybook interaction tests reached `main`). `pnpm lint:html`/`pnpm lint:vnu` delegate to the
  site's own scripts too, since the site owns the validators and their exceptions, though the
  `_site/` they check is at the root.

`pnpm react:generate` (`build/generate-api.ts`) walks `packages/react/src/components`, extracts
prop tables with `react-docgen-typescript`, and writes JSON into `packages/site/content/api/` —
run this after changing any component's exported props so the docs site picks up the change.
`pnpm react:check:api-docs` is the CI gate for it: regenerates and fails if the result differs from
what's committed. That gate is only possible because the generator rewrites
react-docgen-typescript's absolute paths repo-relative on the way out — it used to embed the
generating machine's own checkout path in all 148 files, which made the artifacts
machine-specific.
The site's static assets come from the `vendor/assets` submodule (chassis-assets), built by the
`chassis-docs` command of `@chassis-ui/docs`. `pnpm vendor` builds the commit this repository
pins, and every build uses it, so one commit of this repository always builds the same site.
`pnpm sync-submodules` moves the pin to the latest `app/docs` and builds it; commit the new
pointer on its own.

## CI

`.github/workflows/ci.yml` runs on push to `develop` and on PRs against `develop`/`staging`/`main`, as the jobs Lint, Type Check, Test and Build (the names the ruleset requires) plus `site-build`, `visual-regression` and `smoke-test-nextjs`: `pnpm install
--frozen-lockfile`, then `pnpm lint` (eslint, stylelint and Prettier in both packages, then
cspell; ESLint warnings don't fail it, errors and any Prettier, stylelint or cspell finding do), then `pnpm react:check:types`
(`tsc --noEmit` over `packages/react`'s `src/`, `test/`, `types/` and `.storybook/` — nothing else
type-checks this repo's own source, since tsdown bundles declarations rather than running a full
`tsc`, and `react:check:api` only diffs the emitted `.d.ts`; four type errors including a wrong
published `usePagination` return type reached `main` before this gate existed), then `pnpm test`
(the react package's vitest suite — both the jsdom project and the `storybook` browser project —
including coverage thresholds; see [`packages/react/AGENTS.md`](packages/react/AGENTS.md)), then
`pnpm react:build` + `pnpm react:check:api` (fails if the public props/types surface drifted from
the checked-in `packages/react/api-report.md` — see that package's `AGENTS.md`) +
`pnpm react:check:rsc` (asserts the built bundle still starts with exactly one `'use client'`
directive — see `RSC.md`) + `pnpm react:check:api-docs` (regenerates
`packages/site/content/api/` and fails if it drifted from what's committed), then
`pnpm site:check` (Astro/MDX type-checking — fast, and needs neither the `vendor/assets`
submodule nor a Sass toolchain; the full static build runs as its own `site-build` job, see
below), then `pnpm react:check:bundle` (`packages/react/.bundlewatch.config.json` — fails
if `dist/index.js`/`dist/style.css` grow past their configured gzip ceilings, catching e.g. a real
dependency silently getting bundled instead of externalized again), then `pnpm audit --prod`
(blocking — a vulnerable runtime dependency would ship to every consumer) and a non-blocking
`pnpm audit` covering devDependencies too (real findings worth tracking, but failing CI on every
disclosed build-tooling CVE would make the gate chronically red).

A separate `site-build` job runs the full `pnpm site:setup && pnpm site:build` (real `astro build`

- pagefind, not just type-checking). This used to be impossible to gate on — it failed on an
  external issue in the sibling `../chassis-css` checkout's own in-progress Sass, linked in by a
  workspace override. That override was dev-only and has since been removed, so the site builds
  against the published `@chassis-ui/css` and this is green again. It's a separate job because it's
  the only thing in CI that needs a submodule checkout: `packages/site/public/` is gitignored and
  populated from `vendor/assets` by `pnpm vendor`. The same job then runs `pnpm lint:html` and
  `pnpm lint:vnu` over the built `_site/`.

`pnpm lint:html`/`pnpm lint:vnu` are not in `pnpm lint`, because they need a built `_site/`.
They run the `chassis-docs html-validate` and `chassis-docs vnu` commands with this site's
exceptions: `packages/site/html-validate.json` and `packages/site/vnu-filters.txt`. Most exceptions
are markup React and react-aria write on purpose, such as `spellCheck` in camelCase, ids from
`useId` and explicit roles on native elements. Some cover library defects still open, listed in
finding F10 of `AUDIT-PLAN.md`; delete each one when its fix lands. Fix a new finding in the
example or the component; add an exception only for markup that is correct.

A separate `visual-regression` job runs `pnpm test:visual` (Storybook + Playwright screenshot
tests scoped to the calendar/datepicker family today — see
[`packages/react/AGENTS.md`](packages/react/AGENTS.md#visual-regression)) inside the official
Playwright Docker image, so the rendered pixels match the checked-in Linux baseline screenshots.
That image tag has to stay in lockstep with the `@playwright/test` devDependency version in
`packages/react/package.json` — bumping one without the other risks font/rendering drift that
looks like a regression but isn't.

`.github/workflows/release.yml` publishes to npm on a push to `main` when npm lacks the version in
`packages/react/package.json`, after checking that the CI jobs passed on that commit. Versions are
made on `develop` with `pnpm changeset:version` and pushed as the same commit to `staging` and
`main`. See [`packages/react/VERSIONING.md`](packages/react/VERSIONING.md). `dependency-review.yml`
blocks pull requests that add a vulnerable dependency.

## Where things live

- Component source + tests: `packages/react/src/components/**`
- Form-family components specifically have their own scoped guide — read
  [`packages/react/FORMS.md`](packages/react/FORMS.md) before
  touching any of the form-related components it lists.
- Docs prose (`.mdx`) + generated API JSON: `packages/site/content/**`
- Live docs examples (imported into `.mdx` via `<Example>`): `packages/site/examples/**`
- Sidebar nav structure: `packages/site/data/sidebar.yml` — new docs pages must be added here or
  they won't appear in the site nav even though the route exists.
