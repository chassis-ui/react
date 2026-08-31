import { Combobox, ComboboxGroup, ComboboxItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Combobox aria-label="Language" placeholder="Choose a language…">
      <ComboboxGroup label="Frontend">
        <ComboboxItem id="html">HTML</ComboboxItem>
        <ComboboxItem id="css">CSS</ComboboxItem>
        <ComboboxItem id="js">JavaScript</ComboboxItem>
      </ComboboxGroup>
      <ComboboxGroup label="Backend">
        <ComboboxItem id="python">Python</ComboboxItem>
        <ComboboxItem id="ruby">Ruby</ComboboxItem>
      </ComboboxGroup>
      <ComboboxItem id="sql">SQL</ComboboxItem>
    </Combobox>
  )
}
