import React, { ChangeEventHandler, forwardRef, InputHTMLAttributes, ReactNode, useId } from 'react'
import classNames from 'classnames'

import { renderFormField } from '../form-field/renderFormField'

export interface CxFileInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
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
   * Allows selecting more than one file.
   */
  multiple?: boolean
  /**
   * Method called when the selected file(s) change.
   */
  onChange?: ChangeEventHandler<HTMLInputElement>
  /**
   * Size the component small or large.
   */
  size?: 'small' | 'large'
  /**
   * Set component validation state to valid.
   */
  valid?: boolean
  /**
   * A success message for the field, rendered below the input when `valid` is set.
   */
  validFeedback?: ReactNode
}

export const CxFileInput = forwardRef<HTMLInputElement, CxFileInputProps>(
  (
    { className, help, id, invalid, invalidFeedback, label, size, valid, validFeedback, ...rest },
    ref
  ) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const helpId = `${generatedId}-help`
    const feedbackId = `${generatedId}-feedback`

    const showInvalidFeedback = invalid && invalidFeedback
    const showValidFeedback = valid && validFeedback
    const describedBy = [
      help && helpId,
      (showInvalidFeedback || showValidFeedback) && feedbackId,
      rest['aria-describedby']
    ]
      .filter(Boolean)
      .join(' ')

    const _className = classNames(
      'form-input',
      size,
      {
        'is-invalid': invalid,
        'is-valid': valid
      },
      className
    )

    return renderFormField({
      children: (
        <input
          {...rest}
          aria-describedby={describedBy || undefined}
          aria-invalid={invalid || undefined}
          className={_className}
          id={inputId}
          ref={ref}
          type="file"
        />
      ),
      help,
      ids: { feedback: feedbackId, help: helpId, input: inputId },
      invalid,
      invalidFeedback,
      label,
      valid,
      validFeedback
    })
  }
)

CxFileInput.displayName = 'CxFileInput'
