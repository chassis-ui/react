import { Autocomplete, AutocompleteGroup, AutocompleteItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Autocomplete aria-label="Language" placeholder="Choose a language…">
      <AutocompleteGroup label="Frontend">
        <AutocompleteItem id="html">HTML</AutocompleteItem>
        <AutocompleteItem id="css">CSS</AutocompleteItem>
        <AutocompleteItem id="js">JavaScript</AutocompleteItem>
      </AutocompleteGroup>
      <AutocompleteGroup label="Backend">
        <AutocompleteItem id="python">Python</AutocompleteItem>
        <AutocompleteItem id="ruby">Ruby</AutocompleteItem>
      </AutocompleteGroup>
      <AutocompleteItem id="sql">SQL</AutocompleteItem>
    </Autocomplete>
  )
}
