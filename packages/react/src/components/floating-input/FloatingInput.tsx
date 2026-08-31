import React, { forwardRef, HTMLAttributes, ReactNode } from 'react'
import classNames from 'classnames'

import { FormLabel } from '../form/FormLabel'
import { FormFieldIds, renderFormField } from '../form-field/renderFormField'

export interface FloatingInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * The form control (e.g. a `TextInput`, `Select`, or `Textarea`) the floating label attaches
   * to. Chassis-css's floating-label CSS relies on a `label:has(~ .form-input)` selector, so this
   * must render an element carrying the `form-input` class as a direct child.
   */
  children: ReactNode
  /**
   * A string of all className you want applied to the `.form-floating` element.
   */
  className?: string
  /**
   * A description for the field, rendered below the control. Setting this (or `invalidFeedback`/
   * `validFeedback`) wraps the floating input in a `.form-field`.
   */
  help?: ReactNode
  /**
   * The DOM ids of the wrapped control, used to associate the label (`htmlFor`) and point your
   * control's own `aria-describedby` at the rendered help/feedback text.
   */
  ids?: FormFieldIds
  /**
   * Set field validation state to invalid.
   */
  invalid?: boolean
  /**
   * An error message for the field, rendered below the control when `invalid` is set.
   */
  invalidFeedback?: ReactNode
  /**
   * The field's caption, rendered as a floating `FormLabel` associated with `ids.input`.
   */
  label: ReactNode
  /**
   * Set field validation state to valid.
   */
  valid?: boolean
  /**
   * A success message for the field, rendered below the control when `valid` is set.
   */
  validFeedback?: ReactNode
}

export const FloatingInput = forwardRef<HTMLDivElement, FloatingInputProps>(
  (
    {
      children,
      className,
      help,
      ids,
      invalid,
      invalidFeedback,
      label,
      valid,
      validFeedback,
      ...rest
    },
    ref
  ) => {
    if (!ids?.input && !ids?.label) {
      console.warn(
        'FloatingInput: `ids.input`/`ids.label` are not set — the rendered label ' +
          "won't be associated with your control (no `htmlFor`, no `aria-labelledby` target). " +
          'Pass `ids={{ input: yourControlId }}` (or `ids.label` for a group with no single ' +
          'input) so the label has something to point at.'
      )
    }

    return renderFormField({
      children: (
        <div className={classNames('form-floating', className)} {...rest} ref={ref}>
          <FormLabel htmlFor={ids?.input} id={ids?.label}>
            {label}
          </FormLabel>
          {children}
        </div>
      ),
      help,
      ids: { feedback: ids?.feedback, help: ids?.help },
      invalid,
      invalidFeedback,
      valid,
      validFeedback
    })
  }
)

FloatingInput.displayName = 'FloatingInput'
