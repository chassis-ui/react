import React from 'react'
import { CxFormCheck, CxFormRadio, CxFormRadioGroup } from '@chassis-ui/react'

export const WithoutLabelsExample = () => {
  return (
    <>
      <div>
        <CxFormCheck id="checkboxNoLabel" value="" aria-label="..." />
      </div>
      <div>
        <CxFormRadioGroup aria-label="Radio without a visible label" defaultValue="">
          <CxFormRadio value="" aria-label="..." />
        </CxFormRadioGroup>
      </div>
    </>
  )
}
