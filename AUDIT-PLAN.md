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
| B10   | Public `Portal`, `useHydrated`, `VisuallyHidden`           | Sonnet             | minor        |
| B11   | `Alert`, the alert dialog                                  | Opus               | minor        |
| B12   | `NavOverflow`                                              | Fable              | minor        |
| B13   | `Scrollspy`                                                | Opus               | minor        |
| B14   | `Divider`, with its styles                                 | Sonnet             | minor        |
| B15   | `NumberField`, with its styles                             | Opus               | minor        |
| B16   | `TimeField`, with its styles                               | Opus               | minor        |
| B17   | `SearchField`, with its styles                             | Opus               | minor        |
| B18   | `ContextMenu`                                              | Fable              | minor        |
| B19   | `Tree`, with its styles                                    | Fable              | minor        |
| B20   | A time in `DatePicker`                                     | Opus               | minor        |

### Recommended order

1. **A1, A2** — before the next release. Nothing else should publish until `main` is gated.
2. **B0, B1, B2, B3** — the defects consumers hit today.
3. **A3, A4** — ship with the B1–B3 release so the manifest changes go out once.
4. **A8** — makes the docs build reproducible; do it before the next production deploy of the site.
5. **B4, B5** — then **A7**, which needs B4 done for the six components to run under `next dev`.
6. **B6, B7, B8** — API work, one minor release.
7. **A5, A6** — any time; they don't block or depend on anything above.
8. **B9** — last; it is decisions.
9. **A6** before **B10–B19**: the new components follow its scaffold. Then B10 (the new
   components use `VisuallyHidden`), then the rest in any order.

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

Extended in B7: a `transition="fade"` `Carousel` rendered no active slide on the server, so it was
blank until hydration, and `Tabs` had no tab stop there.

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

Decided in B9 (2026-09-30), see there. `.alert` is a dialog: chassis-css's own docs page
(`components/alert.mdx`) documents `<dialog class="alert dialog" role="alertdialog">`, and banners
are `.notification`. Only the header comment of `_alert.scss` is stale.

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

Fixed in B7, with every exception above deleted. The slot ids were not limited to fields: the date
pickers' segments and calendar button, the table selection checkboxes and `ChipInput`'s chip rows
had them too.

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

- [x] Remove `syncReadme()` from `build/sync-version-refs.js` and the sentence about the
      download-archive link from `VERSIONING.md`.
- [x] Root `tsconfig.json`: remove `outDir`, `declaration`, `sourceMap`; try removing
      `ignoreDeprecations`. Verify with `pnpm react:check:types`, `pnpm react:generate` and
      `pnpm site:check`. All four went, and `packages/react/tsconfig.json`'s `outDir` and
      `declarationDir` with them (the latter errors without `declaration`); `dist/` came out
      byte-identical. The site's own `ignoreDeprecations` stays: it covers its `baseUrl`.
- [x] Do #41. The lockfile already resolved `image-size@2.0.4`; only the ignores went. The prod
      audit then failed on `brace-expansion@1.1.14` (six advisories, through the site's
      `html-validate`), overridden to `^1.1.21`.
- [x] Move "this used to…" narrative from both `AGENTS.md` files and the `ci.yml` comments into
      `ref/DECISIONS.md`: a table of ID, decision, outcome and date, like the decisions table of
      chassis-website's roadmap. Leave the rule and the decision's ID behind. IDs are `RD1`–`RD17`,
      so they can't be read as the roadmap's `D` numbers. Stale claims found on the way were
      corrected: component `__snapshots__/` folders, "strict-ish" TypeScript, the Linux baseline
      command in `ci.yml`, tests living under `src/`.
- [ ] **(You)** Disable the wiki. Delete the `backup/develop-pre-reset-2026-09-22` tag from the
      remote when it's no longer needed.

Exit: `packages/react/AGENTS.md` states rules only; every moved paragraph has a row in the table.

### A6 — Component scaffold, CONTRIBUTING, issue forms, links (P9)

Model: **Opus** for the scaffold, which has to reproduce ten conventions exactly. **Sonnet** for
the rest.

- [x] Add `pnpm new:component <kebab-name>`: creates the folder, the barrel with `'use client'` and
      the focus-ring import, both `src/index.ts` entries, a spec with a jest-axe assertion, a
      story, a docs page, and the sidebar entry. It prints the commands still to run
      (`react:generate`, `check:api:update`, `changeset`). `build/new-component.ts`, with
      `--group` for the sidebar group (default Data Display). It writes a polymorphic component.
      The asChild matrix's exact count of polymorphic components became a floor, or every new
      one failed it; `react:build` adds the subpath to `package.json`'s `exports`.
- [x] `CONTRIBUTING.md`: add a "Your first pull request" section of under 20 lines that names
      `develop` as the branch to target; fix the `#running-documentation-locally` anchor.
- [x] Replace the Markdown issue templates with forms, copied from chassis-website and adjusted:
      `bug.yml`, `feature.yml`, `docs.yml`, and a `config.yml` with blank issues off. Fix the
      `chassis-ui/chassis` link in it; the repository is `chassis-ui/css`.
- [x] Add the labels the forms set: `needs-triage`, `needs-info`, `confirmed`. Colours and
      descriptions as chassis-website's.
- [x] Correct the root README's visual-regression sentence. Also its claim that no component
      ships its own CSS.
- [x] Add a pre-commit hook with simple-git-hooks and lint-staged, as chassis-website has: eslint
      and Prettier on staged files only. Scoped to `packages/`, which is what CI lints; no
      Prettier on styles.
- [x] **(You)** Discussions: enable it here, or point the issue chooser at chassis-website's. Only
      chassis-website has it on today. Decided: here. It was already on; the chooser links to it.
- [x] **(You)** Set the homepage to `https://chassis-ui.com/react/`; add topics; turn on "delete
      branch on merge". Applied with `gh repo edit` at the maintainer's request.

Exit: `pnpm new:component demo-thing` followed by `pnpm react:check:types && pnpm test` passes,
then the generated files are removed. Done; the generated docs page also passed `site:check` and
rendered in the dev server with its sidebar entry.

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

- [x] `Tabs`: select the first enabled tab during render when no key is given, so the server
      renders its panel. The selected tab is also the tab stop on the server now; react-aria made
      it one in an effect.
- [x] `Toast`, `Notification`: render `show` on the server when mounted visible with no enter
      animation pending. Mounted visible while not hydrated, they start settled
      (`useDismissibleTransition`, `appear: useHydrated()`); `onShow` fires once on mount for them.
- [x] `Carousel`: render indicators from the child count on the server. Also found by the
      hydrate-and-diff sweep below: the active slide was marked only by an effect, so a
      `transition="fade"` carousel was blank until hydration. `CarouselInner` now gives each
      `CarouselItem` its index (`slides.tsx`), which renders `active`, `role="group"`,
      `aria-roledescription` and `aria-label`; the DOM effect still covers slides inside your own
      components. The end controls start in the right state.
- [x] `Menu`: don't render an open list until it has a position (`show` after hydration).
- [x] `Calendar`, `RangeCalendar`: apply the "today" marker after hydration, or accept a
      `timeZone` prop; document the choice in the SSR page. After hydration, documented in
      `ssr.mdx` with what still comes from the server's zone (react-aria's "Today" label, the
      month a calendar with no value opens on).
- [x] The rest of F10. Fields: render their own `aria-describedby` instead of react-aria's slot
      ids, then turn `no-missing-references` back on. `Table`, `DataGrid`, `ChipInput`: no empty
      `aria-describedby`, no negative size, no `aria-multiselectable` on a `group`. `Menu`: drop
      `aria-hidden` from the closed list, then turn `hidden-focusable` back on. `OtpInput`: decide
      the `autocomplete` of masked boxes, then turn `autocomplete-password` back on. Delete each
      exception with its fix. Decided: `one-time-code` on every masked box. The date pickers keep
      react-aria's other descriptions and drop only the slot ids (`withoutSlotIds`); their
      segments' `aria-labelledby` also named an id react-aria merges away only in the browser.
      `Popover`/`Tooltip` triggers pointed at their portaled panel on the server too. All three
      html-validate rules are back on and the three vnu filters deleted; both validators pass on
      the built site.

How it was checked, beyond the tests: every story server-rendered, hydrated, and its markup
diffed after the page settled. What still changes after hydration is on purpose (`Menu`,
`Popover`, `Tooltip`) or out of this phase: `Modal`/`Drawer` open on first render get `open` only
from `showModal()`, and react-aria-components' generated column keys differ between the server and
the browser (`DataGrid` columns without an `id`, one `data-key` attribute), a mismatch React
reports only as a development warning.

An independent review of the diff found six defects before the commit, each now with a test:
`onShow` and `Tabs`' mount-time `onSelectionChange` had stopped firing, slides remounted when a
sibling came and went, a nested carousel took its enclosing slide's position, a `CarouselInner`
inside your own component labelled slides "N of 0", and a disabled selected tab became the tab
stop.

Changeset: patch. Exit: a new assertion per component in `test/ssr/render.spec.tsx`. Done: the
cases are in `test/ssr/firstPaint.tsx`, asserted in `render.spec.tsx` and hydrated in
`hydrate.spec.tsx`; the story sweep also fails on a reference to a missing id.

### B8 — Refs and shared helpers (F7)

Model: **Sonnet** for the first two boxes (the pattern exists in 61 files). **Opus** for the third.

- [x] Forward refs from `Autocomplete`, `PasswordStrength`, `FormField`, `SkeletonLoader`. Each
      goes to the element the other attributes go to (`Autocomplete`: the `.combobox` toggle, as
      `Combobox`). `FormField`'s is `null` while it renders its children bare; `SkeletonLoader`'s
      is the first generated skeleton while loading, `null` after. `PasswordStrength` already
      reached its meter at runtime through `...rest` (React 19 passes `ref` as a prop), but its
      type had no `ref`.
- [x] Merge `getElementRef` and `getTriggerRef` into one helper. `getElementRef` in `slot.tsx`;
      `triggerElement.ts` is deleted.
- [x] Rebuild the `Tooltip`/`Popover` trigger on `Slot`: `getTriggerChild` and `renderSlotted`
      (`slot.tsx`). A trigger that isn't one element renders as it is, with a development warning,
      instead of throwing. The trigger's handlers now run after the component's, as under
      `asChild`. `Slot` now joins `aria-describedby` instead of letting the child's win: before,
      a `Tooltip` trigger's own description was replaced by the tooltip's while it showed.

An independent review of the diff found three regressions before the commit, each now with a
test: a trigger whose `href` came or went remounted (`getSlot` picks a `Slot` by kind; triggers
now share one), `Slot` wrote `aria-describedby` as `undefined` and so wiped a description the
child's own component writes, and a trigger's own `aria-expanded`/`aria-controls` beat the
popover's state (now passed as `owned`, which wins). The first one still applies under `asChild`,
where the kind is meant to change what the component renders: `<Button asChild>` around a router
link whose `href` comes and goes remounts the link. Left open.

Found beyond F7: the six `DataGrid*` parts render react-aria-components elements but take no ref.
They have closed prop lists over the collection builder and virtualized rows, so they stay open,
listed in the new guard's allowlist. The other components without a ref render no element
(collection parts, providers).

Changeset: minor (new `ref` support). Exit: a ref test per component. Done, plus
`test/utils/refForwarding.spec.tsx`, which fails on an exported component that isn't a
`forwardRef` unless its allowlist names it. Rule in CONVENTIONS.md, "Refs".

### B9 — Public primitives and new components (F9)

Model: **You**, then per item. A new component follows the A6 scaffold; **Opus** for one built on
react-aria hooks, **Fable** for one with a new interaction model (tree, context menu).

- [x] **(You)** Decide whether to export `Slot`, `Portal` and a `VisuallyHidden` component.
      Decided: export `Portal` (with `useHydrated`) and a new `VisuallyHidden`; `Slot` stays
      internal, since consumers reach it through `asChild` and its shape (context, one `Slot` per
      element kind) should stay free to change. B10.
- [x] **(You)** Decide on `Alert`, `NavOverflow` and `Scrollspy`, which chassis-css already ships.
      For `Alert`, first settle with chassis-css whether `.alert` is a dialog or a banner.
      Settled by chassis-css's docs: a dialog (F9). Decided: all three. B11, B12, B13. The
      stale header comment of `_alert.scss` is the maintainer's to fix (B11).
- [x] **(You)** Decide on the components chassis-css doesn't style yet. Each one starts as a
      chassis-css task, not here. Decided otherwise: all six (number, time and search fields,
      context menu, tree, divider), **with their styles written here**, as component-scoped Sass
      the way the calendar, table and data grid have theirs (`THEMING.md`, "Component-scoped
      CSS"). B14–B19.
- [x] Each accepted component gets its own plan entry. B10–B19.

Changeset: none; the entries carry their own.

### Rules for B11–B19

Every new component phase does all of these, besides its own boxes:

- The A6 scaffold: folder, barrel with `'use client'` and the focus-ring import, both entries in
  `src/index.ts`, spec, stories, docs page with examples, `packages/site/data/sidebar.yml`.
- Markup from chassis-css where it has any (its docs page and partial). Where it has none, class
  names in chassis-css's vocabulary (`.<component>`, `.<component>-<part>`, context and size
  modifiers as its siblings take them), so the styles can move to chassis-css later unchanged.
- Styles written here build on the public `--cx-*` tokens and read an existing component's
  custom properties where one fits (as `DataGrid.scss` reads `--table-*`), never a new token
  namespace. They go in `dist/style.css`; list the file in `THEMING.md`'s component-scoped CSS
  section and in `AGENTS.md`'s build paragraph.
- The library's rules: a ref (`test/utils/refForwarding.spec.tsx`), `visible`/`defaultVisible`/
  `onVisibleChange` for anything that opens, `Portal` for anything portaled, `IconSlot` for its
  own icons, server HTML that equals the settled state (the story sweeps pick new stories up),
  and `asChild` if it is polymorphic.
- A visual regression spec for a component with styles of its own, with Linux baselines.
- An axe assertion in a realistic state, `pnpm react:generate`, `api-report.md`, a changeset
  (minor), and an independent review of the diff before the commit.

### B10 — Public `Portal`, `useHydrated` and `VisuallyHidden` (F9)

Model: **Sonnet**. The code exists except `VisuallyHidden`.

- [x] Export `Portal` and `useHydrated` (`src/utils/portal.tsx`) from `src/index.ts`, with a docs
      page (SSR use: render in a portal without a hydration mismatch). Decide the subpath: its own
      barrel, `@chassis-ui/react/portal`. Moved to `src/components/portal/Portal.tsx`, since the
      prop-table generator reads `src/components`. Docs: `Portal` and `Visually Hidden` under a
      new Utilities group, `useHydrated` under Hooks. `Portal`'s `fallback = null` default went:
      react-docgen read it as a non-string default, which the site's schema rejects.
- [x] `VisuallyHidden`: polymorphic (`span` by default, `asChild`), renders `.visually-hidden`,
      with a `focusable` prop for `.visually-hidden-focusable` (a skip link). Check both classes
      in chassis-css's helpers first. Both exist (`helpers/visually-hidden`). The first
      component made with `pnpm new:component`.
- [x] Replace the nine hand-written `<span className="visually-hidden">` in `src/components`
      with it. Eight: the ninth was a comment. Every story's server HTML is the same
      before and after.

Changeset: minor. Exit: both exported, a spec each, `refForwarding` passes. Done; `Portal` is
on that spec's allowlist, since it renders no element of its own, and the SSR portal spec now
hydrates `Portal` and `useHydrated` themselves.

### B11 — `Alert`, the alert dialog (F9)

Model: **Opus**. Built on the dialog machinery `Modal` already uses.

- [x] Markup of chassis-css's `components/alert.mdx`: a `<dialog>` with the classes `alert dialog`
      and `role="alertdialog"`, holding `.alert-icon`, `.alert-body`, `.alert-title`,
      `.alert-footer` and an optional `.close-button`. Parts as flat exports (`AlertTitle`,
      `AlertBody`, `AlertFooter`), `aria-labelledby`/`aria-describedby` wired to title and body. Also `AlertIcon`,
      `AlertCode` and `AlertText` (the message `<p>`). The description is the rendered
      `AlertCode` and `AlertText`, which register from a layout effect, so the server's HTML
      names none.
- [x] Open state as `Modal`'s. A static backdrop and no Escape by default, as the docs advise for
      alert dialogs; props to allow both. Focus goes to the least destructive action. `AlertCancel` closes the alert and
      carries `data-autofocus`. Found on the way: React writes no `autofocus` attribute in a
      client render, so `Modal`'s and `Drawer`'s documented `autofocus` never worked;
      `useDialogElement` now also looks for `data-autofocus`.
- [x] The error-code and multi-step layouts of the docs page as examples. Plus the close
      button and the footer layout; every example opens from a button.
- [ ] **(You)** Fix the header comment of `_alert.scss` in chassis-css, which still describes
      inline status messages. The maintainer does this; B11 doesn't wait for it.

Changeset: minor.

An independent review of the diff found four defects before the commit, each now with a test:
under `asChild` or with a caller's `id`, the title, code and text were registered under ids that
never reached the DOM (they now register the element and read its id); descriptions were listed
in mount order, not document order; a closed `Alert` nested in a `Modal` took the modal's initial
focus (`useDialogElement` now only takes its own dialog's `data-autofocus`, and skips
`data-autofocus="false"`); and after a chain of alerts focus was lost (a closing dialog now
restores focus only if it still holds it, and follows the chain of closed dialogs back to the
first trigger).

Left open: chassis-css's Dialog plugin swaps one alert for the next without dropping the backdrop
(`swap-in`); here the second opens as the first closes. Going back and forth between two alerts
before closing still loses focus: the chain loops, and gives up.

### B12 — `NavOverflow` (F9)

Model: **Fable**: measuring layout during render and moving items without a flash is a new model
here.

- [x] Read `nav-overflow.js` and `components/nav-overflow.mdx` of chassis-css: options (minimum
      visible items, collapse all, toggle text and icon, kept items), methods, events. Kept by
      name: `threshold`, `collapseBelow`, `moreText`, `moreIcon`, `iconPlacement`,
      `menuPlacement`; `.nav-overflow-keep` is `keepVisible` on `NavItem` and `Tab`; the
      `overflow` event is `onOverflow`. Added: `moreLabel` (the name of an icon-only toggle, which
      the plugin fixes at "More") and `menuContainer`. No `update` method: nothing needs it.
- [x] A component around `Nav` (and `Tabs`' list, and inside a `Navbar`) that measures with a
      `ResizeObserver` and moves the items that don't fit into a `Menu` ("More"). The server
      renders every item visible; decide what the first paint shows and document it in the SSR
      page. Nothing is cloned, as the plugin clones links: a list renders `NavOverflowItems`, an
      item registers its `<li>` and its link the props a `MenuItem` is rendered from
      (`src/utils/navOverflow.tsx`), so `onClick` and a router link given with `asChild` work
      from the menu. The toggle and its `Menu` reach the list through context, and stay out of
      `nav`'s and `tabs`' chunks. `Tabs` now finds its `TabList` one level down, inside the
      element that holds it. First paint, decided here: every item, with the row clipped at the
      wrapper's edge and scrollable until the page has hydrated, rather than running over what is
      beside it as under the plugin. The first render in the browser measures in a layout effect,
      and a resize commits with `flushSync` from the observer, so no frame shows the old layout
      (measured frame by frame in Chromium, Firefox and WebKit on the docs page).
- [x] Keyboard and screen reader order stay the item order; the active item is never hidden.
      Neither is the item that has focus. In a `TabList` the toggle is a `tab` with
      `aria-haspopup`, reached with the arrow keys among the tabs that are shown; a tab chosen
      in the menu is selected, shown and focused; the menu is portaled, since a `tablist` owns
      tabs only.

Changeset: minor. Rule in CONVENTIONS.md, "Measured layout". No visual regression spec: the
styles are chassis-css's.

An independent review of the diff found seven defects before the commit, each now with a test: a
tab list in manual activation could hide the tab holding its Tab stop (that tab is now kept); an
`asChild` element's own `ref` and `id` went to the copy in the menu; handlers a `Tooltip` around a
link adds were replayed on the menu item (it gets `onClick` only); `Tabs` read the children of a
`TabPanel` written before the list, waiting for content that isn't shown, and missed a list under
`<NavOverflow asChild>`; an observer leaked when the wrapper became another element; a caller's
ref that is a new function each render made the list's measure find no wrapper; and focus fell to
the page when a resize hid the focused toggle or removed the focused menu item. From its notes:
the toggle is now the list's only Tab stop while it has focus, so Shift+Tab leaves the list.

Left open: a link chosen in the menu loses focus when the menu closes, as any `Menu` item does.
A `Nav` of bare `NavLink`s (`component="nav"`) doesn't collapse, as under the plugin, which also
needs `.nav-item`s. A vertical `Tabs` isn't supported: the wrapper keeps the list on one line.

Found on the way, in chassis-css (not filed; the maintainer's):

- `collapseBelow` with a breakpoint name reads `--cx-breakpoint-{name}` with `parseFloat`. The
  tokens are in `rem` since 0.5.0 (`48rem`), so the plugin compares the width with 48, not 768.
  The component converts `rem`.
- The plugin reserves the toggle's width before it knows anything overflows, so a list that fits
  exactly loses its last item. The component checks the fit without the toggle first.
- 0.5.2's `.nav-link` has no `gap`, so the toggle's icon touches its text, here as under the
  plugin. The unreleased `_nav.scss` adds one.

Also changed: `MenuToggle` takes `caret={false}` and keeps a `tabIndex` it is given;
`IconProvider`'s `icons` has `more`; the docs' `<Example>` takes `resizable`.

### B13 — `Scrollspy` (F9)

Model: **Opus**.

- [x] Read `scrollspy.js` and `components/scrollspy.mdx` of chassis-css: options (root margin,
      threshold, smooth scroll), nested navigation, list integration, events. Kept: `rootMargin`,
      `smoothScroll` (and instant under reduced motion), parent marking (the link before a nested
      `.nav`/`.list`, a menu's toggle), disabled links left out; `activate` is `onActiveChange`.
      Not kept: `threshold`, since the choice below doesn't depend on it, and `refresh`, since
      sections, a link's `href` and a ref's root element are followed when they change.
- [x] A `useScrollspy(ids, options)` hook on `IntersectionObserver` returning the active id, and a
      component that marks the matching `NavLink`/`ListItem` active with `aria-current`.
      `Scrollspy` renders no element: every `Link` inside it registers its element
      (`src/utils/scrollspy.ts`), so `NavLink`, `NavItem`, `ListItem` and `MenuItem` take part,
      `asChild` included; the target is read from the element's `href`. Decided here: the active
      section is the last whose top passed the line at the bottom of `rootMargin`'s box, or the
      first while its top is still in the box, independent of the scroll direction the plugin
      uses; the observer only triggers a measure of every section, with `scrollend` behind it.
      The mark is `aria-current="true"` (a place in the page); an `active` prop keeps `"page"`;
      parents get `.active` only.
- [x] Nothing active on the server; the first active id after hydration. Document it. In the SSR
      guide and a first-paint case; the smoke app has a route with `next/link` under `asChild`.

Changeset: minor. No visual regression spec: the styles are chassis-css's.

An independent review of the diff found six defects before the commit, each now with a test: a
`root` ref was read once, so a box mounted or replaced later was never observed; a link whose
target changed without `Link`'s own `href` changing (`asChild`, a router link's `to`) stayed on the
old section; the first section could stay active past its start when it was never wholly inside
the box (a section holding the others), which only a threshold crossing reported, so the start now
follows `scroll` events; a malformed `href` threw from an effect; smooth scrolling ignored the
container's `scroll-padding-top`; and a disabled link was marked, which the plugin skips.

Left open: after a smooth-scroll click, focus stays on the link, as under the plugin. A plain
`<a>` isn't marked; it takes part under `asChild`.

### B14 — `Divider`, with its styles (F9)

Model: **Sonnet**.

- [x] `useSeparator` from react-aria; horizontal and vertical, `<hr>` by default, polymorphic.
      Check chassis-css's `hr` reboot and `.vr` helper first; build on them. `<hr class="divider">`
      by default; a `<div role="separator">` when vertical (as react-aria-components' `Separator`)
      or labelled, since an `<hr>` is void. Children are the label (`.divider-label`), which names
      the separator through `aria-labelledby`; `labelPlacement` `start`/`center`/`end`. Under
      `asChild` the child's own children are the label.
- [x] Styles here only for what chassis-css lacks (a labelled divider, spacing variants).
      `Divider.scss` restates the reboot `hr` and `.vr` from the same `$hr-*`/`$vr-*` variables,
      so any element draws the same line (a story compares them in three browsers), and adds the
      label. Custom properties `--cx-divider-*`, named as `.menu`'s and `.breadcrumb`'s own, so a
      divider in a menu takes the menu's color and margin. Decided here: no spacing variants, since
      the margin utilities already set the space (`my-xl`).

Changeset: minor. Visual regression spec `divider.visual.spec.ts`, with Linux baselines.

An independent review of the diff found seven defects before the commit, each now with a test or a
browser check: `dist/style.css` loaded before chassis-css's stylesheet put `components` below
`reboot`, so the reboot's `hr` beat `.divider` (the build now opens the file with chassis-css's
`@layer` order, read from its compiled CSS); the ref was typed for an `<hr>` element for a vertical or
labelled divider, which renders a `<div>`; a divider on an inline element drew nothing; a labelled
vertical divider in a row the label fills showed no line (each line is now at least `1em`); under
`asChild` the component's `aria-labelledby` outranked the child's own `aria-label` (a `Slot` rule
now, for every component); the introduction page didn't list the stylesheet's components; and
children that render nothing (`[]`, `true`) made an empty label.

Also: `scrollend` (B13) added to `.cspell.json`, which failed `pnpm spellcheck` on `develop`.

### B15 — `NumberField`, with its styles (F9)

Model: **Opus**. A form component: read `FORMS.md` first.

- [x] `useNumberField`: a native `<input>` with `.form-input`, increment and decrement buttons
      through `IconSlot`, `Intl` formatting, min, max, step. Field props through
      `renderFormField`. The input is a `.ghost-input` in a `.form-input.number-field` wrapper
      (TextInput's adorn shape, `adornStart`/`adornEnd` too), the buttons in a
      `.number-field-buttons` column: as direct children, a button disabled at `max` would have
      made chassis-css style the whole field disabled (`:has(> :disabled)`). New icon purposes
      `increment`/`decrement`; `incrementIcon`/`decrementIcon`. `name` goes to a hidden input
      holding the number, as in react-aria-components. `stepButtons={false}` leaves the buttons
      out (a bare `input.form-input` then). Decided here: `min`/`max`/`step` as on `RangeInput`,
      `onChange(number)` with `NaN` for empty; no `plainText`.
- [x] Styles for the stepper buttons, built on `.form-input` and `.input-group`'s custom
      properties. The column sits over the field's padding, flush with its border, as chassis-css
      places the file input's button, and reads the field's padding, border, radius, background,
      the file button's hover color and the input group's icon size.

Changeset: minor. Visual regression spec `number-field.visual.spec.ts`, with Linux baselines.

Found on the way: react-aria's `useNumberField` picks `inputMode` by iPhone/Android and drops
`aria-roledescription` on iOS, which the server can't know; a hydrating render doesn't patch an
attribute, so an iPhone would have kept the server's keyboard. Both wait for `useHydrated`
(FORMS.md, gotcha 7); a spec hydrates server HTML on a simulated iPhone.

An independent review of the diff found five defects before the commit, each now with a test or a
browser check: `.number-field`'s `display: flex` tied with `.form-input`'s `display: block`, so with
`style.css` loaded first the buttons collapsed (now `.form-input.number-field`); the mouse wheel
stepped only a field with a wrapper; a form linked by `form=` didn't reset the field (the visible
input takes `form` too); `style` was dropped (it goes to the outermost element); the step icons
were 9px, not 12px, as an `em` was counted twice. Plus docs: the locale is the browser's, when
`onChange` fires, touch focus, and AGENTS.md's visual-regression count.

Found after the commit: the Nu Html Checker failed on the docs page, since react-aria's spin
button props repeat the native `disabled`/`readOnly` as `aria-disabled`/`aria-readonly`; the
input now leaves the copies out.

`style.css`'s gzip ceiling in `.bundlewatch.config.json` went from 2 kB to 3 kB: the styles B14 and
B15 add took it to 2.18 kB, and B16–B19 add more, by the decision to write them here.

Left open, then closed in `45bff89e`: `TextInput`'s family dropped `title`, `tabIndex`, `dir`, `lang`
and `onClick` (react-aria's `filterDOMProps`), and `NumberField` with it, apart from `style`. Eight
components now merge the props their hook doesn't read after its own (`mergeUnhandledProps`,
FORMS.md gotcha 8). The toggle-button examples' `autoComplete="off"` then reached the page and
failed both HTML validators; `b4ac327f` took it out of the examples.

### B16 — `TimeField`, with its styles (F9)

Model: **Opus**. A form component: read `FORMS.md` first.

- [x] `useTimeField` with the segment markup `DateField` already renders for the date pickers;
      reuse its styles (`DatePicker.scss`) rather than copy them. `DateSegment` and its styles
      moved out of `DateField.tsx`/`DatePicker.scss` into `datepicker/DateSegment.tsx` and
      `DateSegment.scss`, which both fields use; the date pickers' screenshots are unchanged. The
      field is a `.form-input.time-field` group (react-aria's `role="group"`, the ref), with a
      `.datepicker-field` of segments and react-aria's hidden input (given `inputRef`, as
      react-aria-components does, so a form reset and `name`/`form` work). Found on the way: a
      time's bidi isolation marks were padded as segments, setting it off from the edge; they
      render without the segment class now.
- [x] Granularity, 12/24 hour from the locale, `minValue`/`maxValue`. Decide whether
      `DatePicker` gains a time part here or in its own entry. `granularity`, `hourCycle`,
      `hideTimeZone`, `placeholderValue`, `shouldForceLeadingZeros`. Decided here: a time outside
      the range shows the field invalid with its `invalidFeedback` (react-aria marks only the
      segments), and `DatePicker`'s time part gets its own entry, B20: it widens `DatePicker`'s
      value type.

Changeset: minor. Visual regression spec `time-field.visual.spec.ts`, with Linux baselines.

An independent review of the diff found four defects before the commit, each now with a test or a
browser check: in a right-to-left locale the time showed reversed (`30 : 21`), because the segments
were flex items, between which react-aria's bidi isolation marks do nothing; `.datepicker-field`
lays them out inline now (a story measures the order in three browsers; `DatePicker`'s screenshots
are unchanged, and an Arabic date still reads day, month, year from the right). `invalid={false}`
turned off the range check (react-stately takes a defined `isInvalid` as the whole state); `valid`
with a time out of range showed both states; and a comment still named `DatePicker.scss`. Also
found: the Nu Html Checker rejected read-only segments, `aria-readonly="true"` with
`contenteditable="false"`; a segment that can't be edited leaves `contenteditable` out.

Found on the way, in the docs: the Calendar, Range Calendar, Datepicker and Date Range Picker pages
said their styles were injected on import, with no stylesheet to add; they are in
`@chassis-ui/react/style.css`, and the pages say so now.

### B17 — `SearchField`, with its styles (F9)

Model: **Opus**. A form component: read `FORMS.md` first.

- [x] `useSearchField`: a native `<input type="search">` with `.form-input`, a clear button
      (`CloseButton` or `IconSlot`), Escape clears, `onSubmit`. The markup is chassis-css's input
      adorn docs': a `.form-input.search-field` around a `.ghost-input`, the search icon as a
      `span.input-adorn` and the clear button as an actionable adorn,
      `button.button.icon-only.input-adorn`, both through `IconSlot` with two new icon purposes,
      `search` (`search-outline`) and `clear` (`xmark-outline`). The clear button renders only
      while there is a value and the field is neither disabled nor read-only, out of the tab order
      (react-aria's), named "Clear search" in the locale's language. Props as the other form
      fields', plus `onSubmit(value)`, `onClear`, `searchIcon` (`false` leaves it out),
      `clearIcon`, `clearAriaLabel`; the ref is the input's, `style` the wrapper's. Decided here:
      no adorns of its own, and `onSubmit` also takes Enter with a modifier and in a read-only
      field, which react-aria's shortcut doesn't, so a set `onSubmit` always keeps the form from
      submitting.
- [x] Styles for the clear button and a search icon, built on `.form-input` and
      `.input-group`. chassis-css's input adorn rules already size and color the icon by the
      field's state; `SearchField.scss` lays the wrapper out without waiting for `:has()`, hides
      WebKit's own cancel button, gives the clear button the field's `--cx-icon-color` (a
      `.button` sets its own) and the close button's idle and hover opacity, and hides it in a
      `<fieldset disabled>`.

Changeset: minor. Visual regression spec `search-field.visual.spec.ts`, with Linux baselines. The
stories embed the four icon symbols they draw, since Storybook has no sprite, and the spec waits
for `Default`'s play function to finish typing before its screenshot.

An independent review of the diff found four defects before the commit, each now with a test or a
browser check: with `onSubmit`, Shift+Enter still submitted the form, and so did Enter in a
read-only field (react-aria 3.52's shortcut matches Enter alone and none when read-only); the clear
button's hover and pressed color depended on stylesheet order (a specificity tie with
`.button:not(.button-check):active`); and a field disabled by its `<fieldset>` kept an inert clear
button. The docs page also says now that an `onKeyDown` stops Escape from reaching a dialog around
the field, as react-aria's handlers do. The review also found the Linux baselines missing, which
were due after it.

Found on the way: the toggle-button examples' `autoComplete="off"` failed both HTML validators once
`45bff89e` let it through (`b4ac327f`).

### B18 — `ContextMenu` (F9)

Model: **Fable**: a menu opened at a pointer position, and by long press and the keyboard, is a
new interaction model.

- [x] Reuse `Menu`'s list, items and `.menu` styles; only the trigger and positioning are new.
      Open on `contextmenu`, long press on touch, and Shift+F10 or the context menu key.
      `ContextMenu` is the region the menu belongs to: a polymorphic element (`div`, `component`,
      `asChild`) whose children hold a `MenuList`. It provides `Menu`'s context itself, so
      `MenuList`, `MenuItem`, `MenuHeader`, `MenuDivider`, `MenuSubmenu` and `items` render,
      portal and navigate as under a `Menu`; nothing in `menu/` changed for it except that
      `MenuList` now drops `aria-labelledby` under an `aria-label` of its own, and writes none
      with no trigger to point at. A right-click (`contextmenu`, so Ctrl+click on macOS too), a
      long press by a finger or pen (500 ms, 10 px of travel, written here rather than with
      react-aria's `useLongPress`, whose `usePress` prevents the default of key and pointer events
      on the region and would break the buttons inside it), and Shift+F10 or the context menu key
      on a focused element in the region. The first item takes focus on open, so the arrow keys
      work at once; Escape and an item return focus to the element that had it; a press outside,
      rather than a click, closes it, as a native menu, so the click after a long press's release
      finds nothing to close. Props: `visible`/`defaultVisible`/`onVisibleChange`, `onShow`/
      `onHide`, `autoClose` as `Menu`'s, `disabled` (the browser's own menu). The region gets no
      `aria-haspopup` or `aria-expanded`, which are invalid on an element with no widget role.
- [x] Position at the pointer through `useOverlayPosition` with a virtual target; `Portal`.
      react-aria 3.52's `getTargetRect` replaces the region's rectangle with a zero-size one at
      the pointer, or the focused element's for the keyboard, and `updatePosition` moves an open
      menu on a second right-click. `bottom-start` (`bottom-end` under RTL), flipped above the
      pointer when there is no room below. `MenuList` portals through the context's `container`:
      `document.body`, or the open `<dialog>` around the region (`useFloatingOverlay`).

Changeset: minor. No styles of its own, so no visual regression spec; the `Default` story's play
function checks the position and focus in the three browsers, by right-click, Shift+F10 and a
finger held down.

An independent review of the diff found six defects before the commit, each now with a test: the
list's events reach the region's handlers through the portal (React bubbles them), so a
right-click, Shift+F10 or a long press on an item moved the menu under the item; Chromium fires the
context menu key's `contextmenu` on key up, which the key down's `preventDefault` didn't stop; the
click iOS emits when a long press's finger lifts landed on the item that had just opened under it;
under `asChild` the child's own `id` won the merge while the list pointed at the generated one;
`disabled` with `visible` asked to close on mount; and a slotted child's `style` replaced the
`-webkit-touch-callout`, which is now set on the element. The region also selects no text while a
finger is down, since iOS starts selecting at about the time a press becomes long.

### B19 — `Tree`, with its styles (F9)

Model: **Fable**.

- [x] react-aria-components' `Tree`: expand and collapse, single and multiple selection,
      keyboard navigation, `aria-level`. Server HTML equals the settled state (expanded keys from
      props). `Tree` wraps its `Tree` (a `treegrid` of `row`s, the rows of an expanded item as
      the siblings after it), `TreeItem` its `TreeItem` and `TreeItemContent`; the chevron reads
      `ButtonContext`'s `chevron` slot (`useContextProps` + `useButton`, so the ref it checks for
      is set) and the checkbox `CheckboxContext`'s `selection` slot as a native
      `input.check-input`, as `DataGridSelectionCell` does. Expansion:
      `expandedKeys`/`defaultExpandedKeys`/`onExpandedChange`; selection: `selectionMode`,
      `selectedKeys`/`defaultSelectedKeys`/`onSelectionChange`, `disabledKeys`,
      `disabledBehavior`, `disallowEmptySelection`, `selectionBehavior`; `onAction` on the tree
      and the item; `renderEmptyState`, `autoFocus`. Server HTML: react-aria's `useGridListItem`
      names the row by itself and a description slot id nothing renders (`useSlotId`, FORMS.md
      gotcha 6), so a `render` prop on the row — honoured by react-aria-components' element
      factory though its `TreeItem` types don't declare it — drops `aria-labelledby`, and the
      checkbox drops the `aria-describedby` react-aria adds. The expanded rows are in the server
      HTML; hydration renders the same.
- [x] Styles here: indentation per level, the expand chevron through `IconSlot`, states read from
      `.list` or `.menu` custom properties where they fit. `Tree.scss`: the row's padding, colors
      and active and disabled states from `--list-*`, the gap, item radius and icon size from
      `--menu-item-gap`/`--menu-item-border-radius`/`--menu-icon-size`, hover from
      `%interactive`'s `--bg-even`; `--tree-indent` is the one property of its own, defaulting to
      the chevron's width plus the gap so a child's label lines up under its parent's. The level
      reaches the stylesheet as an inline `--cx-tree-level` on the row (react-aria-components'
      own `--tree-item-level` can't be read: the build prefixes the stylesheet's custom
      properties). The chevron is `IconSlot`'s new `expand` purpose (`chevron-right-outline`),
      rotated 90° on the button when expanded, or the
      tree's `expandIcon`; the button is mirrored under RTL. Visual spec `tree.visual.spec.ts`.
- [x] Decide static children versus `items` data, as `DataGrid` does. Both: nested `TreeItem`
      elements, or `items` and a render function on the tree and on any item
      (react-aria-components' `Collection`), so one function renders every level by passing
      itself on; a function child with no `items` is a leaf and renders nothing. An item's
      content is its `label` prop (with `icon`), since its children are its child items;
      `textValue` defaults to a string or number label.

Decided here, not yet reacted to: a checkbox per item by default with `selectionMode="multiple"`
and the `'toggle'` behavior only (`checkboxes` turns it on or off); no `href` on an item, since
a row is a `div` with `role="row"` and the library renders every `href` as an `<a>`
(`href.matrix.spec.tsx`) — navigation goes through `onAction`; no `hasChildItems` for children
loading later: react-aria-components 1.21 accepts the prop but doesn't pass it to `useTreeItem`,
so such an item gets no `aria-expanded` and the arrow keys don't expand it — both under the docs
page's Scope. `Tree` takes no `data-*`/rest props. Smoke route `app/rsc/tree` (static items,
expanded on the server).

An independent review of the diff found seven defects before the commit, each now fixed, with a
test or a baseline: the chevron and an item's icon kept the page's icon color on a selected or
disabled row (chassis's `.icon` reads `--icon-color`, which the row now sets per state from
`.menu`'s icon tokens, as `.menu-item` does); a disabled item's chevron was a live button that did
nothing (react-aria's slot props guard `onPress` but carry no `isDisabled`; the button is disabled
now); `autoFocus={true}` focused the treegrid itself (react-aria resolves a key for `'first'` and
`'last'` only; `true` maps to `'first'`); the checkbox's `margin: 0` lost to chassis's
`.check-input:is(input)` by specificity; an icon element given as `expandIcon` pointed up under
RTL, since `.directional-icon` flips an `Icon` only (the button is mirrored instead); the docs
said the indentation lined a child's label up under its parent's (it is the child's chevron);
and AGENTS.md's story-folder count was off by one.

`style.css` is now 3,002 bytes gzipped against `.bundlewatch.config.json`'s 3 kB (3,072) ceiling:
B20 raises the ceiling if it adds any style.

Found on the way: user-event's focus emulation in Storybook's hidden document throws inside
react-aria's `preventFocusOnPress` listeners (the chevron), so the `Default` story's play function
clicks the chevron with the element's own `click()`; real pointers are unaffected. With `onAction`
and the toggle behavior, a click activates an item only while nothing is selected (react-aria's
`useSelectableItem`), then toggles the selection, and Enter selects nothing and activates nothing
until the selection is empty again — documented, not changed.

Changeset: minor.

### B20 — A time in `DatePicker` (F9)

Model: **Opus**. A form component: read `FORMS.md` first. Decided in B16.

- [x] `granularity` on `DatePicker` and `DateRangePicker` down to `hour`, `minute` or `second`,
      with `CalendarDateTime`/`ZonedDateTime` values; the field renders the time segments
      (`DateSegment`), the calendar keeps the time when a day is picked. Decide whether a
      `TimeField` also appears in the popover, as react-spectrum's does. A value with a time
      already showed it, and react-stately already kept the time on a picked day; what was
      missing was passing `granularity` (so an empty field could not get a time), `hourCycle`,
      `hideTimeZone`, `placeholderValue` and `shouldForceLeadingZeros`, to the state and the hook
      both. Single selection only: `selectionMode="multiple"` lists dates. Decided here: no
      `TimeField` in the popover. The field's segments edit the time and a picked day still
      closes it; an empty field takes the time of `defaultValue` (single only), else
      `placeholderValue`, else midnight. `Calendar` and `RangeCalendar` gained
      `defaultFocusedValue`, which the pickers pass their `placeholderValue` through, as
      react-aria's hooks ask, so the calendar opens on its month.
- [x] The value type widens (`DateValue` already includes both), so check `onChange`'s type,
      the hidden input's ISO string, `minValue`/`maxValue` with a time, and the calendar's
      "today" after hydration (B7) with a `ZonedDateTime`. `onChange` stays `DateValue | null`.
      The hidden input holds `toString()`, as react-aria's own and `TimeField`'s do:
      `2026-03-15T09:30:00`, and with a zone `…+09:00[Asia/Tokyo]`, which `parseZonedDateTime`
      reads back. The calendar compares days only, so `minValue`'s own day stays selectable.
      Decided here: both pickers show a value out of range, on an unavailable date, or a range
      ending before it starts as invalid with `invalidFeedback`, as `TimeField` does, date-only
      pickers included; `invalid` reaches react-stately as `invalid || undefined`, and so the
      segments' `aria-invalid`, which it had never set. "Today" is the calendar state's zone
      (the value's for a `ZonedDateTime`, else the browser's) rather than always the browser's:
      react-aria's "Today" in the cell's label already used it, so the two could name different
      days.

Changeset: minor. Four stories (`WithTime`, `WithTimeZone`, `TimeOutOfRange`, the range's
`WithTime`) with darwin and Linux baselines; every earlier date and time baseline is unchanged.

Found on the way, and fixed: an unlabelled `TimeField` with `invalidFeedback` lost focus when a
typed time went out of range (B16's defect, which this phase would have spread to both pickers).
`renderFormField` wrapped the control only once feedback showed, and moving it into the new
`.form-field` remounted it. It now wraps once feedback is given, as FORMS.md already said; a
feedback prop without `label` now wraps the control before the feedback shows, in all 13 fields.
The literal between a date and its time (en-US `", "`) was padded as a segment ("2024 , 9:30")
and renders as plain text now; a date's own literals keep their padding. The time zone segment,
react-aria's read-only `span role="textbox"`, failed html-validate's `prefer-native-element`:
`textbox` joins that rule's exclusions in `packages/site/html-validate.json`.

An independent review of the diff found no code defect and two false statements in the docs,
both corrected, each now with a test: a controlled zoned `value`, once cleared, is rebuilt from
`defaultValue`/`placeholderValue` (react-stately), so it stays zoned only with a zoned
`placeholderValue`; and the single picker takes an empty field's time from `defaultValue` before
`placeholderValue`. It also found the first literal rule stripping ko-KR's `". "` date literals
(narrowed to the literal between the date and the time), and a docs example opening its calendar
in January 2026.

Found on the way, fixed after the phase: react-aria's cell label said "Today, …" in the server's
HTML (`useCalendarCell`, with the server's zone and date), which hydration doesn't patch, while
`datepicker-date-today` waits for hydration (B7). On the statically built docs site a calendar
example's label named the build day until the cell re-rendered. `useCellToday`
(`src/components/calendar/todayLabel.ts`) now holds the class, `aria-current` and the label back
together: until hydration the label is react-aria's for a day that isn't today, its "Today" wrapper
taken off and its "selected" wrapper put on, from react-aria's own strings (a
`LocalizedStringProvider`'s, else a copy in `todayLabelStrings.ts`, about 2 kB gzip in the
calendar chunk). A range's description and the first/last available date note stay react-aria's.
`test/components/calendar/todayLabel.spec.tsx` checks the server label in all 34 of react-aria's
locales against `react-aria/i18n`, so a react-aria update that changes the strings fails there;
`render.spec`/`hydrate.spec` cover `Calendar`, `RangeCalendar` and both pickers open on today.
Changeset: patch.
