import React, { forwardRef } from 'react'
import { CollapseProps } from '../collapse/Collapse'

/**
 * @deprecated Native <details>/<summary> handles collapse. This component is a no-op passthrough kept for API compatibility.
 */
export const AccordionCollapse = forwardRef<HTMLDivElement, Omit<CollapseProps, 'horizontal'>>(
  ({ children }, _ref) => {
    console.warn(
      'AccordionCollapse is deprecated: native <details>/<summary> handles collapse now, so ' +
        'this is a no-op passthrough kept for API compatibility. It will be removed in a future ' +
        'major version.'
    )

    return <>{children}</>
  }
)

AccordionCollapse.displayName = 'AccordionCollapse'
