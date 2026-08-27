import React, {
  ElementType,
  ForwardRefRenderFunction,
  MouseEvent,
  MouseEventHandler,
  ReactElement,
  Ref
} from 'react'
import classNames from 'classnames'
import { mergeProps } from 'react-aria'

import { useButtonSemantics } from '../../hooks'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

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

  // A custom `component`/default (non-`button`/`a`) branch gets a raw `onClick` with no keyboard
  // semantics otherwise — the same gap `Link` fills via `useButtonSemantics`.
  const needsButtonSemantics = Component !== 'button' && Component !== 'a' && !!onClick
  const { buttonProps, forkedRef } = useButtonSemantics<HTMLElement>(ref as Ref<HTMLElement>, {
    disabled,
    onClick: onClick as MouseEventHandler<HTMLElement> | undefined
  })

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
        <Component
          className="pagination-link"
          {...(mergeProps(rest, needsButtonSemantics ? buttonProps : {}) as Record<
            string,
            unknown
          >)}
          {...(!needsButtonSemantics && { onClick: handleClick })}
          ref={needsButtonSemantics ? forkedRef : ref}
        >
          {children}
        </Component>
      )}
    </li>
  )
}

export const PaginationItem = createPolymorphicComponent<PaginationItemComponent>(
  PaginationItemRender as ForwardRefRenderFunction<Element, PaginationItemProps<ElementType>>,
  'PaginationItem'
)
