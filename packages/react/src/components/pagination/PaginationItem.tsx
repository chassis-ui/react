import React, { ElementType, forwardRef, HTMLAttributes, MouseEvent, Ref } from 'react'
import classNames from 'classnames'

export interface PaginationItemProps extends HTMLAttributes<HTMLAnchorElement | HTMLButtonElement> {
  /**
   * Toggle the active state for the component.
   */
  active?: boolean
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean
  /**
   * The href attribute. When provided the item renders as an `<a>` tag; otherwise as a `<button>`.
   */
  href?: string
}

export const PaginationItem = forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  PaginationItemProps
>(({ active, children, className, component, disabled, href, onClick, ...rest }, ref) => {
  const _className = classNames(
    'pagination-item',
    {
      active,
      disabled
    },
    className
  )

  const Component = component ? component : active ? 'span' : href ? 'a' : 'button'

  // `<a>` has no real `disabled` attribute, so a disabled anchor pagination item still fires
  // click (and still navigates) unless it's blocked here, same guard `Button` applies.
  const handleClick = (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (Component === 'a' && disabled) {
      event.preventDefault()
      return
    }
    onClick?.(event)
  }

  return (
    <li className={_className} {...(active && { 'aria-current': 'page' })}>
      {Component === 'button' ? (
        <button
          {...(rest as Record<string, unknown>)}
          className="pagination-link"
          type="button"
          disabled={disabled}
          onClick={handleClick}
          ref={ref as Ref<HTMLButtonElement>}
        >
          {children}
        </button>
      ) : Component === 'a' ? (
        <a
          {...(rest as Record<string, unknown>)}
          className="pagination-link"
          href={href}
          onClick={handleClick}
          {...(disabled && { 'aria-disabled': true, tabIndex: -1 })}
          ref={ref as Ref<HTMLAnchorElement>}
        >
          {children}
        </a>
      ) : (
        <Component className="pagination-link" onClick={onClick} {...rest} ref={ref}>
          {children}
        </Component>
      )}
    </li>
  )
})

PaginationItem.displayName = 'PaginationItem'
