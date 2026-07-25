import React, { forwardRef, InputHTMLAttributes, ReactNode, useRef } from 'react'
import classNames from 'classnames'
import { useCheckbox } from 'react-aria'
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
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'checked' | 'defaultChecked' | 'onChange'> {
  /**
   * Create button-like checkboxes and radio buttons.
   */
  button?: ButtonObject
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Whether the input is selected, uncontrolled.
   */
  defaultSelected?: boolean
  /**
   * Sets hit area to the full area of the component.
   */
  hitArea?: 'full'
  /**
   * The id global attribute defines an identifier (ID) that must be unique in the whole document.
   */
  id?: string
  /**
   * Input Checkbox indeterminate Property. Only applies to `type="checkbox"`.
   */
  indeterminate?: boolean
  /**
   * Group checkboxes or radios on the same horizontal row by adding.
   */
  inline?: boolean
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
      defaultSelected,
      disabled,
      hitArea,
      id,
      indeterminate,
      inline,
      invalid,
      isSelected,
      label,
      onChange,
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
      },
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

    const _className = classNames(
      'form-check',
      {
        'form-check-inline': inline,
        'is-invalid': invalid,
        'is-valid': valid,
      },
      className,
    )

    const inputClassName = classNames(button ? 'button-check' : 'check-input', {
      'is-invalid': invalid,
      'is-valid': valid,
      'me-2': hitArea,
    })
    const labelClassName = classNames(
      button
        ? classNames('button', button.context, button.variant, button.size, button.shape)
        : 'check-label',
    )

    const formControl = () =>
      isCheckbox ? (
        <input {...checkboxProps} className={inputClassName} id={id} ref={forkedRef} />
      ) : (
        <input {...radioProps} className={inputClassName} id={id} ref={forkedRef} />
      )

    const formLabel = () => {
      return (
        <CxFormLabel customClassName={labelClassName} {...(id && { htmlFor: id })}>
          {label}
        </CxFormLabel>
      )
    }

    return button ? (
      <>
        {formControl()}
        {label && formLabel()}
      </>
    ) : label ? (
      hitArea ? (
        <CxFormLabel customClassName={className} {...(id && { htmlFor: id })}>
          {formControl()}
          {label}
        </CxFormLabel>
      ) : (
        <div className={_className}>
          {formControl()}
          {formLabel()}
        </div>
      )
    ) : (
      formControl()
    )
  },
)

CxFormCheck.displayName = 'CxFormCheck'
