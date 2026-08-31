import React, { forwardRef, LabelHTMLAttributes } from 'react'
import classNames from 'classnames'

export interface FormLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * A string of all className you want to be applied to the component, and override standard className value.
   */
  customClassName?: string
}

export const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ children, className, customClassName, ...rest }, ref) => {
    const _className = customClassName ? customClassName : classNames('form-label', className)
    return (
      <label className={_className} {...rest} ref={ref}>
        {children}
      </label>
    )
  }
)

FormLabel.displayName = 'FormLabel'
