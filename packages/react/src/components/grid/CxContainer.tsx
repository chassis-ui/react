import React, { forwardRef, HTMLAttributes } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export interface CContainerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Set container 100% wide until small breakpoint.
   */
  sm?: boolean
  /**
   * Set container 100% wide until medium breakpoint.
   */
  md?: boolean
  /**
   * Set container 100% wide until large breakpoint.
   */
  lg?: boolean
  /**
   * Set container 100% wide until X-large breakpoint.
   */
  xl?: boolean
  /**
   * Set container 100% wide until XX-large breakpoint.
   */
  xxl?: boolean
  /**
   * Set container 100% wide, spanning the entire width of the viewport.
   */
  fluid?: boolean
}

const BREAKPOINTS = [
  'xxl' as const,
  'xl' as const,
  'lg' as const,
  'md' as const,
  'sm' as const,
  'fluid' as const,
]

const BP_NAME: Record<string, string> = {
  xxl: '2xlarge',
  xl: 'xlarge',
  lg: 'large',
  md: 'medium',
  sm: 'small',
  fluid: 'fluid',
}

export const CxContainer = forwardRef<HTMLDivElement, CContainerProps>(
  ({ children, className, ...rest }, ref) => {
    const repsonsiveClassNames: string[] = []

    BREAKPOINTS.forEach((bp) => {
      const breakpoint = rest[bp]
      delete rest[bp]

      breakpoint && repsonsiveClassNames.push(`container-${BP_NAME[bp]}`)
    })

    const _className = classNames(
      repsonsiveClassNames.length ? repsonsiveClassNames : 'container',
      className,
    )

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  },
)

CxContainer.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  sm: PropTypes.bool,
  md: PropTypes.bool,
  lg: PropTypes.bool,
  xl: PropTypes.bool,
  xxl: PropTypes.bool,
  fluid: PropTypes.bool,
}

CxContainer.displayName = 'CxContainer'
