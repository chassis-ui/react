import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CxAccordionButtonProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

/**
 * @deprecated CxAccordionHeader already renders its own `.accordion-title` wrapper around its
 * children, so nesting this component inside it produces a duplicate wrapper. Kept for API
 * compatibility; pass content directly to CxAccordionHeader instead.
 */
export const CxAccordionButton = forwardRef<HTMLSpanElement, CxAccordionButtonProps>(
  ({ children, className, ...rest }, ref) => {
    return (
      <span className={classNames('accordion-title', className)} {...rest} ref={ref}>
        {children}
      </span>
    )
  }
)

CxAccordionButton.displayName = 'CxAccordionButton'
