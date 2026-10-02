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
- TypeScript, strict: the root `tsconfig.json` (`strict`, `noImplicitReturns`,
  `noUnusedLocals`/`noUnusedParameters`) is extended by `packages/react` and `build/`. The site
  extends Astro's strict config instead.
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
pnpm new:component <kebab-name> [--group <sidebar group>]  # scaffold a component across both packages
```

`pnpm react:lint`/`pnpm site:lint` delegate to each package's own `lint` script (ESLint, stylelint
and Prettier, scoped to that package); `pnpm react:check:api`/`:update`, `pnpm react:check:bundle`,
`pnpm react:check:types`, `pnpm react:check:rsc`, `pnpm react:check:package`, and `pnpm site:check`
likewise delegate to real scripts on `packages/react`/`packages/site`. `pnpm lint:eslint` delegates
to both packages' own `lint:eslint`, never a root glob of the package paths (RD7).
`pnpm lint:html`/`pnpm lint:vnu` delegate to the site's own scripts too, since the site owns the
validators and their exceptions, though the `_site/` they check is at the root.

`pnpm new:component` (`build/new-component.ts`) writes a polymorphic component with its barrel,
both `src/index.ts` entries, a spec, a story, a docs page with one example and the sidebar entry,
then prints what's left (chassis-css's markup, `react:build`, `react:generate`,
`react:check:api:update`, a changeset). It writes into both packages, so it lives at the root.

A pre-commit hook (simple-git-hooks, installed by `pnpm install`'s `prepare`) runs lint-staged:
ESLint and Prettier on staged files under `packages/`, Prettier on staged JSON, Markdown and YAML.
Styles are left to `pnpm lint`'s stylelint, since Prettier and stylelint disagree on them. Skip the
hook once with `SKIP_SIMPLE_GIT_HOOKS=1`.

`pnpm react:generate` (`build/generate-api.ts`) walks `packages/react/src/components`, extracts
prop tables with `react-docgen-typescript`, and writes JSON into `packages/site/content/api/` —
run this after changing any component's exported props so the docs site picks up the change.
`pnpm react:check:api-docs` is the CI gate for it: regenerates and fails if the result differs from
what's committed. The generator writes react-docgen-typescript's absolute paths repo-relative, so
every machine produces the same files; keep it that way or the gate breaks (RD8).

The site's static assets come from the `vendor/assets` submodule (chassis-assets), built by the
`chassis-docs` command of `@chassis-ui/docs`. `pnpm vendor` builds the commit this repository
pins, and every build uses it, so one commit of this repository always builds the same site.
`pnpm sync-submodules` moves the pin to the latest `app/docs` and builds it; commit the new
pointer on its own.

## CI

`.github/workflows/ci.yml` runs on push to `develop` and on pull requests against `develop`,
`staging` and `main`. A push of the same commit to `staging` or `main` runs none of it. Every job
and every step has a `name`, in the vocabulary the Chassis repositories share (RD18). The ruleset
of `main` requires Lint, Type Check, Test, Build, Site, Visual Regression and Smoke Test by name.
`release.yml` reads those and Audit, which the ruleset doesn't require. Rename a job in all three
places. Every job but Audit starts with `pnpm install --frozen-lockfile`.
[`ref/DECISIONS.md`](ref/DECISIONS.md) holds the history behind the RD numbers below.

- **Lint**: `pnpm lint`, which is ESLint, stylelint and Prettier in both packages, then cspell.
  ESLint warnings don't fail it; errors and any Prettier, stylelint or cspell finding do.
- **Type Check**: `pnpm react:check:types`, `tsc --noEmit` over `packages/react`'s `src/`,
  `test/`, `types/` and `.storybook/`. Nothing else type-checks this repository's own source:
  tsdown bundles declarations without a full `tsc`, and `react:check:api` only diffs the emitted
  `.d.ts` (RD6).
- **Test**: `pnpm test`, both vitest projects (jsdom and the `storybook` browser project) with the
  coverage thresholds. See [`packages/react/AGENTS.md`](packages/react/AGENTS.md#tests).
- **Build**: `pnpm react:build`, then
  - `react:check:api`: the public props and types surface against `packages/react/api-report.md`;
  - `react:check:rsc`: exactly one `'use client'` per entry, none in shared chunks (`RSC.md`);
  - `react:check:api-docs`: `packages/site/content/api/` against a fresh `react:generate` (RD8);
  - `react:check:package`: publint and attw over the published package shape;
  - `site:check`: Astro and MDX type-checking, which needs neither the submodule nor Sass;
  - `react:check:bundle`: the gzip ceilings in `packages/react/.bundlewatch.config.json`, per
    entry, per shared chunk and for `dist/style.css`. A dependency bundled instead of
    externalized breaks one (RD5).
- **Site**: `pnpm site:setup && pnpm site:build` (`astro build` and pagefind), then
  `pnpm lint:html` and `pnpm lint:vnu` over the built `_site/` (RD9). It is its own job because
  only it needs the `vendor/assets` submodule: `packages/site/public/` is gitignored and filled
  from it by `pnpm vendor`.
- **Visual Regression**: `pnpm test:visual` (see
  [`packages/react/AGENTS.md`](packages/react/AGENTS.md#visual-regression)) inside the official
  Playwright Docker image, so the rendered pixels match the checked-in Linux baselines. The image
  tag stays in lockstep with the `@playwright/test` devDependency in `packages/react/package.json`;
  bumping one alone brings font and rendering drift that looks like a regression (RD15).
- **Smoke Test**: `pnpm smoke:build`, then the Next.js app's Server Component routes in
  Chromium under `next start` and `next dev` (RD16). See `smoke-tests/nextjs-app-router/README.md`.
- **Audit**: `pnpm check:pnpm`, which is `pnpm audit --prod --audit-level moderate` and blocks,
  then `pnpm audit`, which reports and doesn't (RD17). It installs nothing: the audit reads the
  lockfile. The ruleset doesn't require it, so it doesn't stop a push to `main`; `release.yml`
  reads it, so it stops a release.
- **Changeset**: a pull request, or a push to `develop`, that changes `packages/react/src/` or
  `tsdown.config.ts` (`changedFilePatterns` in `.changeset/config.json`) needs a changeset;
  `pnpm changeset --empty` adds one that releases nothing. The push of the version commit is
  skipped. Not required by the ruleset or the release.
- **Dependency Review**: on pull requests only, blocks one that adds a dependency with a known
  vulnerability of moderate severity or higher.

`pnpm lint:html`/`pnpm lint:vnu` are not in `pnpm lint`, because they need a built `_site/`.
They run the `chassis-docs html-validate` and `chassis-docs vnu` commands with this site's
exceptions: `packages/site/html-validate.json` and `packages/site/vnu-filters.txt`. The exceptions
are markup React and react-aria write on purpose, such as `spellCheck` in camelCase, ids from
`useId` and explicit roles on native elements. Fix a new finding in the example or the component;
add an exception only for markup that is correct (RD10).

`.github/workflows/release.yml` publishes to npm on a push to `main` when npm lacks the version in
`packages/react/package.json`, after checking that the seven required CI jobs and Audit passed on that commit: Detect
Version, Checks Passed, Publish. It builds, runs `npm publish --provenance` from `packages/react`,
and creates the GitHub release `v<version>` with the notes `build/release-notes.js` reads from the
CHANGELOG. Versions are made on `develop` with `pnpm changeset:version` and pushed as the same
commit to `main`; `staging` is a preview deployment that no workflow reads. See
[`packages/react/VERSIONING.md`](packages/react/VERSIONING.md).

## Where things live

- Component source: `packages/react/src/components/**`; its tests:
  `packages/react/test/components/**`
- Form-family components specifically have their own scoped guide — read
  [`packages/react/FORMS.md`](packages/react/FORMS.md) before
  touching any of the form-related components it lists.
- Docs prose (`.mdx`) + generated API JSON: `packages/site/content/**`
- Live docs examples (imported into `.mdx` via `<Example>`): `packages/site/examples/**`
- Sidebar nav structure: `packages/site/data/sidebar.yml` — new docs pages must be added here or
  they won't appear in the site nav even though the route exists.
- Why the build, tests and CI are the way they are: [`ref/DECISIONS.md`](ref/DECISIONS.md), one row
  per decision, cited as RD numbers from this file, `packages/react/AGENTS.md` and `ci.yml`.
