import React, { forwardRef, HTMLAttributes, ReactNode } from 'react'
import classNames from 'classnames'

import { CloseButton } from '../close-button/CloseButton'
import { useToast } from '../../hooks'
import { ToastIcon } from './ToastIcon'

export interface ToastHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Heading, rendered before `time` as a `<strong>`.
   */
  children?: ReactNode
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Automatically add a close button to the header.
   */
  closeButton?: boolean
  /**
   * Overrides the close button's accessible name (defaults to `'Close'`). Set this for
   * non-English UIs.
   */
  closeLabel?: string
  /**
   * Leading icon. A string is rendered as `<ToastIcon name={icon} />`; pass any other node
   * for a fully custom icon (typically a logo or avatar). Hidden from assistive technology by
   * default, since it duplicates the heading visually.
   */
  icon?: string | ReactNode
  /**
   * Trailing timestamp, rendered after the heading.
   */
  time?: ReactNode
  /**
   * Sets the `id` on the rendered heading element, for `aria-labelledby` wiring. Set
   * automatically by `Toast` when both `title` and `message` are used together; only needed
   * here for manual wiring in a fully custom composition.
   */
  titleId?: string
}

export const ToastHeader = forwardRef<HTMLDivElement, ToastHeaderProps>(
  ({ children, className, closeButton, closeLabel, icon, time, titleId, ...rest }, ref) => {
    const { close } = useToast()
    const _className = classNames('toast-header', className)
    return (
      <div className={_className} {...rest} ref={ref}>
        {icon != null && (
          <span aria-hidden="true" className="me-small">
            {typeof icon === 'string' ? <ToastIcon name={icon} /> : icon}
          </span>
        )}
        {children != null && (
          <strong id={titleId} className="me-auto">
            {children}
          </strong>
        )}
        {time != null && <small>{time}</small>}
        {closeButton && <CloseButton label={closeLabel} onClick={close} />}
      </div>
    )
  }
)

ToastHeader.displayName = 'ToastHeader'
