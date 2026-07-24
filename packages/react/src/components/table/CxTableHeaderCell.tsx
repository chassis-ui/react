import React, { forwardRef, ThHTMLAttributes } from 'react'
import classNames from 'classnames'

import { ContextColor } from '../Types'

export interface CTableHeaderCellProps extends ThHTMLAttributes<HTMLTableHeaderCellElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the context context of the component to one of Chassis themed colors.
   *
   * @type 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light' | string
   */
  context?: ContextColor
}

export const CxTableHeaderCell = forwardRef<HTMLTableHeaderCellElement, CTableHeaderCellProps>(
  ({ children, className, context, ...rest }, ref) => {
    const _className = classNames(context, className)

    return (
      <th className={_className ? _className : undefined} {...rest} ref={ref}>
        {children}
      </th>
    )
  },
)

CxTableHeaderCell.displayName = 'CxTableHeaderCell'
