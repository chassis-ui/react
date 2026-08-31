import React, { forwardRef, ReactNode, TextareaHTMLAttributes, useRef } from 'react'
import classNames from 'classnames'
import { AriaTextFieldOptions, useTextField } from 'react-aria'

import { useForkedRef, useFormField } from '../../hooks'
import { validationClassName } from '../../utils/validationClassName'
import { renderFormField } from '../form-field/renderFormField'

export interface TextareaProps extends Omit<
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
   * A description for the field, rendered below the textarea.
   */
  help?: ReactNode
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean
  /**
   * An error message for the field, rendered below the textarea when `invalid` is set.
   */
  invalidFeedback?: ReactNode
  /**
   * The field's caption, rendered as a `FormLabel` associated with this textarea.
   */
  label?: ReactNode
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
   * The number of visible text lines for the control.
   */
  rows?: number
  /**
   * Size the component small or large.
   */
  size?: 'small' | 'large'
  /**
   * Set component validation state to valid.
   */
  valid?: boolean
  /**
   * A success message for the field, rendered below the textarea when `valid` is set.
   */
  validFeedback?: ReactNode
  /**
   * The value of the textarea, controlled.
   */
  value?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
      rows,
      size,
      valid,
      validFeedback,
      ...rest
    },
    ref
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const forkedRef = useForkedRef(ref, textareaRef)

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

    const { inputProps } = useTextField<'textarea'>(
      {
        ...rest,
        'aria-describedby': describedBy,
        'aria-labelledby': labelledBy,
        id: inputId,
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
      size,
      validationClassName(invalid, valid),
      className
    )

    return renderFormField({
      children: <textarea {...inputProps} rows={rows} className={_className} ref={forkedRef} />,
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

Textarea.displayName = 'Textarea'
