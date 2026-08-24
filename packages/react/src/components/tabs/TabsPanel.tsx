import React, { forwardRef, HTMLAttributes, ReactNode, useRef } from 'react'
import classNames from 'classnames'
import { useTabPanel } from 'react-aria'
import { Key } from 'react-stately'

import { useForkedRef } from '../../hooks'
import { useTabsContext } from './context'

export interface TabsPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> {
  /**
   * Content of the panel, shown while the `TabsTab` of the same `id` is selected.
   */
  children: ReactNode
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Pairs this panel with the `TabsTab` of the same `id`.
   */
  id: Key
}

// The counterpart to `TabsTab` — unlike `TabsTab`, `TabsPanel` renders for real, but only while
// its `id` matches the currently selected tab.
export const TabsPanel = forwardRef<HTMLDivElement, TabsPanelProps>(
  ({ children, className, id, ...rest }, ref) => {
    const { state } = useTabsContext()
    const panelRef = useRef<HTMLDivElement>(null)
    const forkedRef = useForkedRef(ref, panelRef)
    const { tabPanelProps } = useTabPanel({ id }, state, panelRef)

    if (state.selectedKey !== id) return null

    return (
      <div
        className={classNames('tab-pane', 'fade', 'show', 'active', className)}
        {...tabPanelProps}
        {...rest}
        ref={forkedRef}
      >
        {children}
      </div>
    )
  }
)

TabsPanel.displayName = 'TabsPanel'
