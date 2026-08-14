import { Autocomplete, AutocompleteItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Autocomplete aria-label="Fruit" placeholder="Select a fruit…">
      <AutocompleteItem id="apple">Apple</AutocompleteItem>
      <AutocompleteItem id="banana">Banana</AutocompleteItem>
      <AutocompleteItem id="cherry">Cherry</AutocompleteItem>
      <AutocompleteItem id="grape">Grape</AutocompleteItem>
      <AutocompleteItem id="mango">Mango</AutocompleteItem>
    </Autocomplete>
  )
}
