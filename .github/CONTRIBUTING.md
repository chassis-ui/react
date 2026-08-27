# Contributing to Chassis React

Thanks for taking the time to contribute. This doc covers dev setup, conventions, and what a PR
needs before it can be merged. For architecture and package-specific details, it cross-links
rather than duplicates — those docs are kept up to date as the source of truth.

## Dev setup

See the root [`README.md`](../README.md#running-documentation-locally)'s "Running documentation
locally" section for the actual setup steps (`pnpm install`, `pnpm start`, open
`http://localhost:4327/react/`). This repo is a pnpm workspace with two packages:

- [`packages/react`](../packages/react/AGENTS.md) — `@chassis-ui/react`, the published component
  library. Almost all engineering work happens here.
- [`packages/site`](../packages/site/AGENTS.md) — `chassis-react-site`, the Astro docs site.

Read the relevant package's `AGENTS.md` before making changes — both are kept current and cover
the day-to-day rules (layout, build, tests) this doc doesn't repeat.

## Branch and commit conventions

Commits follow a loose `<type>(<scope>): <description>` convention (not strictly enforced by
tooling, but expected):

- **Types in use**: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `ci`, `migrate` (the last
  one specifically for the ongoing enterprise-migration work tracked outside this repo).
- **Scopes in use**: `(react)` or `(site)` when a change is scoped to one package; omitted for
  changes spanning both or affecting neither (e.g. root tooling, CI).
- Examples from this repo's own history: `fix(react): ...`, `docs(site): ...`,
  `ci: add pnpm lint and astro check as required CI steps`.

Branch names aren't templated — name yours descriptively (e.g. `fix/tooltip-placement`).

## Adding or changing a component

There's no scaffolding command for a new component folder. Follow 
[`packages/react/CONVENTIONS.md`](../packages/react/CONVENTIONS.md) for naming, file
layout, and the flat-export compound-API shape, and
[`packages/react/AGENTS.md`](../packages/react/AGENTS.md) for where things live and how the build/
test/docs pipeline fits together. If you're touching any form-related component (text inputs,
select, checkbox/radio, combobox, datepicker, chip-input, otp-input, or the shared `form`/
`form-field` render helpers), read [`packages/react/FORMS.md`](../packages/react/FORMS.md) first —
it documents two non-interchangeable render engines that are easy to blur by copy-pasting from the
wrong sibling component.

After adding or changing a component's exported props, regenerate the docs site's prop tables:

```bash
pnpm react:generate
```

## What a PR needs before merge

- **Passing CI**: lint, tests (with coverage gates), a clean library build, `pnpm react:check:api`
  (fails if the public props/types surface drifted from the checked-in
  `packages/react/api-report.md`), `astro check`, and `pnpm react:check:bundle` (bundle-size
  regression guard). See the root [`AGENTS.md`](../AGENTS.md#ci) for the exact gate list.
- **A changeset**, for anything touching `packages/react`'s published behavior (a new/changed/
  removed export, prop, or observable DOM/class output):
  ```bash
  pnpm changeset
  ```
  Answer the prompts and commit the generated `.changeset/<name>.md` file alongside your code
  change. See [`packages/react/VERSIONING.md`](../packages/react/VERSIONING.md) for the full
  semver policy (what counts as patch/minor/major) and the deprecation policy for anything you're
  renaming or removing. A PR that only touches `packages/site`, docs, or internal tooling doesn't
  need a changeset — `chassis-react-site` is never versioned or published independently.

## Using the issue tracker

Search existing (including closed) issues first, then [open a new
one](https://github.com/chassis-ui/react/issues/new) if your bug or idea isn't already covered.
For a security vulnerability, don't open a public issue — see [`SECURITY.md`](SECURITY.md).
