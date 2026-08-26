import React, {
  ElementType,
  ForwardRefRenderFunction,
  forwardRef,
  MouseEvent,
  ReactElement,
  Ref
} from 'react'
import classNames from 'classnames'

import { PolymorphicComponentProps, PolymorphicRef } from '../../utils/polymorphic'

type PaginationItemOwnProps<C extends ElementType> = {
  /**
   * Toggle the active state for the component.
   */
  active?: boolean
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: C
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean
  /**
   * The href attribute. When provided the item renders as an `<a>` tag; otherwise as a `<button>`.
   */
  href?: string
}

export type PaginationItemProps<C extends ElementType = 'button'> = PolymorphicComponentProps<
  C,
  PaginationItemOwnProps<C>
>

type PaginationItemComponent = (<C extends ElementType = 'button'>(
  props: PaginationItemProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function PaginationItemRender<C extends ElementType = 'button'>(
  {
    active,
    children,
    className,
    component,
    disabled,
    href,
    onClick,
    ...rest
  }: PaginationItemProps<C>,
  ref: PolymorphicRef<C>
) {
  const _className = classNames(
    'pagination-item',
    {
      active,
      disabled
    },
    className
  )

  const Component = (component ?? (active ? 'span' : href ? 'a' : 'button')) as ElementType

  // `<a>` has no real `disabled` attribute, so a disabled anchor pagination item still fires
  // click (and still navigates) unless it's blocked here, same guard `Button` applies.
  const handleClick = (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (Component === 'a' && disabled) {
      event.preventDefault()
      return
    }
    onClick?.(event as never)
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
        <Component className="pagination-link" onClick={handleClick} {...rest} ref={ref}>
          {children}
        </Component>
      )}
    </li>
  )
}

export const PaginationItem = forwardRef(
  PaginationItemRender as ForwardRefRenderFunction<Element, PaginationItemProps<ElementType>>
) as PaginationItemComponent

PaginationItem.displayName = 'PaginationItem'
