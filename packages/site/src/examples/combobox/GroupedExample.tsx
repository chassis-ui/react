import { CxCombobox, CxComboboxGroup, CxComboboxItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <CxCombobox aria-label="Language" placeholder="Choose a language…">
      <CxComboboxGroup label="Frontend">
        <CxComboboxItem id="html">HTML</CxComboboxItem>
        <CxComboboxItem id="css">CSS</CxComboboxItem>
        <CxComboboxItem id="js">JavaScript</CxComboboxItem>
      </CxComboboxGroup>
      <CxComboboxGroup label="Backend">
        <CxComboboxItem id="python">Python</CxComboboxItem>
        <CxComboboxItem id="ruby">Ruby</CxComboboxItem>
      </CxComboboxGroup>
      <CxComboboxItem id="sql">SQL</CxComboboxItem>
    </CxCombobox>
  )
}
