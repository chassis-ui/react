import React, {
  ChangeEventHandler,
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  useRef
} from 'react'
import classNames from 'classnames'

import { useForkedRef, useFormField, useHeldBack } from '../../hooks'
import { validationClassName } from '../../utils/validationClassName'
import { renderFormField } from '../form-field/renderFormField'

// No `placeholder` or `readOnly`: neither applies to `type="range"`.
export interface RangeInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'placeholder' | 'readOnly'
> {
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
   */
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
    {
      className,
      help,
      id,
      invalid: invalidProp,
      invalidFeedback,
      label,
      valid: validProp,
      validFeedback,
      ...rest
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const forkedRef = useForkedRef(ref, inputRef)
    // A range input always has a value and holds no form back, but a `validated` form shows it
    // as valid (`useHeldBack`).
    const { invalid, valid } = useHeldBack(inputRef, { invalid: invalidProp, valid: validProp })

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

    const _className = classNames('form-range', validationClassName(invalid, valid), className)

    return renderFormField({
      children: (
        <input
          {...rest}
          aria-describedby={describedBy}
          // A caller's `aria-labelledby` adds to the visible label, as in `TextInput`, rather than
          // taking its place: it outranks the `<label for>`.
          aria-labelledby={rest['aria-labelledby'] && labelledBy}
          aria-invalid={invalid || undefined}
          className={_className}
          id={inputId}
          ref={forkedRef}
          type="range"
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

RangeInput.displayName = 'RangeInput'
