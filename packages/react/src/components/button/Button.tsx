import React, {
  ElementType,
  ForwardRefRenderFunction,
  MouseEventHandler,
  ReactElement,
  Ref
} from 'react'
import classNames from 'classnames'
import { mergeProps } from 'react-aria'

import { ContextColor, ContextStyle, Shapes } from '../../types'
import { useButtonSemantics, useDisabledAnchorGuard } from '../../hooks'
import {
  createPolymorphicComponent,
  PolymorphicComponentProps,
  PolymorphicRef
} from '../../utils/polymorphic'

type ButtonOwnProps<C extends ElementType> = {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Sets the color of the component to one of Chassis context colors.
   */
  color?: ContextColor
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
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
   * Fires on click. Typed for every element `component` can actually render (`button`, `a`,
   * `input`, or a custom component), rather than narrowed to `HTMLButtonElement` alone.
   */
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement | HTMLInputElement>
  /**
   * Marks the button as pressed for toggle-style usage (e.g. a formatting toolbar button).
   * Applies the `.active` class and sets `aria-pressed` so assistive technology announces
   * "button, pressed" rather than treating the button as a navigation link.
   */
  pressed?: boolean
  /**
   * Select the shape of the component.
   */
  shape?: Shapes
  /**
   * Size the component small or large.
   */
  size?: 'small' | 'large'
  /**
   * Specifies the type of button. Always specify the type attribute for the `<button>` element.
   * Different browsers may use different default types for the `<button>` element.
   */
  type?: 'button' | 'submit' | 'reset'
  /**
   * Set the button style variant. Same as `ContextStyle`, but `solid` (the unmodified default
   * look) doesn't apply as a class, and `link` — button-specific, not a context color — makes
   * the button look and behave like a hyperlink while keeping its `color`.
   */
  variant?: Exclude<ContextStyle, 'solid'> | 'link'
}

export type ButtonProps<C extends ElementType = 'button'> = PolymorphicComponentProps<
  C,
  ButtonOwnProps<C>
>

type ButtonComponent = (<C extends ElementType = 'button'>(
  props: ButtonProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null) & { displayName?: string }

function ButtonRender<C extends ElementType = 'button'>(
  {
    children,
    className,
    color = 'primary',
    component,
    disabled,
    href,
    onClick,
    pressed,
    shape,
    size,
    type = 'button',
    variant,
    ...rest
  }: ButtonProps<C>,
  ref: PolymorphicRef<C>
) {
  // Only defaults to `a` when `component` wasn't explicitly passed — an explicit `component`
  // (even alongside `href`, e.g. a router Link component that accepts `href` itself) always wins.
  const Component = (component ?? (href ? 'a' : 'button')) as ElementType
  const isAnchor = Component === 'a'

  // A component reference (e.g. a router `Link`) has its own visual identity and is trusted to
  // handle its own keyboard/role semantics, same as `CloseButton`'s `isComponentReference` escape
  // hatch — synthesizing `role="button"` and Enter/Space handling on top of it would stamp the
  // wrong ARIA role onto whatever it actually renders (e.g. an `<a>`) and can double-fire a click
  // (native anchor Enter→click, plus the synthesized keydown→click). Only a bare, non-native HTML
  // tag string (e.g. `'div'`) still needs `useButtonSemantics`'s synthesis.
  const isComponentReference = typeof Component !== 'string'

  const _className = classNames(
    'button',
    color,
    {
      outline: variant === 'outline',
      smooth: variant === 'smooth',
      link: variant === 'link',
      active: pressed,
      disabled: Component !== 'button' && disabled
    },
    size,
    shape,
    className
  )

  // `<a>` has no real `disabled` attribute, so a disabled link button still fires click
  // (and still navigates) unless it's blocked here. Native `button`/`input` already stop
  // clicks on their own once the `disabled` attribute below is set.
  const handleClick = useDisabledAnchorGuard<
    HTMLButtonElement | HTMLAnchorElement | HTMLInputElement
  >(isAnchor, disabled, onClick)

  // Native `button`/`a`/`input` elements get keyboard activation, focus and disabled
  // handling for free from the browser. A custom `component` doesn't, so useButtonSemantics
  // fills in role, tabIndex and Enter/Space activation for it, matching native button behavior.
  // `ref` is cast for the same reason as the branches below — it's declared for whatever `C`
  // was passed, but this path (a non-native `component`) only ever populates it with a
  // button/anchor-shaped instance.
  const { buttonProps, forkedRef } = useButtonSemantics<HTMLButtonElement | HTMLAnchorElement>(
    ref as Ref<HTMLButtonElement | HTMLAnchorElement>,
    { disabled, onClick }
  )

  // Rendered as three separate, literal JSX tags (rather than one `<Component>` tag driven
  // by a `'button' | 'a' | 'input'`-typed variable) because a union-typed tag makes JSX
  // intersect all three elements' prop types — `onClick`/`ref` would then need to satisfy
  // `button`, `a` *and* `input` simultaneously, which `handleClick`/`ref`'s real, narrower
  // types can't. `ref` is cast per branch since it's declared for the generic `C`, not the
  // specific element each branch actually renders (true by construction — each branch's ref
  // only ever populates with a matching instance). The props common to all three
  // (className/aria-pressed/onClick) are factored out here so a future addition only needs to
  // change one place, not three.
  const sharedProps = {
    className: _className,
    'aria-pressed': pressed,
    onClick: handleClick
  }

  if (Component === 'button') {
    return (
      <button
        {...(rest as Record<string, unknown>)}
        {...sharedProps}
        type={type}
        disabled={disabled}
        ref={ref as Ref<HTMLButtonElement>}
      >
        {children}
      </button>
    )
  }

  if (Component === 'input') {
    return (
      // `rest` is cast because it's typed generically, whose event handlers don't structurally
      // match `<input>`'s own `onChange` (value-change semantics) — `component="input"` is a
      // fixed set of documented attributes (`type`, `value`, `disabled`, ...), not a
      // general-purpose input, so this is a safe, deliberate escape.
      <input
        {...(rest as Record<string, unknown>)}
        {...sharedProps}
        type={type}
        disabled={disabled}
        ref={ref as Ref<HTMLInputElement>}
      />
    )
  }

  if (isAnchor) {
    return (
      // `rest` is cast for the same reason as the `input` branch above — it's typed generically,
      // whose DOM event handlers are parameterized for whatever `C` was passed, which don't
      // structurally match `<a>`'s own `HTMLAnchorElement` ones (e.g. `onCopy`), even though both
      // accept a real DOM event at runtime.
      <a
        {...(rest as Record<string, unknown>)}
        {...sharedProps}
        href={href}
        {...(disabled && { 'aria-disabled': true, tabIndex: -1 })}
        ref={ref as Ref<HTMLAnchorElement>}
      >
        {children}
      </a>
    )
  }

  return (
    <Component
      {...(isComponentReference
        ? ({ disabled, onClick, ...rest } as Record<string, unknown>)
        : (mergeProps(rest, buttonProps) as Record<string, unknown>))}
      className={_className}
      aria-pressed={pressed}
      // `href` was only ever forwarded when it also forced `Component` to `'a'` — now that an
      // explicit `component` wins over that default (see above), it needs to keep reaching a
      // custom `component`/HTML tag directly, same as `Avatar`'s equivalent fix.
      {...(href && { href })}
      ref={isComponentReference ? ref : forkedRef}
    >
      {children}
    </Component>
  )
}

export const Button = createPolymorphicComponent<ButtonComponent>(
  ButtonRender as ForwardRefRenderFunction<Element, ButtonProps<ElementType>>,
  'Button'
)
