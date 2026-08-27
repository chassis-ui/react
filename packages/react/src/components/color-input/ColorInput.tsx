import React, { ChangeEventHandler, forwardRef, InputHTMLAttributes, ReactNode } from 'react'
import classNames from 'classnames'

import { useFormField } from '../../hooks'
import { validationClassName } from '../../utils/validationClassName'
import { renderFormField } from '../form-field/renderFormField'

export interface ColorInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
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
   * Method called immediately after the `value` prop changes.
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
  /**
   * The `value` attribute of component.
   *
   * @controllable onChange
   * */
  value?: string
}

export const ColorInput = forwardRef<HTMLInputElement, ColorInputProps>(
  (
    { className, help, id, invalid, invalidFeedback, label, size, valid, validFeedback, ...rest },
    ref
  ) => {
    const { describedBy, feedbackId, helpId, inputId } = useFormField({
      ariaDescribedBy: rest['aria-describedby'],
      help,
      id,
      invalid,
      invalidFeedback,
      valid,
      validFeedback
    })

    const _className = classNames(
      'form-input',
      size,
      validationClassName(invalid, valid),
      className
    )

    return renderFormField({
      children: (
        <input
          {...rest}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={_className}
          id={inputId}
          ref={ref}
          type="color"
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

ColorInput.displayName = 'ColorInput'
