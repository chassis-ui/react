import { Autocomplete } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Autocomplete aria-label="Fruit" placeholder="Select fruits…" multiple>
      <Autocomplete.Item id="apple">Apple</Autocomplete.Item>
      <Autocomplete.Item id="banana">Banana</Autocomplete.Item>
      <Autocomplete.Item id="cherry">Cherry</Autocomplete.Item>
      <Autocomplete.Item id="grape">Grape</Autocomplete.Item>
      <Autocomplete.Item id="mango">Mango</Autocomplete.Item>
    </Autocomplete>
  )
}
