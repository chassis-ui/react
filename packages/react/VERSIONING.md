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
which propagates the freshly-bumped `packages/react/package.json` version into the two places that
display it but sit outside the pnpm workspace's own dependency graph: `README.md`'s
download-archive link and `packages/site/config.yml`'s `current_version`. Both are followers of
`packages/react`'s version, never bumped independently.

The actual publish pipeline (`.github/workflows/release.yml`) uses the standard
[`changesets/action`](https://github.com/changesets/action) recipe: on every push to `main` with
pending changesets, it opens/updates a "Version Packages" PR; merging that PR triggers the publish
step. See that workflow file's comments for the npm token/provenance setup a repo admin needs to
complete once, outside what this session can do (see "What still needs a human" below).

## Semver policy

Standard [semver](https://semver.org/): patch = fix with no API change, minor = additive/backward
compatible, major = breaking. Applied to this specific API shape (flat, root-prefixed exports —
see `CONVENTIONS.md`; there is no namespaced/dotted API to reason about):

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
   IntelliSense) explaining what to use instead, and add an unconditional `console.warn` at the
   point of use describing the same thing plus "will be removed in a future major version" —
   matching the existing pattern in `checkbox/Checkbox.tsx`/`select/Select.tsx`'s dev-misuse
   warnings (no `NODE_ENV` gating, no once-per-key dedup — this codebase's existing console-warning
   convention already warns unconditionally on every render, and deprecation warnings follow the
   same shape for consistency rather than introducing a second convention). Concrete precedent:
   `accordion/AccordionItem.tsx`'s `itemKey` prop (deprecated-prop case, warn only when the prop is
   actually passed), retrofitted with a warning as part of adopting this policy since it predates
   it and had none.
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

## What still needs a human

This session set up the mechanics (Changesets tooling, the publish workflow, this policy) but
cannot complete two things that require account/org-level access:

- **`NPM_CHASSIS_UI` repository secret** (reusing the same secret name the sibling `chassis-css`
  repo already uses for its own npm publish token, so one token/secret serves both rather than
  provisioning a near-duplicate) — `.github/workflows/release.yml` reads it and will fail to
  publish until a repo admin adds it.
- **First publish is manual-adjacent**: the very first `npm publish` of a scoped package under a
  given npm org needs that org to already exist on npm and the token's account to have publish
  rights to it — presumably already true, since `@chassis-ui/css` already publishes successfully
  today, but not verified by this session (no npm credentials available here).
