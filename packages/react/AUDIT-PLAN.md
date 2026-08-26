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

- [x] **BUG-04** `switch/Switch.tsx:139-150` — unlabeled `Switch` always wraps in an empty
  `<label class="form-check form-switch">`; `renderFormCheck` returns a bare
  `<span class="check-input">` in the equivalent case. Align `Switch`'s markup to match (render the
  bare span shape when there's no `label`). Update `Switch.spec.tsx`'s snapshot for the unlabeled
  case.
- [x] **BUG-05** `form/renderFormCheck.tsx:52-68` — the `button`-variant wrapper className never
  incorporates `invalid`/`valid`, so a button-styled checkbox/radio has no visible invalid
  indication (only the hidden native input gets the class). Fold `invalid`/`valid` into the
  button-branch className builder, respecting the documented base→size→validation→caller-className
  order from `CONVENTIONS.md`. Add a test rendering `<Checkbox button={{...}} invalid />` and
  asserting the visible class.
- [x] **BUG-03** `otp-input/OtpInput.tsx` (~line 309), `otp-input/OtpBox.tsx:53` — `is-invalid`/
  `is-valid` land only on the outer `.form-otp` wrapper; forward them into each `OtpBox`'s own
  className too, since chassis-css has no descendant rule bridging the two. Add a test asserting
  each digit box carries the class when the group is invalid. Also added `valid` forwarding to
  `OtpBox` (it only had `invalid` before) for the same reason.
- [x] **REFACTOR** `switch/Switch.tsx:87-117` — the `type="radio"` path hand-builds props and
  bypasses react-aria, while `useToggleState`/`useSwitch` are still called unconditionally with an
  unused result (risk of a misleading "controlled without onChange" dev warning). Either wire the
  hook's result through properly for this branch or restructure so the unused call doesn't happen.
  Split `Switch` into internal `SwitchCheckbox`/`SwitchRadio` components (picked by the outer
  `Switch` based on `type`) so the radio path never calls `useToggleState`/`useSwitch` at all,
  instead of calling them unconditionally and discarding the result.
- [x] **DECIDE + FIX** `checkbox/Checkbox.tsx` vs `radio/RadioGroup.tsx` — `CheckboxGroup`'s
  `invalid` doesn't cascade to child items' `aria-invalid`/class, unlike `RadioGroup`. Decide
  whether this asymmetry is intentional (FORMS.md notes a lone checkbox's validity is meaningful on
  its own, unlike a lone radio); if not intentional, cascade it the same way `RadioGroup` does and
  add the equivalent test coverage `RadioGroup.spec.tsx` already has. If intentional, add a one-line
  comment in `CheckboxGroup.tsx` saying so, so the next reviewer doesn't re-flag it. Decided: not
  intentional — a lone checkbox's independently-meaningful validity (why the per-item prop exists)
  doesn't mean the group's own `invalid`/`valid` shouldn't still cascade as a default; cascaded both
  (mirroring `RadioGroupContext`'s `valid` passthrough), with the item's own `invalid`/`valid`
  still winning when explicitly set on that item.

Checked: none of the components touched in this phase (Switch, Checkbox, OtpInput) have Storybook
visual-regression coverage (`test/visual/` only covers calendar-datepicker, menu-popover-tooltip,
toast-notification, accordion-collapse), so `pnpm test:visual` wasn't needed.

---

## Phase 3 — Overlay dismissal & modal backdrop correctness

Higher-risk, interaction-heavy — isolate for careful manual + automated testing.

- [x] **BUG-07 / A11Y-03** `popover/Popover.tsx` — no Escape-key or outside-click dismissal at all.
  Bring to parity with `menu/Menu.tsx:262-324`'s existing implementation of both. Add
  `Popover.spec.tsx` tests for Escape-to-close and outside-click-to-close. Verified live in
  Storybook: Escape closes and refocuses the trigger, an outside click closes it, a click inside
  the panel does not.
- [x] **BUG-08** `modal/Modal.tsx:234,243-257` — `backdrop={false}` is a no-op; neither the
  backdrop-click handler nor the className builder branches on it. Compare
  `drawer/Drawer.tsx:190`'s correct handling of the same-named prop
  (`isModal = Boolean(backdrop) || !scroll`) and mirror the intent for Modal. Add the equivalent
  test `Drawer.spec.tsx:91` already has. **Investigated and closed as not-a-bug** (confirmed with
  the user before proceeding): traced chassis-css's vanilla JS — Drawer's own vanilla class derives
  modality from `backdrop`+`scroll`, but Dialog/Modal's vanilla class does not; its `backdrop`
  config is read only to distinguish `'static'` from everything else, and `modal` alone decides
  `showModal()`/`show()`. The React `Modal.tsx`'s `backdrop={false}` no-op (beyond the `'static'`
  check) already matches vanilla `Dialog` exactly — Drawer and Dialog have genuinely different
  upstream backdrop semantics, not a divergence to reconcile. Added a comment on the `backdrop` prop
  in `Modal.tsx` explaining this, plus a regression test pinning that `backdrop={false}` still
  closes on backdrop click (same as the default) so this isn't silently untested.
- [x] **REFACTOR** `popover/Popover.tsx:17` — imports `Placement` from `../tooltip/Tooltip` instead
  of the canonical `../../utils/overlayPlacement.ts` that `Menu`/`Tooltip` both import from
  directly. Fix the import while touching this file for BUG-07 anyway.

Manually verified in a live preview: Popover's dismissal in Storybook (see above), and Modal's
default backdrop-click-to-close on the live docs site (`pnpm --filter chassis-react-site dev`,
`/react/docs/components/modal`'s Live demo — confirmed via DOM introspection that the dialog closes
after the transition; the Browser pane's screenshot capture has an unrelated rendering quirk with
native `<dialog>` top-layer + `backdrop-filter`, so this was checked via JS rather than pixels).
Ran `pnpm test:visual` for the `menu-popover-tooltip` batch: all stories (including ones this phase
never touched, e.g. `menu/Menu — Closed`) already mismatch the checked-in `-darwin.png` baselines
on a clean `git stash`d tree with the exact same pixel-diff ratios — pre-existing local macOS
baseline drift unrelated to this phase's diff, not something to fix here (see `AGENTS.md`'s own
caveat that Linux baselines, the actual CI gate, need the matching Docker image to regenerate).

---

## Phase 4 — Toast/Notification entrance-transition fix

Transition-timing-sensitive; has its own visual-regression batch (`toast-notification.visual.spec.ts`).

- [x] **BUG-09** `toast/Toaster.tsx`, `notification/NotificationStack.tsx`, `toast/Toast.tsx`,
  `notification/Notification.tsx` — queued items mount with `in=true` from their first render, so
  react-transition-group's `Transition` skips the enter animation (only special-cased via `appear`,
  which neither component sets). Set `appear` on the `Transition`/`CSSTransition` in both `Toast`
  and `Notification`. Add a test exercising the always-`visible` queue-mount path specifically (the
  existing tests only cover the `visible={false}→true` rerender path) — assert the entering class is
  present on first mount, not just on a later prop flip. Added `appear` to both `Transition`s;
  replaced `Toast.spec.tsx`'s test that pinned the old (buggy) "mounts settled, no transition"
  behavior with one asserting `show showing` is present immediately on mount and settles to `show`
  after 250ms, plus a new test confirming `onShow` now fires for a queue-mounted toast (previously
  it never fired on initial mount, only on a later `visible` flip — traced via
  `react-transition-group`'s `Transition.js` source: without `appear`, `performEnter`/`onEnter` are
  never invoked for an already-`in` initial mount at all). Also fixed one incidental snapshot test
  (`applies color, className and the default status role once shown`) that was asserting mid-
  transition markup by coincidence of an unawaited `waitFor` — it now explicitly waits for the
  settled (non-`showing`) state before snapshotting, which is what its own title already claimed.
  **Discovered while fixing `Notification`:** `chassis-css`'s `_notification.scss` has zero CSS
  keyed off `.notification.show`/`.fade` — unlike `Toast`, `Notification.tsx`'s `_className` never
  even applies a `fade` class — so `.show` is currently a no-op class for this component regardless
  of the `appear` fix, and `NotificationProps` has no `onShow`-equivalent callback either. The
  `appear` fix is still correct (matches `Toast`'s parity and react-transition-group's documented
  semantics, and costs nothing), but it has no observable effect yet. Filed as a follow-up rather
  than expanding this phase's scope (would need a `chassis-css` change in the sibling repo plus a
  new `Notification` public prop). Added a regression test (`Notification.spec.tsx`, "show/hide
  transition") pinning that the queue-mount path still reaches the settled state and that dismissing
  mid-transition still fires `onClose`, since that's the part actually verifiable today.
- [x] Run `pnpm test:visual` for the `toast-notification` batch; regenerate Linux baselines via the
  Playwright Docker image (see root `AGENTS.md`'s visual-regression section) if the entrance frame
  capture shifts. Ran locally: 13/14 stories mismatch the checked-in `-darwin.png` baselines, but
  confirmed via `git stash` that the exact same 13 stories fail with identical pixel-diff ratios on
  the clean, unmodified tree — pre-existing local macOS baseline drift (same phenomenon Phase 3
  already hit and documented for the `menu-popover-tooltip` batch), not something this phase's diff
  caused. Left for a future Linux-container baseline regen, per `AGENTS.md`.

---

## Phase 5 — List / Stepper / Nav invalid-markup fixes

Same root pattern (an `items`-driven auto-content path duplicating the sub-component's own
markup instead of delegating to it) across three components — fix together, and note the shared
duplication for Phase 7 to actually resolve.

- [x] **BUG-11** `list/List.tsx:105-126`, `list/ListItem.tsx:53` — `items`+`href` shorthand renders
  a bare `<a>` as a direct child of the default `<ul>` root (invalid; only `<li>`/`script`/
  `template` are permitted children), and `ListItem`'s own root swaps to `<a>` instead of wrapping
  one inside `<li>`. Fix both to always render an `<li>` wrapper around the link.
  **Investigated and implemented differently than prescribed above** (confirmed with the user
  before proceeding): wrapping the anchor in an `<li>` while keeping `.list-item`/`.list-action` on
  the `<a>` would make that class a grandchild, not a direct child, of `.list` — silently breaking
  chassis-css's `.list > .list-item.list-action` selector (and every other direct-child selector:
  first/last-child border-radius, `+ .list-item` border collapsing) for every linked item, since
  `%interactive`'s `:hover`/`:focus-visible`/`:active` must live on the actual `<a>`, not a
  non-focusable wrapper. Also discovered the same invalid-nesting bug already exists — and ships on
  the live docs site today — in the fully-documented **composed** usage
  (`<List><ListItem component="a" href="#">`, used by `LinksExample.tsx`, `ButtonsExample.tsx`,
  `ContextualLinksExample.tsx`, `CustomContentExample.tsx`), not just the `items` shorthand named
  above. Fixed both by having `List` auto-default its own root to `'div'` instead of `'ul'`
  whenever an item/child is interactive (a linked data-driven item, or a `<ListItem
  component="a"|"button">` child) — matching the pattern already documented for `Stepper`'s
  composed interactive usage (`<Stepper component="div">`) — and, for the composed-children path,
  cloning each plain `ListItem` sibling to `component="div"` too (a bare `<li>` inside a `<div>` is
  just as invalid). `component` stays a full caller override. Considered also adding
  `role="list"`/`role="listitem"` to restore the lost `<ul>`/`<li>` semantics, but reverted it after
  it broke the native `link`/`button` role on interactive items (an explicit `role` replaces an
  element's implicit one, so `role="listitem"` on an `<a>` — the WAI-ARIA-correct annotation for a
  role="list" child — silently un-announces it as a link, which several existing tests caught via
  `getByRole('link', ...)` failing); dropped the role work entirely rather than ship that
  regression — same trade-off Bootstrap's own `list-group` (`<div class="list-group"><a
  class="list-group-item list-group-item-action">`, no `role="list"`/`listitem"` either) already
  makes. Updated `list.mdx`'s "Links and buttons" section to document the automatic `<div>` default.
  Filed a follow-up (not fixed here, outside BUG-11's named scope) for a third, separate instance of
  the same invalid-nesting pattern: `ChecksListItemExample.tsx`'s `<List><Checkbox
  className="list-item">` renders a bare `<label>` inside `<ul>`, since `List`'s interactive
  detection only recognizes `ListItem` children, not arbitrary components with a non-`<li>` root.
- [x] **BUG-12** `stepper/Stepper.tsx:93-104` — `items` path renders linked steps as a bare `<a>`
  sibling to the surrounding `<li>` steps inside the `<ol>`. Fix to nest the anchor inside an `<li>`,
  matching `nav/Nav.tsx:62-70`'s correct pattern for the equivalent case. **Implemented with the
  same auto-div-default approach as BUG-11** (same user decision covers both — Stepper has the
  identical conflict: `.stepper-item:not(.active):has(~ .stepper-item.active)`'s progress-line
  styling is a sibling-combinator selector that an `<li>` wrapper would just as surely break).
  `Stepper`'s `items` path and composed `StepperItem` children now both default the root to `'div'`
  when a step is interactive; simplified `packages/site/examples/components/stepper/
  InteractiveExample.tsx` to drop its now-redundant explicit `component="div"` (demonstrating the
  new automatic behavior) and updated `stepper.mdx` accordingly.
- [x] Add the missing axe assertions that would have caught these: `List.spec.tsx`/
  `ListItem.spec.tsx` need a test rendering the `items`+`href` shorthand (and a `ListItem`
  actually nested in a `<ul>`), and `Stepper.spec.tsx` needs one rendering the `items` variant, not
  just manual `StepperItem` children. Added, adapted to the actual fix shape: for both `List` and
  `Stepper`, a data-driven-linked-item test and a composed-interactive-child test each asserting the
  root is `div` (not `ul`/`ol`) with no invalid tag anywhere in the tree, an explicit-`component`
  override test for each, a stays-`ul`/`ol`-when-nothing-is-linked test for each, and axe checks for
  both the data-driven and composed interactive shapes (four new axe assertions total). Verified
  live against the docs site (`pnpm --filter chassis-react-site dev` already running on :4327,
  `/react/docs/components/list` and `/react/docs/components/stepper`): every existing composed
  example (`LinksExample`, `ButtonsExample`, `ContextualLinksExample`, `CustomContentExample`,
  `InteractiveExample`) now renders a valid `<div><a>`/`<div><button>` tree with no `component`
  changes needed in the example source itself — the auto-detection fixed them transparently.

---

## Phase 6 — Calendar/DatePicker accessibility

Isolated, complex family with its own component-scoped CSS and its own visual-regression batch
(`calendar-datepicker.visual.spec.ts`) — keep separate from everything else.

- [x] **A11Y-01** `calendar/`, `datepicker/` — no `aria-live` region anywhere in either folder
  announcing the visible month/year when it changes via paging or the month/year picker. Added a
  visually-hidden `role="status"` announcer (implicit `aria-live="polite"`/`aria-atomic="true"`,
  matching the existing pattern already used in `Carousel.tsx:720`, rather than a bare
  `aria-live="polite"` attribute) to each of the three header views shared by `Calendar` and
  `RangeCalendar` via `CalendarMonthYearPicker`/`CalendarMonthGrid`/`CalendarYearGrid`: the day
  grid's header announces `"<Month> <Year>"` (updates on prev/next paging), the month grid's header
  announces `"Select month, <Year>"` (updates on entering that view), and the year grid's header
  announces `"Select year, <range>"` (updates on entering that view and on its own internal
  prev/next-years paging). Since `CalendarMonthYearPicker` is reused per visible month block for
  `visibleMonths > 1`, threaded a new `announce` prop (`CalendarMonthGrid`/`CalendarYearGrid`) gated
  to `monthIndex === 0` so only the first block renders its announcer — otherwise every block would
  fire its own simultaneous, differently-worded announcement on every page. Verified live against
  the docs site (`pnpm --filter chassis-react-site dev` already running on :4327 — required an
  `pnpm --filter @chassis-ui/react build` first per this repo's dist/docs-preview gotcha) via DOM
  introspection: paging, opening the month/year picker, and paging within the year grid all update
  the live `role="status"` text correctly.
- [x] **A11Y-02** `CalendarMonthGrid.tsx:51-79`, `CalendarYearGrid.tsx:92-113` — marked
  `role="listbox"`/`role="option"` without the roving-tabindex/arrow-key behavior that role implies.
  Decided to drop the listbox/option roles rather than retrofit real listbox keyboard semantics —
  same call already made for the analogous case in Phase 5 (dropping a mismatched ARIA role rather
  than building out full semantics for a plain button grid). Wrapper `<div>`s now use `role="group"`
  (matching `DatePicker.tsx:484`/`OtpInput.tsx:314`'s existing use of the same role for a labeled
  group of controls); each month/year button is now a plain, unadorned `<button>` (native
  role, natural Tab order — each was already independently focusable, so nothing about the actual
  keyboard behavior changed) marked with `aria-current="true"` when it's the currently-showing
  month/year, replacing `aria-selected` (which requires an `option`/similar role context to be
  valid) — mirrors the exact pattern `RangeCalendar.tsx:350`'s `DateRangePresets` and
  `CarouselIndicators.tsx:33` already use for "the currently active choice among several buttons."
  Updated `Calendar.spec.tsx`/`RangeCalendar.spec.tsx`'s `getByRole('option', ...)` queries to
  `getByRole('button', ...)` accordingly, and replaced one `queryByRole('option')` presence check
  (which would've become vacuously true post-fix, since no element anywhere carries that role
  now) with `queryByRole('group')`, which still meaningfully confirms the picker view closed.
- [x] Add the calendar test-coverage gaps identified in the audit while in this file anyway:
  keyboard paging across a month boundary, a single-day range (same date clicked twice), and an
  unavailable date falling strictly between a selected start/end. Added two `Calendar.spec.tsx`
  tests (arrow-key paging past the last/before the first day of the month auto-advances/retreats
  the visible month) and two `RangeCalendar.spec.tsx` tests (clicking the same date twice selects a
  single-day range; an unavailable date between the anchor and a candidate end disables every date
  past it rather than silently clamping or completing past it — confirmed the actual react-stately
  behavior by probing the DOM rather than assuming, since the initial guess — that it clamps the
  end to the day before the unavailable date — was wrong: react-stately instead disables every date
  beyond the unavailable one once an anchor is set, so an out-of-range click is a no-op).
- [x] Re-run `pnpm test:visual` for the `calendar-datepicker` batch and regenerate baselines if the
  new announcer or grid markup changes any screenshot (a visually-hidden announcer shouldn't, but
  confirm). Ran it: all 14/14 stories mismatch the checked-in `-darwin.png` baselines, but confirmed
  via `git stash` that the exact same 14 stories fail with identical results on the clean,
  unmodified tree — pre-existing local macOS baseline drift (same phenomenon Phase 3/4 already hit
  and documented), not something this phase's diff caused. Left for a future Linux-container
  baseline regen, per `AGENTS.md`.

---

## Phase 7 — Structural refactors (shared code, no behavior change)

Bigger, optional, no urgent bug attached — do this only once Phases 1–6 are settled, and consider
splitting into 7a/7b/7c sub-commits rather than one large diff. Get explicit user sign-off on scope
before starting, since "extract a shared hook" can balloon in review size.

- [x] **7a** Extract the button-semantics block duplicated in `link/Link.tsx:99-109`,
  `button/Button.tsx:125-135`, `close-button/CloseButton.tsx:123-133` (ref setup + `useForkedRef` +
  `useButton` call) into a shared hook in `src/hooks/`. Added `useButtonSemantics` — all three
  components now call it instead of hand-building the same `useRef`/`useForkedRef`/
  `AriaButtonProps<'div'>`/`useButton` block. `Button.tsx`'s call needed one `Ref<...>` cast (its
  forwarded ref type is the wider `button | a | input` union; this hook path only ever populates a
  button/anchor-shaped instance) — same justification already given for the file's other per-branch
  ref casts.
- [x] **7b** Extract the ~150-200 duplicated lines of dialog machinery in `modal/Modal.tsx` and
  `drawer/Drawer.tsx` (forked ref, show/hide effects, static-bounce handling, non-modal Escape
  handling) into a shared `useDialogElement`-style hook. Added `useDialogElement`; `Drawer`'s one
  genuinely distinct behavior (auto-closing every other open drawer) hooks in via a new
  `onBeforeShow` callback invoked at the one precise point in the show effect it needs, rather than
  being duplicated. Verified live (open/close, focus into/back-out-of the dialog, default vs.
  `backdrop="static"` click) plus the full `Modal`/`Drawer` suites, which exercise the transient
  bounce class and cross-instance auto-close under fake timers — both passed unmodified.
- [x] **7c** Extract the duplicated `.form-input` adorn-wrapper shell and popover-overlay shell
  repeated three times across `datepicker/DatePicker.tsx` (×2 variants) and
  `datepicker/DateRangePicker.tsx` into a shared internal render helper. Added
  `renderDatePickerShell` (private to `components/datepicker/`, same pattern as
  `renderFormField`) — each caller now only supplies the genuinely variant-specific pieces (which
  field(s), which calendar, each variant's own `groupProps`/hidden inputs). Verified live: all
  three variants' popovers open, render their calendar grid, and commit a selection back to the
  field(s); the manually-built multi-select `groupProps` path (the most divergent of the three)
  confirmed correct via its `role="group"`/`aria-labelledby` making it through unchanged.
- [x] **7d** Extract the spacing-class guard (`typeof x === 'string' || 'number' ? ... : null`)
  duplicated in `flex/Flex.tsx:77-81`, `stack/Stack.tsx:52`, `grid/Row.tsx:49-51`,
  `card/CardBody.tsx:41` into one shared helper alongside `utils/breakpoints.ts`. Added
  `spacingClassName` in `utils/spacingClassName.ts` (a sibling file, not folded into
  `breakpoints.ts` itself — different-enough concern to keep separate) — all 8 call sites
  (`gap`/`rowGap`/`columnGap`/`gutter`/`gutterX`/`gutterY` across the four components) now call it.
- [x] **7e** Memoize `combobox/Combobox.tsx:217-233`'s entry-building/disabled-key computation
  (currently re-runs every render including every keystroke) with `useMemo` keyed on
  `children`/`items`. Wrapped `entries` (keyed on `[items, children]`) and `disabledKeys` (keyed on
  `[entries]`) in `useMemo`.
- [x] **7f** Dedupe `chip-input/ChipInput.tsx:15,157-192`'s three independent `buildTagIds`
  recomputations down to the one already-memoized array. Hoisted a single `const ids =
  useMemo(() => buildTagIds(tags), [tags])` above `removeTags`/`items`/`focusLastChip`, which all
  now read it instead of each calling `buildTagIds(tags)` themselves.
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
