import { Combobox, ComboboxItem } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Combobox
      label="Country"
      help="The billing region."
      name="country"
      placeholder="Pick a country…"
    >
      <ComboboxItem id="us">United States</ComboboxItem>
      <ComboboxItem id="uk">United Kingdom</ComboboxItem>
      <ComboboxItem id="ca">Canada</ComboboxItem>
      <ComboboxItem id="au">Australia</ComboboxItem>
      <ComboboxItem id="de">Germany</ComboboxItem>
    </Combobox>
  )
}
