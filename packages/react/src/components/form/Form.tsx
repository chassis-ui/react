import React, { forwardRef, FormHTMLAttributes } from 'react'
import classNames from 'classnames'

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Mark a form as validated. If you set it `true`, all validation styles will be applied to the forms component.
   */
  validated?: boolean
}

export const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ children, className, validated, ...rest }, ref) => {
    const _className = classNames({ 'was-validated': validated }, className)
    return (
      <form className={_className} {...rest} ref={ref}>
        {children}
      </form>
    )
  }
)

Form.displayName = 'Form'
