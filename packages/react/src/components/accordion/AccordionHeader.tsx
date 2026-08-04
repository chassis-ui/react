import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface AccordionHeaderProps extends HTMLAttributes<HTMLElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const AccordionHeader = forwardRef<HTMLElement, AccordionHeaderProps>(
  ({ children, className, ...rest }, ref) => {
    return (
      <summary className={classNames(className) || undefined} {...rest} ref={ref}>
        <span className="accordion-title">{children}</span>
      </summary>
    )
  }
)

AccordionHeader.displayName = 'AccordionHeader'
