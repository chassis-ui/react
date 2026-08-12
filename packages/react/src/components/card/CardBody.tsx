import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { Breakpoint, Spacing } from '../../types'
import { buildResponsiveClassNames } from '../../utils/breakpoints'

type CardBodyDirection = 'row' | 'column'

const directionClassNames = (direction: CardBodyDirection | undefined, prefix: string) => [
  direction && `${prefix}flex-${direction}`
]

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Switches the body from its default stacked (column) layout to a side-by-side (row) layout —
   * for placing an image beside text within a single padded region. Wrap the image and text in
   * `Col` to control each side's width, and nest another `CardBody` (with `.p-0`) for the text
   * side so it doesn't receive double padding.
   */
  direction?: CardBodyDirection
  /**
   * Spacing between children, mapped to the `gap-*` utility classes. Overrides the card's default
   * gap between body children.
   */
  gap?: Spacing | 0
  /**
   * Overrides `direction` at one or more breakpoints.
   */
  responsive?: Partial<Record<Breakpoint, CardBodyDirection>>
}

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ children, className, direction, gap, responsive, ...rest }, ref) => {
    const _className = classNames(
      'card-body',
      buildResponsiveClassNames(directionClassNames, direction, responsive),
      typeof gap === 'string' || typeof gap === 'number' ? `gap-${gap}` : null,
      className
    )

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  }
)

CardBody.displayName = 'CardBody'
