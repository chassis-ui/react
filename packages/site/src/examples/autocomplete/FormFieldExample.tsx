import { CxAutocomplete, CxAutocompleteItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <CxAutocomplete
      label="Country"
      help="The billing region."
      name="country"
      placeholder="Pick a country…"
    >
      <CxAutocompleteItem id="us">United States</CxAutocompleteItem>
      <CxAutocompleteItem id="uk">United Kingdom</CxAutocompleteItem>
      <CxAutocompleteItem id="ca">Canada</CxAutocompleteItem>
      <CxAutocompleteItem id="au">Australia</CxAutocompleteItem>
      <CxAutocompleteItem id="de">Germany</CxAutocompleteItem>
    </CxAutocomplete>
  )
}
