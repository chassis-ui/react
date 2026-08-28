# `@chassis-ui/react`

The component library itself, published from `dist/` (built by tsdown, ESM-only) with source
living in `src/`. Styling comes entirely from the sibling `@chassis-ui/css` framework (a peer
dependency in consuming apps) — components apply chassis-css class names, they don't ship their
own styles, except for the handful of components with no chassis-css visual equivalent (e.g.
`DatePicker`'s calendar grid), whose Sass compiles via tsdown's own CSS pipeline into a single
`dist/style.css` a consumer imports explicitly (`import '@chassis-ui/react/style.css'` — see
`THEMING.md`), not injected at runtime by the JS.

## Layout

- `src/components/<kebab-name>/<PascalName>.tsx` — one folder per component (or a compound
  family's root + sub-parts), plus that folder's `index.ts` barrel, and (narrow exception) a
  private helper module never exported or used outside the folder — tests and stories are
  centralized in their own trees (below), not colocated. See `CONVENTIONS.md` for the naming/
  barrel/compound-API rules this layout follows, including that exception's exact boundary.
- `test/components/<kebab-name>/<PascalName>.spec.tsx`, plus `test/components/<kebab-name>/
__snapshots__/` for that component's snapshot files — mirrors `src/components/`, under the
  top-level `test/` folder that also holds shared setup (`test/setup.ts`, `test/dialogPolyfill.ts`,
  `test/axeMatchers.ts`).
- `src/components/<kebab-name>/index.ts` — every component folder's barrel: re-exports the root
  component and, for compound families, every sub-part as its own flat, root-prefixed named export
  (`AccordionItem`, not `Accordion.Item` — see `CONVENTIONS.md`). The central `src/index.ts`
  imports from these barrels, not from component files directly.
- `FORMS.md` — **read this before touching any form-related component**
  (text inputs, select, checkbox/radio, combobox, datepicker, chip-input, otp-input, and the
  shared `form`/`form-field` render helpers). It documents two non-interchangeable shared render
  engines and several non-obvious rules that are easy to violate by copy-pasting from the wrong
  sibling component.
- `src/hooks` — shared hooks (e.g. `useForkedRef`) used across components.
- `THEMING.md` — how a consuming app re-themes the library: which `@chassis-ui/css`/
  `@chassis-ui/tokens` surface is the supported override point, versus internal values that could
  change without notice. Read this before adding component-scoped CSS (see the calendar/datepicker
  family) or documenting a "how to customize" story for consumers.
- `VERSIONING.md` — the Changesets-based release process, the semver policy for this API's flat
  exports, and the deprecation policy (TSDoc `@deprecated` + a runtime `console.warn`, minimum one
  minor release before a breaking removal). Read this before deprecating or removing any exported
  component/prop, or before publishing a release.
- `RSC.md` — why the package ships one `'use client'` directive for the whole bundle (not
  per-component), what that means for a consumer, and how to re-verify it survives the tsdown build
  if that build ever changes. Read this before touching `tsdown.config.ts`'s `output.banner` or
  reconsidering the single-bundle build shape.
- `src/index.ts` — the public API surface. Every exported component/helper needs **two** entries
  here: an `import` line (from the component's folder barrel, not the component file) and a
  matching entry in the trailing `export { ... }` block. Forgetting either means it silently isn't
  part of the published package even though it works in local dev.
- `test/setup.ts`, `test/dialogPolyfill.ts`, `test/axeMatchers.ts` — shared Vitest setup
  (jest-axe matchers, a `<dialog>` polyfill for jsdom, global test config).

## Build

`tsdown.config.ts` produces a single ESM bundle (`dist/index.js`) from `src/index.ts`, a bundled
`dist/index.d.ts` (tsdown bundles types directly — no intermediate `tsc` declaration-output pass,
unlike the prior Rollup setup), and `dist/style.css` (tsdown's own CSS pipeline, compiling the
`Calendar`/`RangeCalendar`/`DatePicker`/`DateRangePicker`/`Table`/`Notification` Sass/CSS
side-effect imports into one file rather than injecting them via JS). No CJS output — this package is ESM-only, with no
consumers to preserve dual-format compatibility for. `exports: true` auto-generates
`package.json`'s `exports` map on every build; `publint: true`/`attw: true` run non-blockingly as
part of the same build for fast local feedback (the actual CI gate is this package's own
`pnpm check:package` script, run from the repo root as `pnpm react:check:package`, a separate,
blocking step — see `.github/workflows/ci.yml`). `output.banner` adds the `'use client'`
directive Rolldown would otherwise strip during bundling — see `RSC.md`.

```bash
pnpm build             # one-shot build (also run via `pnpm react:build` from the repo root)
pnpm dev               # tsdown --watch, for local development against packages/site
pnpm lint              # eslint + stylelint + prettier, scoped to this package
pnpm format            # prettier --write, scoped to this package
pnpm check:api         # diff dist/index.d.ts against the checked-in api-report.md snapshot
pnpm check:api:update  # regenerate api-report.md from the current build
```

`check:api`/`check:api:update` run `scripts/check-api-surface.ts` (see below) against this
package's own `dist/index.d.ts` and `api-report.md` — from the repo root these are
`pnpm react:check:api`/`pnpm react:check:api:update`.

## Tests

```bash
pnpm test         # vitest run --coverage
pnpm test:update  # same, plus -u to update snapshots
```

- Test files matched by `test/**/*.spec.tsx` only (see `vitest.config.ts`); environment is jsdom.
- Coverage provider is **istanbul**, not v8 — kept intentionally to match the branch/statement
  counting the existing thresholds were tuned against. Current thresholds: statements 91%,
  branches 79%, functions 93%, lines 93% (`vitest.config.ts`). A change that drops coverage below
  these fails the run (and CI, which just runs `pnpm test`).
- Fake timers are configured to also fake `requestAnimationFrame`/`cancelAnimationFrame` (Vitest's
  modern fake timers don't do this by default, unlike the prior ts-jest runner) — react-aria's
  hover/press interactions schedule state updates via rAF, so `vi.useFakeTimers()` +
  `vi.runAllTimers()` needs this to actually flush them.
- Import components under test from the package's own public entry point
  (`'../../../src/index'`), not directly from the component file — this keeps tests honest about
  what's actually exported.
- Every interactive component's spec file gets a jest-axe accessibility assertion
  (`expect(await axe(container)).toHaveNoViolations()`), rendered in a realistic composed state
  (visible/open, with the sub-parts a real usage would include) rather than the emptiest possible
  markup — an axe check against a bare shell can pass while the actual documented usage still
  violates.
- No raw DOM markup snapshots (`expect(container).toMatchSnapshot()`) under `test/components/**` —
  assert structure and behavior explicitly instead (`toHaveClass`/`toHaveAttribute`/role queries),
  and reach for Storybook + Playwright visual regression (below) for anything genuinely
  pixel-level. `eslint.config.js` bans the pattern under this path via `no-restricted-syntax`, at
  `error` — there's no `__snapshots__/` directory left under this path to grandfather. This wasn't
  always the convention: the suite used to carry a `test('matches the baseline markup snapshot',
  ...)` in 105 of its 128 spec files, each a raw `container`/`toMatchSnapshot()` dump living in an
  adjacent `__snapshots__/*.snap` file, plus another 11 files with a second `toMatchSnapshot()` call
  in a differently-named test. An audit of all of it found every single one blind-diffable — pinning
  exactly the same tag/class/attribute list already asserted a few lines away in the same file
  (backfilling one or two explicit assertions where it wasn't quite) — and zero stood in for a
  genuine rendering concern markup diffing can't capture, including the portal/positioning-heavy
  families (menu, popover, tooltip): their snapshots pinned an inline `style="position: ..."` that
  jsdom's fake layout can't meaningfully validate either way, but those families already have real
  Storybook + Playwright coverage for the pixel-level concern (see Visual regression below), so
  there was nothing left for a DOM snapshot to usefully stand in for. A snapshot like that isn't
  testing anything the explicit assertions don't already cover; it's a blind-diffable duplicate
  someone can `-u` past a real regression without reading, so all of it was removed and replaced
  with the explicit assertions it was shadowing.

## Visual regression

Storybook (`.storybook/`, config framework `@storybook/react-vite`) plus Playwright screenshot
tests (`test/visual/`) catch pixel-level regressions that `vitest`'s DOM snapshots can't — e.g. a
CSS change that doesn't alter markup at all. Coverage today spans five batches, each its own spec
file: `calendar-datepicker.visual.spec.ts` (calendar, datepicker — this family has component-scoped
CSS, see `THEMING.md`, so it needs pixel coverage the other families don't),
`menu-popover-tooltip.visual.spec.ts`
(positioning-heavy, portal-based), `toast-notification.visual.spec.ts` (transition-heavy),
`accordion-collapse.visual.spec.ts` (native `<details>` / `CSSTransition`-driven open-close state),
and `carousel.visual.spec.ts` (CSS-scroll-snap-driven). A future family gets its own
`test/visual/<family>.visual.spec.ts` with its own story-title filter, not a widened version of an
existing one. All five call the shared `runVisualRegressionSuite` helper (`test/visual/
visualSuite.ts`) rather than each re-reading and filtering Storybook's build manifest themselves —
a spec file is just its title-prefix list plus, for the one family that needs it (toast/
notification, see below), a `waitFor`.

```bash
pnpm storybook            # storybook dev -p 6006, for authoring stories interactively
pnpm storybook:build      # static build to _storybook/ (gitignored)
pnpm test:visual          # build-storybook, then run test/visual/**/*.visual.spec.ts against it
pnpm test:visual:update   # same, plus --update-snapshots to regenerate baselines
```

- Story files are collected under `stories/<family>/<Component>.stories.tsx` (e.g.
  `stories/calendar/Calendar.stories.tsx`), not colocated beside the component they document —
  matched by `.storybook/main.ts`'s glob against anywhere under `src/`, so this is purely an
  organizational choice, not something the glob requires. `.storybook/preview.tsx` imports
  the real compiled `@chassis-ui/css/dist/css/chassis.min.css` — Storybook has no consuming app to
  supply that peer dependency itself (see `THEMING.md`), so without it every story would render
  unstyled.
- Story `args` use fixed, past `CalendarDate`s (e.g. `new CalendarDate(2024, 3, 15)`), not
  `today()` like the docs-site examples in `packages/site/examples/` do — a screenshot has to
  render identically no matter what day it's actually run, and `today()` would shift both the
  visible month and the `.datepicker-date-today` highlight on every run.
- `runVisualRegressionSuite` (`test/visual/visualSuite.ts`) reads `_storybook/index.json`
  (Storybook's own build manifest) at collection time to enumerate stories, rather than hardcoding
  story IDs — a new story on an already-covered component is picked up automatically. This is also
  why `test:visual` runs `build-storybook` as an explicit, separate step before `playwright test`,
  not inside `playwright.config.ts`'s `webServer` — the manifest must already exist on disk before
  Playwright starts loading spec files.
- Baseline images live under `test/visual/__snapshots__/<spec-file-name>/`, not next to the spec
  file (Playwright's own default) — `playwright.config.ts`'s `snapshotPathTemplate` collects every
  family's baselines under one `__snapshots__/` directory, matching this repo's existing
  `__snapshots__/` convention for vitest's own DOM snapshots, while still keeping each family in
  its own subfolder so story-id filenames can't collide across families.
- Playwright's snapshot filenames are platform-suffixed (`-chromium-darwin.png`,
  `-chromium-linux.png`) and both are checked in: the `-linux.png` ones are what CI's
  `visual-regression` job (running inside the official Playwright Docker image, see
  `.github/workflows/ci.yml`) actually checks against; the `-darwin.png` ones exist purely so a
  contributor on a Mac gets a meaningful local pass/fail from `pnpm test:visual` too. If you only
  have a Mac, regenerating the Linux baselines needs a matching container — use
  `pnpm test:visual:update:linux [spec files...]` (`scripts/update-linux-snapshots.sh`) rather than
  running `playwright test --update-snapshots` in a container by hand. That script exists because
  the naive version of "run it in `mcr.microsoft.com/playwright:<version>-noble`" has three sharp
  edges: bind-mounting the repo and running `pnpm install` in the container rebuilds native deps
  (esbuild, sharp, `@parcel/watcher`) as Linux binaries directly over your host `node_modules`
  (the script copies the repo in/out instead); the image is multi-arch, so Docker silently runs
  native arm64 on Apple Silicon unless you force `--platform linux/amd64` to match CI's actual
  `ubuntu-latest` (x86_64) runners; and macOS's `tar` embeds `._*` AppleDouble sidecar files that
  Playwright's spec glob picks up as real `.spec.ts` files and crashes on (needs
  `COPYFILE_DISABLE=1` plus an explicit exclude). The script also re-runs each regenerated spec
  twice more in normal (non-`--update-snapshots`) mode before copying anything back — a screenshot
  taken mid-transition/mid-animation can pass once with no baseline to compare against, then fail
  immediately on the very next real run (this is exactly what happened to
  `toast-notification.visual.spec.ts`'s `.show` wait — see its git history). Always pass the spec
  file(s) for the family you actually touched; running with no args regenerates every family's
  Linux baselines at once, which also means reviewing every diff for an unrelated font-rendering
  drift instead of just the one you meant to change.
- A popover-based story (`DatePicker`/`DateRangePicker`'s `Open*` variants) screenshots the whole
  iframe page rather than a specific element, because `Popover` portals to `document.body` (see
  `Popover.tsx`), outside Storybook's `#storybook-root`.

## Conventions

- New component checklist lives in
  [`FORMS.md`](FORMS.md#adding-a-new-form-component) for form
  components specifically; for non-form components, follow the same folder/test/index.ts-export
  shape without the render-helper-engine decision.
- `className` builder ordering (base class, then size, then validation state, then caller's
  `className` last) — see `CONVENTIONS.md`.
- Prefer native elements (`<input>`, `<select>`, `<textarea>`) wired up with react-aria hooks over
  fully custom widgets, wherever chassis-css targets the native element directly via attribute
  selectors (`select.form-input`, `.form-input[type="file"]`) — a react-aria hook that renders
  fully custom markup (e.g. `useSelect`, `useSlider`) won't pick up that styling.
- After adding/changing a component's exported props, run `pnpm react:generate` from the repo root
  so `packages/site/content/api/` (prop-table JSON, consumed by the docs site) stays in sync.
- After any _intentional_ public API change (new/renamed/removed export, changed prop type), run
  `pnpm react:build && pnpm react:check:api:update` from the repo root and commit the resulting
  `api-report.md` diff alongside the code change — `pnpm react:check:api` (no `:update`) is a CI
  check that fails the build if this snapshot has drifted from what `dist/index.d.ts` actually exports,
  so an unintentional breaking change gets caught before merge instead of after publish. See
  `scripts/check-api-surface.ts`.
