# Markup snapshot audit

Phase 1 of the plan to remove `toMatchSnapshot()` markup snapshots from
`packages/react/test/components/**` (see repo root for context). Every spec file that calls
`toMatchSnapshot()` is classified into exactly one bucket by comparing what its baseline-markup
snapshot pins against the explicit assertions (`toHaveClass`, `toHaveAttribute`, tag/role/name
checks, etc.) already present elsewhere in the *same* spec file.

- **DUPLICATE** — everything the snapshot pins is already covered by an explicit assertion
  elsewhere in the file. Safe to delete outright in Phase 2.
- **PARTIAL** — the snapshot pins something not asserted anywhere else in the file (a conditional
  class combo, a nested/composed subcomponent's output, a specific attribute). Needs a one-line
  backfill assertion before deletion in Phase 3.
- **VISUAL** — the snapshot really stands in for a rendering concern markup diffing can't capture
  (animation state, portal placement, layout). None found — see note below.

Totals: 105 files audited — **66 DUPLICATE**, **39 PARTIAL**, **0 VISUAL**.

**No VISUAL findings.** Every component initially suspected of a genuine visual/positioning
concern — the portal/overlay families (`Menu`, `Modal`, `Popover`, `Tooltip`) and the two
components with known past arrow-positioning bugs (`Popover`, `Tooltip`) — turned out, on
inspection, to only pin plain class/attribute/role markup in their *audited* `toMatchSnapshot()`
test, or (for `Popover`/`Tooltip`) to pin only the closed/pre-open trigger state. A couple of these
snapshots also happen to capture an inline positioning `style` (`Menu.spec.tsx`,
`MenuSubmenu.spec.tsx`) that jsdom's fake layout can't meaningfully validate either way, but that's
a minor fragment of what each snapshot pins next to substantial plain markup, so those files landed
in PARTIAL rather than VISUAL. Net: Phase 3's VISUAL step is expected to be a no-op, and Phase 5
(widening visual regression) stays purely about the 6 already-Storybook'd, not-yet-`.visual.spec`'d
families named in the plan, not about anything surfaced here.

## DUPLICATE (66)

- `test/components/accordion/Accordion.spec.tsx`
- `test/components/accordion/AccordionBody.spec.tsx`
- `test/components/avatar/Avatar.spec.tsx`
- `test/components/avatar/AvatarImage.spec.tsx`
- `test/components/avatar/AvatarStack.spec.tsx`
- `test/components/badge/Badge.spec.tsx`
- `test/components/breadcrumb/BreadcrumbItem.spec.tsx`
- `test/components/button/Button.spec.tsx`
- `test/components/card/Card.spec.tsx`
- `test/components/card/CardBody.spec.tsx`
- `test/components/card/CardFooter.spec.tsx`
- `test/components/card/CardHeader.spec.tsx`
- `test/components/card/CardImage.spec.tsx`
- `test/components/card/CardImageOverlay.spec.tsx`
- `test/components/card/CardLink.spec.tsx`
- `test/components/card/CardSubtitle.spec.tsx`
- `test/components/card/CardText.spec.tsx`
- `test/components/card/CardTitle.spec.tsx`
- `test/components/chip/Chip.spec.tsx`
- `test/components/close-button/CloseButton.spec.tsx`
- `test/components/collapse/Collapse.spec.tsx`
- `test/components/drawer/DrawerBody.spec.tsx`
- `test/components/drawer/DrawerFooter.spec.tsx`
- `test/components/drawer/DrawerTitle.spec.tsx`
- `test/components/file-input/FileInput.spec.tsx`
- `test/components/flex/Flex.spec.tsx`
- `test/components/form/FormFeedback.spec.tsx`
- `test/components/form/FormHelp.spec.tsx`
- `test/components/form/FormLabel.spec.tsx`
- `test/components/grid/Col.spec.tsx`
- `test/components/grid/Container.spec.tsx`
- `test/components/grid/Grid.spec.tsx`
- `test/components/grid/GridItem.spec.tsx`
- `test/components/grid/Row.spec.tsx`
- `test/components/icon/Icon.spec.tsx`
- `test/components/input-adorn/InputAdorn.spec.tsx`
- `test/components/input-group/InputGroup.spec.tsx`
- `test/components/input-group/InputGroupAddon.spec.tsx`
- `test/components/link/Link.spec.tsx`
- `test/components/list/ListItem.spec.tsx`
- `test/components/menu/MenuDivider.spec.tsx`
- `test/components/menu/MenuItem.spec.tsx`
- `test/components/menu/MenuText.spec.tsx`
- `test/components/modal/ModalBody.spec.tsx`
- `test/components/modal/ModalFooter.spec.tsx`
- `test/components/modal/ModalTitle.spec.tsx`
- `test/components/nav/NavItem.spec.tsx`
- `test/components/nav/NavLink.spec.tsx`
- `test/components/nav/NavTitle.spec.tsx`
- `test/components/navbar/Navbar.spec.tsx`
- `test/components/navbar/NavbarBrand.spec.tsx`
- `test/components/navbar/NavbarNav.spec.tsx`
- `test/components/navbar/NavbarText.spec.tsx`
- `test/components/notification/Notification.spec.tsx`
- `test/components/notification/NotificationText.spec.tsx`
- `test/components/notification/NotificationTitle.spec.tsx`
- `test/components/range-input/RangeInput.spec.tsx`
- `test/components/skeleton/Skeleton.spec.tsx`
- `test/components/spinner/Spinner.spec.tsx`
- `test/components/stack/Stack.spec.tsx`
- `test/components/stepper/StepperItem.spec.tsx`
- `test/components/toast/Toast.spec.tsx`
- `test/components/toast/ToastBody.spec.tsx`
- `test/components/toast/ToastFooter.spec.tsx`
- `test/components/toast/ToastHeader.spec.tsx`
- `test/components/tooltip/Tooltip.spec.tsx`

## PARTIAL (39)

- `test/components/accordion/AccordionHeader.spec.tsx` — the snapshot pins the inner text node as
  a `<span class="accordion-title">`, but no test elsewhere checks that inner element's tag name —
  only its class and the outer `<summary>`'s tag/nesting are checked.
- `test/components/accordion/AccordionItem.spec.tsx` — composes `AccordionHeader`+`AccordionBody`
  and pins their rendered output (`accordion-title` span, `accordion-body` div), but no other test
  in this file asserts those classes when composed together — the toggle tests only use
  `getByText` for presence.
- `test/components/breadcrumb/Breadcrumb.spec.tsx` — composes three `BreadcrumbItem`s (two
  non-active, one active), but no other test asserts `toHaveClass('breadcrumb-item')` on a
  non-active composed item.
- `test/components/button-group/ButtonGroup.spec.tsx` — pins each nested `Button`'s rendered
  `class="button primary"` and `type="button"`, but no other test asserts those on the nested
  button — only the group's own classes are checked.
- `test/components/button-group/ButtonToolbar.spec.tsx` — pins `role="group" aria-label="Bazinga"`
  on the toolbar plus nested `ButtonGroup`s/`Button`s; no other test asserts the toolbar's
  role/aria-label, the nested group's role forwarding, or the nested buttons' classes/type.
- `test/components/card/CardGroup.spec.tsx` — the nested-cards snapshot composes a rich
  `Card`/`CardImage`/`CardHeader`/`CardBody`/`CardTitle`/`CardSubtitle`/`CardText`/`CardLink`/`CardFooter`
  tree; the file's only other test renders plain text with no nested subcomponents at all.
- `test/components/carousel/Carousel.spec.tsx` — pins the prev/next controls' full class list
  (`button small icon-only`), `type="button"`, and the decorative icon's full markup; the "labeled
  controls" test only checks accessible name and the icon's single class.
- `test/components/checkbox/Checkbox.spec.tsx` — the label-less (`aria-label` only, no `label`
  prop) bare `<span class="check-input">` shape, plus `data-react-aria-pressable="true"` and
  `tabindex="0"`, are never independently asserted — every other wrapper-inspecting test passes a
  `label` prop, producing a different (`label.form-check`-wrapped) structure.
- `test/components/checkbox/CheckboxGroup.spec.tsx` — pins `class="form-field"` on the fieldset,
  `class="form-label"` on the legend, and `class="form-check"` on each item wrapper; no test
  asserts these three specific classes.
- `test/components/color-input/ColorInput.spec.tsx` — pins the `value="#ff0000"` attribute
  resulting from `defaultValue="#ff0000"`; no test asserts that `defaultValue` seeds the input's
  initial `value` attribute (only post-`fireEvent.change` values are checked).
- `test/components/drawer/Drawer.spec.tsx` — pins `tabindex="-1"` and a generated
  `aria-labelledby` on the `<dialog>`; no test asserts either attribute directly (the closest test
  only checks the computed accessible name, via a different, titled render).
- `test/components/drawer/DrawerHeader.spec.tsx` — pins the default close button's
  `class="close-button"` and `type="button"`; the "renders a close button by default" test only
  checks its role/accessible-name.
- `test/components/floating-input/FloatingInput.spec.tsx` — no test asserts
  `toHaveClass('form-label')` on the rendered label; no test cross-checks the `.form-help`
  element's `id` against the input's `aria-describedby` (unlike `FileInput.spec.tsx`'s explicit
  equivalent).
- `test/components/form-field/FormField.spec.tsx` — the *presence* case of the `.form-field`
  wrapper class is never asserted (only its *absence* is checked); no `toHaveClass('form-label')`
  on the label; no id-containment check between `.form-help`'s `id` and the input's
  `aria-describedby`.
- `test/components/form/Form.spec.tsx` — the baseline snapshot is a composite render of
  `FormLabel`+`TextInput`+`FormHelp`+`Checkbox`+`Button` inside `Form`; none of that nested
  markup is asserted anywhere else in this file (other tests only check the `<form>` element
  itself).
- `test/components/list/List.spec.tsx` — `toHaveClass('list-item')` is never asserted for
  rendered items; the active data-driven item's literal `active` class isn't checked (only
  `aria-current`); `toHaveClass('list')` on the div-mode root isn't checked (only its tag name).
- `test/components/menu/Menu.spec.tsx` — pins `MenuToggle`'s rendered class
  (`button primary caret show`) and aria wiring, and `MenuItem`'s class/role, none of which is
  asserted elsewhere in this file; also pins `data-cx-placement="bottom-start"` on the panel.
- `test/components/menu/MenuHeader.spec.tsx` — `toHaveAttribute('role', 'presentation')` on the
  header is pinned but never asserted (only the class and tag name are checked).
- `test/components/menu/MenuSubmenu.spec.tsx` — `toHaveClass('menu-item')`,
  `toHaveAttribute('role', 'menuitem')`, and `toHaveAttribute('aria-haspopup', 'true')` on the
  trigger are pinned but never asserted; the trigger's default `aria-expanded="false"` state is
  also unchecked.
- `test/components/modal/Modal.spec.tsx` — `toHaveAttribute('tabindex', '-1')` on the open dialog
  is pinned but never asserted; no test positively checks `toHaveAttribute('open', '')` for the
  visible case (only its absence when closed is checked).
- `test/components/modal/ModalHeader.spec.tsx` — `toHaveClass('close-button')` and
  `type="button"` on the default close button are pinned but never asserted (only role/accessible
  name are checked).
- `test/components/nav/Nav.spec.tsx` — `toHaveClass('nav-link')` is never asserted anywhere in
  this file (only the variant classes `active`/`disabled` are checked).
- `test/components/navbar/NavbarToggler.spec.tsx` — the default toggler icon's svg
  classes/`aria-hidden`/`height`/`width`/`<use href>` are pinned but never asserted (only the
  accessible name is checked elsewhere).
- `test/components/notification/NotificationIcon.spec.tsx` — `height="24"`/`width="24"` on the
  generated svg are pinned but never asserted with `toHaveAttribute`.
- `test/components/notification/NotificationStack.spec.tsx` — the region wrapper's
  `aria-label="0 notifications."`, `data-react-aria-top-layer="true"`, and `tabindex="-1"` are
  pinned but never asserted (only layout classes are checked, in a different test).
- `test/components/pagination/Pagination.spec.tsx` — the `<nav aria-label="Pagination">`
  wrapper's `aria-label`, and the per-item `pagination-item`/`pagination-link` classes and
  `type="button"`, are pinned but never asserted (items are queried by role/name only).
- `test/components/pagination/PaginationItem.spec.tsx` — the default button's `type="button"` is
  pinned but never asserted (only role/class/accessible-name are checked).
- `test/components/placeholder/Placeholder.spec.tsx` — the default computed
  `aria-label="Placeholder: 200x100"` and the `width`/`height`/`preserveAspectRatio` attributes are
  pinned but never asserted (only the custom-title/text variant's `aria-label` is checked
  elsewhere).
- `test/components/popover/Popover.spec.tsx` — captures only the *closed* trigger button
  (`aria-expanded="false"`, `class="button primary"`, `type="button"`); no test explicitly asserts
  these on the pre-open trigger (other tests query by role/name only, or cover the open state via
  a separate, out-of-scope snapshot).
- `test/components/progress/Progress.spec.tsx` — `aria-valuemax="100"`/`aria-valuemin="0"` are
  never asserted (only `aria-valuenow` is, for non-50 values); the inner bar's `fg-contrast` class
  and the `<span class="mx-2xsmall">` element are never asserted.
- `test/components/progress/ProgressBar.spec.tsx` — the `fg-contrast` class and the
  `<span class="mx-2xsmall">` element are pinned but never asserted (only `progress-bar`,
  `bg-{color}`, and the inline width style are checked).
- `test/components/radio/Radio.spec.tsx` — the wrapping `<label class="form-check">`, the roving
  `tabindex` (0 on checked, -1 on the rest), `data-react-aria-pressable="true"`, and the enclosing
  fieldset's `role="radiogroup"`/`class="form-field"`/`aria-orientation="vertical"` are pinned but
  never asserted.
- `test/components/radio/RadioGroup.spec.tsx` — the fieldset's `class="form-field"` and
  `aria-orientation="vertical"`, and the legend's `class="form-label"`, are pinned but never
  asserted; the nested `Radio` markup the snapshot also pins has no explicit assertion in this
  file (only in `Radio.spec.tsx` itself).
- `test/components/select/Select.spec.tsx` — the baseline snapshot renders raw JSX `<option>`
  children; no test asserts that children-based rendering path's text/value (every other test
  exercises the `options`/`placeholder` prop API instead).
- `test/components/stepper/Stepper.spec.tsx` — composing `Stepper` with `StepperItem` children (as
  the snapshot does) and asserting the resulting `stepper-item`/`stepper-item active` classes and
  `aria-current="step"` isn't done anywhere else — only the separate `items`-prop-driven render
  path is checked for that class/aria combo.
- `test/components/switch/Switch.spec.tsx` — the default (unlabeled, checkbox-backed) input's
  `type="checkbox"`, `data-react-aria-pressable="true"`, and `tabindex="0"` are pinned but never
  asserted (only `role="switch"` and the wrapper class are checked for this variant).
- `test/components/text-input/TextInput.spec.tsx` — the input's `tabindex="0"` is pinned but
  never asserted (class and `type="text"` are covered elsewhere).
- `test/components/textarea/Textarea.spec.tsx` — the textarea's `tabindex="0"` is pinned but
  never asserted (class and value are covered elsewhere).
- `test/components/toast/Toaster.spec.tsx` — the `p-medium` class, and the region wrapper's
  `aria-label="0 notifications."`, `data-react-aria-top-layer="true"`, and `tabindex="-1"`, are
  pinned but never asserted (only placement/base classes are checked).

## VISUAL (0)

None. See the note above the DUPLICATE section.
