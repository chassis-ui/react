import React from 'react'
import { CxFormRadio, CxFormRadioGroup } from '@chassis-ui/react'

export const RadioToggleButtonsExample = () => {
  return (
    <CxFormRadioGroup
      aria-label="Radio toggle buttons"
      defaultValue="checked"
      orientation="horizontal"
    >
      <CxFormRadio
        button={{ context: 'secondary' }}
        value="checked"
        autoComplete="off"
        label="Checked"
      />
      <CxFormRadio
        button={{ context: 'secondary' }}
        value="radio"
        autoComplete="off"
        label="Radio"
      />
      <CxFormRadio
        button={{ context: 'secondary' }}
        value="disabled"
        autoComplete="off"
        label="Radio"
        disabled
      />
      <CxFormRadio
        button={{ context: 'secondary' }}
        value="radio2"
        autoComplete="off"
        label="Radio"
      />
    </CxFormRadioGroup>
  )
}
