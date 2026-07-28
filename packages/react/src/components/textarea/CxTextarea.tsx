import React, { forwardRef, TextareaHTMLAttributes, useRef } from 'react'
import classNames from 'classnames'
import { AriaTextFieldOptions, useTextField } from 'react-aria'

import { useForkedRef } from '../../utils/hooks'

export interface CxTextareaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'defaultValue' | 'onChange' | 'value'
> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * The value of the textarea, uncontrolled.
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
   * Render the component styled as plain text. Removes the default form field styling and preserve the correct margin and padding. Recommend to use only along side `readonly`.
   */
  plainText?: boolean
  /**
   * Toggle the readonly state for the component.
   */
  readOnly?: boolean
  /**
   * Set component validation state to valid.
   */
  valid?: boolean
  /**
   * The value of the textarea, controlled.
   */
  value?: string
}

export const CxTextarea = forwardRef<HTMLTextAreaElement, CxTextareaProps>(
  ({ className, disabled, invalid, plainText, readOnly, valid, ...rest }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const forkedRef = useForkedRef(ref, textareaRef)

    const { inputProps } = useTextField<'textarea'>(
      {
        ...rest,
        inputElementType: 'textarea',
        isDisabled: disabled,
        isInvalid: invalid,
        isReadOnly: readOnly
      } as AriaTextFieldOptions<'textarea'>,
      textareaRef
    )

    const _className = classNames(
      'form-input',
      plainText && 'plaintext',
      {
        'is-invalid': invalid,
        'is-valid': valid
      },
      className
    )

    return <textarea {...inputProps} className={_className} ref={forkedRef} />
  }
)

CxTextarea.displayName = 'CxTextarea'
