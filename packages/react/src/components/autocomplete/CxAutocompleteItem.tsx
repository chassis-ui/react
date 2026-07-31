import { CxComboboxItemProps } from '../combobox/CxComboboxItem'

// Same shape as `CxComboboxItemProps` — kept as its own named type (rather than re-exporting
// `CxComboboxItemProps` directly) so `CxAutocomplete`'s public API doesn't leak an unrelated
// component's prop type, even though the two are structurally identical under the hood.
export type CxAutocompleteItemProps = CxComboboxItemProps

// `CxAutocompleteItem` is never actually mounted — like `CxComboboxItem`, it's read as data by
// `CxAutocomplete`, which builds react-aria's listbox collection from each item's `id` and
// `children`. This keeps the public authoring shape as plain composed JSX:
//
//   <CxAutocomplete aria-label="Fruit">
//     <CxAutocompleteItem id="apple">Apple</CxAutocompleteItem>
//     <CxAutocompleteItem id="banana">Banana</CxAutocompleteItem>
//   </CxAutocomplete>
export const CxAutocompleteItem = (_props: CxAutocompleteItemProps): null => null

CxAutocompleteItem.displayName = 'CxAutocompleteItem'
