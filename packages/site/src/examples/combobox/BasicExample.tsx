import { Combobox } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Combobox aria-label="Fruit" placeholder="Select a fruit…">
      <Combobox.Item id="apple">Apple</Combobox.Item>
      <Combobox.Item id="banana">Banana</Combobox.Item>
      <Combobox.Item id="cherry">Cherry</Combobox.Item>
      <Combobox.Item id="grape">Grape</Combobox.Item>
      <Combobox.Item id="mango">Mango</Combobox.Item>
      <Combobox.Item id="orange">Orange</Combobox.Item>
      <Combobox.Item id="peach">Peach</Combobox.Item>
      <Combobox.Item id="strawberry">Strawberry</Combobox.Item>
    </Combobox>
  )
}
