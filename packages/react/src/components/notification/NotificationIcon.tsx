import React, { forwardRef } from 'react'
import classNames from 'classnames'

import { Icon, IconProps } from '../icon/Icon'

export type NotificationIconProps = IconProps & {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
}

export const NotificationIcon = forwardRef<HTMLSpanElement | SVGSVGElement, NotificationIconProps>(
  ({ className, ...rest }, ref) => {
    const _className = classNames('notification-icon', className)

    return <Icon className={_className} {...rest} ref={ref} />
  }
)

NotificationIcon.displayName = 'NotificationIcon'
