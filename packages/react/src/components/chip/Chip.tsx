import React, {
  ElementType,
  ForwardRefRenderFunction,
  MouseEventHandler,
  ReactElement,
  Ref
} from 'react'
import classNames from 'classnames'
import { mergeProps } from 'react-aria'

import { ContextColor, ContextStyle } from '../../types'
import { useButtonSemantics, useDisabledAnchorGuard } from '../../hooks'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type ChipOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   * Defaults to `span`, or `a` when `href` is set.
   */
  component?: C
  /**
   * Toggle the disabled state for the component. Applied as the native `disabled` attribute when
   * `component` is `button`, or the `.disabled` class for every other element (a bare `<span>`/
   * `<a>` has no real `disabled` attribute).
   */
  disabled?: boolean
  /**
   * Renders the chip as a link to this URL. Defaults `component` to `a`.
   */
  href?: string
  /**
   * Fires on click. Typed for every element `component` can actually render, rather than
   * narrowed to whichever element `C` happens to be.
   */
  onClick?: MouseEventHandler<HTMLElement>
  /**
   * Marks the chip as pressed for toggle-style usage (e.g. a filter chip). Applies the `.active`
   * class and sets `aria-pressed` so assistive technology announces the toggle state.
   */
  pressed?: boolean
  /**
   * Size the component small or large.
   */
  size?: 'small' | 'large'
  /**
   * Specifies the type of button. Only applies when `component` is `button`. Different browsers
   * may use different default types for the `<button>` element, so always specify it explicitly.
   */
  type?: 'button' | 'submit' | 'reset'
  /**
   * Set the chip style variant. `solid`/`basic` render the default look with no extra class.
   */
  variant?: ContextStyle
}

export type ChipProps<C extends ElementType = 'span'> = PolymorphicComponentProps<
  C,
  ChipOwnProps<C>
>

type ChipComponent = (<C extends ElementType = 'span'>(
  props: ChipProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function ChipRender<C extends ElementType = 'span'>(
  {
    children,
    className,
    color,
    component,
    disabled,
    href,
    onClick,
    pressed,
    size,
    type = 'button',
    variant,
    ...rest
  }: ChipProps<C>,
  ref: PolymorphicRef<C>
) {
  // Only defaults to `a` when `component` wasn't explicitly passed — an explicit `component`
  // (even alongside `href`) always wins.
  const Component = (component ?? (href ? 'a' : 'span')) as ElementType
  const isButton = Component === 'button'
  const isAnchor = Component === 'a'

  const _className = classNames(
    'chip',
    color,
    size,
    {
      outline: variant === 'outline',
      smooth: variant === 'smooth',
      active: pressed,
      disabled: !isButton && disabled
    },
    className
  )

  // `<a>`/`<span>`/`<div>` have no real `disabled` attribute, so a disabled non-button chip
  // still fires click (and an anchor still navigates) unless it's blocked here, same guard
  // `Button`/`CloseButton` apply.
  const handleClick = useDisabledAnchorGuard<HTMLElement>(!isButton, disabled, onClick)

  // A default (non-`button`/`a`) chip — the documented `pressed`/filter-chip use case — gets a
  // raw `onClick` with no keyboard semantics otherwise, the same gap `Link` fills via
  // `useButtonSemantics`. Skipped when the caller already supplied their own `role` via `rest`
  // (e.g. `ChipList`'s `role="row"` grid semantics) — that caller is trusted to handle its own
  // keyboard interaction, same as `CloseButton`'s `isComponentReference` escape hatch.
  const hasExplicitRole = (rest as Record<string, unknown>).role !== undefined
  const needsButtonSemantics = !isButton && !isAnchor && !!onClick && !hasExplicitRole
  const { buttonProps, forkedRef } = useButtonSemantics<HTMLElement>(ref as Ref<HTMLElement>, {
    disabled,
    onClick
  })

  if (isButton) {
    return (
      <button
        {...(rest as Record<string, unknown>)}
        aria-pressed={pressed}
        className={_className}
        disabled={disabled}
        onClick={handleClick as MouseEventHandler<HTMLButtonElement>}
        ref={ref as Ref<HTMLButtonElement>}
        type={type}
      >
        {children}
      </button>
    )
  }

  if (isAnchor) {
    return (
      <a
        {...(rest as Record<string, unknown>)}
        aria-pressed={pressed}
        className={_className}
        href={href}
        onClick={handleClick as MouseEventHandler<HTMLAnchorElement>}
        {...(disabled && { 'aria-disabled': true, tabIndex: -1 })}
        ref={ref as Ref<HTMLAnchorElement>}
      >
        {children}
      </a>
    )
  }

  return (
    <Component
      {...(mergeProps(rest, needsButtonSemantics ? buttonProps : {}) as Record<string, unknown>)}
      aria-pressed={pressed}
      className={_className}
      {...(!needsButtonSemantics && { onClick: handleClick })}
      {...(disabled && { 'aria-disabled': true })}
      // `href` was only ever forwarded when it also forced `Component` to `'a'` — now that an
      // explicit `component` wins over that default (see above), it needs to keep reaching a
      // custom `component`/HTML tag directly, same as `Avatar`'s equivalent fix.
      {...(href && { href })}
      ref={needsButtonSemantics ? forkedRef : ref}
    >
      {children}
    </Component>
  )
}

export const Chip = createPolymorphicComponent<ChipComponent>(
  ChipRender as ForwardRefRenderFunction<Element, ChipProps<ElementType>>,
  'Chip'
)
