import React, { HTMLAttributes, InputHTMLAttributes, ReactElement, ReactNode, useRef } from 'react'
import classNames from 'classnames'
import { useComboBox, useFilter, useOverlayPosition } from 'react-aria'
import { Item, Key, useComboBoxState } from 'react-stately'

import { resolveDataPlacement, toAriaPlacement } from '../../utils/overlayPlacement'
import { CComboboxItemProps } from './CxComboboxItem'
import { ComboboxListBox } from './ComboboxListBox'

export interface CComboboxProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
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
   * `id` forwarded to the input element — useful for pairing with a `<label for>`.
   */
  id?: string
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
   * The selected option's id (controlled).
   */
  value?: Key | null
}

export const CxCombobox = ({
  children,
  className,
  defaultValue,
  disabled,
  id,
  name,
  noResultsText = 'No results found',
  onChange,
  placeholder,
  size,
  value,
  ...rest
}: CComboboxProps) => {
  const items = React.Children.toArray(children).filter(
    (child): child is ReactElement<CComboboxItemProps> => React.isValidElement(child),
  )

  // Case- and accent-insensitive substring matching, mirroring chassis-css's own
  // always-case-insensitive combobox.js filtering.
  const { contains } = useFilter({ sensitivity: 'base' })

  const state = useComboBoxState<ReactElement<CComboboxItemProps>>({
    children: (item) => (
      <Item
        key={item.props.id}
        textValue={typeof item.props.children === 'string' ? item.props.children : undefined}
      >
        {item.props.children}
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
    menuTrigger: 'focus',
  })

  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listBoxRef = useRef<HTMLElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const { inputProps, listBoxProps } = useComboBox<ReactElement<CComboboxItemProps>>(
    {
      'aria-label': rest['aria-label'],
      'aria-labelledby': rest['aria-labelledby'],
      id,
      inputRef,
      listBoxRef,
      popoverRef,
      isDisabled: disabled,
      placeholder,
    },
    state,
  )

  const { overlayProps, placement: resolvedPlacement } = useOverlayPosition({
    targetRef: wrapperRef,
    overlayRef: popoverRef,
    placement: toAriaPlacement('bottom-start'),
    offset: 2,
    isOpen: state.isOpen,
  })

  const overlayStyle: React.CSSProperties = {
    position: overlayProps.style?.position as React.CSSProperties['position'],
    top: overlayProps.style?.top,
    left: overlayProps.style?.left,
  }
  const placementAttr = resolveDataPlacement('bottom-start', resolvedPlacement)

  const inputHtmlProps = inputProps as InputHTMLAttributes<HTMLInputElement>

  return (
    <>
      <div
        className={classNames(
          'form-input',
          'combobox',
          { small: size === 'small', large: size === 'large', disabled },
          className,
        )}
        ref={wrapperRef}
        {...rest}
      >
        <input className="combobox-value" autoComplete="off" {...inputHtmlProps} ref={inputRef} />
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
        {state.collection.size === 0 && <div className="combobox-no-results">{noResultsText}</div>}
      </div>
      {name && (
        <input type="hidden" name={name} value={state.selectedKey ?? ''} disabled={disabled} />
      )}
    </>
  )
}

CxCombobox.displayName = 'CxCombobox'
