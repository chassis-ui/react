import React, { ButtonHTMLAttributes, ElementType, forwardRef, RefObject, useRef } from 'react'
import classNames from 'classnames'
import { AriaButtonProps, mergeProps, useButton } from 'react-aria'

import { ContextColor, ContextStyle, Shapes } from '../Types'
import { CxLink } from '../link/CxLink'
import { useForkedRef } from '../../utils/hooks'

export interface CxButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Toggle the active state for the component.
   */
  active?: boolean
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Sets the context color of the component to one of Chassis themed colors.
   */
  context?: ContextColor
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
   * The role attribute describes the role of an element in programs that can make use of it, such as screen readers or magnifiers.
   */
  role?: string
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
   * Set the button style variant.
   */
  variant?: ContextStyle
}

export const CxButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, CxButtonProps>(
  (
    {
      children,
      className,
      context = 'primary',
      component = 'button',
      disabled,
      onClick,
      shape,
      size,
      type = 'button',
      variant,
      ...rest
    },
    ref
  ) => {
    const _className = classNames('button', context, variant, size, shape, className)
    const resolvedComponent = rest.href ? 'a' : component
    const isCustomComponent = resolvedComponent !== 'button' && resolvedComponent !== 'a'

    // Native `button`/`a` elements get keyboard activation, focus and disabled handling for
    // free from the browser. A custom `component` doesn't, so useButton fills in role, tabIndex
    // and Enter/Space activation for it, matching native button behavior.
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
      <CxLink
        component={resolvedComponent}
        type={type}
        className={_className}
        {...(isCustomComponent ? mergeProps(rest, buttonProps) : { onClick, ...rest })}
        disabled={disabled}
        ref={isCustomComponent ? forkedRef : ref}
      >
        {children}
      </CxLink>
    )
  }
)

CxButton.displayName = 'CxButton'
