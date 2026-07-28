import React, { forwardRef, InputHTMLAttributes, ReactNode, useContext, useRef } from 'react'
import classNames from 'classnames'
import {
  AriaCheckboxGroupItemProps,
  AriaCheckboxProps,
  useCheckbox,
  useCheckboxGroupItem
} from 'react-aria'
import { CheckboxGroupState, useToggleState } from 'react-stately'

import { useForkedRef } from '../../hooks'
import { ContextColor } from '../Types'

import { CxCheckboxGroupContext } from './context'
import { ButtonObject, renderFormCheck } from '../form/renderFormCheck'

export type { ButtonObject } from '../form/renderFormCheck'

export interface CxCheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'checked' | 'defaultChecked' | 'onChange' | 'size'
> {
  /**
   * Create button-like checkboxes.
   */
  button?: ButtonObject
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the context of the check indicator to one of Chassis themed colors. Ignored when `button` is set.
   */
  context?: ContextColor
  /**
   * Whether the checkbox is selected, uncontrolled. Ignored when rendered inside a `<CxCheckboxGroup>` —
   * the group's `value`/`defaultValue` owns selection there.
   */
  defaultSelected?: boolean
  /**
   * The id global attribute defines an identifier (ID) that must be unique in the whole document.
   */
  id?: string
  /**
   * Checkbox indeterminate property.
   */
  indeterminate?: boolean
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean
  /**
   * Whether the checkbox is selected, controlled. Ignored when rendered inside a `<CxCheckboxGroup>` —
   * the group's `value`/`defaultValue` owns selection there.
   */
  isSelected?: boolean
  /**
   * The element represents a caption for a component.
   */
  label?: string | ReactNode
  /**
   * Callback fired when the selected state changes. Ignored when rendered inside a `<CxCheckboxGroup>` —
   * use the group's `onChange` instead.
   */
  onChange?: (isSelected: boolean) => void
  /**
   * Size the component small or large.
   */
  size?: 'small' | 'large'
  /**
   * Set component validation state to valid.
   */
  valid?: boolean
  /**
   * The value of the checkbox, used when submitting an HTML form. Required when rendered inside a
   * `<CxCheckboxGroup>` — it identifies this item within the group's selected values.
   */
  value?: string
}

const CxCheckboxStandalone = forwardRef<HTMLInputElement, CxCheckboxProps>(
  (
    {
      button,
      className,
      context,
      defaultSelected,
      disabled,
      id,
      indeterminate,
      invalid,
      isSelected,
      label,
      onChange,
      size,
      valid,
      ...rest
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const forkedRef = useForkedRef(ref, inputRef)

    const toggleState = useToggleState({
      defaultSelected,
      isDisabled: disabled,
      isSelected,
      onChange
    })

    const { inputProps } = useCheckbox(
      {
        ...rest,
        children: label,
        isDisabled: disabled,
        isIndeterminate: indeterminate,
        value: rest.value as string | undefined
      } as AriaCheckboxProps,
      toggleState,
      inputRef
    )

    const inputClassName = classNames({ 'is-invalid': invalid, 'is-valid': valid })

    return renderFormCheck({
      button,
      className,
      context,
      input: <input {...inputProps} className={inputClassName} id={id} ref={forkedRef} />,
      invalid,
      label,
      size,
      valid
    })
  }
)
CxCheckboxStandalone.displayName = 'CxCheckboxStandalone'

interface CxCheckboxGroupItemProps extends CxCheckboxProps {
  groupState: CheckboxGroupState
}

const CxCheckboxGroupItem = forwardRef<HTMLInputElement, CxCheckboxGroupItemProps>(
  (
    {
      button,
      className,
      context,
      defaultSelected: _defaultSelected,
      disabled,
      groupState,
      id,
      indeterminate,
      invalid,
      isSelected: _isSelected,
      label,
      onChange: _onChange,
      size,
      valid,
      ...rest
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const forkedRef = useForkedRef(ref, inputRef)

    if (!rest.value) {
      console.error(
        'CxCheckbox: a `value` prop is required when rendered inside a CxCheckboxGroup.'
      )
    }
    if (_defaultSelected !== undefined || _isSelected !== undefined || _onChange !== undefined) {
      console.warn(
        'CxCheckbox: `defaultSelected`, `isSelected`, and `onChange` are ignored inside a ' +
          "CxCheckboxGroup — selection is owned by the group's `value`/`defaultValue`/`onChange`."
      )
    }

    const { inputProps } = useCheckboxGroupItem(
      {
        ...rest,
        children: label,
        isDisabled: disabled,
        isIndeterminate: indeterminate,
        value: rest.value as string
      } as AriaCheckboxGroupItemProps,
      groupState,
      inputRef
    )

    const inputClassName = classNames({ 'is-invalid': invalid, 'is-valid': valid })

    return renderFormCheck({
      button,
      className,
      context,
      input: <input {...inputProps} className={inputClassName} id={id} ref={forkedRef} />,
      invalid,
      label,
      size,
      valid
    })
  }
)
CxCheckboxGroupItem.displayName = 'CxCheckboxGroupItem'

export const CxCheckbox = forwardRef<HTMLInputElement, CxCheckboxProps>((props, ref) => {
  const groupState = useContext(CxCheckboxGroupContext)
  return groupState ? (
    <CxCheckboxGroupItem {...props} groupState={groupState} ref={ref} />
  ) : (
    <CxCheckboxStandalone {...props} ref={ref} />
  )
})

CxCheckbox.displayName = 'CxCheckbox'
