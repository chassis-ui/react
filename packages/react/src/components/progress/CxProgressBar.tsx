import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { ContextColor } from '../Types'
export interface CxProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Use to animate the stripes right to left via CSS3 animations.
   */
  animated?: boolean
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the context context of the component to one of Chassis themed colors.
   */
  context?: ContextColor
  /**
   * The percent to progress the ProgressBar.
   */
  value?: number
  /**
   * Set the progress bar variant to optional striped.
   */
  variant?: 'striped'
}

export const CxProgressBar = forwardRef<HTMLDivElement, CxProgressBarProps>(
  ({ children, animated, className, context, value = 0, variant, ...rest }, ref) => {
    const _className = classNames(
      'progress-bar',
      context,
      {
        [`progress-bar-${variant}`]: variant,
        'progress-bar-animated': animated,
      },
      className,
    )

    return (
      <div
        className={_className}
        role="progressbar"
        style={{ width: `${value}%` }}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        {...rest}
        ref={ref}
      >
        {children}
      </div>
    )
  },
)
CxProgressBar.displayName = 'CxProgressBar'
