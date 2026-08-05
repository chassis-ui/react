import { Autocomplete } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Autocomplete aria-label="Language" placeholder="Choose a language…">
      <Autocomplete.Group label="Frontend">
        <Autocomplete.Item id="html">HTML</Autocomplete.Item>
        <Autocomplete.Item id="css">CSS</Autocomplete.Item>
        <Autocomplete.Item id="js">JavaScript</Autocomplete.Item>
      </Autocomplete.Group>
      <Autocomplete.Group label="Backend">
        <Autocomplete.Item id="python">Python</Autocomplete.Item>
        <Autocomplete.Item id="ruby">Ruby</Autocomplete.Item>
      </Autocomplete.Group>
      <Autocomplete.Item id="sql">SQL</Autocomplete.Item>
    </Autocomplete>
  )
}
