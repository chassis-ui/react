import { createContext, ReactElement, useContext } from 'react'
import { TabListState } from 'react-stately'

import { TabProps } from './Tab'

export interface TabsContextValue {
  keyboardActivation?: 'automatic' | 'manual'
  orientation?: 'horizontal' | 'vertical'
  state: TabListState<ReactElement<TabProps>>
}

export const TabsContext = createContext<TabsContextValue | null>(null)

export const useTabsContext = (): TabsContextValue => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('TabList and TabPanel must be rendered inside a Tabs')
  }
  return context
}
