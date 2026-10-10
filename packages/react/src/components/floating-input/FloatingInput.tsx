import React, { forwardRef, HTMLAttributes, ReactNode, useEffect, useId, useMemo } from 'react'
import classNames from 'classnames'

import { FormLabel } from '../form/FormLabel'
import { FormFieldContext } from '../form-field/context'
import { FormFieldIds, renderFormField } from '../form-field/renderFormField'
import { devWarning } from '../../utils/devWarning'
import { joinIds } from '../../utils/idRefs'

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
   * The ids that tie the label, help and feedback to the wrapped control, in place of the ones
   * `FloatingInput` generates. A field component of this library (`TextInput`, `Select`,
   * `Textarea`) takes them by itself and needs none. Any other control, such as a native
   * `<input>`, takes them by hand: `input` is the label's `htmlFor` and goes on the control as
   * its `id`, `label` is the label's own `id`, for a control named through `aria-labelledby`,
   * and `help` and `feedback` are the ids of the help and feedback text, for the control's
   * `aria-describedby`. `label` without `input` leaves the label with no `htmlFor`.
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
   * The field's caption, rendered as a floating `FormLabel` associated with the wrapped control.
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
    const generatedId = useId()
    // `ids.label` alone says the control is no single input: the label gets no `htmlFor`.
    const inputId = ids?.input ?? (ids?.label ? undefined : `${generatedId}-input`)
    const labelId = ids?.label ?? `${generatedId}-label`
    const helpId = ids?.help ?? `${generatedId}-help`
    const feedbackId = ids?.feedback ?? `${generatedId}-feedback`

    // The same choice `renderFormField` makes: at most one feedback renders, and `invalid` wins.
    const showInvalidFeedback = Boolean(invalid && invalidFeedback)
    const showValidFeedback = Boolean(valid && validFeedback) && !showInvalidFeedback
    const describedBy = joinIds(
      Boolean(help) && helpId,
      (showInvalidFeedback || showValidFeedback) && feedbackId
    )

    // A field component inside reads these in `useFormField`, so the consumer repeats no id.
    const field = useMemo(
      () => ({ describedBy, inputId, labelId }),
      [describedBy, inputId, labelId]
    )

    // Only a field component takes the id by itself. Checked once the control is in the document,
    // since nothing at render says whether a child read the context.
    useEffect(() => {
      devWarning(
        inputId !== undefined && !document.getElementById(inputId),
        'FloatingInput: no element has the id that the label points at with `htmlFor`. A field ' +
          'component of this library takes that id by itself; a control with an `id` of its ' +
          'own, or any other control, needs it passed as `ids={{ input: yourControlId }}` (or ' +
          '`ids.label` for a group with no single input, named through `aria-labelledby`).'
      )
    }, [inputId])

    return renderFormField({
      children: (
        <div className={classNames('form-floating', className)} {...rest} ref={ref}>
          <FormLabel htmlFor={inputId} id={labelId}>
            {label}
          </FormLabel>
          <FormFieldContext.Provider value={field}>{children}</FormFieldContext.Provider>
        </div>
      ),
      help,
      ids: { feedback: feedbackId, help: helpId },
      invalid,
      invalidFeedback,
      valid,
      validFeedback
    })
  }
)

FloatingInput.displayName = 'FloatingInput'
