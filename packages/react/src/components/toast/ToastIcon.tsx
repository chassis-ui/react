import React, { forwardRef } from 'react'
import classNames from 'classnames'

import { Icon, IconProps } from '../icon/Icon'

export type ToastIconProps = IconProps & {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const ToastIcon = forwardRef<HTMLSpanElement | SVGSVGElement, ToastIconProps>(
  ({ className, ...rest }, ref) => {
    const _className = classNames('toast-icon', className)

    return <Icon className={_className} {...rest} ref={ref} />
  }
)

ToastIcon.displayName = 'ToastIcon'
