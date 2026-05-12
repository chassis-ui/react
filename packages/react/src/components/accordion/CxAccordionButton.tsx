import React, { forwardRef, HTMLAttributes } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export interface CAccordionButtonProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const CxAccordionButton = forwardRef<HTMLSpanElement, CAccordionButtonProps>(
  ({ children, className, ...rest }, ref) => {
    return (
      <span className={classNames('accordion-title', className)} {...rest} ref={ref}>
        {children}
      </span>
    )
  },
)

CxAccordionButton.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

CxAccordionButton.displayName = 'CxAccordionButton'
