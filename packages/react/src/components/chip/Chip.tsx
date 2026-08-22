import React, { ElementType, forwardRef, HTMLAttributes, MouseEvent, Ref } from 'react'
import classNames from 'classnames'

import { ContextColor, ContextStyle } from '../../types'

export interface ChipProps extends HTMLAttributes<HTMLElement> {
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
  component?: string | ElementType
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

export const Chip = forwardRef<HTMLElement, ChipProps>(
  (
    {
      children,
      className,
      color,
      component = 'span',
      disabled,
      href,
      onClick,
      pressed,
      size,
      type = 'button',
      variant,
      ...rest
    },
    ref
  ) => {
    const Component = href ? 'a' : component
    const isButton = Component === 'button'
    const isAnchor = Component === 'a'

    const _className = classNames(
      'chip',
      color,
      {
        outline: variant === 'outline',
        smooth: variant === 'smooth',
        active: pressed,
        disabled: !isButton && disabled
      },
      size,
      className
    )

    // `<a>`/`<span>`/`<div>` have no real `disabled` attribute, so a disabled non-button chip
    // still fires click (and an anchor still navigates) unless it's blocked here, same guard
    // `Button`/`CloseButton` apply.
    const handleClick = (event: MouseEvent<HTMLElement>) => {
      if (!isButton && disabled) {
        event.preventDefault()
        return
      }
      onClick?.(event)
    }

    if (isButton) {
      return (
        <button
          {...(rest as Record<string, unknown>)}
          aria-pressed={pressed}
          className={_className}
          disabled={disabled}
          onClick={handleClick as React.MouseEventHandler<HTMLButtonElement>}
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
          onClick={handleClick as React.MouseEventHandler<HTMLAnchorElement>}
          {...(disabled && { 'aria-disabled': true, tabIndex: -1 })}
          ref={ref as Ref<HTMLAnchorElement>}
        >
          {children}
        </a>
      )
    }

    const Tag = Component as ElementType

    return (
      <Tag {...rest} aria-pressed={pressed} className={_className} onClick={handleClick} ref={ref}>
        {children}
      </Tag>
    )
  }
)

Chip.displayName = 'Chip'
