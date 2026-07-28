import { CxCombobox, CxComboboxItem, CxFormField } from '@chassis-ui/react'

export const FormFieldExample = () => {
  return (
    <CxFormField label="Country" help="The billing region." ids={{ input: 'comboFormField' }}>
      <CxCombobox id="comboFormField" name="country" placeholder="Pick a country…">
        <CxComboboxItem id="us">United States</CxComboboxItem>
        <CxComboboxItem id="uk">United Kingdom</CxComboboxItem>
        <CxComboboxItem id="ca">Canada</CxComboboxItem>
        <CxComboboxItem id="au">Australia</CxComboboxItem>
        <CxComboboxItem id="de">Germany</CxComboboxItem>
      </CxCombobox>
    </CxFormField>
  )
}
