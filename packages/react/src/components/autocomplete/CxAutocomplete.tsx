import React, { HTMLAttributes, InputHTMLAttributes, ReactNode, useEffect, useRef } from 'react'
import classNames from 'classnames'
import { useButton, useComboBox, useFilter, useOverlayPosition } from 'react-aria'
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
import { CxMenuItemsDef } from '../menu/CxMenuItemDef'
import { renderMenuItemContent } from '../menu/renderMenuItemContent'
import { CxAutocompleteGroup, CxAutocompleteGroupProps } from './CxAutocompleteGroup'
import { CxAutocompleteItem, CxAutocompleteItemProps } from './CxAutocompleteItem'

type AutocompleteItemElement = React.ReactElement<CxAutocompleteItemProps>

// Splits `children` into a flat, ordered list of entries — bare `CxAutocompleteItem` elements
// and `CxAutocompleteGroup`-wrapped clusters of them. `CxAutocompleteItemProps`/
// `CxAutocompleteGroupProps` are structurally identical to `CxCombobox`'s own item/group props,
// so the built elements are assignable to the shared `ComboboxEntry` shape from
// `combobox/comboboxCollection` without needing a parallel type — only the entry-building logic
// (which keys off `CxAutocompleteItem`/`CxAutocompleteGroup`'s runtime identity) needs its own
// copy, mirroring CxCombobox.tsx's own private helpers.
const buildEntriesFromChildren = (children: ReactNode): ComboboxEntry[] => {
  const entries: ComboboxEntry[] = []
  React.Children.forEach(children, (child, index) => {
    if (!React.isValidElement(child)) return
    if (child.type === CxAutocompleteGroup) {
      const groupProps = child.props as CxAutocompleteGroupProps
      const items: AutocompleteItemElement[] = []
      React.Children.forEach(groupProps.children, (groupChild) => {
        if (React.isValidElement(groupChild) && groupChild.type === CxAutocompleteItem) {
          items.push(groupChild as AutocompleteItemElement)
        }
      })
      entries.push({ entryType: 'group', key: `group-${index}`, label: groupProps.label, items })
      return
    }
    if (child.type === CxAutocompleteItem) {
      entries.push(child as AutocompleteItemElement)
    }
  })
  return entries
}

// Same shape as `buildEntriesFromChildren`, from a flat `CxMenuItemsDef` instead — see
// CxCombobox.tsx's equivalent for the grouping rules (a `'header'` opens a group that following
// items join until the next header/end; `'divider'` is a no-op).
const buildEntriesFromItemsDef = (defs: CxMenuItemsDef): ComboboxEntry[] => {
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
      <CxAutocompleteItem
        key={def.id}
        id={def.id}
        disabled={def.disabled}
        icon={def.icon}
        description={def.description}
      >
        {def.label}
      </CxAutocompleteItem>
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

export interface CxAutocompleteProps extends Omit<
  HTMLAttributes<HTMLButtonElement>,
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
   * `CxAutocompleteItem` elements, optionally wrapped in `CxAutocompleteGroup` — read as data by
   * `CxAutocomplete` to build the option list. Not rendered directly. Ignored when `items` is set.
   */
  children?: ReactNode
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * The initial selected option's id (uncontrolled).
   */
  defaultValue?: Key | null
  /**
   * Prevents the autocomplete from being focused or interacted with.
   */
  disabled?: boolean
  /**
   * A description for the field, rendered below the autocomplete.
   */
  help?: ReactNode
  /**
   * `id` forwarded to the toggle button — useful for pairing with a `<label for>`.
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
   * `CxAutocompleteGroup` composition instead if you need finer control over grouping.
   */
  items?: CxMenuItemsDef
  /**
   * The field's caption, rendered as a `CxFormLabel` associated with the toggle button.
   */
  label?: ReactNode
  /**
   * `name` of an auto-created hidden input, kept in sync with the selection, for native form
   * submission. Omit to skip creating one.
   */
  name?: string
  /**
   * Text shown in the listbox when no options match the current query.
   */
  noResultsText?: ReactNode
  /**
   * Callback fired when the selected option changes.
   */
  onChange?: (value: Key | null) => void
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
   * The selected option's id (controlled).
   */
  value?: Key | null
}

// `CxAutocomplete` implements chassis-css's button-trigger combobox — a display-only toggle
// (not a text input) that opens a `.menu` containing its own search field, matching
// https://chassis-ui.com/css/docs/forms/combobox/#search-field. This is deliberately NOT the
// same composition as `CxCombobox` (whose text input *is* the trigger): here, react-aria's
// `useComboBox` is given a separate `buttonRef` — a first-class option the hook supports
// specifically for this "button opens a listbox with its own input" shape — so the real
// `role="combobox"` input lives inside the popover (styled as `.combobox-search-input`) while
// a plain `<button>` (`.form-input.combobox`, matching `CxSelect`'s own dropdown-trigger look)
// serves as the always-visible, always-focusable trigger.
export const CxAutocomplete = ({
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
}: CxAutocompleteProps) => {
  const entries = items ? buildEntriesFromItemsDef(items) : buildEntriesFromChildren(children)

  // Case- and accent-insensitive substring matching, mirroring chassis-css's own
  // always-case-insensitive combobox.js filtering.
  const { contains } = useFilter({ sensitivity: 'base' })

  const state = useComboBoxState<ComboboxEntry>({
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
    defaultValue,
    value,
    onChange,
    allowsEmptyCollection: true,
    // Opening is driven only by the toggle button (see `buttonProps` below) — there's no input
    // to focus or type into until the panel is already open, so 'input'/'focus' triggers (the
    // hook's defaults, meant for `CxCombobox`'s text-input trigger) don't apply here.
    menuTrigger: 'manual'
  })

  const triggerRef = useRef<HTMLButtonElement>(null)
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

  const { buttonProps, inputProps, listBoxProps } = useComboBox<ComboboxEntry>(
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

  const { buttonProps: triggerButtonProps } = useButton(
    { ...buttonProps, elementType: 'button', isDisabled: disabled },
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

  const { overlayProps, placement: resolvedPlacement } = useOverlayPosition({
    targetRef: triggerRef,
    overlayRef: popoverRef,
    placement: toAriaPlacement('bottom-start'),
    offset: 2,
    isOpen: state.isOpen
  })

  const overlayStyle: React.CSSProperties = {
    position: overlayProps.style?.position as React.CSSProperties['position'],
    top: overlayProps.style?.top,
    left: overlayProps.style?.left
  }
  const placementAttr = resolveDataPlacement('bottom-start', resolvedPlacement)

  const inputHtmlProps = inputProps as InputHTMLAttributes<HTMLInputElement>
  const selectedLabel = state.selectedItem?.textValue

  return renderFormField({
    children: (
      <>
        <button
          type="button"
          className={classNames(
            'form-input',
            'combobox',
            { small: size === 'small', large: size === 'large', disabled },
            { 'is-invalid': invalid, 'is-valid': valid },
            className
          )}
          {...rest}
          {...triggerButtonProps}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          ref={triggerRef}
        >
          <span
            className={classNames('combobox-value', {
              'combobox-placeholder': !state.selectedItem
            })}
          >
            {state.selectedItem ? selectedLabel : placeholder}
          </span>
        </button>
        <div
          className={classNames('menu', { show: state.isOpen })}
          role="listbox"
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
        {name && (
          <input type="hidden" name={name} value={state.selectedKey ?? ''} disabled={disabled} />
        )}
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

CxAutocomplete.displayName = 'CxAutocomplete'
