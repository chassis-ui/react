import { Tabs as TabsRoot } from './Tabs'
import { Tab } from './Tab'
import { TabList } from './TabList'
import { TabPanel } from './TabPanel'
// plop:sub-import

export const Tabs = Object.assign(TabsRoot, {
  // plop:sub-entry
  Tab: Tab,
  List: TabList,
  Panel: TabPanel
})
export type { TabsProps } from './Tabs'
export type { TabProps } from './Tab'
export type { TabListProps } from './TabList'
export type { TabPanelProps } from './TabPanel'
// plop:sub-type

// TabContent/TabPane are a separate, older API — pair with Nav (uncontrolled `visible` prop),
// not with Tabs (react-aria controlled selection). Not part of the Tabs namespace.
export { TabContent } from './TabContent'
export type { TabContentProps } from './TabContent'
export { TabPane } from './TabPane'
export type { TabPaneProps } from './TabPane'
