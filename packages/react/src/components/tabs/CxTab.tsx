import { ReactNode } from 'react'
import { Key } from 'react-stately'

export interface CTabProps {
  /**
   * Label content for the tab. Must be a plain string for the tab to participate in typeahead.
   */
  children: ReactNode
  /**
   * Prevents the tab from being selected, focused, or otherwise interacted with.
   */
  disabled?: boolean
  /**
   * Identifies this tab and pairs it with the `CxTabPanel` of the same `id`.
   */
  id: Key
}

// `CxTab` is never actually mounted — it's read as data by `CxTabs`, which builds react-aria's
// tab collection from each `CxTab`'s `id` and `children` (see `CxTabs.tsx`), and `CxTabList`
// renders the real, focusable tab elements from that collection instead. This keeps the public
// authoring shape as plain composed JSX:
//
//   <CxTabList aria-label="...">
//     <CxTab id="home">Home</CxTab>
//     <CxTab id="profile">Profile</CxTab>
//   </CxTabList>
//   <CxTabPanel id="home">...</CxTabPanel>
//   <CxTabPanel id="profile">...</CxTabPanel>
//
// `id` (not React's own `key`) is what pairs a tab with its panel — still give each `CxTab`/
// `CxTabPanel` a React `key` too, as you would for any list.
export const CxTab = (_props: CTabProps): null => null

CxTab.displayName = 'CxTab'
