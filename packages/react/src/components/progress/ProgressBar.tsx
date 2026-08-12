import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { ContextColor } from '../../types'

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Use to animate the stripes right to left via CSS3 animations.
   */
  animated?: boolean
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor
  /**
   * Adds a diagonal stripe pattern over the bar's background.
   */
  striped?: boolean
  /**
   * The percent to progress the ProgressBar.
   */
  value?: number
}

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ children, animated, className, color, striped, style, value = 0, ...rest }, ref) => {
    const _className = classNames(
      'progress-bar',
      color && `bg-${color} fg-contrast`,
      {
        striped,
        animated
      },
      className
    )

    return (
      <div {...rest} className={_className} style={{ width: `${value}%`, ...style }} ref={ref}>
        <span className="mx-2xsmall">{children}</span>
      </div>
    )
  }
)
ProgressBar.displayName = 'ProgressBar'
