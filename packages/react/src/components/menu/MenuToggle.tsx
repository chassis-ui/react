import React, {
  ElementType,
  ForwardRefRenderFunction,
  ReactElement,
  useContext,
  useRef
} from 'react'
import classNames from 'classnames'
import { mergeProps, useButton } from 'react-aria'

import { Button } from '../button/Button'
import { MenuContext } from './Menu'
import { ContextColor, ContextStyle, Shapes } from '../../types'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'
import { useForkedRef } from '../../hooks'

type MenuToggleOwnProps<C extends ElementType> = {
  /**
   * Toggle the active state for the component.
   */
  active?: boolean
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Sets the color of the component to one of Chassis context colors. Only applies to the
   * default `Button` root.
   */
  color?: ContextColor
  /**
   * Component used for the root node — the trigger element the menu opens from. Defaults to
   * `Button`; swap for e.g. `NavLink` to render a nav-item-style trigger (`.nav-link.caret`)
   * instead of a `.button.caret`. Its own props are type-checked at the call site once passed
   * here.
   */
  component?: C
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean
  /**
   * The href attribute specifies the URL of the page the link goes to.
   */
  href?: string
  /**
   * Select the shape of the component. Only applies to the default `Button` root.
   */
  shape?: Shapes
  /**
   * Size the component small or large. Only applies to the default `Button` root.
   */
  size?: 'small' | 'large'
  /**
   * Sets the context style of the component. Only applies to the default `Button` root.
   */
  variant?: ContextStyle
}

export type MenuToggleProps<C extends ElementType = typeof Button> = PolymorphicComponentProps<
  C,
  MenuToggleOwnProps<C>
>

type MenuToggleComponent = (<C extends ElementType = typeof Button>(
  props: MenuToggleProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function MenuToggleRender<C extends ElementType = typeof Button>(
  { children, className, component, onClick, onKeyDown, ...rest }: MenuToggleProps<C>,
  ref: PolymorphicRef<C>
) {
  const { hide, menuTriggerProps, reference, targetRef, toggleNodeRef, visible } =
    useContext(MenuContext)
  const Component = component ?? Button
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  // `elementType` tells react-aria whether the rendered root already has native button
  // semantics (`Button`, defaulting to `<button>`) or needs them emulated (`role="button"`,
  // keyboard activation) — anything else swapped in via `component` (e.g. `NavLink`, which
  // defaults to `<a>`) falls into the latter case.
  const { buttonProps } = useButton(
    { ...menuTriggerProps, elementType: Component === Button ? 'button' : 'a' },
    buttonRef
  )
  const wasOpenRef = useRef(false)

  const setRefs = (node: HTMLButtonElement | null) => {
    buttonRef.current = node
    toggleNodeRef.current = node
    if (reference !== 'parent') {
      targetRef.current = node
    }
  }

  const forkedRef = useForkedRef(ref, setRefs)

  // react-aria's `useMenuTrigger` opens (rather than toggles) on mouse/pen press start, so
  // re-clicking an already-open trigger would otherwise re-open it right back instead of
  // closing it. Capture whether it was open before that happens — ours has to run ahead of
  // `buttonProps`' own `onPointerDown` in the `mergeProps` chain below — then close it back
  // down on click. Touch is exempt: react-aria's `onPress` already toggles it correctly there.
  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    wasOpenRef.current = event.pointerType !== 'touch' && visible
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (wasOpenRef.current) {
      wasOpenRef.current = false
      hide()
    }
    onClick?.(event)
  }

  return (
    <Component
      // Only the default `Button` root needs an explicit `type` to avoid an implicit form
      // submit — other roots (e.g. `NavLink`, a raw `'button'` string) either don't render a
      // `<button>` at all or already accept `type` as one of their own passthrough props.
      {...(Component === Button ? { type: 'button' } : {})}
      // The `.caret` utility (rather than styling off `[data-cx-toggle="menu"]`, as the vanilla
      // CSS docs show) keeps this element from also matching Chassis CSS's own vanilla menu.js
      // selectors on a page that happens to load both — this component reimplements all of that
      // behavior itself, so there's nothing for the vanilla plugin to usefully do with it anyway.
      // `show` mirrors `MenuList`'s own `{ show: visible }` and vanilla menu.js's
      // `this._element.classList.add('show')` — it's what puts the trigger itself into a
      // pressed look while its menu is open (`.button.show`/`.nav-item.show .nav-link`).
      className={classNames('caret', { show: visible }, className)}
      {...(mergeProps({ onPointerDown: handlePointerDown }, rest, buttonProps, {
        onClick: handleClick,
        onKeyDown
      }) as Record<string, unknown>)}
      ref={forkedRef}
    >
      {children}
    </Component>
  )
}

export const MenuToggle = createPolymorphicComponent<MenuToggleComponent>(
  MenuToggleRender as ForwardRefRenderFunction<Element, MenuToggleProps<ElementType>>,
  'MenuToggle'
)
