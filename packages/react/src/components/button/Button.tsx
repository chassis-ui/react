import React, {
  ButtonHTMLAttributes,
  ElementType,
  forwardRef,
  MouseEvent,
  RefObject,
  useRef
} from 'react'
import classNames from 'classnames'
import { AriaButtonProps, mergeProps, useButton } from 'react-aria'

import { ContextColor, ContextStyle, Shapes } from '../../types'
import { useForkedRef } from '../../hooks'

// Elements with real native button/link semantics — keyboard activation, focus handling and
// (for button/input) a working `disabled` attribute all come for free from the browser here.
const NATIVE_ELEMENTS = new Set(['button', 'a', 'input'])

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
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

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
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
    const isNative = typeof Component === 'string' && NATIVE_ELEMENTS.has(Component)

    const _className = classNames(
      'button',
      color,
      {
        outline: variant === 'outline',
        smooth: variant === 'smooth',
        link: variant === 'link',
        active: pressed,
        disabled: isAnchor && disabled
      },
      size,
      shape,
      className
    )

    // `<a>` has no real `disabled` attribute, so a disabled link button still fires click
    // (and still navigates) unless it's blocked here. Native `button`/`input` already stop
    // clicks on their own once the `disabled` attribute below is set.
    const handleClick = (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (isAnchor && disabled) {
        event.preventDefault()
        return
      }
      onClick?.(event as unknown as MouseEvent<HTMLButtonElement>)
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

    if (isNative) {
      return (
        <Component
          {...rest}
          className={_className}
          {...(!isAnchor && { type, disabled })}
          {...(isAnchor && disabled && { 'aria-disabled': true, tabIndex: -1 })}
          aria-pressed={pressed}
          onClick={handleClick}
          ref={ref}
        >
          {children}
        </Component>
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
