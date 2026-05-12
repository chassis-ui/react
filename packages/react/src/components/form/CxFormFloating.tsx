import React, { forwardRef, HTMLAttributes } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export interface CFormFloatingProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
}

export const CxFormFloating = forwardRef<HTMLDivElement, CFormFloatingProps>(
  ({ children, className, ...rest }, ref) => {
    const _className = classNames('form-floating', className)
    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
      </div>
    )
  },
)

CxFormFloating.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

CxFormFloating.displayName = 'CxFormFloating'
