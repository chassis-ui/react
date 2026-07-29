import React, { forwardRef, InputHTMLAttributes, ReactNode, useRef } from 'react'
import classNames from 'classnames'
import { AriaTextFieldProps, useTextField } from 'react-aria'

import { useForkedRef, useFormField } from '../../hooks'
import { renderFormField } from '../form-field/renderFormField'

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
   * A description for the field, rendered below the input.
   */
  help?: ReactNode
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean
  /**
   * An error message for the field, rendered below the input when `invalid` is set.
   */
  invalidFeedback?: ReactNode
  /**
   * The field's caption, rendered as a `CxFormLabel` associated with this input.
   */
  label?: ReactNode
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
   * A success message for the field, rendered below the input when `valid` is set.
   */
  validFeedback?: ReactNode
  /**
   * The value of the input, controlled.
   */
  value?: string
}

export const CxTextInput = forwardRef<HTMLInputElement, CxTextInputProps>(
  (
    {
      className,
      disabled,
      help,
      id,
      invalid,
      invalidFeedback,
      label,
      plainText,
      readOnly,
      size,
      type = 'text',
      valid,
      validFeedback,
      ...rest
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const forkedRef = useForkedRef(ref, inputRef)

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

    const { inputProps } = useTextField(
      {
        ...rest,
        'aria-describedby': describedBy,
        'aria-labelledby': labelledBy,
        id: inputId,
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

    return renderFormField({
      children: <input {...inputProps} className={_className} ref={forkedRef} />,
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

CxTextInput.displayName = 'CxTextInput'
