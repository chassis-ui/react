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
import { hrefProps, linkElement, resolveElementKind } from '../../utils/elementKind'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef,
  PolymorphicRefWithFallback
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
  props: PaginationItemProps<C> & {
    ref?: PolymorphicRefWithFallback<C, HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement>
  }
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

  // The active page keeps whatever element it would render anyway (`<button>`, or `<a>` when
  // given `href`) rather than collapsing to a `<span>`. Swapping the tag on activation made React
  // unmount the focused control and mount a different element in its place, so a keyboard user who
  // activated a page was dropped to `<body>` and had to tab in from the top of the document again
  // (WCAG 2.4.3). The `<span>` wasn't even inert: `Pagination`'s smart mode passes an `onClick`,
  // so `useButtonSemantics` gave it `role="button"` and `tabIndex={0}` — a synthetic button,
  // strictly worse than the real one it replaced. Styling is unaffected either way: chassis-css
  // matches `.pagination-link { &.active, .active > & }`, and `active` still lands on the `<li>`.
  const Component = linkElement(component, href, 'button')
  // The kind rather than the tag: under `asChild`, `Component` is a `Slot` standing in for the
  // caller's element, and a slotted `<a>` needs what `component="a"` gets. Each branch below
  // renders `Component` typed as its tag, which is the tag itself or that `Slot`.
  const kind = resolveElementKind(Component)
  // A router link as `component` takes `href` too; it used to get none.
  const linkProps = hrefProps(kind, href, 'PaginationItem')
  const NativeButton = Component as 'button'
  const Anchor = Component as 'a'

  // `<a>` has no real `disabled` attribute, so a disabled anchor pagination item still fires
  // click (and still navigates) unless it's blocked here, same guard `Button` applies.
  const handleClick = (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (kind === 'anchor' && disabled) {
      event.preventDefault()
      return
    }
    onClick?.(event as never)
  }

  // A custom `component`/default (non-`button`/`a`) branch gets a raw `onClick` with no keyboard
  // semantics otherwise — the same gap `Link` fills via `useButtonSemantics`.
  const needsButtonSemantics = kind !== 'button' && kind !== 'anchor' && !!onClick
  const { buttonProps, forkedRef } = useButtonSemantics<HTMLElement>(ref as Ref<HTMLElement>, {
    disabled,
    onClick: onClick as MouseEventHandler<HTMLElement> | undefined
  })

  // `aria-current="page"` goes on the control itself, not the wrapping `<li>` — that's where the
  // WAI-ARIA pagination pattern puts it, and it's what a screen reader conveys when focus lands on
  // the control. On the `<li>` it was attached to a presentational list item nothing focuses.
  const currentProps = active ? { 'aria-current': 'page' as const } : {}

  return (
    <li className={_className}>
      {kind === 'button' ? (
        <NativeButton
          {...(rest as Record<string, unknown>)}
          className="pagination-link"
          type="button"
          disabled={disabled}
          onClick={handleClick}
          {...currentProps}
          ref={ref as Ref<HTMLButtonElement>}
        >
          {children}
        </NativeButton>
      ) : kind === 'anchor' ? (
        <Anchor
          {...(rest as Record<string, unknown>)}
          className="pagination-link"
          {...linkProps}
          onClick={handleClick}
          {...(disabled && { 'aria-disabled': true, tabIndex: -1 })}
          {...currentProps}
          ref={ref as Ref<HTMLAnchorElement>}
        >
          {children}
        </Anchor>
      ) : (
        <Component
          className="pagination-link"
          {...(mergeProps(rest, needsButtonSemantics ? buttonProps : {}) as Record<
            string,
            unknown
          >)}
          {...(!needsButtonSemantics && { onClick: handleClick })}
          {...linkProps}
          {...currentProps}
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
