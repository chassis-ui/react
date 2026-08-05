import React, { HTMLAttributes, InputHTMLAttributes, ReactNode, useEffect, useRef } from 'react'
import classNames from 'classnames'
import { mergeProps, useButton, useComboBox, useFilter, useOverlayPosition } from 'react-aria'
import { Item, Key, Section, useComboBoxState } from 'react-stately'

import { useFormField } from '../../hooks'
import { resolveDataPlacement, toAriaPlacement } from '../../utils/overlayPlacement'
import {
  ComboboxEntry,
  ComboboxGroupEntry,
  ComboboxItemElement,
  isComboboxGroupEntry
} from '../combobox/comboboxCollection'
import { ComboboxListBox } from '../combobox/ComboboxListBox'
import { renderFormField } from '../form-field/renderFormField'
import { MenuItemsDef } from '../menu/MenuItemDef'
import { renderMenuItemContent } from '../menu/renderMenuItemContent'
import { AutocompleteGroup, AutocompleteGroupProps } from './AutocompleteGroup'
import { AutocompleteItem, AutocompleteItemProps } from './AutocompleteItem'

type AutocompleteItemElement = React.ReactElement<AutocompleteItemProps>

// Splits `children` into a flat, ordered list of entries — bare `AutocompleteItem` elements
// and `AutocompleteGroup`-wrapped clusters of them. `AutocompleteItemProps`/
// `AutocompleteGroupProps` are structurally identical to `Combobox`'s own item/group props,
// so the built elements are assignable to the shared `ComboboxEntry` shape from
// `combobox/comboboxCollection` without needing a parallel type — only the entry-building logic
// (which keys off `AutocompleteItem`/`AutocompleteGroup`'s runtime identity) needs its own
// copy, mirroring Combobox.tsx's own private helpers.
const buildEntriesFromChildren = (children: ReactNode): ComboboxEntry[] => {
  const entries: ComboboxEntry[] = []
  React.Children.forEach(children, (child, index) => {
    if (!React.isValidElement(child)) return
    if (child.type === AutocompleteGroup) {
      const groupProps = child.props as AutocompleteGroupProps
      const items: AutocompleteItemElement[] = []
      React.Children.forEach(groupProps.children, (groupChild) => {
        if (React.isValidElement(groupChild) && groupChild.type === AutocompleteItem) {
          items.push(groupChild as AutocompleteItemElement)
        }
      })
      entries.push({ entryType: 'group', key: `group-${index}`, label: groupProps.label, items })
      return
    }
    if (child.type === AutocompleteItem) {
      entries.push(child as AutocompleteItemElement)
    }
  })
  return entries
}

// Same shape as `buildEntriesFromChildren`, from a flat `MenuItemsDef` instead — see
// Combobox.tsx's equivalent for the grouping rules (a `'header'` opens a group that following
// items join until the next header/end; `'divider'` is a no-op).
const buildEntriesFromItemsDef = (defs: MenuItemsDef): ComboboxEntry[] => {
  const entries: ComboboxEntry[] = []
  let currentGroup: ComboboxGroupEntry | null = null

  defs.forEach((def) => {
    if (def.type === 'divider') return
    if (def.type === 'header') {
      currentGroup = { entryType: 'group', key: def.id, label: def.label, items: [] }
      entries.push(currentGroup)
      return
    }
    const item = (
      <AutocompleteItem
        key={def.id}
        id={def.id}
        disabled={def.disabled}
        icon={def.icon}
        description={def.description}
      >
        {def.label}
      </AutocompleteItem>
    )
    if (currentGroup) currentGroup.items.push(item)
    else entries.push(item)
  })

  return entries
}

const getDisabledKeys = (entries: ComboboxEntry[]): Key[] =>
  entries.reduce<Key[]>((keys, entry) => {
    const items = isComboboxGroupEntry(entry) ? entry.items : [entry]
    return keys.concat(items.filter((item) => item.props.disabled).map((item) => item.props.id))
  }, [])

const renderAutocompleteItem = (item: ComboboxItemElement) => (
  <Item
    key={item.props.id}
    textValue={typeof item.props.children === 'string' ? item.props.children : undefined}
  >
    {renderMenuItemContent({
      icon: item.props.icon,
      label: item.props.children,
      description: item.props.description
    })}
  </Item>
)

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
   * `id` forwarded to the toggle — useful for pairing with a `<label for>`.
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
   * `AutocompleteGroup` composition instead if you need finer control over grouping.
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
}: AutocompleteProps) => {
  const entries = items ? buildEntriesFromItemsDef(items) : buildEntriesFromChildren(children)

  // Case- and accent-insensitive substring matching, mirroring chassis-css's own
  // always-case-insensitive combobox.js filtering.
  const { contains } = useFilter({ sensitivity: 'base' })

  const state = useComboBoxState<ComboboxEntry, 'multiple'>({
    children: (entry) =>
      isComboboxGroupEntry(entry) ? (
        <Section key={entry.key} title={entry.label} items={entry.items}>
          {renderAutocompleteItem}
        </Section>
      ) : (
        renderAutocompleteItem(entry)
      ),
    defaultItems: entries,
    disabledKeys: getDisabledKeys(entries),
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
  // applied to it too while the panel is open. `ariaHideOutside`'s own doc comment says it
  // watches for *new* elements to hide, not attribute changes on existing ones, so removing it
  // here (in an effect that necessarily runs after react-aria's own — declared later in this
  // same component) doesn't get silently re-applied.
  useEffect(() => {
    if (!state.isOpen) return
    triggerRef.current?.removeAttribute('aria-hidden')
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

  const overlayStyle: React.CSSProperties = {
    position: overlayProps.style?.position as React.CSSProperties['position'],
    top: overlayProps.style?.top,
    left: overlayProps.style?.left
  }
  const placementAttr = resolveDataPlacement('bottom-start', resolvedPlacement)

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
      ? state.selectedItems[0].textValue
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
        <div
          className={classNames('menu', { show: state.isOpen })}
          role="listbox"
          aria-multiselectable={multiple || undefined}
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
        </div>
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
    ids: { feedback: feedbackId, help: helpId, input: inputId, label: labelId },
    invalid,
    invalidFeedback,
    label,
    valid,
    validFeedback
  })
}

Autocomplete.displayName = 'Autocomplete'
