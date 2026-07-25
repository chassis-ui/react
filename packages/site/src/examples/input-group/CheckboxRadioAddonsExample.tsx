import React from 'react'
import {
  CxFormCheck,
  CxFormInput,
  CxFormRadio,
  CxFormRadioGroup,
  CxInputGroup,
  CxInputGroupText,
} from '@chassis-ui/react'

export const CheckboxRadioAddonsExample = () => {
  return (
    <>
      <CxInputGroup className="mb-medium">
        <CxInputGroupText>
          <CxFormCheck value="" aria-label="Checkbox for following text input" />
        </CxInputGroupText>
        <CxFormInput aria-label="Text input with checkbox" />
      </CxInputGroup>

      <CxInputGroup>
        <CxInputGroupText>
          <CxFormRadioGroup aria-label="Radio button for following text input" defaultValue="">
            <CxFormRadio value="" aria-label="Radio button for following text input" />
          </CxFormRadioGroup>
        </CxInputGroupText>
        <CxFormInput aria-label="Text input with radio button" />
      </CxInputGroup>
    </>
  )
}
