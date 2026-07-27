import React, { forwardRef, InputHTMLAttributes, ReactNode, useContext, useRef } from 'react'
import classNames from 'classnames'
import {
  AriaCheckboxGroupItemProps,
  AriaCheckboxProps,
  useCheckbox,
  useCheckboxGroupItem
} from 'react-aria'
import { CheckboxGroupState, useToggleState } from 'react-stately'

import { useForkedRef } from '../../utils/hooks'
import { ContextColor } from '../Types'

import { CxCheckboxGroupContext } from './context'
import { ButtonObject, renderFormCheckControl } from './formCheckRender'

export type { ButtonObject } from './formCheckRender'

export interface CxFormCheckProps extends Omit<
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
   * Whether the checkbox is selected, uncontrolled. Ignored when rendered inside a `<CxFormCheckGroup>` —
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
   * Whether the checkbox is selected, controlled. Ignored when rendered inside a `<CxFormCheckGroup>` —
   * the group's `value`/`defaultValue` owns selection there.
   */
  isSelected?: boolean
  /**
   * The element represents a caption for a component.
   */
  label?: string | ReactNode
  /**
   * Callback fired when the selected state changes. Ignored when rendered inside a `<CxFormCheckGroup>` —
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
   * `<CxFormCheckGroup>` — it identifies this item within the group's selected values.
   */
  value?: string
}

const CxFormCheckStandalone = forwardRef<HTMLInputElement, CxFormCheckProps>(
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

    return renderFormCheckControl({
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
CxFormCheckStandalone.displayName = 'CxFormCheckStandalone'

interface CxFormCheckGroupItemProps extends CxFormCheckProps {
  groupState: CheckboxGroupState
}

const CxFormCheckGroupItem = forwardRef<HTMLInputElement, CxFormCheckGroupItemProps>(
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
        'CxFormCheck: a `value` prop is required when rendered inside a CxFormCheckGroup.'
      )
    }
    if (_defaultSelected !== undefined || _isSelected !== undefined || _onChange !== undefined) {
      console.warn(
        'CxFormCheck: `defaultSelected`, `isSelected`, and `onChange` are ignored inside a ' +
          "CxFormCheckGroup — selection is owned by the group's `value`/`defaultValue`/`onChange`."
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

    return renderFormCheckControl({
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
CxFormCheckGroupItem.displayName = 'CxFormCheckGroupItem'

export const CxFormCheck = forwardRef<HTMLInputElement, CxFormCheckProps>((props, ref) => {
  const groupState = useContext(CxCheckboxGroupContext)
  return groupState ? (
    <CxFormCheckGroupItem {...props} groupState={groupState} ref={ref} />
  ) : (
    <CxFormCheckStandalone {...props} ref={ref} />
  )
})

CxFormCheck.displayName = 'CxFormCheck'
