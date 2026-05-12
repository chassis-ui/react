import React, { forwardRef, HTMLAttributes } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export interface CCarouselCaptionProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const CxCarouselCaption = forwardRef<HTMLDivElement, CCarouselCaptionProps>(
  ({ className, ...rest }, ref) => {
    const _className = classNames('carousel-caption', className)

    return <div className={_className} {...rest} ref={ref} />
  },
)

CxCarouselCaption.propTypes = {
  className: PropTypes.string,
}

CxCarouselCaption.displayName = 'CxCarouselCaption'
