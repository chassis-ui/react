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
   * Size the component sm or lg.
   */
  size?: 'sm' | 'lg'
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
    {
      className,
      help,
      id,
      invalid: invalidProp,
      invalidFeedback,
      label,
      size,
      valid: validProp,
      validFeedback,
      ...rest
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const forkedRef = useForkedRef(ref, inputRef)
    // A color input always has a value and holds no form back, but a `validated` form shows it
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
          // A caller's `aria-labelledby` adds to the visible label, as in `TextInput`, rather than
          // taking its place: it outranks the `<label for>`.
          aria-labelledby={rest['aria-labelledby'] && labelledBy}
          aria-invalid={invalid || undefined}
          className={_className}
          id={inputId}
          ref={forkedRef}
          type="color"
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

ColorInput.displayName = 'ColorInput'
