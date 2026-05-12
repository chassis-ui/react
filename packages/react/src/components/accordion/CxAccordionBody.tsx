import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CAccordionBodyProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const CxAccordionBody = forwardRef<HTMLDivElement, CAccordionBodyProps>(
  ({ children, className, ...rest }, ref) => {
    return (
      <div className={classNames('accordion-body', className)} {...rest} ref={ref}>
        {children}
      </div>
    )
  },
)

CxAccordionBody.displayName = 'CxAccordionBody'
