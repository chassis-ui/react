import { createContext, ReactElement, useContext } from 'react'
import { TabListState } from 'react-stately'

import { CxTabProps } from './CxTab'

export interface CxTabsContextValue {
  keyboardActivation?: 'automatic' | 'manual'
  orientation?: 'horizontal' | 'vertical'
  state: TabListState<ReactElement<CxTabProps>>
}

export const CxTabsContext = createContext<CxTabsContextValue | null>(null)

export const useCxTabsContext = (): CxTabsContextValue => {
  const context = useContext(CxTabsContext)
  if (!context) {
    throw new Error('CxTabList and CxTabPanel must be rendered inside a CxTabs')
  }
  return context
}
