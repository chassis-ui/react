# Component library audit — fix plan

Tracks remediation of the findings from the 2026-08-27 senior-level review of all
`packages/react/src/components/**` folders, done as 7 parallel batch reviews (form primitives;
overlays/selection; navigation; data-display; feedback; layout/base primitives;
calendar/datepicker/carousel), each checked against this package's own `CONVENTIONS.md`/
`FORMS.md`/`THEMING.md` rather than generic style preference. This is the second full pass — the
first (2026-08-26, `AUDIT-PLAN.md` history) is fully closed; this plan only covers what's newly
found since. Findings are grouped into phases by shared risk/blast-radius, not by severity alone,
so each phase is one coherent, independently shippable commit.

## How to work this plan (read this every session)

- **One phase per session/commit.** Do not start the next phase in the same turn you finish one.
- After finishing a phase: run `pnpm lint` and `pnpm test` (and `pnpm react:build && pnpm
  react:report` if the phase touched exported props/types — see root `AGENTS.md`), check off every
  item in that phase below, commit with a message referencing the phase number
  (e.g. `fix(react): phase 3 — toast/notification dismissal correctness`), then **stop and wait for
  the user's go-ahead before starting the next phase.** Do not ask "should I continue?" as a
  rhetorical flourish and proceed anyway — actually stop.
- **Resuming in a new session/context window:** read this file top to bottom first. The first
  phase with any unchecked box is the current phase. Do not re-do checked phases; do not skip ahead
  of the first unchecked one without the user explicitly asking to reorder.
- Each phase lists the finding IDs it closes so a future session can cross-reference the original
  reasoning without re-deriving it (IDs are local to this plan — no separate published artifact).
- If a fix reveals the finding was wrong or already fixed, check the box anyway and note that in
  the commit message — don't leave it dangling because "nothing to do."
- Every phase that changes behavior adds/updates a test for that behavior in the same commit —
  don't defer test-writing to Phase 10 for anything with a dedicated phase below. Phase 10 is only
  for coverage gaps that aren't attached to any specific fix.
- Items tagged **DECIDE** need a judgment call, not just mechanical execution — surface the
  tradeoff to the user (or state your reasoning and proceed if it's clearly low-stakes) before
  implementing, and record the decision in the commit message so it doesn't get re-litigated later.

---

## Phase 1 — Isolated quick fixes (no shared-engine changes)

Independent, single-file, low-risk bugs. Safe to land as one commit; order within the phase
doesn't matter.

- [x] **BUG-01** `link/Link.tsx` (~line 96) — the `component="button"` branch never defaults
  `type`, unlike `button/Button.tsx`/`close-button/CloseButton.tsx` which both default
  `type='button'` specifically to prevent accidental form submission. `<Link component="button">`
  inside a `<form>` defaults to `type="submit"`. Add the same default.
- [x] **REFACTOR-01** `link/Link.tsx` (~lines 101-109) — inline disabled/`preventDefault` anchor
  guard duplicates `useDisabledAnchorGuard`, which `Button`/`CloseButton` already use for the same
  problem. Switch to the shared hook while touching this file for BUG-01 anyway.
- [x] **A11Y-01** `pagination/PaginationItem.tsx` (~lines 99-103) — the custom-`component`/default
  branch attaches a raw `onClick` with no keyboard semantics (no `tabIndex`, no Enter/Space
  handling) — the exact case `Link` already solves via `useButtonSemantics`. Wire the same hook in
  here. Add a test covering `<PaginationItem component="div" onClick={...}>` keyboard activation
  (currently untested — confirmed no existing test exercises a custom `component` + `onClick`
  combination).
- [x] **A11Y-02 / BUG-02** `chip/Chip.tsx` (~lines 146-159) — the generic (non-button/non-anchor)
  branch, which is what a default `<Chip disabled>`/`<Chip pressed onClick>` actually renders
  through, is missing both `aria-disabled` (present on the anchor branch) and keyboard semantics
  for the documented `pressed`/filter-chip use case (present on `Link` via `useButtonSemantics`,
  never wired into `Chip`). Fix both in this branch, mirroring `Link`/the anchor branch. Add tests
  for `aria-disabled` and keyboard activation on the default-element branch.
- [x] **CLEANUP-01** `chip/Chip.tsx` (~lines 96-107) — className build order (`base, color, state,
  size, className`) diverges from sibling `Badge.tsx` (`base, color, size, state, className`,
  matching `CONVENTIONS.md`'s documented order). Reorder to match.
- [x] **BUG-03** `password-strength/PasswordStrength.tsx` (~lines 95-98) — `maxScore` is always
  derived from the built-in criteria weights, ignoring a caller-supplied `scorer` on a different
  scale; `useProgressBar` silently clamps `aria-valuenow`/`aria-valuemax` once a custom scorer's
  values exceed the built-in max. Add an optional `maxScore` prop, documented as paired with
  `scorer`, used instead of the weights-sum when provided. Add a test with a custom scorer + custom
  `maxScore` on a different scale.
- [x] **A11Y-03** `icon/Icon.tsx` (~lines 62-74, svg branch) — no `role="img"` fallback when
  `title` is set, unlike the font-mode branch which defensively sets `role={title ? 'img' :
  undefined}`. Add the same fallback to the svg branch.
- [x] **BUG-04** `icon/Icon.tsx` (line 4) — `IconProps extends HTMLAttributes<HTMLSpanElement |
  SVGSVGElement>` doesn't actually type the SVG render target, forcing an `as SVGAttributes<...>`
  cast at the render site. Type as a discriminated union (`font: true` → `HTMLAttributes<
  HTMLSpanElement>`; default → `SVGAttributes<SVGSVGElement>`), or at minimum union in
  `SVGAttributes<SVGSVGElement>` so the existing cast becomes provably safe instead of an escape
  hatch.
- [x] **A11Y-04** `progress/Progress.tsx` (~line 112) — `aria-label` is only derived when `label`
  is a plain string; a `ReactNode` label (which the prop type explicitly allows) renders visually
  with no accessible name on the `role="progressbar"` element at all. Generate an id for the
  caption and wire `aria-labelledby` when `label` is a non-string node, mirroring how
  `Toast`/`Notification` handle their analogous `title` case. Add a test with a `ReactNode` label.
- [x] **BUG-05** `progress/Progress.tsx`/`ProgressBar.tsx` — `value` isn't clamped to 0–100, so an
  out-of-range value produces `aria-valuenow` outside `aria-valuemin`/`aria-valuemax` and a bar
  that overflows its track. Clamp with `Math.min(100, Math.max(0, value))`.
- [x] **A11Y-05** `placeholder/Placeholder.tsx` (~lines 118-137, `src`/real-`<img>` branch) —
  `alt={alt ?? label}` resolves to `undefined` when both `alt` and `label` (via `title={false}`)
  are absent, leaving the `<img>` with no `alt` attribute at all — most screen readers fall back to
  announcing the file name/URL. The generated-SVG branch already degrades correctly
  (`aria-hidden="true"`, no role) for the equivalent case. Default to `alt={alt ?? label ?? ''}`.
  Add a test for `src` + `title={false}` + no explicit `alt`.
- [x] **BUG-06** `combobox/Combobox.tsx` (~lines 289-295) — `useOverlayPosition` has no `onClose:
  null`, unlike sibling `Autocomplete.tsx`'s identical positioning call, which has a comment
  specifically noting the fix should also apply to `Combobox`. Add `onClose: null` here too.
- [x] **BUG-07** `menu/MenuSubmenu.tsx` (~lines 98-110) — same missing `onClose: null` on its
  `useOverlayPosition` call. Add it. While in this file, fix the stale claim in
  `hooks/useOverlayPlacement.ts` (~lines 35-38) that `MenuSubmenu`/`Combobox` already have this fix
  — it should now be true after BUG-06/BUG-07, so just verify the comment matches reality.
- [x] **BUG-08** `list/List.tsx` (`ListItemDef`, ~lines 15-36) — no stable `id`/`key` field, unlike
  sibling `*Def` shapes (`AccordionItemDef.id`, `AvatarStackItemDef.key`) which both exist
  specifically as a stable-key escape hatch. Add an optional `id`/`key` field and use it when
  present instead of always keying by array index (`List.tsx` ~line 150).
- [x] **BUG-09** `accordion/AccordionItem.tsx` (line 6) — extends `HTMLAttributes<
  HTMLDetailsElement>` instead of `DetailsHTMLAttributes<HTMLDetailsElement>`, so `onToggle` (the
  *only* way to observe open/close on this intentionally-uncontrolled component) is untyped/
  unreachable through the prop surface. Switch to `DetailsHTMLAttributes`.
- [x] **CLEANUP-02** `accordion/context.ts` (~lines 3-8) — `AccordionContextProps.name` is typed
  as required `string` but the context defaults to `{} as AccordionContextProps`, a cast masking
  that `name` is genuinely `undefined` for a supported, tested standalone-`AccordionItem` case.
  Type `name?: string` instead of casting around it.
- [x] **CLEANUP-03** `form/FormLabel.tsx` (lines 1, 4) — the only use of `AllHTMLAttributes`
  anywhere in `src/`, silently permitting attributes that don't belong on `<label>` with no type
  error. Swap to `LabelHTMLAttributes<HTMLLabelElement>` (still carries `htmlFor`, which is all
  that's used).
- [x] **CLEANUP-04** `table/Table.css` (~lines 33-39) — `[role="row"]:focus-visible`/
  `[role="gridcell"]:focus-visible`/etc. selectors are unscoped, so this focus-ring styling would
  apply to any future element reusing those ARIA roles anywhere in the bundle. Prefix with a
  `.table` ancestor selector.

---

## Phase 2 — Modal/Drawer dialog-hook correctness (`useDialogElement`)

Shared hook, interaction-heavy — isolate for careful manual + automated testing.

- [x] **BUG-10** `hooks/useDialogElement.ts` (~lines 170-183) — the non-modal Escape-key listener
  (needed because native `cancel` only fires for `showModal()`) calls `preventDefault()` and
  returns when `!keyboard`, but never calls `triggerStaticBounce()` — unlike the modal path's
  `handleCancel`, which does. `<Modal modal={false} keyboard={false}>` (and the equivalent
  `Drawer`) currently swallows Escape silently with no bounce and no `onClosePrevented`. Call
  `triggerStaticBounce()` in this branch too. Add a test for `modal={false} keyboard={false}` +
  Escape on both `Modal` and `Drawer` (confirmed missing today — existing tests only cover
  `keyboard={false}` against the native `cancel` event).
- [x] **BUG-11** `hooks/useDialogElement.ts` (same listener) — reads `close`/`onClose` from the
  enclosing closure directly rather than through a ref, with effect deps `[keyboard]` only; if
  `onClose` changes identity without `keyboard` changing, Escape invokes a stale callback. Route
  through a ref, matching `Drawer`'s own `closeRef` pattern (used for its cross-instance registry)
  or `useFloatingOverlay`'s `closeRef`.
- [x] **A11Y-06 / DECIDE-01** `modal/ModalTitle.tsx`, `drawer/DrawerTitle.tsx` — neither generates
  an `id`, and neither `Modal`/`Drawer` wires `aria-labelledby` to it automatically, unlike
  `Popover` in the same overlay family (`useDialog` + `titleProps`). `drawer.mdx` documents the
  manual `aria-labelledby` workaround; `modal.mdx` doesn't even have that. **Decide**: auto-wire
  `id`/`aria-labelledby` like `Popover` does (bigger, more consistent fix), or at minimum add the
  same manual-wiring doc note to `modal.mdx` that `drawer.mdx` already has (smaller, stopgap fix).
  Either way, add a test asserting the dialog has a resolvable accessible name in the documented
  usage.
  **Decided: auto-wire.** `Modal`/`Drawer` each generate a `titleId` via `useId()`, put it on the
  context (`ModalContextProps.titleId`/`DrawerContextProps.titleId`) alongside `close`, and set
  `aria-labelledby={titleId}` on the `<dialog>` (overridable by a caller-supplied
  `aria-labelledby`, since it's spread from `rest` after the default). `ModalTitle`/`DrawerTitle`
  read `titleId` via `useModal`/`useDrawer` and apply it as their own `id` unless the caller passes
  an explicit `id`. Non-breaking (an unused `aria-labelledby` pointing at a title that isn't
  rendered is simply ignored by ATs, same as today's no-`aria-labelledby` case) and consistent with
  `Popover`'s auto-id pattern. Updated `modal.mdx` (new Accessibility section) and `drawer.mdx`
  (replaced the manual-wiring instruction) accordingly.

---

## Phase 3 — Toast/Notification dismissal correctness & shared-hook extraction

This is the highest-confidence *silent* bug in the whole review: real, currently invisible to the
test suite, and reachable under completely normal multi-toast usage. Isolate for careful testing.

- [ ] **BUG-12** `toast/Toast.tsx` (~line 145), `notification/Notification.tsx` (~line 134) — both
  pass an unmemoized `() => setVisible(false)` into `hooks/useAutoDismiss.ts`, whose scheduling
  effect depends on that closure's identity. Since `Toaster`/`NotificationStack` re-render every
  mounted item whenever the shared queue changes (`ToastQueue.add()`/`.close()` notify all
  subscribers synchronously), **adding or dismissing any one toast/notification silently restarts
  every other visible one's autohide countdown** — an item can outlive its documented `delay`
  indefinitely under normal multi-item churn. Not caught today because existing tests only rerender
  with deliberately *changed* props. Add a test rendering two toasts (and two notifications) and
  asserting the first's timer survives the second's arrival/dismissal.
- [ ] **REFACTOR-02** Extract the ~30 lines of duplicated dismiss/transition machinery between
  `Toast.tsx` and `Notification.tsx` (visible-state + prop-sync effect, forked ref, `getTransitionClass`
  — currently byte-for-byte duplicated per `git show 545012b` — `titleId`/`textId` via `useId()`,
  the `Transition` boilerplate, and the close callback + `useAutoDismiss` wiring) into a shared
  hook, e.g. `useDismissibleTransition` in `src/hooks/`. Fixing BUG-12 as part of this extraction
  (memoize the close callback once, inside the shared hook) is preferable to patching both files
  separately — do BUG-12 and REFACTOR-02 as one combined change.
- [ ] **BUG-13** `notification/Notification.tsx` (~lines 136-141) — the autohide timer isn't gated
  on the entrance transition having finished, unlike `Toast.tsx` (~lines 132-135, 150), which
  explicitly gates on an `entered` state with a comment explaining why ("gating on `_visible` alone
  would start it the instant `visible` flips true, while still fading/sliding in"). Apply the same
  gating to `Notification`, or fold this into REFACTOR-02's shared hook so both get it uniformly.
- [ ] **DECIDE-02** `toast/ToastHeader.tsx` (~lines 83-87) vs `notification/Notification.tsx`
  (~lines 184-192) — `ToastHeader` unconditionally wraps *any* icon, including a caller-supplied
  custom `ReactNode`, in `aria-hidden="true"`; `Notification` never does this for a custom node.
  Both JSDocs describe the same "pass a custom node, typically a logo or avatar" use case
  near-verbatim. Decide which is correct (likely: only auto-hide the string/`ToastIcon` case —
  `Icon` already handles its own `aria-hidden` default — and leave a genuinely meaningful custom
  icon, e.g. an avatar, to the caller) and align both. Update whichever spec file's existing test
  currently pins the behavior being changed.
- [ ] **CLEANUP-05** `toast/Toast.tsx` — `role` prop is untyped beyond the generic inherited
  `AriaRole`, unlike `notification/Notification.tsx` (~lines 88-93), which explicitly types and
  documents `role?: 'status' | 'alert'`. Give `Toast` the same explicit type + doc, since its
  fade/live-region behavior is only really meaningful for those two values.
- [ ] **REFACTOR-03** `toast/Toaster.tsx` (~lines 45-48) vs `notification/NotificationStack.tsx`
  (~lines 31-34) — identical region-setup boilerplate (`useToastQueue`/equivalent + ref + region
  hook + forked ref), differing only in which queue. Extract a shared helper if convenient while in
  these files for the above; skip if it complicates REFACTOR-02's extraction rather than
  simplifying it.

---

## Phase 4 — Autocomplete/Combobox overlay portal fix

**DECIDE-03**: `autocomplete/Autocomplete.tsx` (~lines 471-490) and `combobox/Combobox.tsx`
(~lines 336-349) render their floating listbox panel inline (positioned `absolute`/`fixed` via
`useOverlayPosition`, but not portaled), unlike every other overlay in this library (`Popover`,
`Tooltip`, `Menu` all portal to `document.body` or an explicit `container`). Any ancestor with
`overflow: hidden`/`auto` — a `ModalBody`, a scrollable card, a table cell — will clip the dropdown.
Not documented as an accepted tradeoff anywhere (contrast `MenuSubmenu`'s `stacked` inline-render
mode, which explicitly documents and accepts this exact downside).

- [ ] Decide the fix shape: portal to `document.body` by default (biggest behavior change, most
  consistent with the rest of the library), or add a `container` prop matching `Menu`'s (smaller,
  opt-in, but leaves the default behavior clipping-prone). Given how commonly `Autocomplete`/
  `Combobox` get used inside `Modal`/`Drawer`, lean toward portaling by default unless there's a
  concrete reason (e.g. an existing consumer relying on inline positioning) surfaced during
  implementation.
- [ ] Implement for both `Autocomplete` and `Combobox` identically — this is exactly the kind of
  prop where the two siblings drifting again would recreate today's problem.
- [ ] Add a test for both components rendered inside an `overflow: hidden` ancestor, asserting the
  dropdown is not clipped (i.e. actually portaled/positioned outside the clipping ancestor).
- [ ] If this changes visual positioning in Storybook, check `test/visual/menu-popover-tooltip.
  visual.spec.ts` isn't the wrong home for Autocomplete/Combobox screenshots — these two aren't
  currently in any visual-regression batch; adding one may be worth a follow-up but isn't required
  to close this phase.

---

## Phase 5 — Form validation-class helper consistency sweep

Mechanical, but touches the shared `renderFormCheck` engine (used by both `Checkbox` and `Radio`),
so keep it isolated rather than folding into Phase 1.

- [ ] **CLEANUP-06** `src/utils/validationClassName.ts` exists specifically to centralize
  `{ 'is-invalid': invalid, 'is-valid': valid }` and is already used by `Radio`/`Switch`/
  `RangeInput`/`Select`/`TextInput`/`Textarea`, but 9 other call sites hand-roll the identical
  literal instead: `form/renderFormCheck.tsx` (both the button-variant and default branches),
  `checkbox/Checkbox.tsx` (`CheckboxStandalone` and `CheckboxGroupItem`), `otp-input/OtpBox.tsx`,
  `otp-input/OtpInput.tsx`, `color-input/ColorInput.tsx`, `file-input/FileInput.tsx`. Replace every
  literal with `validationClassName(invalid, valid)`. No behavior change expected — this is a pure
  mechanical dedup — but re-run the full form-family test suite carefully since `renderFormCheck`
  is shared infrastructure.

---

## Phase 6 — Nav/Breadcrumb/Stepper item-rendering dedup refactor

The prior (2026-08-26) audit's Phase 5 explicitly flagged this exact duplication ("note the shared
duplication for Phase 7 to actually resolve") but its own Phase 7 sub-items never touched it — it's
still outstanding, and it has since caused a real, confirmed bug (BUG-14 below), which is the
clearest sign the duplication itself is the thing worth fixing, not just its current symptom.

- [ ] **BUG-14** `nav/Nav.tsx` (~line 65) — the `items`-driven `autoContent` path always renders a
  real, clickable `<a href="#">` when `NavItemDef.href` is omitted (a valid, optional field),
  producing a dead link. Sibling `breadcrumb/Breadcrumb.tsx` (~lines 33-47) and
  `stepper/Stepper.tsx` (~lines 125-143) both correctly fall back to non-anchor markup in the
  equivalent case — `Nav` is the one outlier, because it's an independent reimplementation rather
  than delegating to its own `NavItem` subcomponent.
- [ ] **REFACTOR-04** `nav/Nav.tsx`, `breadcrumb/Breadcrumb.tsx`, `stepper/Stepper.tsx` — each
  hand-rolls its own `<li>`/link markup (className building, `active`/`disabled`/`aria-current`
  handling) in its `items`-driven `autoContent` path, instead of rendering its own existing
  subcomponent (`NavItem`, `BreadcrumbItem`, `StepperItem`) which already implements the identical
  logic correctly. `pagination/Pagination.tsx`'s smart mode already does this the right way — it
  renders real `<PaginationItem>` elements. Refactor all three `autoContent` implementations to map
  over `items` and render the sibling subcomponent instead of raw JSX. This closes BUG-14 as a
  natural consequence (the subcomponent already has the correct `href`-optional fallback) rather
  than patching it separately.
- [ ] Add/update tests confirming `Nav`'s `items` path (with and without `href`) renders the same
  markup shape as composing `NavItem` directly, and equivalent checks for `Breadcrumb`/`Stepper` if
  not already covered.

---

## Phase 7 — Polymorphic-shape consistency decisions

These are judgment calls about API surface, not mechanical fixes — get explicit sign-off on scope
before implementing, since some of these are borderline breaking-API questions.

- [ ] **DECIDE-04** `button/Button.tsx`/`link/Link.tsx` (~lines 100-118 in `Link.tsx`) vs
  `close-button/CloseButton.tsx` (~lines 98-104) — Button/Link always synthesize `useButtonSemantics`
  (`role="button"`, keyboard handling) onto *any* non-native `component`, including a component
  reference (e.g. a router `Link`); CloseButton explicitly detects a component reference via
  `isComponentReference` and trusts it to handle its own semantics — a deliberate, tested design
  choice (`CloseButton.spec.tsx`). Neither `Button.spec.tsx` nor `Link.spec.tsx` test a real
  component reference, so this divergence is currently unverified in either direction. A common
  composition like `<Button component={NextLink} href="/x" onClick={fn}>` gets `role="button"`
  stamped onto what renders as `<a>`, and Enter can double-fire (native anchor Enter→click, plus
  the synthesized keydown→click). Decide: adopt CloseButton's `isComponentReference` guard in
  Button/Link too (recommended — it's the safer default and already proven), or explicitly document
  why Button/Link's behavior is intentionally different. Either way, add the same kind of
  component-reference test CloseButton has, to lock in whichever choice is made.
- [ ] **DECIDE-05** `card/Card.tsx` has no `component` polymorphism while all 8 of its sub-parts do
  (confirmed deliberate — commit `7e8bbd2` left it out with no stated reason); `grid/Row.tsx`/
  `grid/Col.tsx` have no `component` prop at all (confirmed deliberate — commit `48ed25b` states
  "Row/Col are out of scope, unchanged"); `nav/Nav.tsx` still uses the pre-migration
  `component?: string | ElementType` shape with a fixed ref-type union instead of the
  `PolymorphicComponentProps<C, OwnProps<C>>` pattern every other root in its batch uses (also
  confirmed deliberately deferred in the prior audit). None of these are bugs, but leaving three
  different "still not migrated" asymmetries undocumented invites a future contributor to "fix" one
  as a bug fix when it isn't, or to keep deferring it indefinitely with no record of why. Decide,
  per case: pick it up now using the same established pattern (low risk — the pattern is proven
  across a dozen other components), or add a short explanatory note (e.g. in `CONVENTIONS.md`)
  saying it's deliberately out of scope and why. Card is the lowest-risk one to just finish, given
  every sibling sub-part already has the pattern to copy from.
- [ ] **CLEANUP-07** `card/Card.tsx`/`card/CardBody.tsx` (~lines 15-17 / 11-13) — byte-for-byte
  duplicated `directionClassNames` helper. Extract one shared `flexDirectionClassNames` next to
  `buildResponsiveClassNames` in `utils/breakpoints.ts` (this is the same class of fix Phase 7d of
  the prior audit already did for the *spacing* guard — this is the *direction* guard that fix
  didn't reach).

---

## Phase 8 — Polymorphic wrapper-boilerplate extraction (structural, no behavior change)

Bigger, optional, no urgent bug attached — do this only once Phase 7's decisions are settled (it
touches several of the same files), and consider splitting into sub-commits if the diff gets large.
Get explicit user sign-off on scope before starting.

- [ ] **REFACTOR-05** The polymorphic-component wrapper boilerplate (`forwardRef` + cast to a
  named component type + `displayName` assignment) is duplicated verbatim across `button/Button.tsx`,
  `link/Link.tsx`, `close-button/CloseButton.tsx`, `flex/Flex.tsx`, `stack/Stack.tsx`,
  `grid/Container.tsx`, `grid/Grid.tsx`, `grid/GridItem.tsx`, `button-group/ButtonGroup.tsx`,
  `button-group/ButtonToolbar.tsx` (10 files; likely also `Avatar`/`Chip`/others migrated in later
  phases — grep for the pattern rather than trusting this list is exhaustive). `utils/
  polymorphic.ts` already centralizes the *type* half (`PolymorphicComponentProps`/
  `PolymorphicRef`) but not this runtime-wrapper half. Add a small generic helper (e.g.
  `createPolymorphicComponent(render, displayName)`) there and migrate all call sites to use it.
- [ ] **CLEANUP-08** While touching these files: standardize the "pick a default root element"
  idiom, which is currently split three ways — destructured default (`Nav.tsx`), logical-OR
  (`Navbar.tsx`, `NavbarNav.tsx`, `NavbarText.tsx`, `Tabs.tsx`, `StepperItem.tsx`, `Flex.tsx`,
  `Stack.tsx`, `Container.tsx`, `Grid.tsx`, `GridItem.tsx`, `ButtonGroup.tsx`, `ButtonToolbar.tsx`,
  all `component || <default>`), and nullish-coalescing (`NavbarBrand.tsx`, `PaginationItem.tsx`,
  `Stepper.tsx`, `Button.tsx`, `Link.tsx`, `CloseButton.tsx`, all `component ?? <default>`).
  Functionally near-equivalent given realistic inputs (an `ElementType` is never legitimately
  falsy), but standardize on `??` everywhere while these files are already open for REFACTOR-05.
- [ ] `grid/Container.spec.tsx` doesn't test the `component` prop, unlike `Flex.spec.tsx`/
  `Stack.spec.tsx`/`Grid.spec.tsx`/`GridItem.spec.tsx`, all of which do. Add one `component="section"`
  test for parity while in this file.

---

## Phase 9 — Carousel hardening

Carousel just went through a full refactor (phase 16 of the prior migration effort: autoplay/loop/
scroll-sync logic) but has no visual-regression coverage and a materially untested prop surface —
close that gap before it drifts further from the rest of the library's coverage standard.

- [ ] **TEST-01** Add `stories/carousel/Carousel.stories.tsx` (following the pattern of
  `stories/calendar/`, etc.) and `test/visual/carousel.visual.spec.ts`, per `AGENTS.md`'s own rule
  that a new family gets its own visual-regression spec file. This is CSS-scroll-snap-driven —
  exactly the class of bug DOM snapshots can't catch (pixel-identical markup, broken layout).
- [ ] **DECIDE-06** `carousel/Carousel.tsx` (~line 151) — `useControllableState(activeIndexProp,
  defaultActiveIndex)` has no `onChange`, and `CarouselProps` has no `onChange`/
  `onActiveIndexChange` prop at all; in controlled mode, `onSlide`/`onSlid` are the *only* way a
  consumer can feed the new index back, undocumented as the required pairing, and unlike every
  other controlled component in this library (`Calendar`/`DatePicker` use `value`+`onChange`).
  CONVENTIONS.md mandates `onChange` naming for change events. A controlled `<Carousel
  activeIndex={n}>` with no `onSlide` listener will visually freeze on click/swipe/autoplay — a
  real, currently-untested footgun. Decide: document explicitly that `onSlide`/`onSlid` is the
  required pairing for controlled `activeIndex` (smaller fix), or add a proper `onChange`-named
  callback (bigger, more consistent with the rest of the library — recommended if this isn't a
  breaking-API concern for existing consumers).
- [ ] **TEST-02** Add test coverage for the currently-untested prop surface: controlled
  `activeIndex`, `transition="fade"`, `center`, `auto`, multi-item layout (`items`/`itemsGap`/
  `itemsPeek`), and `CarouselOverlay` — confirmed zero references to any of these in
  `Carousel.spec.tsx` today.
- [ ] **TEST-03** `carouselEngine.ts` (~lines 157-170, `canLoop`) — its own docblock says
  multi-item/peek/centered/variable-width layouts fall back to a `wrap` jump instead of a true
  loop transition, but nothing verifies that fallback actually runs the right code path (i.e. that
  `navigate()`'s `normalizeIndex(..., wraps=true)` path, not `performLoopTransition`, is what fires
  for `ends="loop"` + `items={2}`). Add a test for this specific interaction — likely follows
  naturally from TEST-02's multi-item coverage.

---

## Phase 10 — Remaining test-coverage backfill

Only the gaps not already covered by a fix above.

- [ ] `otp-input/OtpInput.spec.tsx` — the `inputGroup` prop (`OtpInput.tsx`, non-trivial: it
  conditionally wraps in `.input-group` and interacts with `groupSizes`) is never referenced in the
  spec file. Add coverage.
- [ ] `select/Select.spec.tsx` — the `htmlSize` prop (feeds the `isDropdown` branch documented in
  `FORMS.md`'s adorn section — "skip the proxy-open when `htmlSize > 1`") is never referenced. Add
  coverage.

---

## Findings intentionally not actioned

- `switch/Switch.tsx` (~lines 12-15, 55) — `type?: 'checkbox' | 'radio'` selects the internal
  variant to render, which collides in name (though not in practice) with the native `<input
  type>` attribute `TextInput`/`ColorInput`/`FileInput` use for its real DOM meaning. A real smell,
  but fixing it means a public prop rename (e.g. to `variant`), which is a breaking change with no
  attached bug — not worth doing opportunistically. Revisit only if `Switch`'s API is being
  touched for an unrelated reason anyway.
- `carousel/Carousel.tsx` (~lines 216-220) — `atStart`/`atEnd` are computed from index math first,
  then immediately re-derived from real scroll geometry once a real viewport exists; the two
  sources can transiently disagree for one paint in a real browser. No user-visible symptom found;
  flagging only because double-source-of-truth patterns tend to rot silently on the next refactor
  — worth a second look if Carousel's scroll-sync logic is touched again, not a standalone fix.
- `datepicker/renderDatePickerShell.tsx` (~lines 89-96) — overlay visibility is guarded both by
  `hidden={!isOpen}` and by conditionally mounting `<FocusScope>`. Redundant but harmless (and
  arguably intentional: `hidden` for CSS/AT, conditional render to avoid mounting `Calendar`'s
  hooks while closed).
- `form-field/FormField.tsx`/`floating-input/FloatingInput.tsx` — near-identical "missing
  `ids.input`/`ids.label`" `console.warn` blocks. Only two consumers today; extract a shared
  `warnMissingLabelIds` helper if a third form-render-engine consumer appears, not before.
