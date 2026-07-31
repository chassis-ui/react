import React, { ElementType, forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { ContextColor } from '../Types'

export interface CxNavbarProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor
  /**
   * Sets if the context of text should be colored for a light or dark dark background.
   */
  colorScheme?: 'dark' | 'light'
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
  /**
   * Defines optional container wrapping children elements.
   */
  container?: boolean | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge' | 'fluid'
  /**
   * Defines the responsive breakpoint to determine when content collapses.
   */
  expand?: boolean | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge'
  /**
   * Place component in non-static positions.
   */
  placement?: 'fixed-top' | 'fixed-bottom' | 'sticky-top'
}

export const CxNavbar = forwardRef<HTMLDivElement, CxNavbarProps>(
  (
    {
      children,
      className,
      color,
      colorScheme,
      component: Component = 'nav',
      container,
      expand,
      placement,
      ...rest
    },
    ref
  ) => {
    const _className = classNames(
      'navbar',
      {
        [`bg-${color}`]: color,
        [`navbar-${colorScheme}`]: colorScheme,
        [typeof expand === 'boolean' ? 'navbar-expand' : `navbar-expand-${expand}`]: expand
      },
      placement,
      className
    )

    let content
    if (container) {
      content = (
        <div className={`container${container !== true ? '-' + container : ''}`}>{children}</div>
      )
    } else {
      content = children
    }

    return (
      <Component className={_className} {...rest} ref={ref}>
        {content}
      </Component>
    )
  }
)

CxNavbar.displayName = 'CxNavbar'
