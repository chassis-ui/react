import React, { forwardRef } from 'react'
import { CollapseProps } from '../collapse/Collapse'

/**
 * @deprecated Native <details>/<summary> handles collapse. This component is a no-op passthrough kept for API compatibility.
 */
export const AccordionCollapse = forwardRef<HTMLDivElement, Omit<CollapseProps, 'horizontal'>>(
  ({ children }, _ref) => <>{children}</>
)

AccordionCollapse.displayName = 'AccordionCollapse'
