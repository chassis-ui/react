import React, { forwardRef, HTMLAttributes } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export interface CModalContentProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const CxModalContent = forwardRef<HTMLDivElement, CModalContentProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('modal-content', className)

    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  },
)

CxModalContent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

CxModalContent.displayName = 'CxModalContent'
