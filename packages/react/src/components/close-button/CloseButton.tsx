import React, { ButtonHTMLAttributes, ElementType, forwardRef, RefObject, useRef } from 'react'
import classNames from 'classnames'
import { AriaButtonProps, mergeProps, useButton } from 'react-aria'

import { ContextColor, ContextStyle } from '../../types'
import { Link } from '../link/Link'
import { useForkedRef } from '../../hooks'

export interface CloseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Sets the color of the component to one of Chassis context colors. Applies the
   * `context` class alongside it, so the icon picks up that color without needing
   * an ancestor `.context` wrapper.
   */
  color?: ContextColor
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   * A custom HTML tag (e.g. `'span'`) gets button semantics — role, focus, Enter/Space
   * activation — filled in automatically. A component is trusted to handle its own semantics,
   * so pass one that's already interactive (e.g. `Button`).
   */
  component?: string | ElementType
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean
  /**
   * The accessible label announced by assistive technology. Override this to
   * localize the button for non-English contexts.
   */
  label?: string
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
   * Set the close button's context style variant. Applies the `context` class
   * alongside it, same as `color`.
   */
  variant?: ContextStyle
}

export const CloseButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, CloseButtonProps>(
  (
    {
      children,
      className,
      color,
      component = 'button',
      disabled,
      label,
      onClick,
      size,
      type = 'button',
      variant,
      ...rest
    },
    ref
  ) => {
    // A component reference (e.g. `Button`) has its own visual identity and its own
    // `color`/`size`/`variant` semantics — CloseButton's icon styling (the `close-button`
    // class and its context/color/variant/size classes) would just conflict with it, and
    // would also swallow those props before the component ever saw them. So a component
    // reference gets none of CloseButton's own styling; `color`/`size`/`variant` pass
    // through untouched, same as `className`, letting the component interpret them itself.
    const isComponentReference = typeof component !== 'string'

    const _className = isComponentReference
      ? className
      : classNames('close-button', { context: color || variant }, color, variant, size, className)

    // Only a bare HTML tag needs synthesized button semantics. A component reference is
    // trusted to already be interactive — wrapping it in useButton too would double up
    // keyboard activation (native Enter/Space plus useButton's synthetic handling).
    const needsAccessibleRole =
      typeof component === 'string' && component !== 'button' && component !== 'a'

    // The default icon-only close button has no visible text, so it needs the 'Close' fallback
    // as its accessible name. Once `children` renders visible content (e.g. custom text passed
    // through `component`), let that content be the accessible name instead — forcing the
    // fallback label here would silently override it (a Label-in-Name accessibility failure).
    // An explicit `label` always wins either way, same as an explicit `aria-label` always did.
    const _label = label ?? (children == null ? 'Close' : undefined)

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

    return (
      <Link
        component={component}
        // `type` only has button semantics; on an anchor it means something else entirely
        // (a MIME-type hint), so skip it there. A dismiss control has no reason to navigate,
        // but `component` still technically allows `'a'`, so this stays a deliberate guard
        // rather than an assumption.
        {...(component !== 'a' && { type })}
        className={_className}
        aria-label={_label}
        {...(needsAccessibleRole ? mergeProps(rest, buttonProps) : { onClick, ...rest })}
        // `LinkProps.size`/`color` come from generic HTML attribute typing (a numeric
        // `<input size>`, a legacy `color` string) — irrelevant here, since these only ever
        // reach a component reference that defines its own `size`/`color`/`variant` meaning.
        {...(isComponentReference && ({ color, size, variant } as Record<string, unknown>))}
        disabled={disabled}
        ref={needsAccessibleRole ? forkedRef : ref}
      >
        {children}
      </Link>
    )
  }
)

CloseButton.displayName = 'CloseButton'
