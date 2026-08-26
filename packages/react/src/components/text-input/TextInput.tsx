import React, { forwardRef, InputHTMLAttributes, ReactNode, useRef } from 'react'
import classNames from 'classnames'
import { AriaTextFieldProps, useTextField } from 'react-aria'

import { useForkedRef, useFormField } from '../../hooks'
import { validationClassName } from '../../utils/validationClassName'
import { renderFormField } from '../form-field/renderFormField'

export interface TextInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'defaultValue' | 'onChange' | 'size' | 'value'
> {
  /**
   * Content rendered at the input's trailing edge, e.g. a `InputAdorn` icon, text, or button.
   * Setting either `adornStart` or `adornEnd` renders a `.form-input` wrapper around a
   * `.ghost-input`, matching chassis-css's [input help](https://chassis-ui.com/css/docs/forms/input-adorn) pattern.
   */
  adornEnd?: ReactNode
  /**
   * Content rendered at the input's leading edge, e.g. a `InputAdorn` icon, text, or button.
   * Setting either `adornStart` or `adornEnd` renders a `.form-input` wrapper around a
   * `.ghost-input`, matching chassis-css's [input help](https://chassis-ui.com/css/docs/forms/input-adorn) pattern.
   */
  adornStart?: ReactNode
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
   * The field's caption, rendered as a `FormLabel` associated with this input.
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
   * Specifies the type of component. For `color` or `file` inputs, use the dedicated `ColorInput` or `FileInput` components instead.
   */
  type?:
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'month'
    | 'password'
    | 'search'
    | 'tel'
    | 'text'
    | 'time'
    | 'url'
    | 'week'
    | (string & {})
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

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      adornEnd,
      adornStart,
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

    const hasAdorn = adornStart != null || adornEnd != null

    // chassis-css's `.form-input:has(.ghost-input.is-valid)` selector reads validation state off
    // the inner input, not the wrapper, once adorns turn `.form-input` into a flex container - see
    // https://chassis-ui.com/css/docs/forms/input-adorn.
    const inputClassName = classNames(
      hasAdorn ? 'ghost-input' : 'form-input',
      !hasAdorn && plainText && 'plaintext',
      !hasAdorn && size,
      validationClassName(invalid, valid),
      !hasAdorn && className
    )

    const input = <input {...inputProps} className={inputClassName} ref={forkedRef} />

    const children = hasAdorn ? (
      <div className={classNames('form-input', plainText && 'plaintext', size, className)}>
        {adornStart}
        {input}
        {adornEnd}
      </div>
    ) : (
      input
    )

    return renderFormField({
      children,
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

TextInput.displayName = 'TextInput'
