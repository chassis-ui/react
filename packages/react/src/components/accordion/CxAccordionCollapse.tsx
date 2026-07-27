import React, { forwardRef } from 'react'
import { CxCollapseProps } from '../collapse/CxCollapse'

/**
 * @deprecated Native <details>/<summary> handles collapse. This component is a no-op passthrough kept for API compatibility.
 */
export const CxAccordionCollapse = forwardRef<HTMLDivElement, Omit<CxCollapseProps, 'horizontal'>>(
  ({ children }, _ref) => <>{children}</>
)

CxAccordionCollapse.displayName = 'CxAccordionCollapse'
