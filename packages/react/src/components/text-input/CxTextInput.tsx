import React, { forwardRef, InputHTMLAttributes, useRef } from 'react'
import classNames from 'classnames'
import { AriaTextFieldProps, useTextField } from 'react-aria'

import { useForkedRef } from '../../utils/hooks'

export interface CxTextInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'defaultValue' | 'onChange' | 'size' | 'value'
> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * The value of the input, uncontrolled.
   */
  defaultValue?: string
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean
  /**
   * Handler that is called when the value changes.
   */
  onChange?: (value: string) => void
  /**
   * Render the component styled as plain text. Removes the default form field styling and preserve the correct margin and padding. Recommend to use only along side `readonly` [docs]
   */
  plainText?: boolean
  /**
   * Toggle the readonly state for the component.
   */
  readOnly?: boolean
  /**
   * Size the component small or large.
   */
  size?: 'small' | 'large'
  /**
   * Specifies the type of component.
   */
  type?: 'color' | 'file' | 'text' | string
  /**
   * Set component validation state to valid.
   */
  valid?: boolean
  /**
   * The value of the input, controlled.
   */
  value?: string
}

export const CxTextInput = forwardRef<HTMLInputElement, CxTextInputProps>(
  (
    { className, disabled, invalid, plainText, readOnly, size, type = 'text', valid, ...rest },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const forkedRef = useForkedRef(ref, inputRef)

    const { inputProps } = useTextField(
      {
        ...rest,
        isDisabled: disabled,
        isInvalid: invalid,
        isReadOnly: readOnly,
        type
      } as AriaTextFieldProps,
      inputRef
    )

    const _className = classNames(
      'form-input',
      plainText && 'plaintext',
      size,
      {
        'is-invalid': invalid,
        'is-valid': valid
      },
      className
    )

    return <input {...inputProps} className={_className} ref={forkedRef} />
  }
)

CxTextInput.displayName = 'CxTextInput'
