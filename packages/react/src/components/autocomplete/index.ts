import { Autocomplete as AutocompleteRoot } from './Autocomplete'
import { AutocompleteGroup } from './AutocompleteGroup'
import { AutocompleteItem } from './AutocompleteItem'
// plop:sub-import

export const Autocomplete = Object.assign(AutocompleteRoot, {
  // plop:sub-entry
  Group: AutocompleteGroup,
  Item: AutocompleteItem
})
export type { AutocompleteProps } from './Autocomplete'
export type { AutocompleteGroupProps } from './AutocompleteGroup'
export type { AutocompleteItemProps } from './AutocompleteItem'
// plop:sub-type
