# Versioning, deprecation, and release process

Everything in `packages/react/src` prior to this package's first published npm version assumed
there were no external consumers, so a rename or removal could happen directly, with no
deprecation path. That assumption no longer holds once this ships a published version to npm —
this doc is the process for handling changes safely from that point on.

## Release mechanics: Changesets

Version bumps and `CHANGELOG.md` are generated from `.changeset/*.md` files, not hand-written
after the fact:

```bash
pnpm changeset            # add a changeset describing this PR's change and its bump type

pnpm changeset:version    # consume pending changesets: bump packages/react/package.json,
                          # write packages/react/CHANGELOG.md, sync README.md/site config

pnpm changeset:publish    # build, then `changeset publish` (npm publish for any bumped,
                          # non-private workspace package — only @chassis-ui/react today)
```

Every PR that changes `packages/react`'s published behavior needs a changeset (`pnpm changeset`,
answer the prompts, commit the generated `.changeset/<name>.md` file alongside the code change).
A PR that only touches `packages/site`, docs, or internal tooling doesn't need one —
`chassis-react-site` is `private` and listed in `.changeset/config.json`'s `ignore`, so Changesets
never versions or publishes it.

`pnpm changeset:version` runs `build/sync-version-refs.js` right after `changeset version` itself,
which propagates the freshly-bumped `packages/react/package.json` version into
`packages/site/config.yml`'s `currentVersion`, which displays it but sits outside the pnpm
workspace's own dependency graph. It follows `packages/react`'s version, never bumped
independently.

Versions are made on `develop`: run `pnpm changeset:version`, commit the result, and push that same
commit to `staging` and `main`. A push to `main` runs `.github/workflows/release.yml`, which checks
that the CI jobs passed on the commit, then publishes the version in `packages/react/package.json`
when npm doesn't have it yet, and creates its GitHub release from the `CHANGELOG.md` entry. A push
without a new version publishes nothing. It publishes with npm trusted publishing, so no npm token
is involved (see "npm authentication" below).

## Semver policy

[Semver](https://semver.org/), with the 0.x rule: **before 1.0, a minor release may break and a
patch release may not.** From 1.0: patch = fix with no API change, minor = additive/backward
compatible, major = breaking. The bump levels below are the 1.0 rules; before 1.0, read "major" as
"minor" and say "Breaking:" in the changeset. Applied to this specific API shape (flat,
root-prefixed exports — see `CONVENTIONS.md`; there is no namespaced/dotted API to reason about):

- **Adding a new component, or a new sub-part to an existing compound family** (e.g. a new
  `AccordionFooter` alongside `AccordionItem`/`AccordionHeader`/`AccordionBody`) — **minor**. It's
  a new named export; nothing existing changes shape.
- **Adding a new optional prop, or a new value to an existing union-typed prop** (e.g. a new
  `color` variant) — **minor**.
- **Renaming or removing an exported component, sub-part, or hook** — **major**. Every export in
  `src/index.ts` is part of the public API surface (`pnpm react:check:api` — see below — exists
  specifically to catch this kind of change turning up unintentionally).
- **Renaming or removing a prop, narrowing a prop's accepted type, or changing a prop from
  optional to required** — **major**.
- **Changing a component's rendered DOM structure or the chassis-css classes it applies** — treat
  as **major** if it's a class a consumer could reasonably have targeted directly (see
  `THEMING.md`'s "supported override surface" for the equivalent reasoning about CSS custom
  properties); a purely internal, undocumented structure change is judgment call, but default to
  major when unsure — a false-positive major bump costs nothing but a version number, an
  undisclosed breaking change costs a consumer's build.
- **Deprecating something (see below) without removing it yet** — **minor** (the deprecated thing
  still works) or **patch** (if the change is purely adding the warning, no behavior change at
  all) — never major on its own; the major bump happens later, at actual removal.

`pnpm react:check:api` (see `AGENTS.md`) is the mechanical backstop for the "renaming/removing an
export or narrowing a prop type" cases above — it fails CI if `dist/index.d.ts`'s public type
surface drifted from the checked-in `api-report.md` snapshot, so an unintentional breaking change
is caught before merge, not just relied on this policy's judgment calls at PR-review time.

## Deprecation policy

A breaking removal doesn't happen in one PR. The minimum path from "we want to remove this" to
"it's gone":

1. **Land the deprecation with a changeset and a runtime warning, as a minor (or patch) release.**
   Mark the export/prop `@deprecated` in its TSDoc comment (consumers' editors surface this via
   IntelliSense) explaining what to use instead, and add a `devWarning` call
   (`src/utils/devWarning.ts`) at the point of use describing the same thing plus "will be removed
   in a future major version" — the same helper every dev-misuse warning in this package goes
   through. It's guarded on `process.env.NODE_ENV`, so the warning reaches the consumer's _dev_
   console (where a maintainer will see it) and never their end users' production console, and it's
   de-duplicated on the message, so a warning in a render body reports once instead of on every
   render. This replaces an earlier convention of unconditional, undeduplicated `console.warn`
   calls; don't reintroduce those. Concrete precedent: `accordion/AccordionItem.tsx`'s `itemKey`
   prop (deprecated-prop case, warn only when the prop is actually passed).
2. **Give it at least one minor release cycle** before removing it, so a consumer pinned to
   `^x.y.0` sees the warning in their own dev console before the breaking major lands, not only in
   a changelog they may not read.
3. **Remove it in a major release.** The changeset for that release documents the removal and
   restates what to migrate to (the changelog is the durable record — don't rely on the original
   deprecation PR still being easy to find).
4. **Consider a codemod for mechanical, high-call-site renames** (`jscodeshift` is the standard
   tool for this; not currently a dependency anywhere in this workspace) — worth authoring when a
   rename would otherwise mean hand-editing many call sites across many consumers with an
   otherwise-mechanical find/replace. Not worth it for a one-off prop removal or a component few
   consumers likely use — the TSDoc + runtime warning + changelog entry is sufficient signal on its
   own for those.

## npm authentication

`@chassis-ui/react` publishes with [npm trusted publishing](https://docs.npmjs.com/trusted-publishers):
on npmjs.com the package trusts the `release.yml` workflow of `chassis-ui/react`, and the workflow
authenticates by OIDC (`id-token: write`). No npm token or repository secret is involved, and
every version gets provenance.

- Renaming or moving `release.yml` breaks publishing until the trusted publisher on npmjs.com is
  updated to the new file name.
- The job runs Node 24 by name, not `.nvmrc`: its npm 11 is what trusted publishing needs (11.5.1
  or later). `changeset publish` runs `pnpm publish`, which hands the upload to that npm.
