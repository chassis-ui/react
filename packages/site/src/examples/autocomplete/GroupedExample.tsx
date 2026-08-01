import { CxAutocomplete, CxAutocompleteGroup, CxAutocompleteItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <CxAutocomplete aria-label="Language" placeholder="Choose a language…">
      <CxAutocompleteGroup label="Frontend">
        <CxAutocompleteItem id="html">HTML</CxAutocompleteItem>
        <CxAutocompleteItem id="css">CSS</CxAutocompleteItem>
        <CxAutocompleteItem id="js">JavaScript</CxAutocompleteItem>
      </CxAutocompleteGroup>
      <CxAutocompleteGroup label="Backend">
        <CxAutocompleteItem id="python">Python</CxAutocompleteItem>
        <CxAutocompleteItem id="ruby">Ruby</CxAutocompleteItem>
      </CxAutocompleteGroup>
      <CxAutocompleteItem id="sql">SQL</CxAutocompleteItem>
    </CxAutocomplete>
  )
}
