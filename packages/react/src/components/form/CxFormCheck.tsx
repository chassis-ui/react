import React, { forwardRef, InputHTMLAttributes, ReactNode, useRef } from 'react'
import classNames from 'classnames'
import { AriaCheckboxProps, useCheckbox } from 'react-aria'
import { useToggleState } from 'react-stately'

import { useForkedRef } from '../../utils/hooks'
import { ContextColor, Shapes } from '../Types'

import { CxFormLabel } from './CxFormLabel'

export type ButtonObject = {
  /**
   * Sets the context context of the component to one of Chassis themed colors.
   */
  context?: ContextColor
  /**
   * Select the shape of the component.
   */
  shape?: Shapes
  /**
   * Size the component small or large.
   */
  size?: 'small' | 'large'
  /**
   * Set the button variant to an outlined button or a ghost button.
   */
  variant?: 'outline' | 'ghost'
}

export interface CxFormCheckProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'checked' | 'defaultChecked' | 'onChange' | 'size'
  > {
  /**
   * Create button-like checkboxes and radio buttons.
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
   * Whether the input is selected, uncontrolled.
   */
  defaultSelected?: boolean
  /**
   * The id global attribute defines an identifier (ID) that must be unique in the whole document.
   */
  id?: string
  /**
   * Input Checkbox indeterminate Property. Only applies to `type="checkbox"`.
   */
  indeterminate?: boolean
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean
  /**
   * Whether the input is selected, controlled.
   */
  isSelected?: boolean
  /**
   * The element represents a caption for a component.
   */
  label?: string | ReactNode
  /**
   * Callback fired when the selected state changes.
   */
  onChange?: (isSelected: boolean) => void
  /**
   * Size the component small or large.
   */
  size?: 'small' | 'large'
  /**
   * Specifies the type of component.
   */
  type?: 'checkbox' | 'radio'
  /**
   * Set component validation state to valid.
   */
  valid?: boolean
}

export const CxFormCheck = forwardRef<HTMLInputElement, CxFormCheckProps>(
  (
    {
      className,
      button,
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
      type = 'checkbox',
      valid,
      ...rest
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const forkedRef = useForkedRef(ref, inputRef)
    const isCheckbox = type === 'checkbox'

    // Radios stay on native semantics — react-aria's radio hooks (useRadioGroupState/useRadio)
    // require a grouped API that doesn't fit CxFormCheck's flat, ungrouped design (no
    // CxFormRadioGroup wrapper exists). They still share the same
    // isSelected/defaultSelected/onChange(boolean) shape as checkboxes, translated from the
    // native change event, so both types have one consistent public API.
    const toggleState = useToggleState({
      defaultSelected,
      isDisabled: disabled,
      isSelected,
      onChange: isCheckbox ? onChange : undefined,
    })

    const { inputProps: checkboxProps } = useCheckbox(
      {
        ...rest,
        children: label,
        isDisabled: disabled,
        isIndeterminate: indeterminate,
        value: rest.value as string | undefined,
      } as AriaCheckboxProps,
      toggleState,
      inputRef,
    )

    const radioProps = {
      ...rest,
      checked: isSelected,
      defaultChecked: defaultSelected,
      disabled,
      onChange: onChange
        ? (event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.checked)
        : undefined,
      type: 'radio' as const,
    }

    const inputClassName = classNames({
      'is-invalid': invalid,
      'is-valid': valid,
    })

    const input = isCheckbox ? (
      <input {...checkboxProps} className={inputClassName} id={id} ref={forkedRef} />
    ) : (
      <input {...radioProps} className={inputClassName} id={id} ref={forkedRef} />
    )

    if (button) {
      const _className = classNames(
        'button',
        'button-check',
        button.context,
        button.variant,
        button.size,
        button.shape,
        className,
      )
      return (
        <CxFormLabel customClassName={_className}>
          {input}
          {label}
        </CxFormLabel>
      )
    }

    const checkInputClassName = classNames('check-input', context, {
      'is-invalid': invalid,
      'is-valid': valid,
    })

    if (!label) {
      return <span className={checkInputClassName}>{input}</span>
    }

    const _className = classNames(
      'form-check',
      size,
      {
        'is-invalid': invalid,
        'is-valid': valid,
      },
      className,
    )

    return (
      <CxFormLabel customClassName={_className}>
        <span className={checkInputClassName}>{input}</span>
        {label}
      </CxFormLabel>
    )
  },
)

CxFormCheck.displayName = 'CxFormCheck'
