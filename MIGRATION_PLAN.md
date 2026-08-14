# Enterprise migration plan

Tracks the migration of `@chassis-ui/react` toward an enterprise-grade component library built
on `@chassis-ui/css`. This file is the source of truth across sessions — a new session should
read this file top to bottom before doing anything else.

## How to resume

1. Read the **Status** table below to find the first phase not marked `done`.
2. Read that phase's section for scope and the batch/commit breakdown.
3. Work one batch at a time; commit after each batch (not after every file) with a message like
   `migrate(react): rename accordion family (Cx prefix removal)`.
4. After each commit, tick the corresponding checkbox in this file and update the Status table,
   then commit that as part of the same batch commit (plan + code change together).
5. Stop at the end of a batch and wait for the user, unless they've said to keep going
   unattended for a stretch.

## Status

| Phase | Scope | Status |
|---|---|---|
| 0 | Conventions & tooling groundwork | not started |
| 1 | Naming migration — drop `Cx` prefix | not started |
| 2 | Styling migration — Sass + chassis-css tokens | not started |
| 3 | Architecture — hooks/utils consolidation, compound API | not started |
| 4 | Enterprise hardening — a11y, visual regression, CI, bundle size | not started |
| 5 | Docs & final verification | not started |

## Ground truth (as of plan authoring, 2026-08-04)

- 52 component folders under `packages/react/src/components/`.
- 272 files under `packages/react/src` reference `Cx`; 198 files under `packages/site/src`
  reference `Cx`; 115 spec files; 102 snapshot files.
- No per-component `index.ts` barrel — every export is wired by hand into the single
  `packages/react/src/index.ts` (import line + export block entry).
- Styling today: components apply `@chassis-ui/css` class names via `classnames`, no
  component-scoped CSS, **except** the calendar/datepicker family, which ships hand-written
  `.css` (`CxCalendar.css`, `CxRangeCalendar.css`, `CxDatePicker.css`, `CxDateRangePicker.css`),
  injected as a `<style>` tag by `rollup-plugin-postcss` (`inject: true`).
- `@chassis-ui/css` is a sibling checkout (`../chassis-css`, linked via `pnpm-workspace.yaml`
  `overrides`), already ships Sass source (`"sass": "scss/chassis.scss"`, `"./scss/*"` export) —
  including `scss/_datepicker.scss`, which likely already covers some of what the hand-rolled
  `CxDatePicker.css` reimplements. **Reconcile with it, don't just tokenize the existing CSS
  blind.**
- Behavior layer already leans on `react-aria`/`react-stately` for most interaction logic
  (focus, keyboard, ARIA wiring) — the "headless core" architectural goal is largely already
  true for components built on those hooks. The gap is narrower than "build headless layer from
  scratch": mainly the components that predate/bypass react-aria (autocomplete, combobox,
  chip-input, otp-input, password-strength) and general `hooks`/`utils` consolidation
  (currently just `useForkedRef`, `useFormField`, `dialogTransition`, `overlayPlacement`,
  `virtualFocusStyle`).
- Coverage gates already exist and must keep passing throughout: statements 91%, branches 79%,
  functions 93%, lines 93% (`packages/react/vitest.config.ts`).
- `pnpm api:generate` (`react-docgen-typescript`) regenerates `packages/site/content/api/` from
  component prop types — must be re-run after any prop/type rename.
- No backward-compatibility constraint (library unpublished) — renames can be direct, no
  deprecated aliases, no dual-export shims.

---

## Phase 0 — Conventions & tooling groundwork

No component code changes. Establishes the rules Phase 1+ execute mechanically, so the actual
rename isn't a series of ad hoc judgment calls.

- [ ] Write `packages/react/CONVENTIONS.md` (or fold into `AGENTS.md`) covering:
  - Component naming: `PascalCase`, no prefix (`CxButton` → `Button`).
  - Prop/interface naming: `<Component>Props` (`CxButtonProps` → `ButtonProps`), shared prop
    vocabulary (`onChange` vs `onValueChange`, `size`/`variant`/`tone`/`color` usage — audit
    current usage across components for existing drift before mandating).
  - File naming: `Component.tsx` (drop `Cx` from filenames too, e.g. `CxButton.tsx` →
    `Button.tsx`), test files `Component.spec.tsx`.
  - Whether each component folder gets its own `index.ts` barrel (recommended — makes the
    central `src/index.ts` a re-export sweep instead of 100+ hand-maintained import lines, and
    makes Phase 1's mechanical rename lower-risk).
  - Compound-component API decision (flat exports like `AccordionItem` vs. namespaced
    `Accordion.Item`) — decide once here, apply in Phase 3, not per-component ad hoc.
  - Sass usage policy: chassis-css classes remain the default for every component; a
    component-local `.scss` file is only justified when chassis-css has no equivalent class
    (matches current documented exception for the calendar/datepicker family) or partial
    coverage that would otherwise duplicate values chassis-css already tokenizes.
- [ ] Add an ESLint rule (or a simple `no-restricted-syntax`/regex check) that fails on `Cx`
  prefixed identifiers in `packages/react/src`, so nothing reintroduces it mid-migration or
  after.
- [ ] Add a component scaffold generator (e.g. `plop`) matching the Phase 0 folder/file
  decisions, so every component touched from Phase 1 onward — and every new component after
  this migration — has one shape, generated rather than copy-pasted.
- [ ] Wire Sass compilation into `packages/react/rollup.config.mjs`: confirm
  `rollup-plugin-postcss`'s `use: ['sass']` (or equivalent) resolves `@use '@chassis-ui/css/...'`
  from the linked sibling package (`node_modules` resolution via the `pnpm-workspace.yaml`
  `link:../chassis-css` override) — add `sass` as a devDependency, verify a trivial `@use`
  against `@chassis-ui/css/scss/tokens` compiles before Phase 2 depends on it.
- [ ] Commit: `docs(react): migration conventions + tooling groundwork`.

## Phase 1 — Naming migration: drop the `Cx` prefix

Mechanical, scripted rename (codemod / careful `git mv` + find-replace, not hand-editing 272
files). One batch = one commit. Each batch includes: component file(s), test file, snapshot
file, the central `src/index.ts` entries for that batch, and any in-repo usage inside
`packages/site/examples/**` for that batch's components.

Batches, grouped to keep each commit reviewable and independently revertable:

- [ ] **Batch A — layout & display primitives**: avatar, backdrop, badge, breadcrumb, card,
  close-button, collapse, grid, icon, image, list, placeholder, progress, spinner.
- [ ] **Batch B — actions & navigation**: button, button-group, link, nav, navbar, pagination,
  tabs, tooltip.
- [ ] **Batch C — overlays & feedback**: accordion, carousel, drawer, modal, notification,
  popover, toast.
- [ ] **Batch D — menus & selection widgets**: menu, select, autocomplete, combobox.
- [ ] **Batch E — form primitives**: checkbox, chip-input, color-input, file-input,
  floating-input, form, form-field, input-adorn, input-group, otp-input, password-strength,
  radio, range-input, switch, text-input, textarea. Cross-check every change against
  `packages/react/FORMS.md` — it documents two non-interchangeable render engines; the rename
  must not blur that distinction.
- [ ] **Batch F — calendar/datepicker family**: calendar, datepicker (`CxCalendar`,
  `CxRangeCalendar`, `CxDatePicker`, `CxDateRangePicker` + their `.css` files, which get renamed
  now and converted to `.scss` in Phase 2 — don't do both in the same commit).
- [ ] **Batch G — sweep & docs**: any remaining `Cx` occurrences (`Types.tsx` shared type
  unions if named e.g. `CxContextColor`, grep for stragglers), full `packages/site/src` sweep
  for remaining example/prose references, run `pnpm api:generate` and commit the regenerated
  `packages/site/content/api/**` JSON, update `AGENTS.md`, `packages/react/AGENTS.md`,
  `packages/react/FORMS.md`, `README.md` to describe the new (unprefixed) naming instead of
  `Cx*`.

After each batch: `pnpm test` (coverage gates must hold), `pnpm lint`, `pnpm build`,
`pnpm --filter chassis-react-site astro check` (or `pnpm check:astro`) before committing.

Known naming collisions to accept, not work around (no backward-compat constraint, and this
matches how other component libraries — MUI, Chakra — name things): `Image`, `Link`, `List`,
`Table`, `Select` are common names consumers may already have in scope from other libraries;
that's resolved by the consumer aliasing on import (`import { Button as CxButton } from ...}`),
not by us keeping a prefix.

## Phase 2 — Styling migration: Sass + chassis-css tokens

- [ ] Read `../chassis-css/scss/_datepicker.scss` (and any other partial that overlaps the
  calendar/datepicker family) before touching `.css` → `.scss` — reconcile rather than
  reimplement; if chassis-css already covers part of what `CalendarMonthGrid`/`DateField`
  currently hand-roll, delete the duplicated CSS instead of tokenizing it.
- [ ] Convert `Calendar.css` / `RangeCalendar.css` / `DatePicker.css` / `DateRangePicker.css`
  (post Phase-1 names) to `.scss`, replacing hardcoded colors/spacing/radii with chassis-css
  tokens, functions, and mixins via `@use`.
- [ ] Confirm build output is unchanged in substance (visual diff / snapshot check) after the
  conversion — this phase should not change rendered output, only the source of the values.
- [ ] Audit every other component's `classnames(...)` call list against the current
  `@chassis-ui/css` class API (the framework has moved since some of these components were
  written) — flag any component relying on a chassis-css class that's been renamed/removed
  upstream, and any component that's accumulated inline styles or ad hoc CSS that should instead
  be a chassis-css class or a new scoped `.scss` partial.
- [ ] Commit per component-family touched (calendar/datepicker first since it's the concrete
  case; a second commit only if the classnames audit finds other components needing changes).

## Phase 3 — Architecture: hooks/utils consolidation, compound API

- [ ] Audit `autocomplete`, `combobox`, `chip-input`, `otp-input`, `password-strength` (the
  components not already built on `react-aria`/`react-stately`) for inline state logic that
  should move to a dedicated `use<Component>` hook, matching the headless pattern the
  react-aria-backed components already follow.
- [ ] During that audit, extract genuinely shared logic (controlled/uncontrolled value handling,
  id generation, etc.) into `src/hooks`/`src/utils` instead of leaving it duplicated per
  component — only extract what's actually duplicated, not speculative.
- [ ] Apply the Phase 0 compound-API decision if it was "namespaced" — e.g. `Accordion.Item`
  alongside or instead of `AccordionItem`. Skip this step entirely if Phase 0 decided flat
  exports are fine; don't do it "because it's possible."
- [ ] Commit per component family touched.

## Phase 4 — Enterprise hardening

- [ ] Accessibility: extend `jest-axe` assertions to any component test still missing them
  (`AGENTS.md` says "where practical" today — tighten to "every interactive component" and
  document any deliberate exceptions).
- [ ] Visual regression: evaluate adding screenshot testing (Playwright component tests or
  Chromatic) for at minimum the calendar/datepicker family, since Phase 2 touches their CSS
  output directly and snapshot tests alone don't catch visual regressions.
- [ ] TypeScript strictness audit: check for remaining `any`, consider
  `noUncheckedIndexedAccess`; this is a good moment since Phase 1 already touches every type
  name.
- [ ] Bundle size: `@chassis-ui/css` already has `.bundlewatch.config.json` — evaluate mirroring
  that for `@chassis-ui/react`; revisit `"sideEffects": true` in `packages/react/package.json`
  now that per-component structure is settled (Phase 0's barrel decision) to see if
  tree-shaking can be tightened.
- [ ] CI: `.github/workflows/ci.yml` currently only runs `pnpm test`. Add `pnpm lint`,
  `pnpm build`, and the site's `astro check` as required CI steps (per `AGENTS.md`, these are
  today only run locally "before relying on them being caught automatically" — close that gap).
- [ ] Commit per item, not as one giant "hardening" commit.

## Phase 5 — Docs & final verification

- [ ] Full sweep: `pnpm test`, `pnpm lint`, `pnpm build`, `pnpm site:build` (includes
  `api:generate` + `astro check` + `astro build`) all green from a clean install.
- [ ] Re-read `AGENTS.md`, `packages/react/AGENTS.md`, `packages/site/AGENTS.md`,
  `packages/react/FORMS.md`, `README.md` end to end — confirm nothing still describes the old
  `Cx*` naming or the pre-Sass styling story.
- [ ] Commit: `chore(react): migration complete — final verification pass`.
