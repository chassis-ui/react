import React, {
  forwardRef,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  useId,
  useMemo,
  useRef
} from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames'
import { useComboBox, useFilter, useOverlayPosition } from 'react-aria'
import { Item, Key, Section, useComboBoxState } from 'react-stately'

import { useFloatingOverlay, useForkedRef, useFormField } from '../../hooks'
import {
  ComboboxEntry,
  ComboboxGroupEntry,
  ComboboxItemElement,
  isComboboxGroupEntry
} from '../../utils/comboboxCollection'
import {
  COMBOBOX_MENU_OVERLAY_STYLE,
  resolveDataPlacement,
  toAriaPlacement
} from '../../utils/overlayPlacement'
import { renderMenuItemContent } from '../../utils/renderMenuItemContent'
import { validationClassName } from '../../utils/validationClassName'
import { renderFormField } from '../form-field/renderFormField'
import { MenuItemsDef } from '../menu/MenuItemDef'
import { ComboboxGroup, ComboboxGroupProps } from './ComboboxGroup'
import { ComboboxItem } from './ComboboxItem'
import { ComboboxListBox } from './ComboboxListBox'

// Splits `children` into a flat, ordered list of entries — bare `ComboboxItem` elements and
// `ComboboxGroup`-wrapped clusters of them — mirroring how `useComboBoxState`'s dynamic
// collection needs top-level nodes: some rendered as a plain `<Item>`, some as a `<Section>`
// wrapping several `<Item>`s.
const buildEntriesFromChildren = (children: ReactNode): ComboboxEntry[] => {
  const entries: ComboboxEntry[] = []
  React.Children.forEach(children, (child, index) => {
    if (!React.isValidElement(child)) return
    if (child.type === ComboboxGroup) {
      const groupProps = child.props as ComboboxGroupProps
      const items: ComboboxItemElement[] = []
      React.Children.forEach(groupProps.children, (groupChild) => {
        if (React.isValidElement(groupChild) && groupChild.type === ComboboxItem) {
          items.push(groupChild as ComboboxItemElement)
        }
      })
      entries.push({ entryType: 'group', key: `group-${index}`, label: groupProps.label, items })
      return
    }
    if (child.type === ComboboxItem) {
      entries.push(child as ComboboxItemElement)
    }
  })
  return entries
}

// Same shape as `buildEntriesFromChildren`, from a flat `MenuItemsDef` instead. A `'header'`
// entry opens a new group that all following items join until the next header (or the end of
// the array) — matching how chassis-css itself renders grouped items (flat siblings, no
// wrapping element per group). `'divider'` entries aren't meaningful for a listbox/option
// collection and are skipped.
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
      <ComboboxItem
        key={def.id}
        id={def.id}
        disabled={def.disabled}
        icon={def.icon}
        description={def.description}
        textValue={def.textValue}
      >
        {def.label}
      </ComboboxItem>
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

const renderComboboxItem = (item: ComboboxItemElement) => (
  <Item
    key={item.props.id}
    textValue={
      item.props.textValue ??
      (typeof item.props.children === 'string' ? item.props.children : undefined)
    }
  >
    {renderMenuItemContent({
      icon: item.props.icon,
      label: item.props.children,
      description: item.props.description
    })}
  </Item>
)

export interface ComboboxProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  /**
   * An accessible label for the combobox, used when there's no visible `<label>`.
   */
  'aria-label'?: string
  /**
   * Identifies a visible `<label>` element for the combobox.
   */
  'aria-labelledby'?: string
  /**
   * `ComboboxItem` elements, optionally wrapped in `ComboboxGroup` — read as data by
   * `Combobox` to build the option list. Not rendered directly. Ignored when `items` is set.
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
   * Prevents the combobox from being focused or interacted with.
   */
  disabled?: boolean
  /**
   * A description for the field, rendered below the combobox.
   */
  help?: ReactNode
  /**
   * `id` forwarded to the input element — useful for pairing with a `<label for>`.
   */
  id?: string
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean
  /**
   * An error message for the field, rendered below the combobox when `invalid` is set.
   */
  invalidFeedback?: ReactNode
  /**
   * Array of item/header/divider definitions for data-driven rendering. When provided, children
   * are ignored. A `'header'` entry starts a group that all following items join until the next
   * header or the end of the array. `'divider'` entries are a no-op here (dividers aren't
   * meaningful for a listbox/option collection) — use `ComboboxGroup` composition instead if
   * you need finer control over grouping.
   */
  items?: MenuItemsDef
  /**
   * The field's caption, rendered as a `FormLabel` associated with the input.
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
   * Placeholder shown in the input when nothing is selected.
   */
  placeholder?: string
  /**
   * Size the component small or large.
   */
  size?: 'small' | 'large'
  /**
   * Set component validation state to valid.
   */
  valid?: boolean
  /**
   * A success message for the field, rendered below the combobox when `valid` is set.
   */
  validFeedback?: ReactNode
  /**
   * The selected option's id (controlled).
   */
  value?: Key | null
}

export const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      'aria-describedby': ariaDescribedBy,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
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
      size,
      valid,
      validFeedback,
      value,
      ...rest
    }: ComboboxProps,
    ref
  ): ReactNode => {
    // `entries`/`disabledKeys` only need to change when the data driving them does — without this,
    // both re-derive from scratch on every render, including every keystroke while typing.
    const entries = useMemo(
      () => (items ? buildEntriesFromItemsDef(items) : buildEntriesFromChildren(children)),
      [items, children]
    )
    const disabledKeys = useMemo(() => getDisabledKeys(entries), [entries])

    // Case- and accent-insensitive substring matching, mirroring chassis-css's own
    // always-case-insensitive combobox.js filtering.
    const { contains } = useFilter({ sensitivity: 'base' })

    const state = useComboBoxState<ComboboxEntry>({
      children: (entry) =>
        isComboboxGroupEntry(entry) ? (
          <Section key={entry.key} title={entry.label} items={entry.items}>
            {renderComboboxItem}
          </Section>
        ) : (
          renderComboboxItem(entry)
        ),
      defaultItems: entries,
      disabledKeys,
      defaultFilter: contains,
      defaultValue,
      value,
      onChange,
      allowsEmptyCollection: true,
      // Matches chassis-css's vanilla combobox.js: the menu opens on focus, not only once the
      // user starts typing.
      menuTrigger: 'focus'
    })

    const wrapperRef = useRef<HTMLDivElement>(null)
    const forkedWrapperRef = useForkedRef(ref, wrapperRef)
    const inputRef = useRef<HTMLInputElement>(null)
    const listBoxRef = useRef<HTMLElement>(null)
    const popoverRef = useRef<HTMLDivElement>(null)
    const noResultsId = useId()

    const { describedBy, feedbackId, helpId, inputId, labelId, labelledBy } = useFormField({
      ariaDescribedBy,
      ariaLabelledBy,
      help,
      id,
      invalid,
      invalidFeedback,
      label,
      valid,
      validFeedback
    })

    const { inputProps, listBoxProps } = useComboBox<ComboboxEntry>(
      {
        'aria-label': ariaLabel,
        'aria-labelledby': labelledBy,
        id: inputId,
        inputRef,
        listBoxRef,
        popoverRef,
        isDisabled: disabled,
        placeholder
      },
      state
    )

    const { overlayProps, placement: resolvedPlacement } = useOverlayPosition({
      targetRef: wrapperRef,
      overlayRef: popoverRef,
      placement: toAriaPlacement('bottom-start'),
      offset: 2,
      isOpen: state.isOpen,
      // Leaving `onClose` unset doesn't actually disable react-aria's close-on-scroll listener —
      // only an explicit `null` does. Matches the fix already applied to `Autocomplete`'s identical
      // positioning call.
      onClose: null
    })

    // Portals the panel to `document.body` (or an enclosing open `<dialog>`) instead of rendering
    // it inline, matching `Popover`/`Tooltip` — an inline-rendered panel gets clipped by any
    // ancestor with `overflow: hidden`/`auto` (a `ModalBody`, a scrollable card, a table cell), and
    // `Combobox` is commonly composed inside exactly those. See `COMBOBOX_MENU_OVERLAY_STYLE` for
    // the styling this trades away by leaving the DOM position `.combobox + .menu` relies on.
    const portalContainer = useFloatingOverlay({
      close: state.close,
      isOpen: state.isOpen,
      open: state.open,
      triggerRef: wrapperRef
    })

    const overlayStyle: React.CSSProperties = {
      ...COMBOBOX_MENU_OVERLAY_STYLE,
      position: overlayProps.style?.position as React.CSSProperties['position'],
      top: overlayProps.style?.top,
      left: overlayProps.style?.left
    }
    const placementAttr = resolveDataPlacement('bottom-start', resolvedPlacement)

    const inputHtmlProps = inputProps as InputHTMLAttributes<HTMLInputElement>
    const showNoResults = state.collection.size === 0
    // Merges the no-results message into the input's own description (for AT that reads
    // descriptions on demand) in addition to the `aria-live` region below (for AT that announces
    // live-region changes proactively as the user types) — belt and braces, since screen reader
    // support for announcing a freshly-mounted live region is inconsistent.
    const inputDescribedBy =
      [describedBy, showNoResults && noResultsId].filter(Boolean).join(' ') || undefined

    return renderFormField({
      children: (
        <>
          <div
            className={classNames(
              'form-input',
              'combobox',
              size,
              { disabled },
              validationClassName(invalid, valid),
              className
            )}
            ref={forkedWrapperRef}
            {...rest}
          >
            <input
              autoComplete="off"
              className="combobox-value"
              {...inputHtmlProps}
              aria-describedby={inputDescribedBy}
              aria-invalid={invalid || undefined}
              ref={inputRef}
            />
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
                <ComboboxListBox
                  state={state}
                  listBoxProps={listBoxProps}
                  listBoxRef={listBoxRef}
                />
                {showNoResults && (
                  <div className="combobox-no-results" id={noResultsId} role="status">
                    {noResultsText}
                  </div>
                )}
              </div>,
              portalContainer ?? document.body
            )}
          {name && (
            <input type="hidden" name={name} value={state.value ?? ''} disabled={disabled} />
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
)

Combobox.displayName = 'Combobox'
