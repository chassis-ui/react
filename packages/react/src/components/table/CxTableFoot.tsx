import PropTypes from 'prop-types'
import React, { forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

import { Colors, contextPropType } from '../Types'

export interface CTableFootProps extends HTMLAttributes<HTMLTableSectionElement> {
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

export const CxTableFoot = forwardRef<HTMLTableSectionElement, CTableFootProps>(
  ({ children, className, context, ...rest }, ref) => {
    const _className = classNames(
      {
        [`table-${context}`]: context,
      },
      className,
    )

    return (
      <tfoot className={_className ? _className : undefined} {...rest} ref={ref}>
        {children}
      </tfoot>
    )
  },
)

CxTableFoot.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  context: contextPropType,
}

CxTableFoot.displayName = 'CxTableFoot'
