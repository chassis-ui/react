import React, { ChangeEventHandler, forwardRef, InputHTMLAttributes, ReactNode } from 'react'
import classNames from 'classnames'

import { useFormField } from '../../hooks'
import { validationClassName } from '../../utils/validationClassName'
import { renderFormField } from '../form-field/renderFormField'

export interface RangeInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean
  /**
   * A description for the field, rendered below the range input.
   */
  help?: ReactNode
  /**
   * Set component validation state to invalid.
   */
  invalid?: boolean
  /**
   * An error message for the field, rendered below the range input when `invalid` is set.
   */
  invalidFeedback?: ReactNode
  /**
   * The field's caption, rendered as a `FormLabel` associated with this range input.
   */
  label?: ReactNode
  /**
   * Specifies the maximum value for the component.
   */
  max?: number
  /**
   * Specifies the minimum value for the component.
   */
  min?: number
  /**
   * Method called immediately after the `value` prop changes.
   */
  onChange?: ChangeEventHandler<HTMLInputElement>
  /**
   * Toggle the readonly state for the component.
   */
  readOnly?: boolean
  /**
   * Specifies the interval between legal numbers in the component.
   */
  step?: number
  /**
   * Set component validation state to valid.
   */
  valid?: boolean
  /**
   * A success message for the field, rendered below the range input when `valid` is set.
   */
  validFeedback?: ReactNode
  /**
   * The `value` attribute of component.
   *
   * @controllable onChange
   * */
  value?: string | number
}

export const RangeInput = forwardRef<HTMLInputElement, RangeInputProps>(
  (
    { className, help, id, invalid, invalidFeedback, label, valid, validFeedback, ...rest },
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

    const _className = classNames('form-range', validationClassName(invalid, valid), className)

    return renderFormField({
      children: (
        <input
          {...rest}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={_className}
          id={inputId}
          ref={ref}
          type="range"
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

RangeInput.displayName = 'RangeInput'
