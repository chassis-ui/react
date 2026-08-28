import React, {
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  useEffect,
  useMemo,
  useRef
} from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames'
import { mergeProps, useButton, useComboBox, useFilter, useOverlayPosition } from 'react-aria'
import { Key, useComboBoxState } from 'react-stately'

import { useFloatingOverlay, useFormField } from '../../hooks'
import {
  buildEntriesFromChildren,
  buildEntriesFromItemsDef,
  ComboboxEntry,
  comboboxCollectionChildren,
  getDisabledKeys
} from '../../utils/comboboxCollection'
import {
  COMBOBOX_MENU_OVERLAY_STYLE,
  resolveMenuOverlayPositioning,
  toAriaPlacement
} from '../../utils/overlayPlacement'
import { ComboboxListBox } from '../combobox/ComboboxListBox'
import { renderFormField } from '../form-field/renderFormField'
import { MenuItemsDef } from '../menu/MenuItemDef'
import { AutocompleteGroup } from './AutocompleteGroup'
import { AutocompleteItem } from './AutocompleteItem'

// `useComboBoxState`/`useComboBox` are generic over a `SelectionMode` ('single' | 'multiple')
// that only affects *types* — actual runtime behavior (whether a selection closes the menu,
// disallows an empty selection, *and* whether `state.value`/`onChange`'s callback argument come
// through as a bare `Key` or a `Key[]`) is driven entirely by the `selectionMode` *string* passed
// at the call site below, not by this type parameter. Fixing the parameter at `'multiple'` here
// (the more permissive of the two shapes) lets one component serve both modes without a full
// code fork, but it means the type system's claim that `state.value`/`onChange`'s argument are
// always `Key[]` is untrustworthy for single-select at runtime — confirmed by testing (the
// naive `keys[0]` on a bare string key silently returned its first *character*). `asKeyArray`
// normalizes either shape; every read of `state.value` or `onChange`'s argument goes through it.
const toMultiValue = (value: Key | Key[] | null | undefined): Key[] | undefined => {
  if (value === undefined) return undefined
  if (value === null) return []
  return Array.isArray(value) ? value : [value]
}

const asKeyArray = (value: unknown): Key[] => {
  if (value == null) return []
  return Array.isArray(value) ? value : [value as Key]
}

export interface AutocompleteProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  /**
   * An accessible label for the autocomplete, used when there's no visible `<label>`.
   */
  'aria-label'?: string
  /**
   * Identifies a visible `<label>` element for the autocomplete.
   */
  'aria-labelledby'?: string
  /**
   * `AutocompleteItem` elements, optionally wrapped in `AutocompleteGroup` — read as data by
   * `Autocomplete` to build the option list. Not rendered directly. Ignored when `items` is set.
   */
  children?: ReactNode
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * The initial selected option's id(s) (uncontrolled). An array when `multiple` is set.
   */
  defaultValue?: Key | Key[] | null
  /**
   * Prevents the autocomplete from being focused or interacted with.
   */
  disabled?: boolean
  /**
   * A description for the field, rendered below the autocomplete.
   */
  help?: ReactNode
  /**
   * `id` forwarded to the search input inside the popover. The toggle — the field's real,
   * always-focusable surface — has no single labelable element `<label for>` can target (it's a
   * `role="button"` `<div>`, and the search input itself is hidden until open), so `label` is
   * associated via `aria-labelledby` on the toggle instead. See FORMS.md's "role=group" pattern.
   */
  id?: string
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean
  /**
   * An error message for the field, rendered below the autocomplete when `invalid` is set.
   */
  invalidFeedback?: ReactNode
  /**
   * Array of item/header/divider definitions for data-driven rendering. When provided, children
   * are ignored. A `'header'` entry starts a group that all following items join until the next
   * header or the end of the array. `'divider'` entries are a no-op here — use
   * `AutocompleteGroup` composition instead if you need finer control over grouping. An entry's
   * `href`/`onClick` are `Menu`-only and are not read here — use `onChange` to react to the
   * selection instead.
   */
  items?: MenuItemsDef
  /**
   * The field's caption, rendered as a `FormLabel` associated with the toggle.
   */
  label?: ReactNode
  /**
   * Allows more than one option to be selected. The toggle shows the single selection's label,
   * or an "N selected" count once more than one is picked. The menu stays open after each
   * selection, and `Backspace` in the empty search field removes the last selected option.
   */
  multiple?: boolean
  /**
   * `name` of auto-created hidden input(s), kept in sync with the selection, for native form
   * submission. Single-select renders one; `multiple` renders one per selected key. Omit to skip
   * hidden-input creation.
   */
  name?: string
  /**
   * Text shown in the listbox when no options match the current query.
   */
  noResultsText?: ReactNode
  /**
   * Callback fired when the selection changes. Receives an array of keys when `multiple` is set.
   */
  onChange?: (value: Key | Key[] | null) => void
  /**
   * Text shown on the toggle when nothing is selected.
   */
  placeholder?: string
  /**
   * Placeholder for the search field inside the dropdown.
   */
  searchPlaceholder?: string
  /**
   * Size the component small or large.
   */
  size?: 'small' | 'large'
  /**
   * Set component validation state to valid.
   */
  valid?: boolean
  /**
   * A success message for the field, rendered below the autocomplete when `valid` is set.
   */
  validFeedback?: ReactNode
  /**
   * The selected option's id(s) (controlled). An array when `multiple` is set.
   */
  value?: Key | Key[] | null
}

// `Autocomplete` implements chassis-css's button-trigger combobox — a display-only toggle
// (not a text input) that opens a `.menu` containing its own search field, matching
// https://chassis-ui.com/css/docs/forms/combobox/#search-field. This is deliberately NOT the
// same composition as `Combobox` (whose text input *is* the trigger): here, react-aria's
// `useComboBox` is given a separate `buttonRef` — a first-class option the hook supports
// specifically for this "button opens a listbox with its own input" shape — so the real
// `role="combobox"` input lives inside the popover (styled as `.combobox-search-input`) while a
// toggle serves as the always-visible, always-focusable trigger. The toggle is a `<div
// role="button">` (via `useButton`'s `elementType: 'div'`, the same pattern `Button.tsx` uses
// for a non-native trigger) rather than a real `<button>` — an earlier version rendered
// removable chips inside it for `multiple` mode, which a real (or ARIA) button can't legally
// contain per axe's `nested-interactive` check; that's now plain "N selected" text instead (see
// `triggerText` below), but the `<div>` stays since reverting buys little and this is proven.
// `useComboBox`'s own `buttonProps` also sets `excludeFromTabOrder: true` by default — correct
// for its usual "auxiliary button beside an always-visible input" composition, wrong here since
// the toggle is the *only* focusable surface before opening; overridden back to reachable below.
export const Autocomplete = ({
  children,
  className,
  defaultValue,
  disabled,
  help,
  id,
  invalid,
  invalidFeedback,
  items,
  label,
  multiple = false,
  name,
  noResultsText = 'No results found',
  onChange,
  placeholder,
  searchPlaceholder,
  size,
  valid,
  validFeedback,
  value,
  ...rest
}: AutocompleteProps): ReactNode => {
  // `entries`/`disabledKeys` only need to change when the data driving them does — without this,
  // both re-derive from scratch on every render, including every keystroke while typing.
  const entries = useMemo(
    () =>
      items
        ? buildEntriesFromItemsDef(items)
        : buildEntriesFromChildren(children, { Group: AutocompleteGroup, Item: AutocompleteItem }),
    [items, children]
  )
  const disabledKeys = useMemo(() => getDisabledKeys(entries), [entries])

  // Case- and accent-insensitive substring matching, mirroring chassis-css's own
  // always-case-insensitive combobox.js filtering.
  const { contains } = useFilter({ sensitivity: 'base' })

  const state = useComboBoxState<ComboboxEntry, 'multiple'>({
    children: comboboxCollectionChildren,
    defaultItems: entries,
    disabledKeys,
    defaultFilter: contains,
    // Cast: the actual runtime string ('single' or 'multiple') is what drives behavior — see the
    // `toMultiValue` comment above for why the *type* parameter above is fixed at 'multiple'.
    selectionMode: (multiple ? 'multiple' : 'single') as 'multiple',
    defaultValue: toMultiValue(defaultValue),
    value: toMultiValue(value),
    onChange: (keys) => {
      const keyArray = asKeyArray(keys)
      onChange?.(multiple ? keyArray : (keyArray[0] ?? null))
    },
    allowsEmptyCollection: true,
    // Opening is driven only by the toggle (see `buttonProps` below) — there's no input to focus
    // or type into until the panel is already open, so 'input'/'focus' triggers (the hook's
    // defaults, meant for `Combobox`'s text-input trigger) don't apply here.
    menuTrigger: 'manual'
  })

  const triggerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listBoxRef = useRef<HTMLElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const { describedBy, feedbackId, helpId, inputId, labelId, labelledBy } = useFormField({
    ariaDescribedBy: rest['aria-describedby'],
    ariaLabelledBy: rest['aria-labelledby'],
    help,
    id,
    invalid,
    invalidFeedback,
    label,
    valid,
    validFeedback
  })

  const { buttonProps, inputProps, listBoxProps } = useComboBox<ComboboxEntry, 'multiple'>(
    {
      'aria-label': rest['aria-label'],
      'aria-labelledby': labelledBy,
      buttonRef: triggerRef,
      id: inputId,
      inputRef,
      listBoxRef,
      popoverRef,
      isDisabled: disabled,
      placeholder: searchPlaceholder
    },
    state
  )

  // `useComboBox`'s own `buttonProps` sets `excludeFromTabOrder: true` — correct for its
  // intended composition (an auxiliary icon button *next to* an already-focusable, always-
  // visible input, e.g. a date picker's calendar-icon trigger), where the input is expected to
  // be the primary tab stop. That doesn't hold here: the input lives inside the popover, `hidden`
  // (and so untabbable) until opened, and this toggle is the *only* focusable surface before
  // that — leaving `excludeFromTabOrder` in place would make the whole control unreachable by
  // keyboard. Overriding it back to `false` is what actually makes the toggle the tab stop.
  const { buttonProps: triggerButtonProps } = useButton(
    { ...buttonProps, elementType: 'div', isDisabled: disabled, excludeFromTabOrder: false },
    triggerRef
  )

  // The search field autofocuses once the panel is actually open (chassis-css docs: "When the
  // menu opens, focus jumps to the search field"), and focus returns to the toggle once it
  // closes — `useComboBox` only knows about `inputRef` as its focus target, and that input is
  // `hidden` (via the panel) while closed, so without this, closing (via Escape, selection, or
  // outside click) would drop focus entirely instead of landing back on the toggle.
  const wasOpen = useRef(state.isOpen)
  useEffect(() => {
    if (state.isOpen && !wasOpen.current) {
      inputRef.current?.focus()
    } else if (!state.isOpen && wasOpen.current) {
      triggerRef.current?.focus()
    }
    wasOpen.current = state.isOpen
  }, [state.isOpen])

  // `useComboBox` also runs react-aria's `ariaHideOutside` while open, to keep background
  // content out of screen readers' way — but it only knows to protect `inputRef`/`popoverRef`
  // (the elements it was given), not this separate toggle, so the toggle (and, in `multiple`
  // mode, its chips and their focusable remove buttons) would otherwise get `aria-hidden`
  // applied to it too while the panel is open. Walking up to `document.body` (rather than
  // clearing just `triggerRef.current` itself) matters now that the popover portals there too
  // (see `useFloatingOverlay` below): `ariaHideOutside` hides the *first* ancestor level whose
  // subtree contains no protected element, which — once the toggle and the popover no longer
  // share a common non-`body` container — can land on one of the toggle's own ancestors instead
  // of the toggle element itself. `ariaHideOutside`'s own doc comment says it watches for *new*
  // elements to hide, not attribute changes on existing ones, so removing it here (in an effect
  // that necessarily runs after react-aria's own — declared later in this same component)
  // doesn't get silently re-applied.
  useEffect(() => {
    if (!state.isOpen) return
    let node: HTMLElement | null = triggerRef.current
    while (node && node !== document.body) {
      node.removeAttribute('aria-hidden')
      node = node.parentElement
    }
  }, [state.isOpen])

  const { overlayProps, placement: resolvedPlacement } = useOverlayPosition({
    targetRef: triggerRef,
    overlayRef: popoverRef,
    placement: toAriaPlacement('bottom-start'),
    offset: 2,
    isOpen: state.isOpen,
    // Leaving `onClose` unset (`undefined`) doesn't actually disable react-aria's close-on-scroll
    // listener — only an explicit `null` does (`useCloseOnScroll` only early-returns on
    // `onClose === null`, not falsy). It happens to be a no-op today only because this toggle is
    // never registered in react-aria's `useOverlayTrigger`/`onCloseMap` backward-compat map (this
    // component calls `useComboBox`, not `useOverlayTrigger`) — an incidental, not guaranteed,
    // safety net. Passing `null` here makes the opt-out explicit, matching `Menu`/`Popover`.
    onClose: null
  })

  // Portals the panel to `document.body` (or an enclosing open `<dialog>`) instead of rendering
  // it inline, matching `Popover`/`Tooltip`/`Combobox` — an inline-rendered panel gets clipped by
  // any ancestor with `overflow: hidden`/`auto` (a `ModalBody`, a scrollable card, a table cell),
  // and `Autocomplete` is commonly composed inside exactly those. See
  // `COMBOBOX_MENU_OVERLAY_STYLE` for the styling this trades away by leaving the DOM position
  // `.combobox + .menu` relies on.
  const portalContainer = useFloatingOverlay({
    close: state.close,
    isOpen: state.isOpen,
    open: state.open,
    triggerRef
  })

  const { menuStyle, placementAttr } = resolveMenuOverlayPositioning(
    overlayProps.style,
    'bottom-start',
    resolvedPlacement
  )
  const overlayStyle: React.CSSProperties = { ...COMBOBOX_MENU_OVERLAY_STYLE, ...menuStyle }

  const removeSelected = (key: Key) => state.selectionManager.toggleSelection(key)

  // Backspace-removes-last-chip only touches the search field's own keydown handling — no
  // nested interactive element needed for it, unlike a rendered "remove" button would be (see
  // the trigger's `combobox-value` text below for why that path was dropped).
  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!multiple || event.key !== 'Backspace' || event.currentTarget.value !== '') return
    const last = state.selectedItems[state.selectedItems.length - 1]
    if (last) removeSelected(last.key)
  }

  const inputHtmlProps = mergeProps(inputProps, {
    onKeyDown: handleSearchKeyDown
  }) as InputHTMLAttributes<HTMLInputElement>

  const hasSelection = state.selectedItems.length > 0
  // Matches chassis-css's own vanilla multi-select combobox: the toggle shows the single
  // selected item's label, or "N selected" once more than one is picked — deliberately plain
  // text, not per-item chips with their own remove buttons. An earlier version rendered chips
  // here; that failed a real axe check ("Interactive controls must not be nested") because the
  // toggle is itself `role="button"`, and a button can't correctly contain other focusable
  // controls. Deselecting an option is still possible by clicking it again in the open list
  // (native to `useComboBoxState`'s multiple-selection toggle behavior) or via Backspace in the
  // search field, just not from the toggle itself.
  const triggerText = !hasSelection
    ? placeholder
    : state.selectedItems.length === 1
      ? (state.selectedItems[0]?.textValue ?? '')
      : `${state.selectedItems.length} selected`

  return renderFormField({
    children: (
      <>
        <div
          className={classNames(
            'form-input',
            'combobox',
            { small: size === 'small', large: size === 'large', disabled },
            { 'is-invalid': invalid, 'is-valid': valid },
            className
          )}
          {...rest}
          {...triggerButtonProps}
          // `useComboBox`'s own `buttonProps` defaults to a generic "Show suggestions" label,
          // since its primary a11y attention goes to the search input — override with the same
          // label the input gets, so the toggle (the element actually reachable via Tab, since
          // the input is hidden until open) announces the field's real name, matching the
          // vanilla docs' own `aria-label="Select a country"` on the toggle button.
          aria-label={rest['aria-label']}
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          ref={triggerRef}
        >
          <span className={classNames('combobox-value', { 'combobox-placeholder': !hasSelection })}>
            {triggerText}
          </span>
        </div>
        {typeof window !== 'undefined' &&
          createPortal(
            <div
              className={classNames('menu', { show: state.isOpen })}
              data-cx-placement={placementAttr}
              style={overlayStyle}
              hidden={!state.isOpen}
              ref={popoverRef}
            >
              <div className="combobox-search">
                <input
                  autoComplete="off"
                  className="form-input combobox-search-input small"
                  {...inputHtmlProps}
                  ref={inputRef}
                />
              </div>
              <ComboboxListBox state={state} listBoxProps={listBoxProps} listBoxRef={listBoxRef} />
              {state.collection.size === 0 && (
                <div className="combobox-no-results">{noResultsText}</div>
              )}
            </div>,
            portalContainer ?? document.body
          )}
        {name &&
          (multiple ? (
            asKeyArray(state.value).map((key) => (
              <input key={key} type="hidden" name={name} value={key} disabled={disabled} />
            ))
          ) : (
            <input
              type="hidden"
              name={name}
              value={asKeyArray(state.value)[0] ?? ''}
              disabled={disabled}
            />
          ))}
      </>
    ),
    help,
    // No `input` id: the toggle is a `role="button"` `<div>`, not a labelable element, so
    // `htmlFor` can't target it — `aria-labelledby={labelledBy}` on the toggle above (fed by
    // `labelId`) is what actually associates the label, matching DatePicker/OtpInput's
    // `role="group"` pattern in FORMS.md. Passing `inputId` here would point `<label for>` at
    // the hidden search input instead, which sits inert until the popover opens.
    ids: { feedback: feedbackId, help: helpId, label: labelId },
    invalid,
    invalidFeedback,
    label,
    valid,
    validFeedback
  })
}

Autocomplete.displayName = 'Autocomplete'
