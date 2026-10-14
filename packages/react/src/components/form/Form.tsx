import React, { forwardRef, FormHTMLAttributes } from 'react'

import { FormValidatedContext } from './context'

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Shows every field of the form as valid or invalid by its own constraints (`required`,
   * `type`, `pattern`, ...), and again as its value changes: its class, `aria-invalid` and its
   * `validFeedback` or `invalidFeedback`. A field's own `invalid` or `valid` still decides how
   * that field looks. Set it once the user has tried to submit, as the `onSubmit` of a
   * `noValidate` form can.
   */
  validated?: boolean
}

export const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ children, validated = false, ...rest }, ref) => (
    <form {...rest} ref={ref}>
      <FormValidatedContext.Provider value={validated}>{children}</FormValidatedContext.Provider>
    </form>
  )
)

Form.displayName = 'Form'
