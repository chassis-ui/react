import React from 'react'
import { CxButtonGroup, CxFormRadio, CxFormRadioGroup } from '@chassis-ui/react'

export const VerticalRadioToggleButtonGroupExample = () => {
  return (
    <CxFormRadioGroup aria-label="Vertical radio toggle button group" defaultValue="vbtnradio1">
      <CxButtonGroup vertical>
        <CxFormRadio
          button={{ context: 'danger', variant: 'outline' }}
          value="vbtnradio1"
          autoComplete="off"
          label="Radio 1"
        />
        <CxFormRadio
          button={{ context: 'danger', variant: 'outline' }}
          value="vbtnradio2"
          autoComplete="off"
          label="Radio 2"
        />
        <CxFormRadio
          button={{ context: 'danger', variant: 'outline' }}
          value="vbtnradio3"
          autoComplete="off"
          label="Radio 3"
        />
      </CxButtonGroup>
    </CxFormRadioGroup>
  )
}
