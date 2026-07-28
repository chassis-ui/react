import {
  CxCheckbox,
  CxFormInput,
  CxRadio,
  CxRadioGroup,
  CxInputGroup,
  CxInputGroupText
} from '@chassis-ui/react'

export const CheckboxRadioAddonsExample = () => {
  return (
    <>
      <CxInputGroup className="mb-medium">
        <CxInputGroupText>
          <CxCheckbox value="" aria-label="Checkbox for following text input" />
        </CxInputGroupText>
        <CxFormInput aria-label="Text input with checkbox" />
      </CxInputGroup>

      <CxInputGroup>
        <CxInputGroupText>
          <CxRadioGroup aria-label="Radio button for following text input" defaultValue="">
            <CxRadio value="" aria-label="Radio button for following text input" />
          </CxRadioGroup>
        </CxInputGroupText>
        <CxFormInput aria-label="Text input with radio button" />
      </CxInputGroup>
    </>
  )
}
