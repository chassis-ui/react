import { createContext, ReactElement, useContext } from 'react'
import { TabListState } from 'react-stately'

import { TabsTabProps } from './TabsTab'

export interface TabsContextValue {
  keyboardActivation?: 'automatic' | 'manual'
  orientation?: 'horizontal' | 'vertical'
  state: TabListState<ReactElement<TabsTabProps>>
}

export const TabsContext = createContext<TabsContextValue | null>(null)

export const useTabsContext = (): TabsContextValue => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('TabsList and TabsPanel must be rendered inside a Tabs')
  }
  return context
}
