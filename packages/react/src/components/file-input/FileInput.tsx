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

export interface FileInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
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
   * Set component validation state to invalid. Left unset, the component shows as invalid by itself
   * from a submit it held back (an empty `required` one, say) until it no longer would, or its
   * form is reset. Set it, to `false` too, and it alone decides.
   */
  invalid?: boolean
  /**
   * An error message for the field, rendered below the input when `invalid` is set, and after a
   * submit the field held back, until it no longer would.
   */
  invalidFeedback?: ReactNode
  /**
   * The field's caption, rendered as a `FormLabel` associated with this input.
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
}

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
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
    // Shown as invalid from a submit it held back until it no longer would (`useHeldBack`). The
    // browser's own message stays: no react-aria hook is given this control to cancel it. It is
    // on the first invalid control of the form alone, and gone at the next click.
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
          type="file"
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

FileInput.displayName = 'FileInput'
