import React, { ElementType, forwardRef, HTMLAttributes } from 'react'
import classNames from 'classnames'

export interface CCardImageProps
  extends HTMLAttributes<HTMLImageElement | HTMLOrSVGElement | HTMLOrSVGImageElement> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
  /**
   * Optionally orientate the image to the top, bottom, or make it overlaid across the card.
   */
  orientation?: 'top' | 'bottom'
}

export const CxCardImage = forwardRef<
  HTMLImageElement | HTMLOrSVGElement | HTMLOrSVGImageElement,
  CCardImageProps
>(({ children, className, component: Component = 'img', orientation, ...rest }, ref) => {
  const _className = classNames(orientation ? `card-img-${orientation}` : 'card-img', className)

  return (
    <Component className={_className} {...rest} ref={ref}>
      {children}
    </Component>
  )
})

CxCardImage.displayName = 'CxCardImage'
