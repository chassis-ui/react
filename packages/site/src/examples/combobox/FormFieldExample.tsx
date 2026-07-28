import { CxCombobox, CxComboboxItem } from '@chassis-ui/react'

export const FormFieldExample = () => {
  return (
    <CxCombobox
      label="Country"
      help="The billing region."
      name="country"
      placeholder="Pick a country…"
    >
      <CxComboboxItem id="us">United States</CxComboboxItem>
      <CxComboboxItem id="uk">United Kingdom</CxComboboxItem>
      <CxComboboxItem id="ca">Canada</CxComboboxItem>
      <CxComboboxItem id="au">Australia</CxComboboxItem>
      <CxComboboxItem id="de">Germany</CxComboboxItem>
    </CxCombobox>
  )
}
