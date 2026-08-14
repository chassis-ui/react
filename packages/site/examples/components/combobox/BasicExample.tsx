import { Combobox, ComboboxItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Combobox aria-label="Fruit" placeholder="Select a fruit…">
      <ComboboxItem id="apple">Apple</ComboboxItem>
      <ComboboxItem id="banana">Banana</ComboboxItem>
      <ComboboxItem id="cherry">Cherry</ComboboxItem>
      <ComboboxItem id="grape">Grape</ComboboxItem>
      <ComboboxItem id="mango">Mango</ComboboxItem>
      <ComboboxItem id="orange">Orange</ComboboxItem>
      <ComboboxItem id="peach">Peach</ComboboxItem>
      <ComboboxItem id="strawberry">Strawberry</ComboboxItem>
    </Combobox>
  )
}
