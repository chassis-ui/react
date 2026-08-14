import { Autocomplete, AutocompleteItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Autocomplete
      label="Country"
      help="The billing region."
      name="country"
      placeholder="Pick a country…"
    >
      <AutocompleteItem id="us">United States</AutocompleteItem>
      <AutocompleteItem id="uk">United Kingdom</AutocompleteItem>
      <AutocompleteItem id="ca">Canada</AutocompleteItem>
      <AutocompleteItem id="au">Australia</AutocompleteItem>
      <AutocompleteItem id="de">Germany</AutocompleteItem>
    </Autocomplete>
  )
}
