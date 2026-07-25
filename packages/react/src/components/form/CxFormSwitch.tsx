import React, { forwardRef, InputHTMLAttributes, ReactNode, useRef } from 'react'
import classNames from 'classnames'
import { useSwitch } from 'react-aria'
import { useToggleState } from 'react-stately'

import { useForkedRef } from '../../utils/hooks'

import { CxFormLabel } from './CxFormLabel'

export interface CxFormSwitchProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'checked' | 'defaultChecked' | 'onChange' | 'size'
  > {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Whether the switch is selected, uncontrolled.
   */
  defaultSelected?: boolean
  /**
   * The id global attribute defines an identifier (ID) that must be unique in the whole document.
   */
  id?: string
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean
  /**
   * Whether the switch is selected, controlled.
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
   * Size the component large or extra large. Works only with `switch` [docs]
   */
  size?: 'large' | 'xlarge'
  /**
   * Specifies the type of component.
   */
  type?: 'checkbox' | 'radio'
  /**
   * Set component validation state to valid.
   */
  valid?: boolean
}

export const CxFormSwitch = forwardRef<HTMLInputElement, CxFormSwitchProps>(
  (
    {
      className,
      defaultSelected,
      disabled,
      id,
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

    // Same split as CxFormCheck: react-aria's radio hooks need a grouped API this flat component
    // doesn't have, so radio-type switches stay native, translated to the same
    // isSelected/defaultSelected/onChange(boolean) shape as the checkbox path.
    const toggleState = useToggleState({
      defaultSelected,
      isDisabled: disabled,
      isSelected,
      onChange: isCheckbox ? onChange : undefined,
    })

    const { inputProps: switchProps } = useSwitch(
      {
        ...rest,
        children: label,
        isDisabled: disabled,
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
      'form-check form-switch',
      {
        [`form-switch-${size}`]: size,
        'is-invalid': invalid,
        'is-valid': valid,
      },
      className,
    )

    const inputClassName = classNames('form-check-input', {
      'is-invalid': invalid,
      'is-valid': valid,
    })
    const labelClassName = classNames('form-check-label')

    return (
      <div className={_className}>
        {isCheckbox ? (
          <input {...switchProps} className={inputClassName} id={id} ref={forkedRef} />
        ) : (
          <input {...radioProps} className={inputClassName} id={id} ref={forkedRef} />
        )}
        {label && (
          <CxFormLabel customClassName={labelClassName} {...(id && { htmlFor: id })}>
            {label}
          </CxFormLabel>
        )}
      </div>
    )
  },
)

CxFormSwitch.displayName = 'CxFormSwitch'
