# `@chassis-ui/react`

The component library, published from `dist/` (tsdown, ESM only) with source in `src/`. Components
apply `@chassis-ui/css` class names and ship no styles of their own, except the few with no
chassis-css equivalent, whose Sass builds into `dist/style.css` (see `THEMING.md`). RD numbers
cite rows of [`DECISIONS.md`](../../DECISIONS.md), which holds the history behind each rule.

## Layout

- `src/components/<kebab-name>/` holds the component and its `index.ts` barrel; specs are under
  `test/components/`, stories under `stories/<family>/`. `CONVENTIONS.md` has the naming, layout,
  barrel and compound-API rules; it wins over what an existing component does.
- A new barrel starts with `'use client'` and `import '../../utils/suppressFocusRingGlobally'`,
  copied from a sibling. `static-table`, the server-safe entry, carries neither (`RSC.md`;
  `pnpm check:rsc` checks the directive).
- Every export needs an `import` line and an entry in the `export { ... }` block of
  `src/index.ts`. One without both works locally and isn't published.
- Read `FORMS.md` before touching a form component it lists; `THEMING.md` before adding
  component-scoped CSS or documenting how a consumer customizes; `VERSIONING.md` before
  deprecating or removing an export or prop, or publishing; `RSC.md` before touching a
  `'use client'` directive, `scripts/check-rsc-directive.ts` or the multi-entry build.

## Build

- ESM only, one entry per component folder plus the root, code in shared `dist/chunks/` (RD1;
  `tsdown.config.ts`, `RSC.md` "Subpath imports"). The `'use client'` of an entry comes from its
  source's first line; don't add one in `tsdown.config.ts` (RD4).
- `pnpm dev` passes `--no-clean` so the docs site keeps a `dist/` to serve; don't run `pnpm build`
  while `pnpm dev` runs, restart `dev` after it (RD22).
- `pnpm check:types` (`pnpm react:check:types` at the root) is the only type check of this
  package's source: the build and `check:api` never see an error inside a function body. Run it
  after any non-trivial change (RD6).
- No `engines` field (RD2). `sideEffects` names `dist/` paths only: the entries, the focus-ring
  chunk and `style.css`. A new side-effectful module needs an entry there and in
  `tsdown.config.ts`'s `moduleSideEffects` (RD3).
- `@chassis-ui/css` is a peer dependency pinned to one 0.x minor. A pull request that takes a new
  css minor widens that range and carries a changeset.

## Tests

- `pnpm test` runs both vitest projects: jsdom specs under `test/`, and `storybook`, every story's
  `play` function in Chromium, Firefox and WebKit (once:
  `pnpm exec playwright install chromium firefox webkit`). Filter with `--project=storybook`,
  `--project='!storybook'` or `--project='storybook (webkit)'`.
- A story's `waitFor` and `findBy*` wait five seconds (`test/storyWaits.ts`). Don't pass a shorter
  `timeout` to a wait that follows a scroll, a transition or an overlay opening.
- `test/types.test-d.tsx` holds type-level assertions, checked by `pnpm check:types` only. Add a
  case when changing a generic public type: `api-report.md` pins the text and specs the behavior,
  neither catches a type that compiles and is wrong for a consumer.
- Sweeps cover every component without editing: `test/ssr/render.spec.tsx` and
  `hydrate.spec.tsx` (every story and `test/ssr/firstPaint.tsx`), and under `test/utils/`
  `asChild.matrix.spec.tsx`, `lazyChildren.spec.tsx`, `refForwarding.spec.tsx`,
  `visibleState.spec.tsx` and `tailwindClassNames.spec.tsx`. Each allowlist entry must keep
  failing: a fixed case fails until its entry is deleted. `pnpm smoke:test` runs the `asChild`
  and lazy-children cases in a real app.
- Import the component under test from `../../../src/index`, not from its file.
- Dev-time misuse warnings go through `devWarning`/`devError` (`src/utils/devWarning.ts`), never a
  bare `console.warn`/`console.error`.
- Every interactive component's spec asserts `expect(await axe(container)).toHaveNoViolations()`
  in a realistic composed state (open, with its sub-parts), not the emptiest markup.
- No markup snapshots under `test/components/**`; `eslint.config.js` bans `toMatchSnapshot` there.
  Assert structure explicitly; pixels are the job of visual regression (RD12).

## Visual regression

- Storybook (`.storybook/`) plus Playwright screenshots (`test/visual/`) cover one family per
  `*.visual.spec.ts`, each a call to `runVisualRegressionSuite` (`test/visual/visualSuite.ts`)
  with its own title prefixes. A new family gets its own spec, not a widened one; the families
  without one are tracked in #45.
- Story `args` use fixed past dates (`new CalendarDate(2024, 3, 15)`), never `today()`: a screenshot
  must render the same on any day.
- Baselines are checked in for both platforms; CI compares the `-linux.png` ones inside the
  Playwright image. Regenerate them with `pnpm test:visual:update:linux <spec files>`, always
  naming the specs you touched, never `playwright test --update-snapshots` in a container by hand
  (RD14).

## Conventions

- Start a new component with `pnpm new:component <kebab-name>` at the root. A form component
  then follows [`FORMS.md`](FORMS.md#adding-a-new-form-component). The scaffold is the shape only;
  before it lands a component also needs:
  - Markup from chassis-css where it has any (the component's docs page and its partial in
    `@chassis-ui/css/scss/`); otherwise class names in chassis-css's vocabulary (`.<component>`,
    `.<component>-<part>`, context and size modifiers as its siblings take them), so the styles
    can move to chassis-css unchanged.
  - Styles here only for what chassis-css lacks, built on the public `--cx-*` tokens and an
    existing component's custom properties where one fits (as `DataGrid.scss` reads
    `--table-*`), never a new token namespace. List the file in `THEMING.md`'s "Component-scoped
    CSS", and give it a visual regression spec with Linux baselines.
  - The rules below: a forwarded ref, `visible`/`defaultVisible`/`onVisibleChange` if it opens,
    `Portal` if it is portaled, `IconSlot` for its own icons, `asChild` if it is polymorphic, and
    server HTML that equals the settled state. The sweeps under "Tests" pick it up by themselves.
  - An axe assertion in a realistic state, `pnpm react:generate`, the `api-report.md` update, a
    minor changeset, and an independent review of the diff before the commit.
- `CONVENTIONS.md` states, and a sweep enforces, each of: polymorphism (ask `resolveElementKind`,
  never compare `component` to a tag), reading children (`isElementOfType`/`resolveLazy`, never
  `child.type === X`), `href`, open state, refs, server HTML, measured layout, `className` order,
  and show/hide transitions (`useTransitionState`, no duration in JavaScript).
- Never call `createPortal`: render `Portal` (`src/components/portal/Portal.tsx`), which renders
  nothing until hydrated so portaled content can't break hydration (`CONVENTIONS.md`, "Server
  HTML").
- Screen-reader-only text is a `VisuallyHidden`, not a `<span className="visually-hidden">`; a
  skip link is `VisuallyHidden` with `focusable`.
- A link-like component renders through `Link`, which registers with a surrounding `Scrollspy`
  and takes its mark (`src/utils/scrollspy.ts`); `NavLink`, `ListItem` and `MenuItem` take part
  that way with no code of their own.
- A component's own icons render through `IconSlot` (`src/utils/iconSlot.tsx`) with a purpose key
  and the class chassis-css positions it by, never `<Icon>` directly, so consumers can swap them
  through `IconProvider` or the component's icon prop. A new purpose goes in `IconKey`/
  `DEFAULT_ICONS` (`src/utils/iconConfig.ts`).
- A prop maps to a utility class of `@chassis-ui/css` by whole class names, from a condition or a
  table (`src/utils/colorClassNames.ts`), never joined at runtime (`` `bg-${color}` ``): the
  Tailwind entry generates a utility only where the scanner reads its whole name (RD20). The
  exceptions are the allowlist of `test/utils/tailwindClassNames.spec.tsx`; a new layout-prop
  value needs its class in chassis-css's safelist first.
- After changing exported props or types: `pnpm react:generate`, then
  `pnpm react:build && pnpm react:check:api:update`, and commit both diffs with the code (RD8).
  `pnpm react:check:api` fails CI when `api-report.md` has drifted.
