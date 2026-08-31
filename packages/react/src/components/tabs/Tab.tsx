import { ReactNode } from 'react'
import { Key } from 'react-stately'

export interface TabProps {
  /**
   * Label content for the tab. Must be a plain string for it to be used as the tab's accessible
   * name when the rendered content itself doesn't expose one (e.g. an icon-only tab).
   */
  children: ReactNode
  /**
   * Prevents the tab from being selected, focused, or otherwise interacted with.
   */
  disabled?: boolean
  /**
   * Identifies this tab and pairs it with the `TabPanel` of the same `id`.
   */
  id: Key
}

// `Tab` is never actually mounted — it's read as data by `Tabs`, which builds react-aria's tab
// collection from each `Tab`'s `id` and `children` (see `Tabs.tsx`), and `TabList` renders the
// real, focusable tab elements from that collection instead. This keeps the public authoring
// shape as plain composed JSX:
//
//   <TabList aria-label="...">
//     <Tab id="home">Home</Tab>
//     <Tab id="profile">Profile</Tab>
//   </TabList>
//   <TabPanel id="home">...</TabPanel>
//   <TabPanel id="profile">...</TabPanel>
//
// `id` (not React's own `key`) is what pairs a tab with its panel — still give each `Tab`/
// `TabPanel` a React `key` too, as you would for any list.
export const Tab = (_props: TabProps): null => null

Tab.displayName = 'Tab'
