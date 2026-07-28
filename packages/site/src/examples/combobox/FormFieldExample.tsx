import { CxCombobox, CxComboboxItem, CxFormLabel, CxFormHelp } from '@chassis-ui/react'

export const FormFieldExample = () => {
  return (
    <div className="form-field">
      <CxFormLabel htmlFor="comboFormField">Country</CxFormLabel>
      <CxCombobox id="comboFormField" name="country" placeholder="Pick a country…">
        <CxComboboxItem id="us">United States</CxComboboxItem>
        <CxComboboxItem id="uk">United Kingdom</CxComboboxItem>
        <CxComboboxItem id="ca">Canada</CxComboboxItem>
        <CxComboboxItem id="au">Australia</CxComboboxItem>
        <CxComboboxItem id="de">Germany</CxComboboxItem>
      </CxCombobox>
      <CxFormHelp>The billing region.</CxFormHelp>
    </div>
  )
}
