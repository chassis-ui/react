import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface AccordionBodyProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const AccordionBody = forwardRef<HTMLDivElement, AccordionBodyProps>(
  ({ children, className, ...rest }, ref) => {
    return (
      <div className={classNames('accordion-body', className)} {...rest} ref={ref}>
        {children}
      </div>
    )
  }
)

AccordionBody.displayName = 'AccordionBody'
