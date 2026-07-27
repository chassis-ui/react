import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CxCloseButtonProps extends HTMLAttributes<HTMLButtonElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean
  /**
   * Change the default context to white.
   */
  white?: boolean
}

export const CxCloseButton = forwardRef<HTMLButtonElement, CxCloseButtonProps>(
  ({ className, disabled, white, ...rest }, ref) => {
    const _className = classNames('close-button', { white }, className)
    return (
      <button className={_className} aria-label="Close" disabled={disabled} {...rest} ref={ref} />
    )
  }
)

CxCloseButton.displayName = 'CxCloseButton'
