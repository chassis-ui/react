import { ReactNode } from 'react'

export interface CxComboboxGroupProps {
  /**
   * `CxComboboxItem` elements belonging to this group.
   */
  children: ReactNode
  /**
   * Header content for the group (`.menu-header`).
   */
  label: ReactNode
}

// `CxComboboxGroup` is never actually mounted — like `CxComboboxItem`, it's read as data by
// `CxCombobox`, which splits its top-level children into groups (wrapping react-stately
// `Section` nodes) and bare items. Groups and bare items can be mixed at the top level:
//
//   <CxCombobox aria-label="Language">
//     <CxComboboxGroup label="Frontend">
//       <CxComboboxItem id="html">HTML</CxComboboxItem>
//       <CxComboboxItem id="css">CSS</CxComboboxItem>
//     </CxComboboxGroup>
//     <CxComboboxItem id="python">Python</CxComboboxItem>
//   </CxCombobox>
export const CxComboboxGroup = (_props: CxComboboxGroupProps): null => null

CxComboboxGroup.displayName = 'CxComboboxGroup'
