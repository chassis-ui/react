# Component library audit — fix plan

Tracks remediation of the findings from the 2026-08-26 senior-level review of all 51
`packages/react/src/components/**` folders (checked against this package's own `CONVENTIONS.md`/
`FORMS.md`/`THEMING.md` rather than generic style preference). Findings are grouped into phases
by shared risk/blast-radius, not by severity alone, so each phase is one coherent, independently
shippable commit.

## How to work this plan (read this every session)

- **One phase per session/commit.** Do not start the next phase in the same turn you finish one.
- After finishing a phase: run `pnpm lint` and `pnpm test` (and `pnpm react:build && pnpm
  react:report` if the phase touched exported props/types — see root `AGENTS.md`), check off every
  item in that phase below, commit with a message referencing the phase number
  (e.g. `fix(react): phase 3 — popover/modal dismissal correctness`), then **stop and wait for the
  user's go-ahead before starting the next phase.** Do not ask "should I continue?" as a rhetorical
  flourish and proceed anyway — actually stop.
- **Resuming in a new session/context window:** read this file top to bottom first. The first
  phase with any unchecked box is the current phase. Do not re-do checked phases; do not skip
  ahead of the first unchecked one without the user explicitly asking to reorder.
- Each phase lists the finding IDs it closes (matching the published audit artifact) so a future
  session can cross-reference the original reasoning without re-deriving it.
- If a fix reveals the finding was wrong or already fixed, check the box anyway and note that in
  the commit message — don't leave it dangling because "nothing to do."
- Every phase that changes behavior adds/updates a test for that behavior in the same commit —
  don't defer test-writing to Phase 8 for anything with a dedicated phase below. Phase 8 is only
  for coverage gaps that aren't attached to any specific fix.

---

## Phase 1 — Isolated quick fixes (no shared-engine changes)

Independent, one-file, low-risk bugs plus trivial cleanup. Safe to land as a single commit.

- [x] **BUG-01** `select/Select.tsx:235` — default-value computation uses a truthy check
  (`option.value &&`), silently drops `value: 0`. Use the same `?? ''`-style nullish check the
  render path already uses a few lines below.
- [x] **BUG-02** `select/Select.tsx:23,239` — `SelectOptionDef.label`'s doc comment promises a
  fallback to the stringified value when omitted; no such fallback exists and an object option
  without `label` renders blank. Either implement `option.label ?? String(option.value ?? '')` or
  correct the doc comment (it ships verbatim into the generated API docs — check which one is the
  actually-intended behavior before picking). Implemented the fallback (matches the doc).
- [x] **BUG-06** `range-input/RangeInput.tsx:65` — `value` type wrongly includes `string[]`,
  copy-pasted from `Select`'s legitimately-array multi-select value. Narrow to `string | number`.
- [x] **BUG-10** `avatar/Avatar.tsx:82` — `tag = component ?? (href ? 'a' : 'button')` makes every
  plain, non-interactive `<Avatar>` a focusable button by default. Default to `'span'` when neither
  `href` nor `component` is set; keep `'a'`/explicit `component` as the opt-in for interactive
  avatars. Check `AvatarStack`'s generated items inherit the corrected default. Update the snapshot
  in `Avatar.spec.tsx` that currently asserts `getByRole('button')` for the bare case.
  `AvatarStack` needed no source change (it just spreads item props into `Avatar`); its own tests/
  snapshot were updated for the new default too.
- [x] **BUG-13** `nav/NavItem.tsx:6-16` — `rest` (onClick/id/data-*/aria-*) is only forwarded inside
  the `if (rest.href || rest.to)` branch; add a plain-`<li>` branch that still spreads `rest`.
- [x] **BUG-14** `carousel/context.ts:21` — context defaults to `{}` instead of a throwing accessor.
  Mirror `tabs/context.ts:18-24`'s pattern so a `Carousel*` sub-part rendered outside `<Carousel>`
  fails with a clear error instead of an opaque "not a function." Added `useCarouselContext()` and
  switched all 5 sub-parts (`CarouselControlNext/Prev`, `CarouselInner`, `CarouselPlayPause`,
  `CarouselIndicators`) to it.
- [x] **CLEANUP** `packages/site/content/api/AccordionCollapse.json`,
  `packages/site/content/api/AccordionButton.json` — stale `pnpm react:generate` output referencing
  deleted `.tsx` files. Delete both.
- [x] **CLEANUP** `tsdown.config.ts:20-23` — comment claims the CSS custom-property prefix plugin
  has "nothing to rewrite" since sources namespace by hand; `Calendar.scss`/`RangeCalendar.scss`
  actually rely on the plugin (bare `var(--primary)`) while `DatePicker.scss`/
  `DateRangePicker.scss` prefix by hand (`var(--cx-primary)`). Fix the comment to describe the real
  (inconsistent-but-working) split so the next editor isn't misled. Do not change the Sass itself
  in this phase — that's a bigger, separate call.
- [x] **DECIDE** `password-strength/PasswordStrength.tsx:99-105` — `onStrengthChange` doesn't fire
  for the initial mount value. Confirm with the user (or docs precedent) whether that's intentional;
  either document it explicitly in the prop's JSDoc or fire it on mount. Add a test either way so
  the behavior is pinned. Decided: fire on mount too (no docs precedent found either way; a
  consumer gating e.g. a submit button on strength needs the true initial state, not just
  subsequent changes) — updated the JSDoc and the ref-init so the mount-time value isn't skipped.

---

## Phase 2 — Form validation-state & toggle-control consistency

Touches the shared `renderFormCheck` helper and `Switch`'s hand-inlined copy of it — same family,
one coherent review pass.

- [ ] **BUG-04** `switch/Switch.tsx:139-150` — unlabeled `Switch` always wraps in an empty
  `<label class="form-check form-switch">`; `renderFormCheck` returns a bare
  `<span class="check-input">` in the equivalent case. Align `Switch`'s markup to match (render the
  bare span shape when there's no `label`). Update `Switch.spec.tsx`'s snapshot for the unlabeled
  case.
- [ ] **BUG-05** `form/renderFormCheck.tsx:52-68` — the `button`-variant wrapper className never
  incorporates `invalid`/`valid`, so a button-styled checkbox/radio has no visible invalid
  indication (only the hidden native input gets the class). Fold `invalid`/`valid` into the
  button-branch className builder, respecting the documented base→size→validation→caller-className
  order from `CONVENTIONS.md`. Add a test rendering `<Checkbox button={{...}} invalid />` and
  asserting the visible class.
- [ ] **BUG-03** `otp-input/OtpInput.tsx` (~line 309), `otp-input/OtpBox.tsx:53` — `is-invalid`/
  `is-valid` land only on the outer `.form-otp` wrapper; forward them into each `OtpBox`'s own
  className too, since chassis-css has no descendant rule bridging the two. Add a test asserting
  each digit box carries the class when the group is invalid.
- [ ] **REFACTOR** `switch/Switch.tsx:87-117` — the `type="radio"` path hand-builds props and
  bypasses react-aria, while `useToggleState`/`useSwitch` are still called unconditionally with an
  unused result (risk of a misleading "controlled without onChange" dev warning). Either wire the
  hook's result through properly for this branch or restructure so the unused call doesn't happen.
- [ ] **DECIDE + FIX** `checkbox/Checkbox.tsx` vs `radio/RadioGroup.tsx` — `CheckboxGroup`'s
  `invalid` doesn't cascade to child items' `aria-invalid`/class, unlike `RadioGroup`. Decide
  whether this asymmetry is intentional (FORMS.md notes a lone checkbox's validity is meaningful on
  its own, unlike a lone radio); if not intentional, cascade it the same way `RadioGroup` does and
  add the equivalent test coverage `RadioGroup.spec.tsx` already has. If intentional, add a one-line
  comment in `CheckboxGroup.tsx` saying so, so the next reviewer doesn't re-flag it.

Run `pnpm test:visual` if any of the above changed the DOM shape of a component covered by
`accordion-collapse.visual.spec.ts` or similar — check whether Switch/Checkbox have Storybook
visual coverage before assuming a plain `pnpm test` is sufficient.

---

## Phase 3 — Overlay dismissal & modal backdrop correctness

Higher-risk, interaction-heavy — isolate for careful manual + automated testing.

- [ ] **BUG-07 / A11Y-03** `popover/Popover.tsx` — no Escape-key or outside-click dismissal at all.
  Bring to parity with `menu/Menu.tsx:262-324`'s existing implementation of both. Add
  `Popover.spec.tsx` tests for Escape-to-close and outside-click-to-close.
- [ ] **BUG-08** `modal/Modal.tsx:234,243-257` — `backdrop={false}` is a no-op; neither the
  backdrop-click handler nor the className builder branches on it. Compare
  `drawer/Drawer.tsx:190`'s correct handling of the same-named prop
  (`isModal = Boolean(backdrop) || !scroll`) and mirror the intent for Modal. Add the equivalent
  test `Drawer.spec.tsx:91` already has.
- [ ] **REFACTOR** `popover/Popover.tsx:17` — imports `Placement` from `../tooltip/Tooltip` instead
  of the canonical `../../utils/overlayPlacement.ts` that `Menu`/`Tooltip` both import from
  directly. Fix the import while touching this file for BUG-07 anyway.

Manually verify in a live preview (Popover and Modal stories in Storybook, or the docs site) before
committing — these are exactly the components `pnpm test:visual`'s `menu-popover-tooltip` batch
screenshots, so re-run `pnpm test:visual` and check whether new interaction states need baseline
screenshots (they likely don't, since dismissal doesn't change static appearance, but confirm).

---

## Phase 4 — Toast/Notification entrance-transition fix

Transition-timing-sensitive; has its own visual-regression batch (`toast-notification.visual.spec.ts`).

- [ ] **BUG-09** `toast/Toaster.tsx`, `notification/NotificationStack.tsx`, `toast/Toast.tsx`,
  `notification/Notification.tsx` — queued items mount with `in=true` from their first render, so
  react-transition-group's `Transition` skips the enter animation (only special-cased via `appear`,
  which neither component sets). Set `appear` on the `Transition`/`CSSTransition` in both `Toast`
  and `Notification`. Add a test exercising the always-`visible` queue-mount path specifically (the
  existing tests only cover the `visible={false}→true` rerender path) — assert the entering class is
  present on first mount, not just on a later prop flip.
- [ ] Run `pnpm test:visual` for the `toast-notification` batch; regenerate Linux baselines via the
  Playwright Docker image (see root `AGENTS.md`'s visual-regression section) if the entrance frame
  capture shifts.

---

## Phase 5 — List / Stepper / Nav invalid-markup fixes

Same root pattern (an `items`-driven auto-content path duplicating the sub-component's own
markup instead of delegating to it) across three components — fix together, and note the shared
duplication for Phase 7 to actually resolve.

- [ ] **BUG-11** `list/List.tsx:105-126`, `list/ListItem.tsx:53` — `items`+`href` shorthand renders
  a bare `<a>` as a direct child of the default `<ul>` root (invalid; only `<li>`/`script`/
  `template` are permitted children), and `ListItem`'s own root swaps to `<a>` instead of wrapping
  one inside `<li>`. Fix both to always render an `<li>` wrapper around the link.
- [ ] **BUG-12** `stepper/Stepper.tsx:93-104` — `items` path renders linked steps as a bare `<a>`
  sibling to the surrounding `<li>` steps inside the `<ol>`. Fix to nest the anchor inside an `<li>`,
  matching `nav/Nav.tsx:62-70`'s correct pattern for the equivalent case.
- [ ] Add the missing axe assertions that would have caught these: `List.spec.tsx`/
  `ListItem.spec.tsx` need a test rendering the `items`+`href` shorthand (and a `ListItem`
  actually nested in a `<ul>`), and `Stepper.spec.tsx` needs one rendering the `items` variant, not
  just manual `StepperItem` children.

---

## Phase 6 — Calendar/DatePicker accessibility

Isolated, complex family with its own component-scoped CSS and its own visual-regression batch
(`calendar-datepicker.visual.spec.ts`) — keep separate from everything else.

- [ ] **A11Y-01** `calendar/`, `datepicker/` — no `aria-live` region anywhere in either folder
  announcing the visible month/year when it changes via paging or the month/year picker. Add a
  visually-hidden `aria-live="polite"` announcer, following react-aria's documented calendar
  pattern.
- [ ] **A11Y-02** `CalendarMonthGrid.tsx:51-79`, `CalendarYearGrid.tsx:92-113` — marked
  `role="listbox"`/`role="option"` without the roving-tabindex/arrow-key behavior that role implies.
  Add proper listbox keyboard navigation (roving `tabIndex`, arrow-key handling) or drop the
  listbox/option roles if a simpler pattern (e.g. a plain button grid with `aria-current`) is a
  better fit — decide which before implementing, since retrofitting real listbox semantics onto an
  existing button grid is nontrivial.
- [ ] Add the calendar test-coverage gaps identified in the audit while in this file anyway:
  keyboard paging across a month boundary, a single-day range (same date clicked twice), and an
  unavailable date falling strictly between a selected start/end.
- [ ] Re-run `pnpm test:visual` for the `calendar-datepicker` batch and regenerate baselines if the
  new announcer or grid markup changes any screenshot (a visually-hidden announcer shouldn't, but
  confirm).

---

## Phase 7 — Structural refactors (shared code, no behavior change)

Bigger, optional, no urgent bug attached — do this only once Phases 1–6 are settled, and consider
splitting into 7a/7b/7c sub-commits rather than one large diff. Get explicit user sign-off on scope
before starting, since "extract a shared hook" can balloon in review size.

- [ ] **7a** Extract the button-semantics block duplicated in `link/Link.tsx:99-109`,
  `button/Button.tsx:125-135`, `close-button/CloseButton.tsx:123-133` (ref setup + `useForkedRef` +
  `useButton` call) into a shared hook in `src/hooks/`.
- [ ] **7b** Extract the ~150-200 duplicated lines of dialog machinery in `modal/Modal.tsx` and
  `drawer/Drawer.tsx` (forked ref, show/hide effects, static-bounce handling, non-modal Escape
  handling) into a shared `useDialogElement`-style hook.
- [ ] **7c** Extract the duplicated `.form-input` adorn-wrapper shell and popover-overlay shell
  repeated three times across `datepicker/DatePicker.tsx` (×2 variants) and
  `datepicker/DateRangePicker.tsx` into a shared internal render helper.
- [ ] **7d** Extract the spacing-class guard (`typeof x === 'string' || 'number' ? ... : null`)
  duplicated in `flex/Flex.tsx:77-81`, `stack/Stack.tsx:52`, `grid/Row.tsx:49-51`,
  `card/CardBody.tsx:41` into one shared helper alongside `utils/breakpoints.ts`.
- [ ] **7e** Memoize `combobox/Combobox.tsx:217-233`'s entry-building/disabled-key computation
  (currently re-runs every render including every keystroke) with `useMemo` keyed on
  `children`/`items`.
- [ ] **7f** Dedupe `chip-input/ChipInput.tsx:15,157-192`'s three independent `buildTagIds`
  recomputations down to the one already-memoized array.
- [ ] **NOT IN SCOPE (document only)** Layout-primitive naming divergence (`row`/`column` vs
  `horizontal`/`vertical`; `gap` vs `gutter`) across `Flex`/`Stack`/`Row` — this is a public-API
  naming question, not a refactor a session should do unilaterally. Leave a short note in
  `CONVENTIONS.md` or `FORMS.md`-equivalent doc explaining the split is intentional (CSS gap vs.
  Bootstrap-style grid gutters are genuinely different mechanisms) rather than silently
  unreconciled, and stop there unless the user asks for an actual rename (which would be breaking).

---

## Phase 8 — Remaining test-coverage backfill

Only the gaps not already covered by a fix above.

- [ ] `text-input/`, `textarea/`, `range-input/` — existing jest-axe assertions only render the
  emptiest state; add at least one per component exercising the realistic composed state
  (`label`+`help`+`invalidFeedback`, plus adorns for `TextInput`) per `AGENTS.md`'s own explicit
  rule against bare-shell-only axe checks.
- [ ] `input-group/InputGroupAddon.spec.tsx` — add a runtime assertion that `htmlFor` actually
  renders the attribute (currently type-only coverage).
- [ ] `input-group/` — add one composed test: `InputGroup` + `InputGroupAddon` (as `component="label"`)
  + a real input with a matching `id`, asserting the accessible name resolves.
- [ ] `hooks/useFormField.ts` — add a dedicated unit test for the id-generation/`describedBy`/
  `labelledBy` merge logic, independent of any one consumer.
- [ ] `checkbox/Checkbox.spec.tsx`, `checkbox/CheckboxGroup.spec.tsx` — add `disabled` assertions
  (item-level and group-level), matching what `Radio.spec.tsx`/`RadioGroup.spec.tsx` already do.
- [ ] `carousel/Carousel.spec.tsx` — add an unmount-during-autoplay test asserting the pending timer
  is cleared and no `act()` warning leaks.
- [ ] `combobox/Combobox.spec.tsx` — add a pure-keyboard option-selection test (ArrowDown + Enter).

---

## Findings intentionally not actioned

- Carousel autoplay not pausing on generic focus-within (only hover/pointerdown/arrow-keydown) —
  already meets the WCAG 2.2.2 minimum via `CarouselPlayPause`; polish only, no phase assigned
  unless the user asks for it later.
- Assorted naming/typing nitpicks from the underlying review (redundant `string | ReactNode` label
  types, `component?: string | ElementType` redundancy, repeated `as X` casts bridging native props
  into react-aria option shapes) — noted in the original review, not worth a phase on their own.
