import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'
import { CxProgressBar, CxProgressBarProps } from './CxProgressBar'

export interface CxProgressProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'color'>, CxProgressBarProps {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the height of the component. If you set that value the inner `<CxProgressBar>` will automatically resize accordingly.
   */
  height?: number
  /**
   * Makes progress bar thinner.
   */
  thin?: boolean
  /**
   * The percent to progress the ProgressBar (out of 100).
   */
  value?: number
  /**
   * Change the default context to white.
   */
  white?: boolean
}

export const CxProgress = forwardRef<HTMLDivElement, CxProgressProps>(
  ({ children, className, height, thin, value = 0, white, ...rest }, ref) => {
    const _className = classNames(
      'progress',
      {
        'progress-thin': thin,
        'progress-white': white
      },
      className
    )

    return (
      <div className={_className} style={height ? { height: `${height}px` } : {}} ref={ref}>
        {value ? (
          <CxProgressBar value={value} {...rest}>
            {children}
          </CxProgressBar>
        ) : (
          children
        )}
      </div>
    )
  }
)

CxProgress.displayName = 'CxProgress'
