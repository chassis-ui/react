import React, { forwardRef } from 'react'
import classNames from 'classnames'

import { ContextColor } from '../../types'
import { ICON_COLOR_CLASS_NAMES } from '../../utils/colorClassNames'
import { Icon, IconProps } from '../icon/Icon'

export type AlertIconProps = IconProps & {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Colors the icon with one of Chassis context colors, such as `danger` for a destructive
   * confirmation.
   */
  color?: ContextColor
}

// `.alert-icon`: an icon before the body. With it, chassis-css lays the alert out in two columns
// from the `md` breakpoint up.
export const AlertIcon = forwardRef<HTMLSpanElement | SVGSVGElement, AlertIconProps>(
  ({ className, color, ...rest }, ref) => (
    <Icon
      className={classNames('alert-icon', color && ICON_COLOR_CLASS_NAMES[color], className)}
      {...rest}
      ref={ref}
    />
  )
)

AlertIcon.displayName = 'AlertIcon'
