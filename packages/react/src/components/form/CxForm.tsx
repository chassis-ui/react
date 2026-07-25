import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CxFormProps extends HTMLAttributes<HTMLFormElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Mark a form as validated. If you set it `true`, all validation styles will be applied to the forms component.
   */
  validated?: boolean
}

export const CxForm = forwardRef<HTMLFormElement, CxFormProps>(
  ({ children, className, validated, ...rest }, ref) => {
    const _className = classNames({ 'was-validated': validated }, className)
    return (
      <form className={_className} {...rest} ref={ref}>
        {children}
      </form>
    )
  },
)

CxForm.displayName = 'CxForm'
