import { Autocomplete } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Autocomplete
      label="Country"
      help="The billing region."
      name="country"
      placeholder="Pick a country…"
    >
      <Autocomplete.Item id="us">United States</Autocomplete.Item>
      <Autocomplete.Item id="uk">United Kingdom</Autocomplete.Item>
      <Autocomplete.Item id="ca">Canada</Autocomplete.Item>
      <Autocomplete.Item id="au">Australia</Autocomplete.Item>
      <Autocomplete.Item id="de">Germany</Autocomplete.Item>
    </Autocomplete>
  )
}
