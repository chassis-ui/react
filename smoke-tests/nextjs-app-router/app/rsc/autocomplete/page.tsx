import { Autocomplete, AutocompleteGroup, AutocompleteItem } from '@chassis-ui/react'
import { ClientMark } from '../ClientMark'

export default function Page() {
  return (
    <main>
      <Autocomplete aria-label="Fruit" placeholder="Select a fruit">
        <AutocompleteItem id="apple" textValue="Apple" icon={<ClientMark />}>
          Apple
        </AutocompleteItem>
        <AutocompleteGroup label="Stone fruit">
          <AutocompleteItem id="cherry">Cherry</AutocompleteItem>
          <AutocompleteItem id="plum">Plum</AutocompleteItem>
        </AutocompleteGroup>
      </Autocomplete>
    </main>
  )
}
