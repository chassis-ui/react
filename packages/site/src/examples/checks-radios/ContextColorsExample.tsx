import React from 'react'
import { CxFormCheck, CxFormRadio, CxFormRadioGroup, CxFormSwitch } from '@chassis-ui/react'

export const ContextColorsExample = () => {
  return (
    <>
      <CxFormCheck
        context="secondary"
        id="checkSecondary"
        label="Secondary checkbox"
        defaultSelected
      />
      <CxFormRadioGroup label="Success option" defaultValue="checkSuccess">
        <CxFormRadio context="success" value="checkSuccess" label="Success radio" />
      </CxFormRadioGroup>
      <CxFormSwitch context="danger" id="switchDanger" label="Danger switch" defaultSelected />
    </>
  )
}
