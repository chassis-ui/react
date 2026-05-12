import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { Colors } from '../Types'

export interface CTableHeadProps extends HTMLAttributes<HTMLTableSectionElement> {
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
}

export const CxTableHead = forwardRef<HTMLTableSectionElement, CTableHeadProps>(
  ({ children, className, context, ...rest }, ref) => {
    const _className = classNames(
      {
        [`table-${context}`]: context,
      },
      className,
    )

    return (
      <thead className={_className ? _className : undefined} {...rest} ref={ref}>
        {children}
      </thead>
    )
  },
)

CxTableHead.displayName = 'CxTableHead'
