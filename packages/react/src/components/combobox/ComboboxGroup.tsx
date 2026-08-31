import { ReactNode } from 'react'

export interface ComboboxGroupProps {
  /**
   * Items belonging to this group.
   */
  children: ReactNode
  /**
   * Header content for the group (`.menu-header`).
   */
  label: ReactNode
}

// `ComboboxGroup` is never actually mounted — like `ComboboxItem`, it's read as data by
// `Combobox`, which splits its top-level children into groups (wrapping react-stately
// `Section` nodes) and bare items. Groups and bare items can be mixed at the top level:
//
//   <Combobox aria-label="Language">
//     <ComboboxGroup label="Frontend">
//       <ComboboxItem id="html">HTML</ComboboxItem>
//       <ComboboxItem id="css">CSS</ComboboxItem>
//     </ComboboxGroup>
//     <ComboboxItem id="python">Python</ComboboxItem>
//   </Combobox>
export const ComboboxGroup = (_props: ComboboxGroupProps): null => null

ComboboxGroup.displayName = 'ComboboxGroup'
