import {
  CxCheckbox,
  CxTextInput,
  CxRadio,
  CxRadioGroup,
  CxInputGroup,
  CxInputAddon
} from '@chassis-ui/react'

export const CheckboxRadioAddonsExample = () => {
  return (
    <>
      <CxInputGroup className="mb-medium">
        <CxInputAddon>
          <CxCheckbox value="" aria-label="Checkbox for following text input" />
        </CxInputAddon>
        <CxTextInput aria-label="Text input with checkbox" />
      </CxInputGroup>

      <CxInputGroup>
        <CxInputAddon>
          <CxRadioGroup aria-label="Radio button for following text input" defaultValue="">
            <CxRadio value="" aria-label="Radio button for following text input" />
          </CxRadioGroup>
        </CxInputAddon>
        <CxTextInput aria-label="Text input with radio button" />
      </CxInputGroup>
    </>
  )
}
