import React, { forwardRef, HTMLAttributes } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export interface CModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const CxModalBody = forwardRef<HTMLDivElement, CModalBodyProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('modal-body', className)

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  },
)

CxModalBody.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

CxModalBody.displayName = 'CxModalBody'
