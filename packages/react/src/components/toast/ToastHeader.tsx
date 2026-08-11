import React, { forwardRef, HTMLAttributes, ReactNode } from 'react'
import classNames from 'classnames'

import { ToastClose } from './ToastClose'

export interface ToastHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
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
   * Leading visual — typically a logo or avatar. Rendered before `title`/`time` and hidden
   * from assistive technology by default, since it duplicates `title` visually.
   */
  image?: ReactNode
  /**
   * Trailing timestamp, rendered after `title`.
   */
  time?: ReactNode
  /**
   * Heading, rendered before `time`. Shorthand for hand-composing a `<strong>` — same markup,
   * without the wiring.
   */
  title?: ReactNode
  /**
   * Sets the `id` on the rendered `title` element, for `aria-labelledby` wiring. Set
   * automatically by `Toast` when both `title` and `message` are used together; only needed
   * here for manual wiring in a fully custom composition.
   */
  titleId?: string
}

export const ToastHeader = forwardRef<HTMLDivElement, ToastHeaderProps>(
  (
    { children, className, closeButton, closeLabel, image, time, title, titleId, ...rest },
    ref
  ) => {
    const _className = classNames('toast-header', className)
    return (
      <div className={_className} {...rest} ref={ref}>
        {image != null && (
          <span aria-hidden="true" className="me-small">
            {image}
          </span>
        )}
        {title != null && (
          <strong id={titleId} className="me-auto">
            {title}
          </strong>
        )}
        {time != null && <small>{time}</small>}
        {children}
        {closeButton && <ToastClose label={closeLabel} />}
      </div>
    )
  }
)

ToastHeader.displayName = 'ToastHeader'
