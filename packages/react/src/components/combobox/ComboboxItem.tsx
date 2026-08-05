import { ReactNode } from 'react'
import { Key } from 'react-stately'

export interface ComboboxItemProps {
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

// `ComboboxItem` is never actually mounted — like `Tab`, it's read as data by `Combobox`,
// which builds react-aria's listbox collection from each item's `id` and `children`. This keeps
// the public authoring shape as plain composed JSX:
//
//   <Combobox aria-label="Fruit">
//     <ComboboxItem id="apple">Apple</ComboboxItem>
//     <ComboboxItem id="banana">Banana</ComboboxItem>
//   </Combobox>
export const ComboboxItem = (_props: ComboboxItemProps): null => null

ComboboxItem.displayName = 'ComboboxItem'
