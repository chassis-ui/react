import { ReactNode } from 'react'
import { Key } from 'react-stately'

export interface ComboboxItemProps {
  /**
   * Content of the option. Used as the filter/typeahead text when `textValue` isn't set — pass
   * `textValue` explicitly whenever `children` isn't a plain string (e.g. it wraps an icon or
   * other rich markup), since it can't otherwise be derived from rich content.
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
  /**
   * Text used for filtering and typeahead. Required when `children` isn't a plain string —
   * falls back to `children` itself when omitted and `children` is a string.
   */
  textValue?: string
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
