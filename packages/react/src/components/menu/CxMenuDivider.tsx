import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CMenuDividerProps extends HTMLAttributes<HTMLHRElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
}

export const CxMenuDivider = forwardRef<HTMLHRElement, CMenuDividerProps>(
  ({ className, ...rest }, ref) => {
    const _className = classNames('menu-divider', className)

    return <hr className={_className} {...rest} ref={ref} />
  },
)

CxMenuDivider.displayName = 'CxMenuDivider'
