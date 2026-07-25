import React from 'react'
import { CxFormRadio, CxFormRadioGroup } from '@chassis-ui/react'

export const WithoutLabelExample = () => {
  return (
    <CxFormRadioGroup aria-label="Radio without a visible label" defaultValue="">
      <CxFormRadio value="" aria-label="..." />
    </CxFormRadioGroup>
  )
}
