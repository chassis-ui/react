import React, { ElementType, HTMLAttributes, forwardRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Colors, contextPropType } from '../Types'
import { CxLink } from '../link/CxLink'

export interface CListGroupItemProps
  extends HTMLAttributes<HTMLLIElement | HTMLAnchorElement | HTMLButtonElement> {
  /**
   * Toggle the active state for the component.
   */
  active?: boolean
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the context context of the component to one of Bootstrap React’s themed colors.
   *
   * @type 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light' | string
   */
  context?: Colors
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
}

export const CxListGroupItem = forwardRef<
  HTMLLIElement | HTMLAnchorElement | HTMLButtonElement,
  CListGroupItemProps
>(({ children, active, className, disabled, context, component = 'li', ...rest }, ref) => {
  const _className = classNames(
    'list-item',
    context,
    {
      action: component === 'a' || component === 'button',
      active,
      disabled,
    },
    className,
  )

  const Component = component === 'a' || component === 'button' ? CxLink : component

  rest = {
    ...((component === 'a' || component === 'button') && {
      active,
      disabled,
      component,
      ref: ref,
    }),
    ...(active && { 'aria-current': true }),
    ...(disabled && { 'aria-disabled': true }),
    ...rest,
  }

  return (
    <Component className={_className} {...rest}>
      {children}
    </Component>
  )
})

CxListGroupItem.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  context: contextPropType,
  component: PropTypes.elementType,
  disabled: PropTypes.bool,
}

CxListGroupItem.displayName = 'CxListGroupItem'
