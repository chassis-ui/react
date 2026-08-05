# `@chassis-ui/react`

The component library itself, published from `dist/` (built by Rollup) with source living in
`src/`. Styling comes entirely from the sibling `@chassis-ui/css` framework (a peer dependency in
consuming apps) — components apply chassis-css class names, they don't ship their own styles,
except for the handful of components with no chassis-css visual equivalent (e.g. `DatePicker`'s
calendar grid), which inject scoped CSS via `rollup-plugin-postcss`.

## Layout

- `src/components/<kebab-name>/<PascalName>.tsx` — one folder per component (or a compound
  family's root + sub-parts), plus `__tests__/<PascalName>.spec.tsx` and a
  `__tests__/__snapshots__/` snapshot file. See `CONVENTIONS.md` for the naming/barrel/compound-API
  rules this layout follows.
- `src/components/<kebab-name>/index.ts` — every component folder's barrel: re-exports the root
  component and, for compound families, every sub-part as its own flat, root-prefixed named export
  (`AccordionItem`, not `Accordion.Item` — see `CONVENTIONS.md`). The central `src/index.ts`
  imports from these barrels, not from component files directly.
- `FORMS.md` — **read this before touching any form-related component**
  (text inputs, select, checkbox/radio, combobox, datepicker, chip-input, otp-input, and the
  shared `form`/`form-field` render helpers). It documents two non-interchangeable shared render
  engines and several non-obvious rules that are easy to violate by copy-pasting from the wrong
  sibling component.
- `src/utils/hooks` — shared hooks (e.g. `useForkedRef`) used across components.
- `src/index.ts` — the public API surface. Every exported component/helper needs **two** entries
  here: an `import` line (from the component's folder barrel, not the component file) and a
  matching entry in the trailing `export { ... }` block. Forgetting either means it silently isn't
  part of the published package even though it works in local dev.
- `test/setup.ts`, `test/dialogPolyfill.js`, `test/axeMatchers.js` — shared Vitest setup
  (jest-axe matchers, a `<dialog>` polyfill for jsdom, global test config).

## Build

`rollup.config.mjs` produces CJS (`dist/index.js`) and ESM (`dist/index.es.js`) bundles from
`src/index.ts`, plus a bundled `dist/index.d.ts` via `rollup-plugin-dts` (this last step reads
`dist/src/index.d.ts` — i.e. it depends on `tsc`'s own declaration output already existing from
the first build step, which is why `dist/src`/`dist/test` get removed afterward as
build-intermediate cruft, not shipped output).

```bash
pnpm build       # one-shot build (also run via `pnpm lib:build` from the repo root)
pnpm dev         # rollup --watch, for local development against packages/site
```

## Tests

```bash
pnpm test         # vitest run --coverage
pnpm test:update  # same, plus -u to update snapshots
```

- Test files matched by `src/**/*.spec.tsx` only (see `vitest.config.ts`); environment is jsdom.
- Coverage provider is **istanbul**, not v8 — kept intentionally to match the branch/statement
  counting the existing thresholds were tuned against. Current thresholds: statements 91%,
  branches 79%, functions 93%, lines 93% (`vitest.config.ts`). A change that drops coverage below
  these fails the run (and CI, which just runs `pnpm test`).
- Fake timers are configured to also fake `requestAnimationFrame`/`cancelAnimationFrame` (Vitest's
  modern fake timers don't do this by default, unlike the prior ts-jest runner) — react-aria's
  hover/press interactions schedule state updates via rAF, so `vi.useFakeTimers()` +
  `vi.runAllTimers()` needs this to actually flush them.
- Import components under test from the package's own public entry point (`'../../../index'`),
  not directly from the component file — this keeps tests honest about what's actually exported.
- Every test file gets jest-axe accessibility assertions where practical
  (`expect(await axe(container)).toHaveNoViolations()`).

## Conventions

- New component checklist lives in
  [`FORMS.md`](FORMS.md#adding-a-new-form-component) for form
  components specifically; for non-form components, follow the same folder/test/index.ts-export
  shape without the render-helper-engine decision.
- `className` builders: chassis-css base class first, then size, then `is-invalid`/`is-valid`,
  then the caller's `className` last (so caller overrides win) — existing snapshot tests assume
  this order.
- Prefer native elements (`<input>`, `<select>`, `<textarea>`) wired up with react-aria hooks over
  fully custom widgets, wherever chassis-css targets the native element directly via attribute
  selectors (`select.form-input`, `.form-input[type="file"]`) — a react-aria hook that renders
  fully custom markup (e.g. `useSelect`, `useSlider`) won't pick up that styling.
- After adding/changing a component's exported props, run `pnpm api:generate` from the repo root
  so `packages/site/content/api/` (prop-table JSON, consumed by the docs site) stays in sync.
