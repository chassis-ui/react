import React, { HTMLAttributes, InputHTMLAttributes, ReactElement, ReactNode, useRef } from 'react'
import classNames from 'classnames'
import { useComboBox, useFilter, useOverlayPosition } from 'react-aria'
import { Item, Key, useComboBoxState } from 'react-stately'

import { useFormField } from '../../hooks'
import { resolveDataPlacement, toAriaPlacement } from '../../utils/overlayPlacement'
import { renderFormField } from '../form-field/renderFormField'
import { renderMenuItemContent } from '../menu/renderMenuItemContent'
import { CxComboboxItemProps } from './CxComboboxItem'
import { ComboboxListBox } from './ComboboxListBox'

export interface CxComboboxProps extends Omit<
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
   * `CxComboboxItem` elements — read as data by `CxCombobox` to build the option list. Not
   * rendered directly.
   */
  children: ReactNode
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
   * The field's caption, rendered as a `CxFormLabel` associated with the input.
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

export const CxCombobox = ({
  children,
  className,
  defaultValue,
  disabled,
  help,
  id,
  invalid,
  invalidFeedback,
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
}: CxComboboxProps) => {
  const items = React.Children.toArray(children).filter(
    (child): child is ReactElement<CxComboboxItemProps> => React.isValidElement(child)
  )

  // Case- and accent-insensitive substring matching, mirroring chassis-css's own
  // always-case-insensitive combobox.js filtering.
  const { contains } = useFilter({ sensitivity: 'base' })

  const state = useComboBoxState<ReactElement<CxComboboxItemProps>>({
    children: (item) => (
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
    ),
    defaultItems: items,
    disabledKeys: items.filter((item) => item.props.disabled).map((item) => item.props.id),
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

  const { inputProps, listBoxProps } = useComboBox<ReactElement<CxComboboxItemProps>>(
    {
      'aria-label': rest['aria-label'],
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
    isOpen: state.isOpen
  })

  const overlayStyle: React.CSSProperties = {
    position: overlayProps.style?.position as React.CSSProperties['position'],
    top: overlayProps.style?.top,
    left: overlayProps.style?.left
  }
  const placementAttr = resolveDataPlacement('bottom-start', resolvedPlacement)

  const inputHtmlProps = inputProps as InputHTMLAttributes<HTMLInputElement>

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
          ref={wrapperRef}
          {...rest}
        >
          <input
            autoComplete="off"
            className="combobox-value"
            {...inputHtmlProps}
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            ref={inputRef}
          />
        </div>
        <div
          className={classNames('menu', { show: state.isOpen })}
          role="listbox"
          data-cx-placement={placementAttr}
          style={overlayStyle}
          hidden={!state.isOpen}
          ref={popoverRef}
        >
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

CxCombobox.displayName = 'CxCombobox'
