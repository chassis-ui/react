import { Combobox as ComboboxRoot } from './Combobox'
import { ComboboxGroup } from './ComboboxGroup'
import { ComboboxItem } from './ComboboxItem'
// plop:sub-import

export const Combobox = Object.assign(ComboboxRoot, {
  // plop:sub-entry
  Group: ComboboxGroup,
  Item: ComboboxItem
})
export type { ComboboxProps } from './Combobox'
export type { ComboboxGroupProps } from './ComboboxGroup'
export type { ComboboxItemProps } from './ComboboxItem'
// plop:sub-type
