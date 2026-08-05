import { ComboboxItemProps } from '../combobox/ComboboxItem'

// Same shape as `ComboboxItemProps` — kept as its own named type (rather than re-exporting
// `ComboboxItemProps` directly) so `Autocomplete`'s public API doesn't leak an unrelated
// component's prop type, even though the two are structurally identical under the hood.
export type AutocompleteItemProps = ComboboxItemProps

// `AutocompleteItem` is never actually mounted — like `ComboboxItem`, it's read as data by
// `Autocomplete`, which builds react-aria's listbox collection from each item's `id` and
// `children`. This keeps the public authoring shape as plain composed JSX:
//
//   <Autocomplete aria-label="Fruit">
//     <AutocompleteItem id="apple">Apple</AutocompleteItem>
//     <AutocompleteItem id="banana">Banana</AutocompleteItem>
//   </Autocomplete>
export const AutocompleteItem = (_props: AutocompleteItemProps): null => null

AutocompleteItem.displayName = 'AutocompleteItem'
