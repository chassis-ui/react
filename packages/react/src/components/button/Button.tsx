import React, {
  ButtonHTMLAttributes,
  ElementType,
  forwardRef,
  MouseEvent,
  MouseEventHandler,
  Ref,
  RefObject,
  useRef
} from 'react'
import classNames from 'classnames'
import { AriaButtonProps, mergeProps, useButton } from 'react-aria'

import { ContextColor, ContextStyle, Shapes } from '../../types'
import { useForkedRef } from '../../hooks'

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
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

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement | HTMLInputElement,
  ButtonProps
>(
  (
    {
      children,
      className,
      color = 'primary',
      component = 'button',
      disabled,
      onClick,
      pressed,
      shape,
      size,
      type = 'button',
      variant,
      ...rest
    },
    ref
  ) => {
    const Component = rest.href ? 'a' : component
    const isAnchor = Component === 'a'

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
    const handleClick = (
      event: MouseEvent<HTMLButtonElement | HTMLAnchorElement | HTMLInputElement>
    ) => {
      if (isAnchor && disabled) {
        event.preventDefault()
        return
      }
      onClick?.(event)
    }

    // Native `button`/`a`/`input` elements get keyboard activation, focus and disabled
    // handling for free from the browser. A custom `component` doesn't, so useButton fills in
    // role, tabIndex and Enter/Space activation for it, matching native button behavior.
    const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null)
    const forkedRef = useForkedRef(ref, buttonRef)
    const buttonAriaProps: AriaButtonProps<'div'> = {
      elementType: 'div',
      isDisabled: disabled,
      onClick: onClick as unknown as AriaButtonProps<'div'>['onClick']
    }
    const { buttonProps } = useButton(
      buttonAriaProps,
      buttonRef as RefObject<HTMLDivElement | null>
    )

    // Rendered as three separate, literal JSX tags (rather than one `<Component>` tag driven
    // by a `'button' | 'a' | 'input'`-typed variable) because a union-typed tag makes JSX
    // intersect all three elements' prop types — `onClick`/`ref` would then need to satisfy
    // `button`, `a` *and* `input` simultaneously, which `handleClick`/`ref`'s real, narrower
    // types can't. `ref` is cast per branch since it's declared for the `button | a | input`
    // union this component exposes publicly, not the specific element each branch actually
    // renders (true by construction — each branch's ref only ever populates with a matching
    // instance). The props common to all three (className/aria-pressed/onClick) are factored
    // out here so a future addition only needs to change one place, not three.
    const sharedProps = {
      className: _className,
      'aria-pressed': pressed,
      onClick: handleClick
    }

    if (Component === 'button') {
      return (
        <button
          {...rest}
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
        // `rest` is cast because it's typed as `ButtonHTMLAttributes`, whose `onChange`
        // (button semantics) collides with `<input>`'s own `onChange` (value-change semantics)
        // — `component="input"` is a fixed set of documented attributes (`type`, `value`,
        // `disabled`, ...), not a general-purpose input, so this is a safe, deliberate escape.
        <input
          {...(rest as Record<string, unknown>)}
          {...sharedProps}
          type={type}
          disabled={disabled}
          ref={ref as Ref<HTMLInputElement>}
        />
      )
    }

    if (Component === 'a') {
      return (
        // `rest` is cast for the same reason as the `input` branch above — it's typed as
        // `ButtonHTMLAttributes`, whose DOM event handlers are parameterized for
        // `HTMLButtonElement`, which don't structurally match `<a>`'s own `HTMLAnchorElement`
        // ones (e.g. `onCopy`), even though both accept a real DOM event at runtime.
        <a
          {...(rest as Record<string, unknown>)}
          {...sharedProps}
          {...(disabled && { 'aria-disabled': true, tabIndex: -1 })}
          ref={ref as Ref<HTMLAnchorElement>}
        >
          {children}
        </a>
      )
    }

    return (
      <Component
        {...mergeProps(rest, buttonProps)}
        className={_className}
        aria-pressed={pressed}
        ref={forkedRef}
      >
        {children}
      </Component>
    )
  }
)

Button.displayName = 'Button'
