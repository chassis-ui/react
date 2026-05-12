import React, { forwardRef, HTMLAttributes } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export interface CAccordionHeaderProps extends HTMLAttributes<HTMLElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const CxAccordionHeader = forwardRef<HTMLElement, CAccordionHeaderProps>(
  ({ children, className, ...rest }, ref) => {
    return (
      <summary className={classNames(className) || undefined} {...rest} ref={ref}>
        <span className="accordion-title">{children}</span>
      </summary>
    )
  },
)

CxAccordionHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

CxAccordionHeader.displayName = 'CxAccordionHeader'
