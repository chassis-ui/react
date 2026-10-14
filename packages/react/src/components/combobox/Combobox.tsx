import React, {
  forwardRef,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef
} from 'react'
import classNames from 'classnames'
import { useComboBox, useFilter, useOverlayPosition } from 'react-aria'
import { Key, useComboBoxState } from 'react-stately'

import {
  useFloatingOverlay,
  useForkedRef,
  useFormField,
  useHeldBack,
  useOverlayMaxHeight
} from '../../hooks'
import { useHydrated } from '../../hooks/useHydrated'
import { joinIds } from '../../utils/idRefs'
import {
  buildEntriesFromChildren,
  buildEntriesFromItemsDef,
  ComboboxEntry,
  comboboxCollectionChildren,
  getDisabledKeys
} from './comboboxCollection'
import {
  COMBOBOX_MENU_OVERLAY_STYLE,
  resolveMenuOverlayPositioning,
  toAriaPlacement
} from '../../utils/overlayPlacement'
import { Portal } from '../portal/Portal'
import { validationClassName } from '../../utils/validationClassName'
import { renderFormField } from '../form-field/renderFormField'
import { MenuItemsDef } from '../menu/MenuItemDef'
import { ComboboxGroup } from './ComboboxGroup'
import { ComboboxItem } from './ComboboxItem'
import { ComboboxListBox } from './ComboboxListBox'

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
   * Set component validation state to invalid. Left unset, the component shows as invalid by itself
   * from a submit it held back (an empty `required` one, say) until it no longer would, or its
   * form is reset. Set it, to `false` too, and it alone decides.
   */
  invalid?: boolean
  /**
   * An error message for the field, rendered below the combobox when `invalid` is set, and after a
   * submit the field held back, until it no longer would.
   */
  invalidFeedback?: ReactNode
  /**
   * Array of item/header/divider definitions for data-driven rendering. When provided, children
   * are ignored. A `'header'` entry starts a group that all following items join until the next
   * header or the end of the array. `'divider'` entries are a no-op here (dividers aren't
   * meaningful for a listbox/option collection) — use `ComboboxGroup` composition instead if
   * you need finer control over grouping. An entry's `href`/`onClick` are `Menu`-only and are not
   * read here — use `onChange` to react to the selection instead.
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
   * Toggle the required state for the component. A required combobox with no option selected
   * holds its form back from submitting, and takes focus: text typed without selecting an option
   * is not a value.
   */
  required?: boolean
  /**
   * Size the component sm or lg.
   */
  size?: 'sm' | 'lg'
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

// See `unselectedText`.
const UNSELECTED_TEXT_MESSAGE = 'Select an option from the list.'

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
      invalid: invalidProp,
      invalidFeedback,
      items,
      label,
      name,
      noResultsText = 'No results found',
      onChange,
      placeholder,
      required,
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
      () =>
        items
          ? buildEntriesFromItemsDef(items)
          : buildEntriesFromChildren(children, { Group: ComboboxGroup, Item: ComboboxItem }),
      [items, children]
    )
    const disabledKeys = useMemo(() => getDisabledKeys(entries), [entries])

    // Case- and accent-insensitive substring matching, mirroring chassis-css's own
    // always-case-insensitive combobox.js filtering.
    const { contains } = useFilter({ sensitivity: 'base' })

    const state = useComboBoxState<ComboboxEntry>({
      children: comboboxCollectionChildren,
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
    // Shown as invalid from a submit it held back until it no longer would (`useHeldBack`):
    // react-aria cancels the browser's own message, and the form stayed with nothing to say why.
    const { invalid } = useHeldBack(inputRef, { invalid: invalidProp, valid })
    const popoverRef = useRef<HTMLDivElement>(null)
    const noResultsId = useId()
    const hydrated = useHydrated()

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
        isRequired: required,
        placeholder
      },
      state
    )

    // `required` asks for what the form submits under `name`: the selected option's id, not the
    // text in the input. The native attribute on the input covers an empty one, and the two agree
    // nearly always, since react-stately puts the selection's text back, none without one, when
    // the list closes: on blur, Enter and Escape. Not while the user is still typing, though, and
    // a form submitted then (a shortcut or a timer that calls `requestSubmit()`) would go with
    // text in the input and nothing under `name`. A custom validity covers that: text with no
    // selection is invalid too. The message is never shown: react-aria cancels the input's
    // `invalid` event, which keeps a browser's bubble away, and focuses the input instead.
    const unselectedText = Boolean(required) && state.value == null && state.inputValue !== ''
    useEffect(() => {
      inputRef.current?.setCustomValidity(unselectedText ? UNSELECTED_TEXT_MESSAGE : '')
    }, [unselectedText])

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
    useOverlayMaxHeight(popoverRef, state.isOpen)

    // Portals the panel to `document.body` (or an enclosing open `<dialog>`) instead of rendering
    // it inline, matching `Popover`/`Tooltip` — an inline-rendered panel gets clipped by any
    // ancestor with `overflow: hidden`/`auto` (a `ModalBody`, a scrollable card, a table cell), and
    // `Combobox` is commonly composed inside exactly those. See `COMBOBOX_MENU_OVERLAY_STYLE` for
    // the styling this trades away by leaving the DOM position `.combobox + .menu` relies on.
    const portalContainer = useFloatingOverlay({
      close: state.close,
      isOpen: state.isOpen,
      triggerRef: wrapperRef
    })

    const { menuStyle, placementAttr } = resolveMenuOverlayPositioning(
      overlayProps.style,
      'bottom-start',
      resolvedPlacement
    )
    const overlayStyle: React.CSSProperties = { ...COMBOBOX_MENU_OVERLAY_STYLE, ...menuStyle }

    const inputHtmlProps = inputProps as InputHTMLAttributes<HTMLInputElement>
    const showNoResults = state.collection.size === 0
    // Merges the no-results message into the input's own description (for AT that reads
    // descriptions on demand) in addition to the `aria-live` region below (for AT that announces
    // live-region changes proactively as the user types) — belt and braces, since screen reader
    // support for announcing a freshly-mounted live region is inconsistent. Only once hydrated:
    // the message is inside `Portal`, which renders nothing on the server and while hydrating, so
    // an empty combobox's server HTML referred to an id no element had.
    const inputDescribedBy = joinIds(describedBy, showNoResults && hydrated && noResultsId)

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
              // The native `required` below says the same.
              aria-required={undefined}
              ref={inputRef}
              // On the visible input, not the hidden one that carries `name`: a hidden input is
              // barred from constraint validation (FORMS.md, gotcha 9). react-aria writes
              // `aria-required` alone, which no form checks. A disabled input isn't validated;
              // the combobox has no read-only state to leave out.
              required={required || undefined}
            />
          </div>
          <Portal container={portalContainer}>
            <div
              className={classNames('menu', { show: state.isOpen })}
              data-cx-placement={placementAttr}
              style={overlayStyle}
              hidden={!state.isOpen}
              ref={popoverRef}
            >
              <ComboboxListBox state={state} listBoxProps={listBoxProps} listBoxRef={listBoxRef} />
              {showNoResults && (
                <div className="combobox-no-results" id={noResultsId} role="status">
                  {noResultsText}
                </div>
              )}
            </div>
          </Portal>
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
