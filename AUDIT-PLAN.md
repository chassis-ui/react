# Audit plan — third pass

Two tracks, from two reviews of this repository:

- **Track A — package and repository.** Licensing, security policy, release safety, the published
  tarball, CI gates, dead config, contributor on-ramp, and alignment with the rest of the Chassis
  ecosystem. Reviewed 2026-09-29, re-verified 2026-09-30.
- **Track B — components.** SSR/CSR compatibility, polymorphism, `asChild`/slots, React Server
  Components, API consistency across `packages/react/src/components`. Reviewed 2026-09-30.

Both against `develop` at `0fc14fab`. The two earlier passes (the 19-phase polymorphic migration and
the 10-phase second review) are closed; this file holds new findings only. Open GitHub issues
#37–#41 are referenced where a phase touches the same code, not re-reported.

This is the repository's own upgrade project in the sense of `SIBLING_TASKS.md` of chassis-website.
Tasks that come from that file keep their ID there (A5, A15, RCT4, ...); to avoid confusion with
this plan's phases they are always written "sibling task A5".

## How to work this plan

- One phase per session and per commit. Track B commits are
  `fix(react): audit 3 phase B<N> — ...`; Track A uses the type that fits (`ci:`, `docs:`,
  `chore:`, `build(react):`). Stop for a go-ahead before starting the next phase.
- Follow the order in "Recommended order" below. Within a phase, work the first unchecked box.
- Boxes marked **(You)** are decisions or settings on GitHub, npm or in another repository. A model
  doesn't make them; it waits for the answer, then does the boxes that depend on it.
- Work lands on `develop`. It reaches `staging` and `main` only when the maintainer says so, as the
  same commit. No phase pushes to either.
- A phase that changes a rendered element or class checks it against chassis-css first: the
  component's page in the chassis-css docs and its partial in `@chassis-ui/css/scss/`. The library
  renders chassis-css's markup; it doesn't define its own.
- After each Track B phase: `pnpm react:check:types`, `pnpm test`, `pnpm react:build`,
  `pnpm react:check:api` (update `api-report.md` only when the change is intentional), then
  `pnpm react:generate` if props changed. Add a changeset for anything a consumer can observe.
- Tick the box and add the commit hash when a phase lands.

## Ecosystem conventions this plan follows

Source: `chassis-website/ref/` — the decisions table of `ROADMAP.md`, `SIBLING_TASKS.md` and
`DEPLOYMENT.md`, read 2026-09-30. "D" numbers are that roadmap's decisions. Where this repository
differs, the phase in the last column closes the gap or asks for a decision.

| Convention                                                                                               | Source          | Here today                                                                 | Phase |
| -------------------------------------------------------------------------------------------------------- | --------------- | -------------------------------------------------------------------------- | ----- |
| Work lands on `develop`; the same commit is pushed to `staging`, then `main`. Pull requests are optional | D1              | Dependabot and the release pull request both target `main`                 | A2    |
| The ruleset on `main` and `staging` requires CI checks, and blocks force push and deletion               | D1              | Blocks force push and deletion only                                        | A2    |
| Changesets are versioned on `develop`; `main` publishes what npm lacks, after CI passed on the commit    | D5              | `changesets/action` opens a release pull request on `main`, as tokens does | A2    |
| Node 24 for development and CI, `engines` at `>=22.12.0`                                                 | D7              | Done                                                                       | —     |
| Shared build scripts are commands of `chassis-docs`; a build uses the pinned submodule commit            | D8              | Own copies in `build/`; every build moves the pin                          | A8    |
| Community files live in each repository: issue forms, blank issues off                                   | D10             | Markdown templates, blank issues on                                        | A6    |
| Before 1.0, a minor release may break and a patch may not (written for `@chassis-ui/docs`)               | D19             | `VERSIONING.md` says breaking is major; 0.2.0 shipped a break as a minor   | A2    |
| Secret scanning, push protection and Dependabot alerts on; Dependabot security updates off               | Roadmap phase 0 | Alerts on, the other two off                                               | A1    |
| Workflows have read-only permissions, actions pinned by commit, dependency review on pull requests       | Roadmap phase 0 | None of the three                                                          | A2    |
| cspell runs in the lint job                                                                              | Roadmap 3.1     | Configured, never run                                                      | A4    |
| Pre-commit hook with simple-git-hooks and lint-staged                                                    | Roadmap 3.2     | None                                                                       | A6    |
| `@chassis-ui/css` and `@chassis-ui/tokens` share a minor version                                         | `DEPLOYMENT.md` | Depends on css `^0.5.2` and tokens `^0.6.0`                                | A3    |

## Which model for which phase

| Model      | Use it for                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------- |
| Sonnet 5.5 | Bounded edits where this plan already says what to change and one command proves it         |
| Opus 5.5   | Multi-file work that follows a pattern already in the repo, or config where a mistake costs |
| Fable 5.1  | Phases that introduce a new abstraction or public API, or depend on how React works inside  |
| You        | Decisions, and settings on GitHub or npm                                                    |

These are judgments about how hard each phase is, not measured results. If a phase needs a second
attempt at the same fix, move it up one tier instead of retrying.

## Overview

| Phase | Work                                                       | Model              | Release      |
| ----- | ---------------------------------------------------------- | ------------------ | ------------ |
| A1    | License, security policy, repo security settings           | You, then Sonnet   | none         |
| A2    | Branch rules, release flow, CI hardening                   | You, then Opus     | none         |
| A3    | Peer dependencies, source maps, npm README                 | Opus               | minor        |
| A4    | Prettier, stylelint and cspell as CI gates                 | Sonnet             | none         |
| A5    | Dead config; history out of the agent guides               | Sonnet, Opus       | none         |
| A6    | Component scaffold, CONTRIBUTING, issue forms, links       | Opus, Sonnet       | none         |
| A7    | Firefox/WebKit tests, React 18 job                         | Opus               | none         |
| A8    | Ecosystem alignment: `chassis-docs` commands, pinned build | Opus               | none         |
| B0    | Permanent SSR, hydration and `asChild` tests               | Opus               | none         |
| B1    | Hydration-safe portals                                     | Opus               | patch        |
| B2    | `asChild` keeps the component's semantics                  | Fable              | patch        |
| B3    | Lazy children from Server Components (#37)                 | Fable              | patch        |
| B4    | Remove `react-transition-group` (#40)                      | Fable              | patch        |
| B5    | One rule for `href`                                        | Opus               | minor        |
| B6    | Overlay and state API (#38, #39)                           | Fable              | minor        |
| B7    | Correct first paint on the server                          | Opus               | patch        |
| B8    | Ref forwarding and shared helpers                          | Sonnet, Opus       | minor        |
| B9    | Public primitives and new components                       | You, then per item | per decision |

### Recommended order

1. **A1, A2** — before the next release. Nothing else should publish until `main` is gated.
2. **B0, B1, B2, B3** — the defects consumers hit today.
3. **A3, A4** — ship with the B1–B3 release so the manifest changes go out once.
4. **A8** — makes the docs build reproducible; do it before the next production deploy of the site.
5. **B4, B5** — then **A7**, which needs B4 done for the six components to run under `next dev`.
6. **B6, B7, B8** — API work, one minor release.
7. **A5, A6** — any time; they don't block or depend on anything above.
8. **B9** — last; it is decisions.

## How the findings were produced

Track A was read and queried: manifests, workflows, `npm pack --dry-run`, the npm registry, and the
GitHub API for repository settings. The lint passes that CI skips were run.

Track B used three throwaway specs, run and then deleted (nothing from them is committed):

1. **Server render sweep** — every story (297, from all 62 story files) rendered with
   `renderToString` in a real Node environment. Result: none threw, none logged an error.
2. **Hydration sweep** — the same 297 server HTML strings hydrated in jsdom with `hydrateRoot`,
   recording `onRecoverableError`. Result: 17 stories fail hydration (F1).
3. **Probes** — targeted `asChild`, `href` and lazy-child cases, output inspected by hand (F2–F5).

What was read rather than executed is marked "by reading" below.

## Track A findings

### P1 — The published LICENSE names a different copyright holder

`packages/react/LICENSE` says `Copyright (c) 2021 creativeLabs Łukasz Holeczek`; the root `LICENSE`
says `Copyright (c) 2025 Ozgur Gunes`. The package file is the one in the npm tarball. No other
file in the repo mentions CoreUI.

### P2 — The security policy points to a disabled channel

`.github/SECURITY.md` sends reporters to GitHub private vulnerability reporting, which is off for
the repository. It also says the package is "not yet published to npm"; 0.2.0 is `latest` there.
Secret scanning and push protection are disabled. Dependabot alerts are on.

### P3 — A release can publish untested code, and `main` drifts from `develop`

`release.yml` builds and publishes on any push to `main` with no test step. The ruleset "Protect
main and staging" blocks only deletion and force-push; it requires no status checks.

Two things write to `main` without passing through `develop`: Dependabot, whose config sets no
`target-branch`, and the "Version Packages" pull request that `changesets/action` opens. After
either merges, `main` holds commits `develop` lacks.

`ci.yml` has no `permissions:` block, no `concurrency` cancellation and no `timeout-minutes`.
Actions are pinned to tags, not commit SHAs. There is no dependency review on pull requests.

`VERSIONING.md` says a breaking change is a major release. 0.2.0 shipped one ("Breaking: `Icon` no
longer references…") as a minor, so the written policy and the practice differ.

### P4 — The manifest under-declares what the package needs

- `@chassis-ui/css` is a devDependency only. A consumer on a mismatched version installs with no
  warning, and the 0.5.0 token rename collapses spacing silently.
- `react` and `react-dom` are `>=18`: open-ended, so it claims React 20, and React 18 is never
  tested (see P7).

### P5 — The tarball ships `src/` but no source maps

`npm pack --dry-run`: 565 files, 1,232 kB unpacked. `src/` is 293 files and 781 kB of that (63%).
`dist/` is minified and has no `.map` files, so nothing references `src/` and consumers debug
minified stack traces.

### P6 — Lint gates CI skips are nearly green

`AGENTS.md` says CI doesn't gate on stylelint or Prettier because of pre-existing findings. Run on
2026-09-29: stylelint passes in both packages; Prettier fails on three files
(`src/types.ts`, `stories/notification/Notification.stories.tsx`,
`test/components/flex/Flex.spec.tsx`); the site's eslint reports two `react/no-array-index-key`
warnings.

### P7 — Browser and React coverage is narrower than claimed

`browserslist` lists Firefox and Safari; the Storybook interaction project and visual regression run
Chromium only. CI and the smoke app run React 19.3 only.

### P8 — Dead or stale configuration

- `.cspell.json`: cspell is not installed or run anywhere, and the config ignores
  `packages/website/`, which doesn't exist here (it is chassis-website's folder).
- `build/sync-version-refs.js` `syncReadme()` rewrites an `archive/vX.zip` link the README no longer
  contains.
- Root `tsconfig.json` keeps `outDir`, `declaration`, `sourceMap` and `target: es2017` from when
  `tsc` emitted; tsdown emits now and `tsc` runs with `--noEmit`.
- `AGENTS.md` (281 lines in `packages/react`) and the `ci.yml` comments narrate what things used to
  do alongside the rules.
- The wiki is enabled and unused; the tag `backup/develop-pre-reset-2026-09-22` is on the public
  remote.

### P9 — Contributor on-ramp

- No scaffold: a new component touches about ten places (folder, barrel with its two required
  lines, two entries in `src/index.ts`, spec, story, docs page, sidebar, generated API JSON,
  `api-report.md`, changeset).
- `CONTRIBUTING.md` links to `README.md#running-documentation-locally`; the heading is "Running the
  docs site locally".
- `.github/ISSUE_TEMPLATE/config.yml` links to `github.com/chassis-ui/chassis`, which doesn't
  exist; the repository is `chassis-ui/css`.
- The root README says visual regression covers the calendar/datepicker family; it covers six.
- `packages/react/README.md`, the one npmjs.com shows, omits the `style.css` import, subpath
  imports and `asChild`.
- Issue templates are Markdown, not forms. Discussions is off. The repository homepage is a
  `vercel.app` URL and there are no topics.
- Known backlogs exist only as prose: about 3,000 HTML-validation findings on the docs site, and
  visual regression covering 6 component families.

### P10 — Drift from the Chassis ecosystem

Checked against `chassis-website/ref/` and the installed packages:

- `build/sync-submodules.js`, `build/html-validate.js` and `build/vnu-jar.js` are this repository's
  own copies. The ecosystem replaced them with `chassis-docs` commands (sibling task A5).
- `sync-submodules` runs `git submodule update --remote` and `git pull`, and both `pnpm setup` and
  the Vercel build command (`pnpm site:setup`) call it. So every build moves the `vendor/assets`
  pin, and the same commit of this repository can build two different sites.
- It checks the build output in `dist/web/chassis-docs`; the output is `dist/web/docs/chassis`
  (sibling task RCT4).
- The site is on `@chassis-ui/docs` 0.6.0. 0.6.1 adds consent before analytics loads (sibling task
  A15) and the `chassis-docs` commands.
- `SIBLING_TASKS.md` still lists sibling task A21 (trusted publishing) as open for react, and
  `OPERATIONS.md` says react reads the `NPM_CHASSIS_UI` secret. Both are out of date: `release.yml`
  has used trusted publishing since `a514a69c`.
- `staging` is at `4d241a5f`, behind `develop` and `main`, which are both at `0fc14fab`.

## Track B findings

### F1 — Portals rendered during hydration break it (confirmed)

`typeof window !== 'undefined' && createPortal(...)` renders nothing on the server and a portal on
the client's first render. React's hydration cursor walks into the portal's children and reports a
mismatch whenever the portal has content on that first render.

| Component                         | Fails when                                   | Stories failing |
| --------------------------------- | -------------------------------------------- | --------------- |
| `Combobox`                        | always — its menu `<div hidden>` is portaled | 6 of 6          |
| `Autocomplete`                    | always — same pattern                        | 7 of 7          |
| `FormField` wrapping a `Combobox` | always — the cursor then eats `.form-help`   | 1               |
| `Popover`                         | `visible` on first render (`defaultOpen`)    | 3               |

`Tooltip` and a closed `Popover` pass only because `Transition mountOnEnter` renders nothing inside
the portal at first. `Toaster` with `placement` reports no error, but the server renders the region
inline and the client moves it to `document.body`, so the server markup is discarded on hydration.

Call sites: `Tooltip.tsx:132`, `Popover.tsx:216`, `Combobox.tsx:282`, `Autocomplete.tsx:410`,
`Toaster.tsx:81`, `MenuList.tsx:132`, `MenuSubmenu.tsx:277` (the last already uses a `mounted`
flag, which is the correct pattern).

### F2 — `asChild` takes the "trusted component reference" path (confirmed)

`createPolymorphicComponent` implements `asChild` by passing `component={Slot}`. Render functions
that branch on `typeof component === 'string'` or `component === 'a'` therefore treat a slotted
`<a>` as an opaque custom component and skip their own semantics.

| Call                                             | Rendered                                         | Problem                                                      |
| ------------------------------------------------ | ------------------------------------------------ | ------------------------------------------------------------ |
| `<Button asChild disabled><a href>`              | `<a href disabled="" class="button … disabled">` | invalid attribute; no `aria-disabled`, `tabindex`, or guard  |
| `<Button href disabled>` (for comparison)        | `<a … aria-disabled="true" tabindex="-1">`       | correct                                                      |
| `<Link asChild disabled>`, `<NavLink asChild …>` | `<a href class="disabled">`                      | still focusable and still navigates                          |
| `<MenuItem asChild disabled>`                    | `<a href role="menuitem" class="disabled …">`    | same                                                         |
| `<CloseButton asChild><a href>`                  | `<a href>x</a>`                                  | loses `close-button`, color/size classes and the label       |
| `<List><ListItem asChild><a>`                    | `<ul class="list"><a class="list-item">`         | `<a>` directly inside `<ul>`; `List` only checks `component` |
| `<Placeholder asChild><img>`                     | the default `<svg>`                              | child ignored silently, no warning                           |

### F3 — Lazy children from Server Components (confirmed; same root cause as #37)

Flight hands a server-passed element over as a `React.lazy` node when its subtree references a
client module that hasn't loaded. #37 covers `Slot`. The same input reaches other components:

- `Tooltip`, `Popover`: **throw** `TypeError: Cannot read properties of undefined (reading 'ref')`
  — `getTriggerRef` reads `element.props.ref` on a node that has no `props`.
- `Tabs`: renders, with a "unique key" warning.
- `List`, `Stepper`: render correctly (`Children.toArray` resolves lazy nodes in React 19).

The lazy node was built by hand in the probe, not captured from a running Next.js app. B3 ran it
in one and corrected this finding; see that phase.

Every file that inspects children is exposed: `comboboxCollection.tsx`, `Stepper.tsx`, `List.tsx`,
`Tabs.tsx`, `DataGridPinBehavior.tsx`, `iconSlot.tsx`, `Tooltip.tsx`, `Popover.tsx`, `slot.tsx`.
The docs' SSR page doesn't mention composition limits for these.

### F4 — `href` means different things per component (confirmed)

- Nine components switch to `<a>` when given `href` (`Button`, `Chip`, `Avatar`, `NavbarBrand`,
  `PaginationItem`, `StepperItem`, and the data-driven `List`/`Stepper`/`MenuList` items).
- `<ListItem href="/a">` renders `<li class="list-item" href="/a">` — an invalid attribute and no
  link. It needs `component="a"` as well.
- `<MenuItem>` with no `href` renders `<a role="menuitem">` without `href`.

Corrected in B5: `StepperItem` doesn't switch on `href` (`<StepperItem href>` renders `<li href>`,
as `ListItem` does), and more components write `href` onto a non-link. See B5.

### F5 — Server HTML differs from the settled client state (confirmed unless marked)

No hydration error, but the first paint is wrong or incomplete:

- `Tabs` without `defaultSelectedKey`: no tab is selected and **no panel is rendered** on the
  server; selection happens after hydration.
- `Toast`/`Notification` with `visible`: server HTML is `class="toast fade"` without `show`.
- `Menu` open on first render: the list is inline at `position:fixed; top:0; left:0` until
  positioned.
- `Carousel`: `<ol class="carousel-indicators">` is empty on the server.
- By reading — `Calendar.tsx:201`, `:318` and `RangeCalendar.tsx:299` call `getLocalTimeZone()`
  during render, so "today" is computed in the server's timezone.

### F6 — Overlay API gaps (by reading)

- `PopoverProps` accepts only `aria-label`/`aria-labelledby` beyond its own props; `TooltipProps`
  accepts nothing. Neither can take `className`, `style`, `id` or `data-*` for the panel, and
  neither forwards a ref.
- `visible` is "sync-on-change, not strictly controlled" (`useFloatingOverlay.ts`). A parent can't
  hold an overlay closed, and there is no change callback carrying the new value.
- Naming is split: `visible` (Modal, Drawer, Menu, Popover, Tooltip, Toast, Notification,
  Collapse), `isOpen` (DatePicker family), `open` (Accordion).
- `useControllableState` exists but has three users (`OtpInput`, `ChipInput`, `Carousel`).

Corrected in B6: `visible` was already controlled on `Modal`, `Drawer` and `Collapse`, and the
`DatePicker` family had the full controlled triplet under other names. See B6.

### F7 — Ref forwarding and duplicated helpers (by reading)

- Public components with no ref: `Autocomplete`, `PasswordStrength`, `FormField`, `Popover`,
  `Tooltip`, `SkeletonLoader`.
- `getElementRef` (`slot.tsx`) and `getTriggerRef` (`triggerElement.ts`) are the same React 18/19
  ref lookup written twice. `Tooltip`/`Popover` clone their trigger by hand instead of using `Slot`.

`Popover` and `Tooltip` forward a ref to their panel since B6. A7 removed the React 18 branch from
both lookups.

### F8 — `react-transition-group` (from the smoke test's own notes)

`smoke-tests/nextjs-app-router/app/page.tsx` records that `Tooltip`, `Popover`, `Toast`,
`Notification`, `Collapse` and `Tabs` throw "Element type is invalid" under `next dev` with
Turbopack, because of how that package is published. Production builds work. Six components import
it: `TabPanel`, `Tooltip`, `Notification`, `Collapse`, `Popover`, `Toast`.

Stale, as B4 found: the error no longer occurs on Next.js 16.3.6. B4 removed the package anyway.

### F9 — Gaps to decide on, not defects

- `Slot`, a portal primitive and a visually-hidden helper are internal only.
- Three chassis-css components have no React counterpart:
  - `.alert` — `CHASSIS_CSS.md` calls it "a blocking alert dialog, not a banner". The header comment
    of `_alert.scss` describes inline status messages instead, so confirm with chassis-css which it
    is before building.
  - `.nav-overflow` — a partial plus a JS plugin (`nav-overflow.js`).
  - Scrollspy — a JS plugin (`scrollspy.js`).
- Common components with no equivalent here or in chassis-css: number input, time field, search
  field, context menu, tree, divider. These need chassis-css styles first.

### F10 — Markup the HTML validators found (confirmed, A8)

A8 ran html-validate and the Nu Html Checker over the built docs site. The docs examples and one
`ListItem` defect were fixed there. These are library markup; each has an exception in
`packages/site/html-validate.json` or `packages/site/vnu-filters.txt`, to delete with its fix:

- `Nav` renders `role="navigation"` on its `<ul>`, a role `ul` doesn't allow, and which removes the
  list's semantics. An item without `href` spreads `active` and `disabled` onto its `<li>` as
  attributes. (vnu filter "Bad value “navigation”".) Fixed in B5.
- react-aria's `useSlotId` writes description and error-message ids into the `aria-describedby`
  of every field on the server, and drops them only in a layout effect after hydration. The docs
  site's server HTML has 823 references to ids that don't exist. The library renders its own
  feedback ids, so it can pass its own `aria-describedby`. (html-validate `no-missing-references`
  off.)
- react-aria's grid writes `aria-describedby=""` on `Table` and `DataGrid` on the server, the
  `DataGrid` virtualizer writes `height:-40px`, and `ChipInput`'s empty tag list is `role="group"`
  with `aria-multiselectable`. (Three vnu filters.)
- A closed `Menu` list has `aria-hidden="true"` over focusable items. chassis-css hides it with
  `display: none`, so nothing can reach them, but the attribute is redundant and keeps
  html-validate's `hidden-focusable` off.
- `OtpInput` with `mask` renders `type="password"` boxes with `autocomplete="off"`, which browsers
  ignore on password fields, so a password manager can offer to fill each digit. (html-validate
  `autocomplete-password` off.)

## Track A phases

### A1 — License, security policy, repository security settings (P1, P2)

Done: 59bf0722.

Model: **You**, then **Sonnet**. The edits are two small files once the decision is made.

- [x] **(You)** Decide the copyright line. If the code descends from CoreUI React, MIT requires
      keeping their notice and adding yours. If it doesn't, replace it with yours.
- [x] Update `packages/react/LICENSE` to match; make the root `LICENSE` consistent with it.
- [x] **(You)** In the repository's security settings, enable private vulnerability reporting,
      secret scanning and push protection. Leave Dependabot security updates off, as the ecosystem
      decided; alerts are already on.
- [x] Rewrite `SECURITY.md` on the model of chassis-website's: "Supported versions" (only the
      latest published version gets fixes), "What to report" for a component library, then the
      reporting steps.

Exit: `gh api repos/chassis-ui/react/private-vulnerability-reporting` returns `enabled: true`.

### A2 — Branch rules, release flow, CI hardening (P3)

Files done: 324321d6. Ruleset requires the seven CI checks since 2026-09-30. Open: the exit check, on the first push to `main`.

Model: **You**, then **Opus**. Small diffs, but a mistake in `release.yml` stops publishing, and
trusted publishing is tied to that file's name.

- [x] **(You)** Choose the release flow.
  - Option 1, as chassis-website (D5): run `pnpm changeset:version` on `develop`, push the same
    commit to `staging` and `main`, and `release.yml` publishes when npm lacks the version.
  - Option 2, as chassis-tokens: keep the "Version Packages" pull request on `main`.
  - Recommendation: option 1. `main` then never holds a commit that `develop` lacks.
- [x] **(You)** Extend the ruleset "Protect main and staging" to require the CI checks. Don't
      require a pull request: D1 keeps them optional, and a direct push of a commit that already
      passed on `develop` is the normal path.
- [x] `ci.yml`: run on pushes to `develop` and on pull requests against `develop`, `staging` and
      `main`. Split the `test` job into Lint, Type Check, Test and Build, the names the ecosystem's
      rulesets require. Keep `visual-regression` and `smoke-test-nextjs` as they are.
- [x] `release.yml`: gate the publish. With option 1, check that CI passed on the commit, as
      `publish-packages.yml` of chassis-website does. With option 2, add a `ci` job that the publish
      job `needs`, as `publish-release.yml` of chassis-tokens does. Don't rename the file.
- [x] `dependabot.yml`: set `target-branch: develop` for both ecosystems.
- [x] Both workflows: top-level `permissions: contents: read`, a `concurrency` group that cancels
      superseded pull-request runs, `timeout-minutes` on each job.
- [x] Pin every action to a commit SHA with the tag in a trailing comment.
- [x] Add dependency review on pull requests. CodeQL is optional; no other Chassis repository runs
      it.
- [x] **(You)** Confirm the pre-1.0 versioning rule: a minor may break, a patch may not (D19).
      Then rewrite the semver section of `VERSIONING.md` to say so.

Exit: a push to `main` of a commit without passing checks is rejected.

### A3 — Peer dependencies, source maps, npm README (P4, P5, P9)

Done: build(react) commit "A3 — peer dependencies, source maps, npm README".

Model: **Opus**. The source-map change interacts with `bundlewatch`, `check:rsc`, `publint` and
the `sideEffects` globs.

- [x] Add `@chassis-ui/css` to `peerDependencies` as `>=0.5.0 <0.6.0` (a 0.x minor is breaking).
      Keep it in `devDependencies`. css and tokens share a minor and tokens is already at 0.6, so
      css 0.6 is likely next: the Dependabot pull request that takes it must widen this range and
      carry a changeset. Add that to the `chassis-ui` group's comment in `dependabot.yml`.
- [x] Change `react`/`react-dom` to `^18.0.0 || ^19.0.0`, or `^19.0.0` if A7 drops React 18.
      A7 dropped it: `^19.0.0`.
- [x] Turn on `sourcemap` in `tsdown.config.ts`. If the maps embed `sourcesContent`, remove `src/`
      from `files`; if not, keep it. Check that `.bundlewatch.config.json`'s globs don't match
      `.map` files and that `check:rsc` still passes. Record the tarball size before and after in
      the changeset.
- [x] Rewrite `packages/react/README.md`: install both packages in one command, the `style.css`
      import, subpath imports, `asChild`, badges.

Changeset: minor. Exit: `npm pack --dry-run` lists `.map` files; `pnpm react:check:package` passes.

### A4 — Prettier, stylelint and cspell as CI gates (P6, P8)

Done: ci commit "A4 — Prettier, stylelint and cspell as CI gates". The first cspell run found no
typos, only project words; `api-report.md` is ignored as generated, and the French examples in
`internationalization.mdx` carry a `cspell:ignore` comment.

Model: **Sonnet**. Named files, two scripts and one workflow line.

- [x] Format the three files by path, one command each. Never run Prettier over `src/` as a whole:
      it disagrees with stylelint on `.scss`/`.css`.
- [x] Fix the two `react/no-array-index-key` warnings in `packages/site/examples/components/list/`.
- [x] Add `cspell` and a `spellcheck` script, as chassis-website has
      (`cspell --no-progress --no-must-find-files`). In `.cspell.json`, change `packages/website/`
      to `packages/site/` and add the project's own words. Expect a first run that lists many.
- [x] Make the root `pnpm lint` run what CI's lint runs: `react:lint`, `site:lint`, `spellcheck`.
      Take `lint:html` and `lint:vnu` out of it; they need a built site and move to A8.
- [x] In `ci.yml`, replace `pnpm lint:eslint` with `pnpm lint`.
- [x] Update the CI section of the root `AGENTS.md`, which still says these have pre-existing
      findings.

Exit: `pnpm lint` exits 0 locally and in CI.

### A5 — Dead config; history out of the agent guides (P8, #41)

Model: **Sonnet** for the first three boxes. **Opus** for the guides: deciding which sentences are
rules and which are history needs judgment across 500 lines.

- [ ] Remove `syncReadme()` from `build/sync-version-refs.js` and the sentence about the
      download-archive link from `VERSIONING.md`.
- [ ] Root `tsconfig.json`: remove `outDir`, `declaration`, `sourceMap`; try removing
      `ignoreDeprecations`. Verify with `pnpm react:check:types`, `pnpm react:generate` and
      `pnpm site:check`.
- [ ] Do #41.
- [ ] Move "this used to…" narrative from both `AGENTS.md` files and the `ci.yml` comments into
      `ref/DECISIONS.md`: a table of ID, decision, outcome and date, like the decisions table of
      chassis-website's roadmap. Leave the rule and the decision's ID behind.
- [ ] **(You)** Disable the wiki. Delete the `backup/develop-pre-reset-2026-09-22` tag from the
      remote when it's no longer needed.

Exit: `packages/react/AGENTS.md` states rules only; every moved paragraph has a row in the table.

### A6 — Component scaffold, CONTRIBUTING, issue forms, links (P9)

Model: **Opus** for the scaffold, which has to reproduce ten conventions exactly. **Sonnet** for
the rest.

- [ ] Add `pnpm new:component <kebab-name>`: creates the folder, the barrel with `'use client'` and
      the focus-ring import, both `src/index.ts` entries, a spec with a jest-axe assertion, a
      story, a docs page, and the sidebar entry. It prints the commands still to run
      (`react:generate`, `check:api:update`, `changeset`).
- [ ] `CONTRIBUTING.md`: add a "Your first pull request" section of under 20 lines that names
      `develop` as the branch to target; fix the `#running-documentation-locally` anchor.
- [ ] Replace the Markdown issue templates with forms, copied from chassis-website and adjusted:
      `bug.yml`, `feature.yml`, `docs.yml`, and a `config.yml` with blank issues off. Fix the
      `chassis-ui/chassis` link in it; the repository is `chassis-ui/css`.
- [ ] Add the labels the forms set: `needs-triage`, `needs-info`, `confirmed`.
- [ ] Correct the root README's visual-regression sentence.
- [ ] Add a pre-commit hook with simple-git-hooks and lint-staged, as chassis-website has: eslint
      and Prettier on staged files only.
- [ ] **(You)** Discussions: enable it here, or point the issue chooser at chassis-website's. Only
      chassis-website has it on today.
- [ ] **(You)** Set the homepage to `https://chassis-ui.com/react/`; add topics; turn on "delete
      branch on merge".

Exit: `pnpm new:component demo-thing` followed by `pnpm react:check:types && pnpm test` passes,
then the generated files are removed.

### A7 — Firefox/WebKit tests, React 18 job (P7, P9)

Done: ci commit "A7 — story tests in Firefox and WebKit, peer range to React 19". Nothing failed
in the new browsers: all 305 stories pass in each of the three, on macOS and in CI's Playwright
image (three runs of the `storybook` project, two of the full `pnpm test`). Open: the exit check,
on the first CI run after the push.

React 18 was measured before the decision, in a container with `react`, `react-dom` and their
types at 18.3: 18 of 2,825 jsdom tests failed in 4 files (the lazy-children cases, hydration of
the two `DataGrid` pinned-column stories, the `Combobox` portal test, one hydration-warning
control) and `check:types` reported 3 errors. The peer range is now `^19.0.0`, and the two
branches that read `element.ref` for React 18 (`slot.tsx`, `triggerElement.ts`) are removed.

Visual regression covers nine spec files, not six: 16 of the 57 story folders. The rest is #45.

Model: **Opus**. New browsers usually surface real failures that need diagnosing, not just config.

- [x] Add `firefox` and `webkit` instances to the `storybook` project in `vitest.config.ts`;
      install them in CI. Triage what fails.
- [x] **(You)** Decide: support React 18, or narrow the peer range to 19. Decided 2026-09-30:
      narrow to 19.
- [x] If supporting it: add a CI job that runs the jsdom project with `react`, `react-dom` and
      `@types/react` overridden to 18. Not needed: React 18 is not supported.
- [x] **(You)** Approve filing one issue: extending visual regression beyond six families. Then
      file it. Filed as #45.

Exit: CI runs three browsers; the peer range matches what CI tests.

### A8 — Ecosystem alignment: `chassis-docs` commands, pinned build (P10, P9)

Done: ci commit "A8 — chassis-docs commands, pinned build, HTML validators". The site renders no
footer of its own, so 0.6.1's footer brings the consent button and the privacy link. The
validators run in the `site-build` job, the only one with a built `_site/`. The library markup
they found is F10.

Model: **Opus**. It replaces build scripts that Vercel runs, and the HTML triage needs judgment
about which findings are real.

- [x] Take `@chassis-ui/docs` `^0.6.1` in `packages/site` (sibling task A15). If the site renders
      a footer of its own, add the "Privacy" link and the `data-consent-open` button.
- [x] Replace the copies in `build/` with the package's commands (sibling task A5, which also
      closes RCT4): `chassis-docs sync-submodules`, `chassis-docs html-validate` with
      `--config packages/site/html-validate.json`, and `chassis-docs vnu`. Delete the three
      scripts. Remove `globby` and `picocolors` from the root `devDependencies` if nothing else
      imports them.
- [x] Add `pnpm vendor` (`chassis-docs vendor`), which builds the pinned commit. Use it in `setup`,
      `site:setup` and the Vercel build command. `pnpm sync-submodules` stays as the deliberate way
      to move the pin, committed on its own.
- [x] Re-run both validators. Put this site's exceptions in `packages/site/html-validate.json` and
      a vnu filter file, with the reason in the commit message; fix the rest. The earlier count of
      about 3,000 findings came from the old scripts and will change.
- [x] Run both validators as checks of the Build job in `ci.yml`.
- [ ] **(You)** In chassis-website, run `pnpm site:lint:links https://chassis-ui.com` and pass on
      what it lists for `/react` (sibling task A23). Then fix those links here.
- [ ] Serve static files under `/react/static` (sibling task A6) once `SIBLING_TASKS.md` no longer
      marks it blocked. Still blocked on 2026-09-30.
- [ ] Optional: call chassis-website's reusable workflows for lint, type check and build, pinned to
      a commit (sibling task A14). The required check names change to `Lint / Lint` and so on.
      Blocked on 2026-09-30 until roadmap session 5.2 is pushed.
- [ ] **(You)** In chassis-website's `SIBLING_TASKS.md`, set sibling task A21 to done for react, and
      each task finished here. Correct the `NPM_CHASSIS_UI` sentence in `OPERATIONS.md`.

Exit: `build/` holds `generate-api.ts`, `sync-version-refs.js` and `tsconfig.json` only. Running
`pnpm site:build` twice leaves `git submodule status` unchanged.

## Track B phases

### B0 — Permanent SSR, hydration and `asChild` tests

Done. The hydrate spec runs in a Node environment: it renders the HTML with no DOM, then installs
jsdom, calls `vi.resetModules()` and hydrates in a fresh module graph. The matrix compares
`asChild` with `component="a"` and found cases F2 doesn't list: `disabled` handling in Avatar,
CardLink, Chip and PaginationItem, and ListItem's missing `list-action` class. Lazy children have their own spec, `test/utils/lazyChildren.spec.tsx`.

Model: **Opus**. Test infrastructure with one design choice (how two environments share HTML).

- [x] `test/ssr/render.spec.tsx` (Node environment): render every story with `renderToString`;
      fail on a throw or a `console.error`.
- [x] `test/ssr/hydrate.spec.tsx` (jsdom): hydrate the HTML from the step above; fail on any
      recoverable error. Decide how the two share HTML (a fixture written by the first, or one
      spec that renders in a Node worker). Set `IS_REACT_ACT_ENVIRONMENT`.
- [x] `test/utils/asChild.matrix.spec.tsx`: for each of the 70 polymorphic components, assert
      `asChild` with an `<a>` child keeps the component's classes and, where it has one, its
      `disabled` handling.
- [x] A `lazyNode()` test helper that builds the `React.lazy` node Flight produces.
- [x] List today's failures (F1, F2, F3) in an explicit allowlist inside each spec, so the suite is
      green and each later phase deletes entries.

No changeset. Exit: the three specs run in `pnpm test` and fail if an allowlisted case is removed
without its fix.

### B1 — Hydration-safe portals (F1)

Done. `test/ssr/portal.spec.tsx` hydrates each portaling component and checks its overlay appears
afterwards; it fails on the code before this phase.

Model: **Opus**. The pattern is known and `MenuSubmenu` already shows it; the work is applying it
to seven call sites without breaking positioning.

- [x] Add `src/utils/portal.tsx`: a `Portal` component that renders nothing until hydration has
      finished (`useSyncExternalStore` with a server snapshot of `false`), then portals to the
      resolved container.
- [x] Replace the seven `createPortal` call sites with it. Keep `useFloatingOverlay`'s
      dialog-aware container resolution and feed its result to `Portal`.
- [x] `Toaster`: portal on both paths or neither; remove the `typeof window` branch in render.
- [x] Remove the F1 entries from the B0 allowlist.

Changeset: patch. Exit: hydration sweep passes for Combobox, Autocomplete, FormField and Popover.

### B2 — `asChild` keeps the component's semantics (F2)

Done. The design differs from the boxes below in one way: the child's type doesn't travel as an
internal prop. A prop would reach the DOM wherever a render function spreads `rest` onto something
other than `Component`, and every one of the 70 render functions would have to strip it. Instead
`createPolymorphicComponent` passes a `Slot` that carries the child's kind and tag
(`src/utils/slot.tsx`), and a render function asks `resolveElementKind(Component)` or
`resolveElementTag(Component)` (`src/utils/elementKind.ts`), which answer for a tag and for a
`Slot` alike.

Found while doing it, and fixed here:

- A router link is a component element, not an `<a>`, so the fix as planned would have missed the
  case consumers hit. A component element with `href` or `to` counts as an anchor. The matrix runs
  every component with a plain `<a>` and with a router link.
- `Stepper` has the same wrapper-tag defect as `List`.
- `<List asChild><ul>` and `<Stepper asChild><ol>` rendered `<div>` items, because the root's tag
  was compared with `Component`.
- A disabled link still ran the child's own `onClick` through the handler chain. `Slot` leaves it
  out when the component marks the element `aria-disabled`.

Left as it was: `MenuToggle` compares `Component` with `Button`, a component and not a tag, to pick
react-aria's `elementType`. The matrix passes for it. `<MenuToggle component="button">` and
`<MenuToggle asChild><button>` get a redundant `role="button"`; B6 touches this file.

Model: **Fable**. It changes the shared polymorphic wrapper and its types, which 70 components
depend on, and each family's semantics have to survive.

- [x] In `createPolymorphicComponent`, pass the slotted child's `type` to the render function
      (an internal prop, stripped before it reaches the DOM). Done as a `Slot` that carries it;
      see above.
- [x] Add `resolveElementKind(component, slottedType)` returning `button`, `anchor`, `input`,
      `host` or `component`, and use it everywhere a render function now compares `component` to
      a tag name. The matrix spec fails on a new tag comparison in `src/components`.
- [x] Fix, in this order: `Button`, `Link`, `NavLink`, `MenuItem`, `Chip`, `PaginationItem`
      (disabled handling); `CloseButton` (classes and label); `List` (wrapper tag when an item uses
      `asChild`). Also `Avatar`, `CardLink` and `ListItem`, which B0 found, and `Stepper`.
- [x] `Placeholder`: either support `asChild` on the `src` path or remove it from the type and
      warn. Supported: the child is the image and carries its own `src`, which is how a framework's
      `Image` is used from a Server Component.
- [x] Update the `asChild` section of the TypeScript docs page with what each family does.

Changeset: patch. Exit: asChild matrix passes with an empty allowlist.

### B3 — Lazy children and Server Component composition (F3, #37)

Done. Reproduced in `smoke-tests/nextjs-app-router` (Next.js 16.3.6, React 19.3.0) before any
change, which corrected F3 in three ways:

- **A second defect, not in F3, and the worse one.** An element whose type is a client component
  carries a lazy wrapper as its `type`, so `child.type === ListItem` is false for children written
  in a Server Component. In a production build, on every request, with no error: `Tabs` rendered
  an empty tab list, `List` and `Stepper` rendered `<ul><a>`, `Combobox` and `Autocomplete` listed
  no options.
- **The lazy node of #37 shows under `next dev` only**, in the browser, when the child holds a
  client component passed by reference whose module is still loading. There it reproduced as
  filed: `asChild` fell back to `<button>` and failed hydration, and `Tooltip` threw and blanked
  the page. `next start` never produced one, with a slow module or on a client-side navigation.
- **`Table` is not a defect.** It fails `next build` from a Server Component, which #20 settled:
  `StaticTable` is what a Server Component renders. The box below that lists `Table` was written
  without reading #20. The smoke app has a `StaticTable` route instead, and the docs say so.

`src/utils/lazyElement.ts` has `resolveLazy`, which covers both nodes and types, and
`isElementOfType`. `DataGrid` with static children was checked too and works.

Model: **Fable**. It depends on how Flight and Suspense behave, and the probe used a hand-built
lazy node, so the first job is reproducing it in a real app.

- [x] Reproduce #37 and the `Tooltip` crash in `smoke-tests/nextjs-app-router` before changing
      anything.
- [x] Add `resolveLazyElement(node)`: return the element for a resolved lazy node, rethrow the
      thenable for a pending one so Suspense handles it. Named `resolveLazy`.
- [x] Apply it in `getSlotChild` (closes #37), `asTriggerElement`, `Tabs`,
      `comboboxCollection`, `DataGridPinBehavior` and `iconSlot`. Also `List`, `Stepper` and
      `resolveKindFromProps`.
- [x] Add routes to the smoke app that compose `Tabs`, `List`, `Tooltip`, `Combobox` and `Table`
      directly in a Server Component, each with a client component in the subtree. Ten routes
      under `app/rsc/`; `StaticTable` in place of `Table`.
- [x] Add a Playwright check against `next start` that fails on any console error. It runs
      against `next dev` as well, where #37 shows, and asserts markup, because the production
      defects logged nothing. `pnpm smoke:test`; CI runs it in `smoke-test-nextjs`.
- [x] Document in the SSR docs page which compound components can be composed from a Server
      Component.

Changeset: patch. Exit: lazy probes render the same HTML as their plain equivalents.

### B4 — Remove `react-transition-group` (F8, #40)

Done. F8 was checked first and is stale: with `react-transition-group` still in place, all six
components rendered and worked under `next dev` with Turbopack on Next.js 16.3.6, from routes added
to the smoke app for that check. The removal went ahead for what is left of its case: one
dependency less, durations that follow the CSS, and #40.

Where the work differs from the boxes below:

- **No duration lives in JavaScript.** `useTransitionState` ends a phase on the element's
  `transitionend`, or after its computed transition duration when that event never comes. That is
  `executeAfterTransition`, which `Modal`, `Drawer` and `Menu` already used, and what chassis-css's
  own plugins do. Reduced motion needs no code of its own: chassis-css sets `transition: none`
  under `prefers-reduced-motion`, and a phase then ends after 50 ms.
- **`Tooltip`, `Popover` and `TabPanel` get `show` as soon as the hidden styles are computed.**
  They used to get it one timer later, which for `TabPanel` was 150 ms spent at full
  transparency before the fade began. The classes and their order are the same.
- **#40 is fixed by reporting the close on unmount**, the first of the two fixes the issue
  suggests. The close is owed from the `close()` call, not from the start of the exit, because
  the unmount can land in the same commit.
- **`Collapse` follows chassis-css's collapse plugin**: it pins the measured size inline before
  it lets go of it, with a reflow between the two. It also merges a `style` passed to it, which
  used to replace the size and stop the transition.
- **No baseline moved.** The Linux baselines of the toast/notification, menu/popover/tooltip and
  accordion/collapse families were run in the CI image and are unchanged. On macOS three
  baselines fail, none from this phase: `Notification — With Actions` (its story text changed on
  2026-09-15), `DataGrid — Variable Row Height` and `Modal — Sizes`. They are not regenerated
  here.

Measured in Chromium on the docs site, frame by frame, with and without reduced motion: each of
the six goes through its classes in order, the size or opacity animates between them, and
`Popover` returns focus to its trigger.

Model: **Fable**. Transition timing, focus return and unmount ordering are easy to get subtly
wrong, and visual baselines will move.

- [x] Write `useTransitionState` (enter/exit phases, `unmountOnExit`, reduced-motion aware),
      building on `useDismissibleTransition`. The other way round: `useDismissibleTransition` is
      built on it.
- [x] Migrate `Collapse`, `TabPanel`, `Toast`, `Notification`, `Tooltip`, `Popover`. Keep the class
      names and their order of application: `fade`, `show`, `showing` and `collapsing` are
      chassis-css's, and its transitions are written against them. While in
      `useDismissibleTransition`, fix #40.
- [x] Remove the dependency and `@types/react-transition-group`.
- [x] Add the six components to the smoke app and re-enable them under `next dev`. `Tooltip`,
      `Popover` and `Tabs` had routes from B3; `Toast`, `Notification` and `Collapse` are new.
- [x] Regenerate the Linux visual baselines for the toast/notification and
      menu/popover/tooltip families only. Run, and nothing changed.

Changeset: patch. Exit: no import of the package remains; visual regression passes.

### B5 — One rule for `href` (F4)

Done. The rule is in `CONVENTIONS.md`, and in `linkElement` and `hrefProps`
(`src/utils/elementKind.ts`), which every component that takes `href` calls. Reading the code
before changing it found more than F4 lists:

- **`StepperItem` was broken like `ListItem`**, not one of the nine that work: `<li href>`.
- **`href` on a non-link**: `Button`, `Chip`, `Avatar`, `NavbarBrand` and `Link` wrote it onto any
  `component` (`component="div" href` rendered `<div href>`). It is now dropped with a
  development warning.
- **The other way round**: `PaginationItem` and `CloseButton` dropped `href` for a router link
  passed as `component`, so `<PaginationItem component={NextLink} href="/p/2">` had no target.
- **Parents didn't see an item's `href`.** `List` and `Stepper` choose a `<div>` root around a
  linked item through `resolveKindFromProps`, which now counts `href`. Their clone step also forced
  `component="div"` onto any item without a `component`, which would have undone the fix.
- **`NavItem` without `href`** spread everything onto its `<li>`, `component` and `asChild`
  included. It now renders its `NavLink` for `href`, `component` or `asChild`, and otherwise a bare
  `<li>` without the link's props.
- **`MenuToggle`** told react-aria its `Button` was a `<button>` even when `href` made it an `<a>`,
  and passed `href` to any `component`. `Avatar` wrote `disabled=""` onto its `<span>`.

The server-rendered markup of every story was compared before and after: the only change is
`role="navigation"` leaving `Nav`'s `<ul>`. No visual baseline moved.

Follow-up, decided by the maintainer: a router link passed as `component` with `href` or `to`
counted as an opaque component, while the same link as the `asChild` element counted as an anchor
(B2's `resolveSlottedKind`). Compared with `component="a"`, it lost `list-action` on `ListItem` and
all its classes on `CloseButton`, and when disabled, in 10 of 12 components, it stayed focusable,
had no `aria-disabled` (except `Chip`, `ListItem`), and its click navigated. `Button`, `Avatar` and
`CloseButton` wrote an invalid `disabled` attribute onto the `<a>`. `resolveLinkKind` now answers for
both. A component reference without a link target is still trusted with `disabled` itself.

Model: **Opus**. Nine components already implement the rule; this extracts and extends it.

- [x] Check the markup chassis-css documents for list items and menu items: which elements carry
      `.list-item` and `.menu-item`, and whether `<button class="menu-item">` is styled. The rule
      below follows that answer. Both `<a>` and `<button type="button">` for each; the menu docs
      say so in as many words.
- [x] Write the rule in `CONVENTIONS.md`: a component that accepts `href` renders `<a>` when it is
      set, unless `component` or `asChild` says otherwise.
- [x] Apply to `ListItem` (confirmed broken). Then check the other components that declare an
      `href` prop and weren't probed: `CloseButton`, `MenuToggle`, `AvatarStack`, `Nav`.
      `CloseButton` and `MenuToggle` fixed, `AvatarStack` follows through `Avatar`. `CardLink`,
      found from the generated prop tables, follows through `Link`.
- [x] `Nav` (F10): no `role` on the `<ul>`, and a `NavItem` without `href` passes no `active` or
      `disabled` attribute to its `<li>`. Delete the matching vnu filter. Also the `navigation`
      exclusion of html-validate's `prefer-native-element`, which was there for the same role.
- [x] `MenuItem` without `href`: render `<button type="button">`, if chassis-css styles it.
- [x] Extract the rule into one helper shared with the nine components that already do it.
- [x] Tests: `test/utils/href.matrix.spec.tsx` covers every component whose generated prop table
      lists `href`, and `test/ssr/render.spec.tsx` fails any story with `href` on a non-link. Two
      stories use `href` alone (`List` `LinksByHref`, `Stepper` `Linked`); without the fix the
      sweep fails on both.
- [x] **(You)** A router link as `component` with `href` or `to` is a link, as it is under
      `asChild`: decided yes. `resolveLinkKind` (`src/utils/elementKind.ts`). The `asChild` matrix
      also renders every polymorphic component with `component={router link}` and `href`, and
      compares it with `component="a"`; on the code before this, 12 cases fail.

Changeset: minor (rendered elements change). Exit: no component renders `href` on a non-anchor.

### B6 — Overlay and state API (F6, #38, #39)

Done. The rule is in `CONVENTIONS.md` ("Open state"), and `test/utils/visibleState.spec.tsx` runs
the same cases against every component that follows it. Reading the code before changing it
corrected F6:

- **Three models, not one.** `Modal` and `Drawer` were already controlled by `visible`: a close
  request only fired `onClose`. `Collapse` too. `Popover`, `Tooltip` and `Menu` copied `visible`
  into a react-stately trigger state in an effect; `Toast` and `Notification` copied it into their
  own state. Only those five changed behaviour.
- **The consumer pattern that breaks.** The app that reported #38 and #39 controls `Popover` and
  `Menu` with `visible={open}` plus `onShow`/`onHide` setting `open` (four call sites), and the
  docs recommended it. Under a controlled `visible` the component never shows, so `onShow` never fires.
  The pattern is now `onVisibleChange={setOpen}`. The smoke app's `Toast` route and the docs'
  `useToast` example broke the same way and were moved.
- **`DatePicker` and `DateRangePicker` already had the triplet**, under react-aria's names. They
  take the `visible` names now; `isOpen`, `defaultOpen` and `onOpenChange` are deprecated.

Decided by the maintainer on 2026-09-30: `visible` is strictly controlled in this release, not
after a deprecation cycle, and `Collapse` keeps `visible` only, since it cannot change its own
state. A request that is dropped because `visible` is set with no `onVisibleChange` warns once in
development; `Modal` and `Drawer` don't warn, because `visible` with `onClose` is complete there.

Differs from the box below in one place: `Popover`, `Tooltip`, `Menu` and the date pickers don't
go through `useControllableState`. Their react-stately states are controlled by `isOpen` already,
so `useOpenStateProps` maps the three props onto them. Its `onOpenChange` keeps one identity: a new
one per render rebuilt the state's `close`, which re-subscribed `Popover`'s outside-click listener
on every render and lost clicks.

A second read of the diff, by a reviewer that had not written it, found what a controlled state
changes around it, and each is fixed and tested: a `Tooltip` held open by `visible` swallowed
every Escape on the page (react-aria stops it at the document while a tooltip is open); a `Menu`
whose close request was declined still moved focus to its toggle; and a tooltip shown by
`visible` or `defaultVisible` was not counted by react-stately's one-tooltip-at-a-time registry.
One change stays and is in the changeset: `Tooltip` no longer fires `onShow` for a tooltip shown
at mount, as `Popover` and `Menu` never did.

No visual baseline moved. `Accordion` keeps `open`, the native `<details>` attribute.

Model: **Fable**. Public API design with a deprecation path; a wrong choice costs a breaking
release later.

- [x] **(You)** Confirm the convention. Recommendation: keep `visible`, add `defaultVisible` and
      `onVisibleChange`, make `visible` strictly controlled. Record it in `CONVENTIONS.md`.
- [x] Apply to `Popover`, `Tooltip`, `Menu`, `Modal`, `Drawer`, `Collapse`, `Toast`,
      `Notification` through `useControllableState`. Keep `onShow`/`onHide`. `Collapse` left as it
      is, by decision.
- [x] `DatePicker`/`DateRangePicker`: accept `visible` alongside `isOpen`; deprecate `isOpen` per
      `VERSIONING.md` (TSDoc `@deprecated` plus `devWarning`).
- [x] `Popover`, `Tooltip`: accept `className`, `style`, `id` and `data-*` for the panel, and
      forward a ref to it.
- [x] Fix #38 and #39 here, since both are type-surface fixes in the same families.

Changeset: minor. Exit: `api-report.md` diff reviewed; type tests added to `types.test-d.tsx`.

### B7 — Correct first paint on the server (F5)

Model: **Opus**. Five independent fixes, each local to one component.

- [ ] `Tabs`: select the first enabled tab during render when no key is given, so the server
      renders its panel.
- [ ] `Toast`, `Notification`: render `show` on the server when mounted visible with no enter
      animation pending.
- [ ] `Carousel`: render indicators from the child count on the server.
- [ ] `Menu`: don't render an open list until it has a position.
- [ ] `Calendar`, `RangeCalendar`: apply the "today" marker after hydration, or accept a
      `timeZone` prop; document the choice in the SSR page.
- [ ] The rest of F10. Fields: render their own `aria-describedby` instead of react-aria's slot
      ids, then turn `no-missing-references` back on. `Table`, `DataGrid`, `ChipInput`: no empty
      `aria-describedby`, no negative size, no `aria-multiselectable` on a `group`. `Menu`: drop
      `aria-hidden` from the closed list, then turn `hidden-focusable` back on. `OtpInput`: decide
      the `autocomplete` of masked boxes, then turn `autocomplete-password` back on. Delete each
      exception with its fix.

Changeset: patch. Exit: a new assertion per component in `test/ssr/render.spec.tsx`.

### B8 — Refs and shared helpers (F7)

Model: **Sonnet** for the first two boxes (the pattern exists in 61 files). **Opus** for the third.

- [ ] Forward refs from `Autocomplete`, `PasswordStrength`, `FormField`, `SkeletonLoader`.
- [ ] Merge `getElementRef` and `getTriggerRef` into one helper.
- [ ] Rebuild the `Tooltip`/`Popover` trigger on `Slot`.

Changeset: minor (new `ref` support). Exit: a ref test per component.

### B9 — Public primitives and new components (F9)

Model: **You**, then per item. A new component follows the A6 scaffold; **Opus** for one built on
react-aria hooks, **Fable** for one with a new interaction model (tree, context menu).

- [ ] **(You)** Decide whether to export `Slot`, `Portal` and a `VisuallyHidden` component.
- [ ] **(You)** Decide on `Alert`, `NavOverflow` and `Scrollspy`, which chassis-css already ships.
      For `Alert`, first settle with chassis-css whether `.alert` is a dialog or a banner.
- [ ] **(You)** Decide on the components chassis-css doesn't style yet. Each one starts as a
      chassis-css task, not here.
- [ ] Each accepted component gets its own plan entry.

Changeset: per decision.
