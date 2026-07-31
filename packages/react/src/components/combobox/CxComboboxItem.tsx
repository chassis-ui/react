import { ReactNode } from 'react'
import { Key } from 'react-stately'

export interface CxComboboxItemProps {
  /**
   * Content of the option. Must be a plain string for the option to participate in filtering
   * and typeahead — this holds even when `icon`/`description` are also set, since those are
   * purely presentational additions layered on top.
   */
  children: ReactNode
  /**
   * Secondary line of text rendered below `children` (`.menu-item-description`).
   */
  description?: ReactNode
  /**
   * Prevents the option from being selected, focused, or otherwise interacted with.
   */
  disabled?: boolean
  /**
   * Icon rendered at the option's leading edge (`.menu-item-icon`).
   */
  icon?: ReactNode
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
export const CxComboboxItem = (_props: CxComboboxItemProps): null => null

CxComboboxItem.displayName = 'CxComboboxItem'
