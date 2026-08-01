import { CxAutocomplete, CxAutocompleteItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <CxAutocomplete aria-label="Fruit" placeholder="Select a fruit…">
      <CxAutocompleteItem id="apple">Apple</CxAutocompleteItem>
      <CxAutocompleteItem id="banana">Banana</CxAutocompleteItem>
      <CxAutocompleteItem id="cherry">Cherry</CxAutocompleteItem>
      <CxAutocompleteItem id="grape">Grape</CxAutocompleteItem>
      <CxAutocompleteItem id="mango">Mango</CxAutocompleteItem>
    </CxAutocomplete>
  )
}
