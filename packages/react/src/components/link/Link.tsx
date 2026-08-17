import React, { AllHTMLAttributes, ElementType, forwardRef, MouseEvent, PointerEvent } from 'react'
import classNames from 'classnames'

import { useSuppressFocusRingOnPointerDown } from '../../hooks'

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
}

export const Link = forwardRef<HTMLButtonElement | HTMLAnchorElement, LinkProps>(
  (
    {
      children,
      active,
      className,
      component: Component = 'a',
      disabled,
      onClick,
      onPointerDown,
      ...rest
    },
    ref
  ) => {
    const _className = classNames(className, { active, disabled })

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

    // Every `Button`/`NavLink`/`MenuItem`/etc. renders through here, so fixing the browser's
    // `:focus-visible` first-click misfire once at this shared root covers all of them at once —
    // see the hook's own comment for why.
    const suppressFocusRing = useSuppressFocusRingOnPointerDown<HTMLElement>()
    const handlePointerDown = isInteractive
      ? (event: PointerEvent<HTMLElement>) => {
          suppressFocusRing(event)
          onPointerDown?.(event)
        }
      : onPointerDown

    return (
      <Component
        {...rest}
        className={_className}
        {...(active && { 'aria-current': 'page' })}
        {...(Component === 'a' && disabled && { 'aria-disabled': true, tabIndex: -1 })}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        disabled={disabled}
        ref={ref}
      >
        {children}
      </Component>
    )
  }
)

Link.displayName = 'Link'
