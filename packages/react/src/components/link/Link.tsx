import React, { AllHTMLAttributes, ElementType, forwardRef, MouseEvent } from 'react'
import classNames from 'classnames'

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
    { children, active, className, component: Component = 'a', disabled, onClick, ...rest },
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

    return (
      <Component
        {...rest}
        className={_className}
        {...(active && { 'aria-current': 'page' })}
        {...(Component === 'a' && disabled && { 'aria-disabled': true, tabIndex: -1 })}
        onClick={handleClick}
        disabled={disabled}
        ref={ref}
      >
        {children}
      </Component>
    )
  }
)

Link.displayName = 'Link'
