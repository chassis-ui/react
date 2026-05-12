import React, { forwardRef, HTMLAttributes } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { CxToastClose } from './CxToastClose'

export interface CToastHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Automatically add a close button to the header.
   */
  closeButton?: boolean
}

export const CxToastHeader = forwardRef<HTMLDivElement, CToastHeaderProps>(
  ({ children, className, closeButton, ...rest }, ref) => {
    const _className = classNames('toast-header', className)
    return (
      <div className={_className} {...rest} ref={ref}>
        {children}
        {closeButton && <CxToastClose />}
      </div>
    )
  },
)

CxToastHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  closeButton: PropTypes.bool,
}

CxToastHeader.displayName = 'CxToastHeader'
