import { ComboboxGroupProps } from '../combobox/ComboboxGroup'

// Same shape as `ComboboxGroupProps` — see `AutocompleteItemProps` for why this is its own
// named type instead of a re-export.
export type AutocompleteGroupProps = ComboboxGroupProps

// `AutocompleteGroup` is never actually mounted — like `ComboboxGroup`, it's read as data by
// `Autocomplete`, which splits its top-level children into groups (wrapping react-stately
// `Section` nodes) and bare items. Groups and bare items can be mixed at the top level:
//
//   <Autocomplete aria-label="Language">
//     <AutocompleteGroup label="Frontend">
//       <AutocompleteItem id="html">HTML</AutocompleteItem>
//       <AutocompleteItem id="css">CSS</AutocompleteItem>
//     </AutocompleteGroup>
//     <AutocompleteItem id="python">Python</AutocompleteItem>
//   </Autocomplete>
export const AutocompleteGroup = (_props: AutocompleteGroupProps): null => null

AutocompleteGroup.displayName = 'AutocompleteGroup'
