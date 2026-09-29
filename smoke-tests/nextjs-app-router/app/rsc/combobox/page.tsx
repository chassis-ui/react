import { Combobox, ComboboxGroup, ComboboxItem } from '@chassis-ui/react'
import { ClientMark } from '../ClientMark'

export default function Page() {
  return (
    <main>
      <Combobox aria-label="Fruit" placeholder="Select a fruit">
        <ComboboxItem id="apple" textValue="Apple" icon={<ClientMark />}>
          Apple
        </ComboboxItem>
        <ComboboxGroup label="Stone fruit">
          <ComboboxItem id="cherry">Cherry</ComboboxItem>
          <ComboboxItem id="plum">Plum</ComboboxItem>
        </ComboboxGroup>
      </Combobox>
    </main>
  )
}
