import { createContext } from 'react'

export interface FormFieldContextValue {
  /**
   * The ids of the help and feedback the wrapper renders, when they are rendered. The field is
   * described by them too.
   */
  describedBy?: string
  /**
   * The id the wrapper's label points at with `htmlFor`. The field takes it as its own `id`
   * unless it was given one.
   */
  inputId?: string
  /**
   * The id of the wrapper's label. The field is labelled by it too.
   */
  labelId?: string
  /**
   * Receives what the field shows as invalid and valid when that differs from its props alone: a
   * submit it held back, or a `validated` form's verdict. `useHeldBack` calls it, so the wrapper
   * renders its feedback with the field's mark.
   */
  reportValidation?: (invalid: boolean | undefined, valid: boolean | undefined) => void
}

// What a wrapper that renders the label itself hands to the field inside it, so the consumer
// repeats no id: `FloatingInput` provides it, `useFormField` reads it. See FORMS.md.
export const FormFieldContext = createContext<FormFieldContextValue | null>(null)
