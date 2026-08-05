import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface AccordionButtonProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

/**
 * @deprecated AccordionHeader already renders its own `.accordion-title` wrapper around its
 * children, so nesting this component inside it produces a duplicate wrapper. Kept for API
 * compatibility; pass content directly to AccordionHeader instead.
 */
export const AccordionButton = forwardRef<HTMLSpanElement, AccordionButtonProps>(
  ({ children, className, ...rest }, ref) => {
    console.warn(
      'AccordionButton is deprecated: AccordionHeader already renders its own .accordion-title ' +
        'wrapper around its children, so pass content directly to AccordionHeader instead. It ' +
        'will be removed in a future major version.'
    )

    return (
      <span className={classNames('accordion-title', className)} {...rest} ref={ref}>
        {children}
      </span>
    )
  }
)

AccordionButton.displayName = 'AccordionButton'
