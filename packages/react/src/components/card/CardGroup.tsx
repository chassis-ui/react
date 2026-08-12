import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CardGroupProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

// Arranges direct-child Cards as an equal-width row, joined edge-to-edge, once its container
// reaches the small container breakpoint — below that, cards stack vertically. Requires a
// `.contains-inline` ancestor (not applied by CardGroup itself, e.g. a wrapping
// `<div className="contains-inline">`) to establish the container query context.
export const CardGroup = forwardRef<HTMLDivElement, CardGroupProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('card-group', className)

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  }
)

CardGroup.displayName = 'CardGroup'
