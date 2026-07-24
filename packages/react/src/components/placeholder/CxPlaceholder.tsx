import React, { ElementType, forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { ContextColor } from '../Types'

export interface CPlaceholderProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Set animation type to better convey the perception of something being actively loaded.
   */
  animation?: 'glow' | 'wave'
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the context context of the component to one of Chassis themed colors.
   *
   * @type 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light' | string
   */
  context?: ContextColor
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
  /**
   * Size the component extra small, small, or large.
   */
  size?: 'xsmall' | 'small' | 'large'
  /**
   * The number of columns on extra small devices (<576px).
   */
  xs?: number
  /**
   * The number of columns on small devices (<768px).
   */
  sm?: number
  /**
   * The number of columns on medium devices (<992px).
   */
  md?: number
  /**
   * The number of columns on large devices (<1200px).
   */
  lg?: number
  /**
   * The number of columns on X-Large devices (<1400px).
   */
  xl?: number
  /**
   * The number of columns on XX-Large devices (≥1400px).
   */
  xxl?: number
}

const BREAKPOINTS = [
  'xxl' as const,
  'xl' as const,
  'lg' as const,
  'md' as const,
  'sm' as const,
  'xs' as const,
]

const BP_NAME: Record<string, string> = {
  xxl: '2xlarge',
  xl: 'xlarge',
  lg: 'large',
  md: 'medium',
  sm: 'small',
  xs: '',
}


export const CxPlaceholder = forwardRef<HTMLSpanElement, CPlaceholderProps>(
  (
    { children, animation, className, context, component: Component = 'span', size, ...rest },
    ref,
  ) => {
    const repsonsiveClassNames: string[] = []

    BREAKPOINTS.forEach((bp) => {
      const breakpoint = rest[bp]
      delete rest[bp]

      const bpName = BP_NAME[bp]
      const prefix = bpName ? `${bpName}:` : ''
      const suffix = bpName ? `-${bpName}` : ''

      if (typeof breakpoint === 'number') {
        repsonsiveClassNames.push(`${prefix}col-${breakpoint}`)
      }

      if (typeof breakpoint === 'boolean') {
        repsonsiveClassNames.push(`col${suffix}`)
      }
    })

    const _className = classNames(
      animation ? `placeholder-${animation}` : 'placeholder',
      {
        [`bg-${context}`]: context,
        [`placeholder-${size}`]: size,
      },
      repsonsiveClassNames,
      className,
    )

    return (
      <Component className={_className} {...rest} ref={ref}>
        {children}
      </Component>
    )
  },
)

CxPlaceholder.displayName = 'CxPlaceholder'
