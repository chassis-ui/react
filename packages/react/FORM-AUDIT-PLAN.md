# Form component family audit — fix plan

Tracks remediation of the findings from the 2026-08-27 senior-level review of the form component
family: `checkbox/`, `radio/`, `switch/`, `text-input/`, `textarea/`, `select/`, `range-input/`,
`file-input/`, `color-input/`, `combobox/`, `datepicker/`, `chip-input/`, `otp-input/`, `form/`,
`form-field/`, `floating-input/`, `input-adorn/`, `input-group/` — checked against this package's
own [`FORMS.md`](FORMS.md)/`CONVENTIONS.md` rather than generic style preference. `FORMS.md` is
the primary reference throughout; read it first if you haven't. This is a narrower, family-scoped
follow-up to the earlier whole-library `AUDIT-PLAN.md` (both of that plan's passes are closed —
see memory/`project_component_audit_plan.md` if working from a fresh session).

## How to work this plan (read this every session)

- **One phase per session/commit**, same as the prior audit. Do not start the next phase in the
  same turn you finish one.
- After finishing a phase: run `pnpm test` and `pnpm lint:eslint` (scoped to the touched files is
  fine mid-phase, but run the full package suite before committing — a shared-engine change can
  break a sibling component's snapshot). Run `pnpm react:build && pnpm react:check:api:update`
  too if the phase touched exported props/types, and commit the resulting `api-report.md` diff
  alongside the code change. Check off every item in the phase below, commit with a message
  referencing the phase number (e.g. `fix(react): form-audit phase 2 — shared validation/size
  classnames`), then **stop and wait for the user's go-ahead before starting the next phase.**
  Do not ask "should I continue?" and proceed anyway — actually stop.
- **Resuming in a new session/context window:** read this file top to bottom first. The first
  phase with any unchecked box is the current phase. Do not re-do checked phases; do not skip
  ahead of the first unchecked one without the user explicitly asking to reorder.
- Each item lists the file(s)/line-area it targets so a future session can jump straight there
  without re-deriving the reasoning — the "why" is spelled out inline too, since that's the part
  that doesn't survive a re-read of the diff alone.
- If a fix reveals the finding was wrong or already fixed, check the box anyway and note that in
  the commit message — don't leave it dangling because "nothing to do."
- Every phase that changes behavior adds/updates a test for that behavior in the same commit.

---

## Phase 1 — Stray ARIA attributes on `ChipInput`/`Combobox` wrapper divs ✅ (done this session)

**Why this was first:** isolated, two files, no shared-engine changes, and it's a real
correctness bug (not just style) — safe to land immediately.

- [x] **BUG-F01** `chip-input/ChipInput.tsx`, `combobox/Combobox.tsx` — both components declare
  `'aria-label'`/`'aria-labelledby'` (and use `'aria-describedby'` via `HTMLAttributes`) as their
  own props, but never destructured them out of the props object before spreading `{...rest}`
  onto the outer `.form-input` wrapper `<div>`. The *raw, un-merged* caller-supplied values landed
  duplicated on that div — which isn't the real accessible-name/-description target (the inner
  ghost/combobox input is, and it correctly received the *merged* `describedBy`/`labelledBy` from
  `useFormField` via the react-aria hook) — while `DatePicker`/`DateRangePicker`/`OtpInput` already
  avoid this by either destructuring these keys or explicitly re-applying the merged values after
  `mergeProps(hookProps, rest)`, per `FORMS.md` gotcha #4. Fixed by destructuring `'aria-label'`/
  `'aria-labelledby'`/`'aria-describedby'` out of the props in both components and routing every
  existing `rest['aria-*']` read through the new locals instead — no behavior change to the real
  accessible target, only removes the redundant/stale copy on the wrapper. Added a regression test
  to each spec file (`field wrapping` describe block) asserting the wrapper carries neither
  attribute while the real input still gets the correctly-merged values; both new tests were
  confirmed to fail against the pre-fix code before the source change landed.

---

## Phase 2 — DRY cleanup: reuse `validationClassName`/`size` instead of reinventing them ✅ (done)

Three call sites rebuild, by hand, exactly what the shared `utils/validationClassName.ts` helper
and a plain `size` passthrough already do elsewhere in the same family. Pure refactor — output-
identical `classNames(...)` results, so this should not need any snapshot updates; if it does,
that's a sign the object shape wasn't actually equivalent and needs a closer look before
committing.

- [x] **CLEANUP-F02** `chip-input/ChipInput.tsx` (~line 300), `combobox/Combobox.tsx` (~line 340),
  `datepicker/renderDatePickerShell.tsx` (~line 76) — each inlines its own
  `{ 'is-invalid': invalid, 'is-valid': valid }` object instead of calling
  `validationClassName(invalid, valid)`, the exact helper `TextInput`/`Select`/`RangeInput`/
  `FileInput`/`ColorInput`/`OtpInput` already import for this. Replaced the inline object with the
  helper call at all three sites.
- [x] **CLEANUP-F03** Same three call sites — each also expanded `size` into
  `{ small: size === 'small', large: size === 'large' }` before handing it to `classNames(...)`,
  where `TextInput`/`Select` just pass the `size` string straight through (`classNames('form-input',
  size, ...)`), relying on the prop's own `'small' | 'large' | undefined` type to make the two
  forms produce an identical class list. Simplified all three to the direct passthrough, in the
  same commit as CLEANUP-F02 since it's the same three call sites and the same "stop reinventing
  what's already correct nearby" reasoning.
- [x] Confirmed no snapshot in `chip-input`/`combobox`/`datepicker` test dirs changed as a result
  (ran both the three affected test dirs and the full 1645-test suite) — the object shapes were
  truly equivalent, as expected.

---

## Phase 3 — `ColorInput` size-prop parity (investigate, then decide) ✅ (done — prop added)

- [x] **DECIDE-F04** `color-input/ColorInput.tsx` — every other native-input leaf in the family
  (`TextInput`, `Select`, `FileInput`, `RangeInput` — via `.form-range`, styled separately) exposes
  a `size?: 'small' | 'large'` prop; `ColorInput` didn't. Traced the sibling `chassis-css` repo's
  compiled output (not just the Sass source — the first pass through the Sass placeholders alone
  looked like `[type="color"]`'s `width`/`height: var(--min-height)` might be size-invariant, since
  `%form-size-small`/`%form-size-large` don't touch `--min-height` directly; the compiled CSS
  showed the real chain: `--cx-min-height`'s *default* is
  `calc(var(--cx-line-height) + var(--cx-padding-y) * 2)`, and `.small.form-input`/
  `.large.form-input` *do* override `--cx-input-line-height`/`--cx-input-padding-y`, which feed
  that calc()). Confirmed `.form-input[type=color]` genuinely resizes with `.small`/`.large` — this
  was a real feature-parity gap, not an intentional omission. Added `size?: 'small' | 'large'` to
  `ColorInputProps` and wired it into the className builder exactly like `FileInput` does, folded a
  `size="large"` assertion into the existing "applies invalid/valid classes" test (renamed to
  "applies size, invalid/valid classes..."), added a `SizingExample.tsx` +
  `content/components/color-input.mdx` "Sizing" section mirroring `FileInput`'s.
- [x] Ran `pnpm react:generate`, `pnpm react:build`, and `pnpm react:check:api:update`; committed
  the `api-report.md`/`content/api/ColorInput.json` diffs alongside the code change. The
  `api-report.md` update also caught up two lines of drift left over from Phase 1 (`ChipInput`/
  `Combobox`'s exported function signatures literally include their destructured parameter names
  in the bundled `.d.ts`, so renaming `rest['aria-*']` reads to real destructured locals in Phase 1
  *did* technically change the public surface snapshot, even though `ChipInputProps`/
  `ComboboxProps` themselves didn't change — missed at the time since Phase 1 didn't touch a prop
  type. Rolled into this commit rather than a separate one since it's a one-line-per-component,
  self-evident catch-up.)

---

## Phase 4 — `label` prop typing consistency across the family ✅ (done)

- [x] **DECIDE-F05** `checkbox/Checkbox.tsx`, `radio/Radio.tsx`, `switch/Switch.tsx` type `label`
  as `string | ReactNode` (a redundant union — `ReactNode` already includes `string`), while every
  `renderFormField`-based component in the family (`TextInput`, `Select`, etc.) types it as plain
  `ReactNode`. Checked `packages/site/content/api/Checkbox.json` vs. `TextInput.json` after a build:
  `react-docgen-typescript` already collapses `string | ReactNode` down to the same `{"name":
  "ReactNode"}` type entry as the plain-`ReactNode` components — the wider union wasn't buying
  anything in the generated docs table. Standardized all three (plus `Switch.tsx`'s two internal
  helper-prop re-declarations, `RenderSwitchOptions`/`RenderSwitchInputOptions`, which mirrored the
  same redundant union) on plain `ReactNode` to match the rest of the family. Confirmed via
  `pnpm react:generate` that the generated `content/api/*.json` for all three components is
  byte-identical before/after — pure internal type cleanup, zero docs-facing change.
- [x] Sweep in any other minor JSDoc/type inconsistencies noticed while executing Phases 1-3 — none
  were flagged during those phases (checked back through Phase 1-3's write-ups above), so nothing
  to carry forward here.
- [x] Ran `pnpm react:build && pnpm react:check:api:update`; committed the `api-report.md` diff
  alongside the code change (three `string | ReactNode` → `ReactNode` lines in the bundled
  `dist/index.d.ts` snapshot).

---

## Phase 5 — Test-coverage audit against `FORMS.md`'s documented gotchas ✅ (done)

The broadest, most exploratory phase — save for last once the shared-engine code itself is settled
from Phases 1-4, so this phase is testing the final shape rather than a moving target.

- [x] **AUDIT-F06** For each of the 5 components in `FORMS.md`'s "Gotchas found the hard way"
  section (`TextInput`, `Textarea`, `Combobox`, `ChipInput`, `DatePicker`), confirmed its spec file
  has a test that would actually fail if that specific gotcha regressed — not just a smoke test
  that the component renders, using the write-test/temporarily-revert-fix/confirm-red/restore
  technique from Phase 1's gotcha #4 test throughout. Findings per component:
  - `DatePicker` (gotcha #4, merged `labelledBy` reverted by a raw `rest` spread) — **already
    adequately covered** by the existing "merges label association with a consumer-supplied
    aria-labelledby instead of dropping it" test (`DatePicker.spec.tsx`); confirmed red when the
    `'aria-labelledby': labelledBy` re-application after `mergeProps(groupProps, rest)` was
    temporarily removed. The sibling multi-date-selection code path in the same file
    (`mergeProps(rest)`, no `groupProps` hook object) isn't exposed to this bug's mechanism at all
    (no hook-props object being spread that could carry a stale raw key), so it needed no test.
  - `Combobox` (gotcha #3, `useComboBox` doesn't accept `isInvalid` so `aria-invalid`/
    `aria-describedby` must be wired manually) — **already adequately covered** by the existing
    "renders invalid feedback and wires it into aria-describedby, and sets aria-invalid..." test;
    confirmed red when the manual `aria-invalid={invalid || undefined}` prop was temporarily
    removed.
  - `ChipInput` (gotcha #2, the `'Add value'` fallback `aria-label` must stop applying once `label`
    is set) — **already adequately covered** by the existing "wraps in .form-field and associates
    the label via htmlFor when label is set" test; confirmed red when the fallback condition's
    `|| label` was temporarily dropped (the accessible name silently reverted to "Add value",
    failing the `getByRole(..., { name: 'Skills' })` query).
  - `TextInput`, `Textarea`, `Combobox`, `ChipInput` (gotcha #5, react-aria's own "no accessible
    label" dev warning doesn't see an external `<label for>`, so `labelledBy` must be threaded into
    the hook's own `aria-labelledby`) — **real gap, no coverage existed** (no spec file in the
    family spied on `console.warn`/`console.error` at all). Added one
    `vi.spyOn(console, 'warn')`-based test per component (in each `field wrapping` describe block)
    asserting the warning is not called when only `label` is set; confirmed each goes red when that
    component's `'aria-labelledby': labelledBy` wiring into its `useTextField`/`useComboBox` call is
    temporarily removed, then restored.
- [x] Spot-checked `Select`'s click-proxy skip conditions (disabled, multiple, `htmlSize > 1`, click
  landing on the select itself, click landing on a nested actionable adorn) — **already thoroughly
  covered**, one dedicated test per skip condition plus the positive "adorn click opens it" case, in
  the `proxy-open behavior` describe block of `Select.spec.tsx`. No gap, no changes needed.
- [x] Spot-checked `OtpInput`'s paste/backspace/delete edge cases. The happy paths (full-code paste,
  mid-string backspace-on-empty, mid-string delete-shift) were already covered, but the boundary
  conditions weren't: **real gaps found and fixed** — added 4 tests to `OtpInput.spec.tsx`: Delete on
  the last box (loop-bounds safety around the `i + 1` read the source comment calls out), Backspace
  on the first box (the `index > 0` guard), and paste-is-a-no-op both when `disabled` and when the
  clipboard content has no digits. All 4 confirmed red against a temporarily-reverted guard, then
  restored.
- [x] Ran `pnpm test` after every addition; final full-suite run: 1653 tests passing (up from 1645 at
  the end of Phase 4 — 8 new regression tests net-added, all confirmed to actually pin behavior via
  the red/green technique above, not just padding the count), coverage held (97.4%/93.02%/98.25%/
  98.92% statements/branches/functions/lines, all above the enforced thresholds).

---

## Findings investigated and ruled out (recorded so a future pass doesn't re-flag them)

- `OtpInput`'s wrapper `<div class="form-otp">` doesn't get a `disabled` class the way `ChipInput`/
  `Combobox`/`DatePicker`'s wrappers do — looked like a missing-class bug, but `.form-otp` doesn't
  `@extend %form-input` in chassis-css (it only sets custom properties/layout), so it was never
  subject to the shared disabled-cascade rule in the first place. Each `OtpBox`'s own `<input
  class="form-input">` carries native `:disabled` styling correctly on its own. Not a bug.
  Restrict `renderDatePickerShell`'s `disabled` bit at Phase 2's classnames refactor is real (that
  wrapper's `.form-input` *does* extend the shared placeholder, and needs it) — the OTP case is the
  outlier and is correctly outlier-shaped, not a candidate to "fix" for consistency.
- `Combobox`'s wrapper `.form-input.combobox` adding a `disabled` class looked possibly redundant
  since chassis-css's shared `%form-input` placeholder already cascades disabled styling from a
  disabled *direct child* via `:has(> :disabled)`, and the combobox's real `<input>` is a direct
  child. Left as-is (Phase 2 only removes the `small`/`large` boolean-object duplication, not the
  `disabled` key) — redundant-but-harmless belt-and-suspenders, consistent with `ChipInput`'s
  identical pattern (which chassis-css's `_chip-input.scss` *does* key an `&.disabled` rule off
  directly, not just via `:has()`), not worth special-casing one over the other.
- Radio's `useRadio(...)` call doesn't pass `isInvalid` the way `Checkbox`'s `useCheckbox`/
  `useCheckboxGroupItem` calls do, and no explicit `aria-invalid` is set on the rendered `<input>`
  either — looked like a missing wire-up at first glance. `FORMS.md` already documents why `Radio`
  has no per-item `invalid`/`valid` props at all (a lone radio's validity isn't independently
  meaningful, unlike a lone checkbox): its invalid state is always exactly `groupState.isInvalid`,
  never overridden per-item, and `useRadio` receives that `groupState` directly — unlike
  `useCheckboxGroupItem`, which needs the item's own (possibly-overridden) `isInvalid` passed
  explicitly because a checkbox item's invalid state *can* differ from the group's. Not a bug.
