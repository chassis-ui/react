import React, { forwardRef, ImgHTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CxImageProps extends ImgHTMLAttributes<HTMLOrSVGImageElement> {
  /**
   * Set the horizontal aligment.
   */
  align?: 'start' | 'center' | 'end'
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Make image responsive.
   */
  fluid?: boolean
  /**
   * Make image rounded.
   */
  rounded?: boolean
  /**
   * Give an image a rounded 1px border appearance.
   */
  thumbnail?: boolean
}

export const CxImage = forwardRef<HTMLImageElement, CxImageProps>(
  ({ align, className, fluid, rounded, thumbnail, ...rest }, ref) => {
    const _className = classNames(
      {
        [`float-${align}`]: align && (align === 'start' || align === 'end'),
        'd-block mx-auto': align && align === 'center',
        'img-fluid': fluid,
        rounded: rounded,
        'img-thumbnail': thumbnail
      },
      className
    )
    return <img className={_className} {...rest} ref={ref} />
  }
)

CxImage.displayName = 'CxImage'
