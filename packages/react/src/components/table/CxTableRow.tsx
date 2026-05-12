import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { Colors } from '../Types'

export interface CTableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /**
   * Highlight a table row or cell..
   */
  active?: boolean
  /**
   * Set the vertical aligment.
   */
  align?: 'bottom' | 'middle' | 'top'
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Sets the context context of the component to one of Chassis themed colors.
   *
   * @type 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light' | string
   */
  context?: Colors
}

export const CxTableRow = forwardRef<HTMLTableRowElement, CTableRowProps>(
  ({ children, active, align, className, context, ...rest }, ref) => {
    const _className = classNames(
      context,
      {
        [`align-${align}`]: align,
        active,
      },
      className,
    )

    return (
      <tr className={_className ? _className : undefined} {...rest} ref={ref}>
        {children}
      </tr>
    )
  },
)

CxTableRow.displayName = 'CxTableRow'
