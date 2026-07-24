import React, { forwardRef, TdHTMLAttributes } from 'react'
import classNames from 'classnames'

import { ContextColor } from '../Types'

export interface CTableDataCellProps
  extends Omit<TdHTMLAttributes<HTMLTableDataCellElement>, 'align'> {
  /**
   * Highlight a table row or cell.
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
   */
  context?: ContextColor
}

export const CxTableDataCell = forwardRef<HTMLTableDataCellElement, CTableDataCellProps>(
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
      <td className={_className ? _className : undefined} {...rest} ref={ref}>
        {children}
      </td>
    )
  },
)

CxTableDataCell.displayName = 'CxTableDataCell'
