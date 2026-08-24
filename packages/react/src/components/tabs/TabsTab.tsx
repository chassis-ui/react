import { ReactNode } from 'react'
import { Key } from 'react-stately'

export interface TabsTabProps {
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
   * Identifies this tab and pairs it with the `TabsPanel` of the same `id`.
   */
  id: Key
}

// `TabsTab` is never actually mounted — it's read as data by `Tabs`, which builds react-aria's
// tab collection from each `TabsTab`'s `id` and `children` (see `Tabs.tsx`), and `TabsList`
// renders the real, focusable tab elements from that collection instead. This keeps the public
// authoring shape as plain composed JSX:
//
//   <TabsList aria-label="...">
//     <TabsTab id="home">Home</TabsTab>
//     <TabsTab id="profile">Profile</TabsTab>
//   </TabsList>
//   <TabsPanel id="home">...</TabsPanel>
//   <TabsPanel id="profile">...</TabsPanel>
//
// `id` (not React's own `key`) is what pairs a tab with its panel — still give each `TabsTab`/
// `TabsPanel` a React `key` too, as you would for any list.
export const TabsTab = (_props: TabsTabProps): null => null

TabsTab.displayName = 'TabsTab'
