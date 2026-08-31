import { createContext, MutableRefObject, ReactElement, useContext } from 'react'
import { TabListState } from 'react-stately'

import { TabProps } from './Tab'

export interface TabsContextValue {
  keyboardActivation?: 'automatic' | 'manual'
  orientation?: 'horizontal' | 'vertical'
  state: TabListState<ReactElement<TabProps>>
  // Read by `TabPanel` at mount time to skip its fade-in for whichever panel is selected on the
  // very first render — only a tab *switch* should animate, not the page settling in. `Tabs`
  // flips this to `false` in an effect once the initial commit has painted.
  isInitialSelectionRef: MutableRefObject<boolean>
}

export const TabsContext = createContext<TabsContextValue | null>(null)

export const useTabsContext = (): TabsContextValue => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('TabList and TabPanel must be rendered inside a Tabs')
  }
  return context
}
