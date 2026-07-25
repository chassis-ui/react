import React from 'react'
import { CxFormRadio, CxFormRadioGroup } from '@chassis-ui/react'

export const RadiosStackedExample = () => {
  return (
    <CxFormRadioGroup label="Options" defaultValue="option1">
      <CxFormRadio value="option1" label="Default radio" />
      <CxFormRadio value="option2" label="Second default radio" />
      <CxFormRadio value="option3" label="Disabled radio" disabled />
    </CxFormRadioGroup>
  )
}
