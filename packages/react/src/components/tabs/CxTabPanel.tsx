import React, { HTMLAttributes, ReactNode, useRef } from 'react'
import classNames from 'classnames'
import { useTabPanel } from 'react-aria'
import { Key } from 'react-stately'

import { useCxTabsContext } from './CxTabs'

export interface CxTabPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> {
  /**
   * Content of the panel, shown while the `CxTab` of the same `id` is selected.
   */
  children: ReactNode
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Pairs this panel with the `CxTab` of the same `id`.
   */
  id: Key
}

// The counterpart to `CxTab` — unlike `CxTab`, `CxTabPanel` renders for real, but only while its
// `id` matches the currently selected tab.
export const CxTabPanel = ({ children, className, id, ...rest }: CxTabPanelProps) => {
  const { state } = useCxTabsContext()
  const ref = useRef<HTMLDivElement>(null)
  const { tabPanelProps } = useTabPanel({ id }, state, ref)

  if (state.selectedKey !== id) return null

  return (
    <div className={classNames('tab-pane', 'fade', 'show', 'active', className)} {...tabPanelProps} {...rest} ref={ref}>
      {children}
    </div>
  )
}

CxTabPanel.displayName = 'CxTabPanel'
