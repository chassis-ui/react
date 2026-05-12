import React, { forwardRef } from 'react'
import { CCollapseProps } from '../collapse/CxCollapse'

/**
 * @deprecated Native <details>/<summary> handles collapse. This component is a no-op passthrough kept for API compatibility.
 */
export const CxAccordionCollapse = forwardRef<HTMLDivElement, Omit<CCollapseProps, 'horizontal'>>(
  ({ children }, _ref) => <>{children}</>,
)

CxAccordionCollapse.displayName = 'CxAccordionCollapse'
