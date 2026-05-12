import React, { forwardRef, HTMLAttributes } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export interface CCardGroupProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const CxCardGroup = forwardRef<HTMLDivElement, CCardGroupProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('card-group', className)

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  },
)

CxCardGroup.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

CxCardGroup.displayName = 'CxCardGroup'
