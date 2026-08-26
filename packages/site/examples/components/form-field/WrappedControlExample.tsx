import { Combobox, ComboboxItem, FormField } from '@chassis-ui/react'

export const Example = () => {
  return (
    <FormField label="Country" help="The billing region." ids={{ input: 'ffCountry' }}>
      <Combobox id="ffCountry" name="country" placeholder="Pick a country…">
        <ComboboxItem id="us">United States</ComboboxItem>
        <ComboboxItem id="uk">United Kingdom</ComboboxItem>
        <ComboboxItem id="ca">Canada</ComboboxItem>
      </Combobox>
    </FormField>
  )
}
