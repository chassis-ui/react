import React, { forwardRef, HTMLAttributes } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Colors, contextPropType } from '../Types'

export interface CTableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
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

export const CxTableBody = forwardRef<HTMLTableSectionElement, CTableBodyProps>(
  ({ children, className, context, ...rest }, ref) => {
    const _className = classNames(
      {
        [`table-${context}`]: context,
      },
      className,
    )

    return (
      <tbody className={_className ? _className : undefined} {...rest} ref={ref}>
        {children}
      </tbody>
    )
  },
)

CxTableBody.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  context: contextPropType,
}

CxTableBody.displayName = 'CxTableBody'
