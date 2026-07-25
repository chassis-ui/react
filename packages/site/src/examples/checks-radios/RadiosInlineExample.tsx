import React from 'react'
import { CxFormRadio, CxFormRadioGroup } from '@chassis-ui/react'

export const RadiosInlineExample = () => {
  return (
    <CxFormRadioGroup label="Options" defaultValue="option1" orientation="horizontal">
      <CxFormRadio value="option1" label="1" />
      <CxFormRadio value="option2" label="2" />
      <CxFormRadio value="option3" label="3 (disabled)" disabled />
    </CxFormRadioGroup>
  )
}
