import React, { forwardRef, ReactNode, TextareaHTMLAttributes, useRef } from 'react'
import classNames from 'classnames'
import { AriaTextFieldOptions, useTextField } from 'react-aria'

import { useForkedRef, useFormField, useHeldBack } from '../../hooks'
import { mergeUnhandledProps, TEXT_FIELD_PROPS } from '../../utils/unhandledProps'
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
   * Set component validation state to invalid. Left unset, the component shows as invalid by itself
   * from a submit it held back (an empty `required` one, say) until it no longer would, or its
   * form is reset. Set it, to `false` too, and it alone decides.
   */
  invalid?: boolean
  /**
   * An error message for the field, rendered below the textarea when `invalid` is set, and after a
   * submit the field held back, until it no longer would.
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
   * Size the component sm or lg.
   */
  size?: 'sm' | 'lg'
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
      invalid: invalidProp,
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
    // Shown as invalid from a submit it held back until it no longer would (`useHeldBack`):
    // react-aria cancels the browser's own message, and the form stayed with nothing to say why.
    const { invalid } = useHeldBack(textareaRef, { invalid: invalidProp, valid })

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
      // `aria-describedby` after the spread: see `TextInput`.
      children: (
        <textarea
          {...mergeUnhandledProps(inputProps, rest, TEXT_FIELD_PROPS)}
          aria-describedby={describedBy}
          rows={rows}
          className={_className}
          ref={forkedRef}
        />
      ),
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
