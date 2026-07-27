import React, { ElementType, forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { ContextColor } from '../Types'

export interface CxSpinnerProps extends HTMLAttributes<HTMLDivElement | HTMLSpanElement> {
  /**
   * A string of all className you want applied to the component.
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
   * Size the component small.
   */
  size?: 'small'
  /**
   * Set the button variant to an outlined button or a ghost button.
   */
  variant?: 'border' | 'grow'
  /**
   * Set visually hidden label for accessibility purposes.
   */
  visuallyHiddenLabel?: string
}

export const CxSpinner = forwardRef<HTMLDivElement | HTMLSpanElement, CxSpinnerProps>(
  (
    {
      className,
      context,
      component: Component = 'div',
      size,
      variant = 'border',
      visuallyHiddenLabel = 'Loading...',
      ...rest
    },
    ref,
  ) => {
    const _className = classNames(
      `spinner-${variant}`,
      context ? `fg-${context}` : null,
      size && `spinner-${variant}-${size}`,
      className,
    )

    return (
      <Component className={_className} role="status" {...rest} ref={ref}>
        <span className="visually-hidden">{visuallyHiddenLabel}</span>
      </Component>
    )
  },
)

CxSpinner.displayName = 'CxSpinner'
