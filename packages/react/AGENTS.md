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
- `test/components/<kebab-name>/<PascalName>.spec.tsx` — mirrors `src/components/`, under the
  top-level `test/` folder that also holds shared setup (`test/setup.ts`, `test/dialogPolyfill.ts`,
  `test/axeMatchers.ts`).
- `src/components/<kebab-name>/index.ts` — every component folder's barrel: re-exports the root
  component and, for compound families, every sub-part as its own flat, root-prefixed named export
  (`AccordionItem`, not `Accordion.Item` — see `CONVENTIONS.md`). The central `src/index.ts`
  imports from these barrels, not from component files directly. Every barrel is also a build
  entry, published as the `@chassis-ui/react/<kebab-name>` subpath export, so it starts with
  `'use client'` followed by `import '../../utils/suppressFocusRingGlobally'` — copy both lines into
  a new folder's barrel (see `RSC.md`; `pnpm check:rsc` catches a missing directive). The one
  exception is `static-table`, the server-safe entry, which must carry neither.
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
  exports, and the deprecation policy (TSDoc `@deprecated` + a runtime `devWarning`, minimum one
  minor release before a breaking removal). Read this before deprecating or removing any exported
  component/prop, or before publishing a release.
- `RSC.md` — why the package ships a `'use client'` directive per entry point (root plus one
  subpath per component folder), what that means for a consumer, the measured bundle-size effect
  of subpath imports, and how the directives survive the tsdown build. Read this before touching a
  directive on `src/index.ts` or a barrel's first line, `scripts/check-rsc-directive.ts`, or the
  multi-entry build shape.
- `src/index.ts` — the public API surface. Every exported component/helper needs **two** entries
  here: an `import` line (from the component's folder barrel, not the component file) and a
  matching entry in the trailing `export { ... }` block. Forgetting either means it silently isn't
  part of the published package even though it works in local dev.
- `test/setup.ts`, `test/dialogPolyfill.ts`, `test/axeMatchers.ts` — shared Vitest setup
  (jest-axe matchers, a `<dialog>` polyfill for jsdom, global test config).

## Build

`tsdown.config.ts` produces a multi-entry ESM build: `dist/index.js` from `src/index.ts`, plus one
`dist/<folder>.js` per `src/components/<folder>/index.ts` barrel (each published as the
`@chassis-ui/react/<folder>` subpath export — see `RSC.md`'s "Subpath imports"). Entries are thin
re-exports; the actual code lives in shared, content-hashed `dist/chunks/*.js`, so the root and a
subpath resolve to the same module instances. Declarations are split the same way (tsdown bundles
types directly, with no `tsc` declaration pass). It
also emits `dist/style.css` (tsdown's own CSS pipeline, compiling the
`Calendar`/`RangeCalendar`/`DatePicker`/`DateRangePicker`/`TimeField`/`Table`/`Notification`/`DataGrid`/`Divider`/`NumberField`/`SearchField`/`Tree` Sass/CSS
side-effect imports into one file rather than injecting them via JS, opened with chassis-css's
`@layer` order so the import order doesn't matter — see `THEMING.md`). No CJS output: the package
is ESM-only (RD1 in [`ref/DECISIONS.md`](../../ref/DECISIONS.md), which holds the history behind
every RD number here). `exports: true` auto-generates
`package.json`'s `exports` map on every build; `publint: true`/`attw: true` run non-blockingly as
part of the same build for fast local feedback (the actual CI gate is this package's own
`pnpm check:package` script, run from the repo root as `pnpm react:check:package`, a separate,
blocking step — see `.github/workflows/ci.yml`). Each entry's `'use client'` directive comes from
the first line of its source module, which Rolldown preserves because it's an entry module; don't
add it again in `tsdown.config.ts`, which would duplicate it (RD4). See `RSC.md`, and
`pnpm check:rsc` for the guard that keeps it correct.

The build emits a source map for every shared chunk (`sourcemap: true`), with `sourcesContent`
embedded. That is why `files` publishes `dist/` only: the maps carry the original source, so
`src/` isn't shipped. The thin entries are re-exports and get no map. `@chassis-ui/css` is a peer
dependency pinned to one 0.x minor; a Dependabot pull request that takes a new css minor must
widen that range and carry a changeset.

```bash
pnpm build             # one-shot build (also run via `pnpm react:build` from the repo root)
pnpm dev               # tsdown --watch --no-clean, for local development against packages/site
pnpm lint              # eslint + stylelint + prettier, scoped to this package
pnpm format            # prettier --write, scoped to this package
pnpm check:types       # tsc --noEmit over src/, test/, types/ and .storybook/
pnpm check:api         # diff a flattened .d.ts of src/index.ts against api-report.md
pnpm check:api:update  # regenerate api-report.md
pnpm check:rsc         # assert every dist/*.js entry has exactly one 'use client' (see RSC.md)
```

`dev` passes `--no-clean`: a tsdown build starts by deleting `dist/`, and takes about ten seconds
to write it back. `pnpm dev` at the root starts the docs site at the same moment, so the site
failed with "Cannot find module '@chassis-ui/react/style.css'" on any page asked for in that time.
The watcher writes over the last build instead, and the chunks it replaces stay in `dist/chunks`
until the next `pnpm build`, which does clean. For the same reason, don't run `pnpm build` while
`pnpm dev` is running: restart `pnpm dev` after it.

`check:types` is the only thing that type-checks this package's own source: tsdown bundles
declarations without running a full `tsc`, so it never sees an error inside a function body, and
`check:api` only diffs the emitted `.d.ts` text. Run it after any non-trivial change — from the
repo root it's `pnpm react:check:types`, and CI runs it before the test suite.

The package declares **no `engines` field**: it's a browser library with no Node runtime
requirement, and the field would warn or fail installs for consumers and set tsdown's target
(RD2). `tsdown.config.ts` pins `target: 'es2022'`, matching the `browserslist` field.

`sideEffects` lists `dist/` paths, never `src/` ones, which no consumer resolves (RD3):
`./dist/*.js` (the entries — each carries a bare `import` of the focus-ring chunk, which a bundler
would drop if the entry itself could be skipped), `./dist/chunks/focus-ring-*.js` (the global
listener install, pinned to its own chunk by `tsdown.config.ts`'s `codeSplitting.groups` so this
glob can name it) and `./dist/style.css`. Every other `dist/chunks/*.js` is side-effect-free,
which is what lets a consumer's bundler drop the chunks of components a page never uses — under
webpack even through a root `@chassis-ui/react` import. Because Rolldown also applies this field to
`src/` (matching nothing there), `tsdown.config.ts` separately marks `suppressFocusRingGlobally` as
side-effectful for the build itself — without that, Rolldown silently drops the bare import.

`check:api`/`check:api:update` run `scripts/check-api-surface.ts`, which bundles its own
single-file `.d.ts` of `src/index.ts` (into `node_modules/.cache/api-surface/`, no prior build
needed) and diffs it against `api-report.md` — the published `dist/index.d.ts` is only
`import`/`export` lines into hashed declaration chunks now, so it can't be snapshotted directly.
From the repo root these are `pnpm react:check:api`/`pnpm react:check:api:update`.

## Tests

```bash
pnpm test         # vitest run --coverage
pnpm test:update  # same, plus -u to update snapshots
```

- Test files matched by `test/**/*.spec.tsx` only (see `vitest.config.ts`); environment is jsdom.
- `vitest.config.ts` defines **two projects**: the default jsdom one (`test/**/*.spec.tsx`) and
  `storybook`, which runs every story's `play` function in real Chromium, Firefox and WebKit via
  `@vitest/browser-playwright` — one instance per engine in `browserslist`. `pnpm test` runs
  both, so it needs the three browser binaries on disk. Locally, from this package:
  `pnpm exec playwright install chromium firefox webkit`; CI adds `--with-deps`. Filter with
  `--project=storybook` / `--project='!storybook'`, or to one browser with
  `--project='storybook (webkit)'`.
- A story's `waitFor` and `findBy*` wait up to five seconds, not testing-library's one:
  `test/storyWaits.ts`, a setup file of the `storybook` project. What a story waits for comes with
  the browser's next frame, and a CI runner has taken 1.5s to render one. Don't pass a shorter
  `timeout` to a wait that follows a scroll, a transition or an overlay opening.
- `test/types.test-d.tsx` holds type-level assertions (`expectTypeOf`, plus `@ts-expect-error`
  cases that must keep erroring). It's deliberately **not** a `.spec.tsx`, so vitest never collects
  or executes it — it's checked entirely by `pnpm check:types`. Add to it when changing a generic
  public type: `api-report.md` pins declaration _text_ and the runtime specs prove behavior, but
  neither catches a type that compiles and is simply wrong for a consumer.
- Three sweeps guard SSR and `asChild` across the whole library, each with an allowlist of
  known failures that must keep failing (a fixed case fails its "still fails" check until its
  entry is deleted): `test/ssr/render.spec.tsx` server-renders every story in a Node environment,
  failing on a reference to an id the HTML doesn't contain, and asserts the first paint of the
  cases in `test/ssr/firstPaint.tsx` (see `CONVENTIONS.md`, "Server HTML");
  `test/ssr/hydrate.spec.tsx` renders the same stories and cases with no DOM, then installs
  jsdom, resets the module graph and hydrates them; `test/utils/asChild.matrix.spec.tsx` checks every
  polymorphic component (found by reading `src/`) renders the same attributes for `asChild` with
  an `<a>`, and with a router link, as for `component="a"`; its allowlist is empty. It also fails
  on a render function that compares `component` to a tag name.
  `test/utils/lazyChildren.spec.tsx` compares markup the same way for children delivered as
  React Server Components deliver them (`test/utils/lazyNode.ts`): as lazy nodes, and as elements
  whose types are lazy wrappers. It also fails on a `child.type === Component` comparison in
  `src/`. The same cases run in a real app: `pnpm smoke:test`, see
  `smoke-tests/nextjs-app-router/README.md`.
- `test/utils/refForwarding.spec.tsx` fails on an exported component that isn't a `forwardRef`,
  unless its allowlist names it; an allowlisted one that gains a ref fails until its entry is
  deleted. See `CONVENTIONS.md`, "Refs".
- Coverage provider is **istanbul**, not v8, to match the counting the thresholds were tuned
  against. Thresholds: statements 96%, branches 91%, functions 97%, lines 97%
  (`vitest.config.ts`). A change that drops coverage below these fails the run (and CI, which just
  runs `pnpm test`). They're set against the **jsdom project alone**, so the gate means the same
  thing whether or not the browser project ran (RD11).
- Fake timers are configured to also fake `requestAnimationFrame`/`cancelAnimationFrame`, which
  Vitest's don't by default (RD13) — react-aria's hover/press interactions schedule state updates
  via rAF, so `vi.useFakeTimers()` + `vi.runAllTimers()` needs this to actually flush them.
- Import components under test from the package's own public entry point
  (`'../../../src/index'`), not directly from the component file — this keeps tests honest about
  what's actually exported.
- Dev-time misuse warnings go through `devWarning`/`devError` (`src/utils/devWarning.ts`), never a
  bare `console.warn`/`console.error`: they're guarded on `process.env.NODE_ENV` so nothing logs in
  a consumer's production build, and de-duplicated on the message so a warning in a render body
  can't re-fire on every render (or twice per render under StrictMode). `test/setup.ts` clears the
  de-duplication set in a global `beforeEach`, so a spec asserting on a warning still sees it.
- Every interactive component's spec file gets a jest-axe accessibility assertion
  (`expect(await axe(container)).toHaveNoViolations()`), rendered in a realistic composed state
  (visible/open, with the sub-parts a real usage would include) rather than the emptiest possible
  markup — an axe check against a bare shell can pass while the actual documented usage still
  violates.
- No raw DOM markup snapshots (`expect(container).toMatchSnapshot()`) under `test/components/**` —
  assert structure and behavior explicitly instead (`toHaveClass`/`toHaveAttribute`/role queries),
  and reach for Storybook + Playwright visual regression (below) for anything genuinely
  pixel-level. `eslint.config.js` bans the pattern under this path via `no-restricted-syntax`, at
  `error`. A markup snapshot duplicates the explicit assertions and can be `-u`'d past a real
  regression without being read (RD12).

## Visual regression

Storybook (`.storybook/`, config framework `@storybook/react-vite`) plus Playwright screenshot
tests (`test/visual/`) catch pixel-level regressions that DOM assertions can't — e.g. a CSS change
that doesn't alter markup at all. Coverage today spans fourteen batches, each its own spec
file: `calendar-datepicker.visual.spec.ts` (calendar, datepicker — this family has component-scoped
CSS, see `THEMING.md`, so it needs pixel coverage the other families don't),
`menu-popover-tooltip.visual.spec.ts`
(positioning-heavy, portal-based), `toast-notification.visual.spec.ts` (transition-heavy),
`accordion-collapse.visual.spec.ts` (native `<details>` / `useTransitionState`-driven open-close
state),
`carousel.visual.spec.ts` (CSS-scroll-snap-driven), `datagrid.visual.spec.ts` (virtualizer-driven
— row/column position and size are computed at runtime by react-aria-components' `Virtualizer`, not
CSS alone), `combobox-autocomplete.visual.spec.ts`, `overlays.visual.spec.ts` (modal, drawer) and
`table.visual.spec.ts`, `divider.visual.spec.ts`, `number-field.visual.spec.ts`, `time-field.visual.spec.ts`, `search-field.visual.spec.ts` and `tree.visual.spec.ts`
(component-scoped CSS, like the calendar family's). That is 21 of the 67 story folders; the rest are tracked in issue
#45. A
future family gets its own `test/visual/<family>.visual.spec.ts` with its own
story-title filter, not a widened version of an existing one. All fourteen call the shared
`runVisualRegressionSuite` helper (`test/visual/visualSuite.ts`) rather than each re-reading and
filtering Storybook's build manifest themselves — a spec file is just its title-prefix list plus,
for the two families that need it, a `waitFor`: toast/notification (see below) and DataGrid (its
own scroll-cue/pin-positioning effects read `scrollWidth`/`clientWidth` before the browser's layout
pass has settled those values, even for statically-sized columns — a screenshot taken in that
window is genuinely, not just transiently, different from one taken a couple of frames later, so
`datagrid.visual.spec.ts` waits two animation frames after navigation before every screenshot in
the family).

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
  family's baselines under one `__snapshots__/` directory, with each family in its own subfolder so
  story-id filenames can't collide across families.
- Playwright's snapshot filenames are platform-suffixed (`-chromium-darwin.png`,
  `-chromium-linux.png`) and both are checked in: the `-linux.png` ones are what CI's
  `visual-regression` job (running inside the official Playwright Docker image, see
  `.github/workflows/ci.yml`) actually checks against; the `-darwin.png` ones exist purely so a
  contributor on a Mac gets a meaningful local pass/fail from `pnpm test:visual` too. If you only
  have a Mac, regenerating the Linux baselines needs a matching container — use
  `pnpm test:visual:update:linux [spec files...]` (`scripts/update-linux-snapshots.sh`), never
  `playwright test --update-snapshots` in a container by hand (RD14). The script copies the repo
  in and out of the container, forces `linux/amd64` to match CI's runners, and re-runs each
  regenerated spec twice in normal mode before copying anything back, so a screenshot taken
  mid-transition can't become a baseline. Always pass the spec file(s) for the family you actually
  touched; running with no args regenerates every family's
  Linux baselines at once, which also means reviewing every diff for an unrelated font-rendering
  drift instead of just the one you meant to change.
- A popover-based story (`DatePicker`/`DateRangePicker`'s `Open*` variants) screenshots the whole
  iframe page rather than a specific element, because `Popover` portals to `document.body` (see
  `Popover.tsx`), outside Storybook's `#storybook-root`.

## Conventions

- Start a new component with `pnpm new:component <kebab-name>` from the repo root: it writes the
  folder, barrel, `src/index.ts` entries, spec, story, docs page and sidebar entry in this
  package's shape. A form component then follows the checklist in
  [`FORMS.md`](FORMS.md#adding-a-new-form-component) for its render-helper engine.
- Never compare a polymorphic component's `component` to a tag name (`Component === 'a'`,
  `typeof Component !== 'string'`): under `asChild` it is a `Slot`, not the tag. Ask
  `resolveElementKind`/`resolveElementTag` (`src/utils/elementKind.ts`) and render `Component`
  typed as the tag, not a literal element. See `CONVENTIONS.md`.
- Never compare a child's `type` to a component or read the `props` of an unresolved child: use
  `isElementOfType` and `resolveLazy` (`src/utils/lazyElement.ts`). Children written in a Server
  Component have lazy types and can be lazy nodes. See `CONVENTIONS.md` and `RSC.md`.
- A component that shows and hides takes `visible` (controlled), `defaultVisible` and
  `onVisibleChange`, never a copy of `visible` synced into state. `useOpenStateProps` maps the
  three onto a react-stately trigger state; `useControllableState` holds them otherwise. See
  `CONVENTIONS.md`; `test/utils/visibleState.spec.tsx` runs every such component through the
  same cases.
- A component that animates showing and hiding takes its phase from `useTransitionState`
  (`src/hooks/useTransitionState.ts`) and maps it to chassis-css's classes itself. No duration
  lives in JavaScript: a phase ends with the element's own CSS transition, so a themed duration
  and `prefers-reduced-motion` are followed. `Modal`, `Alert`, `Drawer` and `Menu` wait on the same
  `executeAfterTransition`.
- Never call `createPortal` directly: render `Portal` (`src/components/portal/Portal.tsx`). It renders
  nothing (or its `fallback`) on the server and during hydration, then portals, so portaled
  content can't break hydration. `test/ssr/portal.spec.tsx` checks the overlays still appear.
- Text for screen readers only is a `VisuallyHidden` (`src/components/visually-hidden/`), not a
  hand-written `<span className="visually-hidden">`; a skip link is `VisuallyHidden` with
  `focusable`.
- A list that a `NavOverflow` can collapse (`Nav`, `NavbarNav`, `TabList`) renders its items
  inside `NavOverflowItems`, an item registers its `<li>` with `useNavOverflowItem`, and its link
  registers the props the menu renders (`src/utils/navOverflow.tsx`). Nothing is cloned or moved
  in the DOM, and the list imports a context only: the toggle and its `Menu` stay in
  `nav-overflow`'s chunk. See `CONVENTIONS.md`, "Measured layout".
- A `Scrollspy` marks links through `Link`: every `Link` inside one registers its element with
  `useScrollspyLink` (`src/utils/scrollspy.ts`) and renders the mark it is given, so `NavLink`,
  `ListItem` and `MenuItem` take part with no code of their own. A new link-like component renders
  through `Link` to take part too. The section is read from the element's `href`, which is where
  an `asChild` link has it. `Link` imports a context only; the observers stay in `scrollspy`'s
  chunk.
- A component that draws an icon of its own never renders `<Icon>` directly — it renders
  `IconSlot` (`src/utils/iconSlot.tsx`) with a purpose key (`check`, `previous`, `next`, ...) plus
  the class chassis-css positions that icon by, so consumers can swap it via `IconProvider` or
  the component's own icon prop. A new purpose goes in `IconKey`/`DEFAULT_ICONS`
  (`src/utils/iconConfig.ts`). `<Icon>` is the default renderer, not a dependency.
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
  check that fails the build if this snapshot has drifted from what the package actually exports,
  so an unintentional breaking change gets caught before merge instead of after publish. See
  `scripts/check-api-surface.ts`.
