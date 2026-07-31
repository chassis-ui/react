import { CxComboboxGroupProps } from '../combobox/CxComboboxGroup'

// Same shape as `CxComboboxGroupProps` — see `CxAutocompleteItemProps` for why this is its own
// named type instead of a re-export.
export type CxAutocompleteGroupProps = CxComboboxGroupProps

// `CxAutocompleteGroup` is never actually mounted — like `CxComboboxGroup`, it's read as data by
// `CxAutocomplete`, which splits its top-level children into groups (wrapping react-stately
// `Section` nodes) and bare items. Groups and bare items can be mixed at the top level:
//
//   <CxAutocomplete aria-label="Language">
//     <CxAutocompleteGroup label="Frontend">
//       <CxAutocompleteItem id="html">HTML</CxAutocompleteItem>
//       <CxAutocompleteItem id="css">CSS</CxAutocompleteItem>
//     </CxAutocompleteGroup>
//     <CxAutocompleteItem id="python">Python</CxAutocompleteItem>
//   </CxAutocomplete>
export const CxAutocompleteGroup = (_props: CxAutocompleteGroupProps): null => null

CxAutocompleteGroup.displayName = 'CxAutocompleteGroup'
