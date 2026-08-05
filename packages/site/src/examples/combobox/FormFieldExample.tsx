import { Combobox } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Combobox
      label="Country"
      help="The billing region."
      name="country"
      placeholder="Pick a country…"
    >
      <Combobox.Item id="us">United States</Combobox.Item>
      <Combobox.Item id="uk">United Kingdom</Combobox.Item>
      <Combobox.Item id="ca">Canada</Combobox.Item>
      <Combobox.Item id="au">Australia</Combobox.Item>
      <Combobox.Item id="de">Germany</Combobox.Item>
    </Combobox>
  )
}
