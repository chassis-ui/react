import React, { forwardRef, ImgHTMLAttributes } from 'react'
import classNames from 'classnames'

export interface AvatarImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
}

export const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, ...rest }, ref) => {
    const _className = classNames('avatar-image', className)

    return <img className={_className} {...rest} ref={ref} />
  }
)

AvatarImage.displayName = 'AvatarImage'
