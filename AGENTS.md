# Chassis React — monorepo guide

Chassis React is the React component library for [Chassis UI](https://chassis-ui.com), whose CSS
framework is the separate `@chassis-ui/css`. This repo holds two pnpm workspace packages:

- **[`packages/react`](packages/react/AGENTS.md)** — `@chassis-ui/react`, the published component
  library, where almost all engineering work happens.
- **[`packages/site`](packages/site/AGENTS.md)** — `chassis-react-site`, the Astro docs site at
  chassis-ui.com/react, which renders live examples from the workspace build of the library.

Read the package guide before working inside either package; this file covers only what is
shared. RD numbers cite rows of [`DECISIONS.md`](DECISIONS.md), which holds the history behind the
build, tests and CI; the guides state the rule and cite the row.

## Toolchain

- Always `pnpm`, never `npm`/`yarn`: the lockfile and the `workspace:*` and `overrides` links in
  `pnpm-workspace.yaml` depend on it.
- cspell checks every `.md`/`.mdx` file (`.cspell.json`, `en` and `en-GB` both accepted). Add a
  real word to `words`; for foreign-language examples in one page, put a
  `{/* cspell:ignore ... */}` comment in that page instead.
- The pre-commit hook runs lint-staged (`package.json`): ESLint and Prettier on staged source,
  Prettier on staged JSON, Markdown and YAML, never on styles, which Prettier and stylelint
  disagree on and `pnpm lint`'s stylelint owns. Skip it once with `SKIP_SIMPLE_GIT_HOOKS=1`.

## Root scripts

- A script whose files live in one package is a real script on that package's `package.json`,
  reached from the root through a `react:*`/`site:*` alias. A script lives at the root only when
  it is cross-package (`react:generate` reads one package and writes into the other;
  `new:component` writes into both) or owns a root artifact (`_site/`). `lint:eslint` delegates
  to both packages' own scripts, never a root glob of their paths (RD7).
- Run `pnpm react:generate` after changing any component's exported props; it writes
  `packages/site/content/api/` and `pnpm react:check:api-docs` fails CI when the committed files
  differ. It writes react-docgen-typescript's paths repo-relative so every machine produces the
  same files; keep it that way or the gate breaks (RD8).
- The site's static assets come from the `vendor/assets` submodule, built by the `chassis-docs`
  command of `@chassis-ui/docs`. `pnpm vendor` builds the commit this repository pins, so one
  commit always builds the same site. `pnpm sync-submodules` moves the pin to the latest and
  builds it; commit the new pointer on its own.

## CI

`.github/workflows/ci.yml` runs on a push to `develop` and on pull requests; a push of the same
commit to `staging` or `main` runs none of it. Every job and step is named (RD18), and each has a
comment with its reason and RD number. The ruleset of `main` requires Lint, Type Check, Test,
Build, Site, Visual Regression and Smoke Test by name; `release.yml` reads those and Audit, which
the ruleset doesn't require. Rename a job in all three places. Changeset and Dependency Review
report without blocking.

Versions are made on `develop` with `pnpm changeset:version` and the same commit is pushed to
`main`, which runs `.github/workflows/release.yml`; `staging` is a preview deployment no workflow
reads. See [`packages/react/VERSIONING.md`](packages/react/VERSIONING.md).

## Where things live

- `packages/react`: components in `src/components/**`, specs in `test/components/**`; read
  [`packages/react/FORMS.md`](packages/react/FORMS.md) before touching a form component.
- `packages/site`: prose in `content/**`, live examples in `examples/**`, the nav in
  `data/sidebar.yml`, which a new page must be added to.
- Nothing here cites a file, a decision or a checkout path inside another Chassis repository
  (`../chassis-css/...`, a row of its roadmap): those move without notice and nothing checks them.
  State the fact and its reason here instead. What a sibling publishes is fine to name: the
  classes, tokens and `scss/` partials of `@chassis-ui/css`, the `chassis-docs` commands, an issue
  by its number.
