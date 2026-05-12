import React, { ElementType, forwardRef } from 'react'
import classNames from 'classnames'

import { CLinkProps } from '../link/CxLink'
import { CxLink } from '../link/CxLink'

export interface CDropdownItemProps extends CLinkProps {
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: string | ElementType
}

export const CxDropdownItem = forwardRef<HTMLButtonElement | HTMLAnchorElement, CDropdownItemProps>(
  ({ children, className, component = 'a', ...rest }, ref) => {
    const _className = classNames('dropdown-item', className)

    return (
      <CxLink component={component} {...rest} className={_className} ref={ref}>
        {children}
      </CxLink>
    )
  },
)

CxDropdownItem.displayName = 'CxDropdownItem'
