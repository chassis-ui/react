export { Tabs } from './Tabs'
export type { TabsProps } from './Tabs'
export { TabsTab } from './TabsTab'
export type { TabsTabProps } from './TabsTab'
export { TabsList } from './TabsList'
export type { TabsListProps } from './TabsList'
export { TabsPanel } from './TabsPanel'
export type { TabsPanelProps } from './TabsPanel'
// plop:sub-export

// TabContent/TabPane are a separate, older API — pair with Nav (uncontrolled `visible` prop),
// not with Tabs (react-aria controlled selection). Not part of the Tabs family above.
export { TabContent } from './TabContent'
export type { TabContentProps } from './TabContent'
export { TabPane } from './TabPane'
export type { TabPaneProps } from './TabPane'
