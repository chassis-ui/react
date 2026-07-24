import React, { ButtonHTMLAttributes, ElementType, forwardRef } from 'react'
import classNames from 'classnames'

import { ContextColor, ContextStyle, Shapes } from '../Types'
import { CxLink } from '../link/CxLink'

export interface CButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Toggle the active state for the component.
   */
  active?: boolean
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Sets the context context of the component to one of Chassis themed colors.
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

export const CxButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, CButtonProps>(
  (
    {
      children,
      className,
      context = 'primary',
      component = 'button',
      shape,
      size,
      type = 'button',
      variant,
      ...rest
    },
    ref,
  ) => {
    const _className = classNames('button', context, variant, size, shape, className)

    return (
      <CxLink
        component={rest.href ? 'a' : component}
        type={type}
        className={_className}
        {...rest}
        ref={ref}
      >
        {children}
      </CxLink>
    )
  },
)

CxButton.displayName = 'CxButton'
