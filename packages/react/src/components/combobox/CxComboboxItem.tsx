import { ReactNode } from 'react'
import { Key } from 'react-stately'

export interface CComboboxItemProps {
  /**
   * Content of the option. Must be a plain string for the option to participate in filtering
   * and typeahead.
   */
  children: ReactNode
  /**
   * Prevents the option from being selected, focused, or otherwise interacted with.
   */
  disabled?: boolean
  /**
   * Identifies this option. Submitted as the value when this option is selected.
   */
  id: Key
}

// `CxComboboxItem` is never actually mounted — like `CxTab`, it's read as data by `CxCombobox`,
// which builds react-aria's listbox collection from each item's `id` and `children`. This keeps
// the public authoring shape as plain composed JSX:
//
//   <CxCombobox aria-label="Fruit">
//     <CxComboboxItem id="apple">Apple</CxComboboxItem>
//     <CxComboboxItem id="banana">Banana</CxComboboxItem>
//   </CxCombobox>
export const CxComboboxItem = (_props: CComboboxItemProps): null => null

CxComboboxItem.displayName = 'CxComboboxItem'
