import { CxCombobox, CxComboboxItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <CxCombobox aria-label="Fruit" placeholder="Select a fruit…">
      <CxComboboxItem id="apple">Apple</CxComboboxItem>
      <CxComboboxItem id="banana">Banana</CxComboboxItem>
      <CxComboboxItem id="cherry">Cherry</CxComboboxItem>
      <CxComboboxItem id="grape">Grape</CxComboboxItem>
      <CxComboboxItem id="mango">Mango</CxComboboxItem>
      <CxComboboxItem id="orange">Orange</CxComboboxItem>
      <CxComboboxItem id="peach">Peach</CxComboboxItem>
      <CxComboboxItem id="strawberry">Strawberry</CxComboboxItem>
    </CxCombobox>
  )
}
