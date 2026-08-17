import React, { AllHTMLAttributes, ElementType, forwardRef, MouseEvent } from 'react'
import classNames from 'classnames'

import { ContextColor } from '../../types'

export interface LinkProps extends AllHTMLAttributes<HTMLElement> {
  /**
   * Toggle the active state for the component.
   */
  active?: boolean
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the link color to one of Chassis context colors, including its interactive
   * (`:hover`/`:focus`/`:active`/`:visited`) states.
   */
  color?: ContextColor
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean
  /**
   * The href attribute specifies the URL of the page the link goes to.
   */
  href?: string
  /**
   * Aligns a leading or trailing icon with the link text using flexbox, with a gap between
   * them and an offset underline. Icons need to be passed as `children` alongside the text.
   * Named `iconLink` rather than `icon` to avoid colliding with components (e.g. `MenuItem`)
   * that already have their own, differently-typed `icon` prop for the icon content itself.
   */
  iconLink?: boolean
  /**
   * Removes the foreground color override, so the link inherits its color from the nearest
   * ancestor instead of the default link color.
   */
  reset?: boolean
  /**
   * Expands the link's click target to fill its positioned ancestor (the nearest ancestor with
   * a `position` other than `static`).
   */
  stretched?: boolean
}

export const Link = forwardRef<HTMLButtonElement | HTMLAnchorElement, LinkProps>(
  (
    {
      children,
      active,
      className,
      color,
      component: Component = 'a',
      disabled,
      iconLink,
      onClick,
      reset,
      stretched,
      ...rest
    },
    ref
  ) => {
    const _className = classNames(
      className,
      color && `link-${color}`,
      { 'icon-link': iconLink, 'fg-reset': reset, 'stretched-link': stretched },
      { active, disabled }
    )

    const isInteractive = Component === 'a' || Component === 'button'
    const handleClick = isInteractive
      ? (event: MouseEvent<HTMLElement>) => {
          if (disabled) {
            event.preventDefault()
            return
          }
          onClick && onClick(event)
        }
      : onClick

    return (
      <Component
        {...rest}
        className={_className}
        {...(active && { 'aria-current': 'page' })}
        {...(Component === 'a' && disabled && { 'aria-disabled': true, tabIndex: -1 })}
        onClick={handleClick}
        {...(Component === 'button' && { disabled })}
        ref={ref}
      >
        {children}
      </Component>
    )
  }
)

Link.displayName = 'Link'
