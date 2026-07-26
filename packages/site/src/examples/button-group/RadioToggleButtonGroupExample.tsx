import { CxButtonGroup, CxFormRadio, CxFormRadioGroup } from '@chassis-ui/react'

export const RadioToggleButtonGroupExample = () => {
  return (
    <CxFormRadioGroup aria-label="Basic radio toggle button group" defaultValue="btnradio1">
      <CxButtonGroup>
        <CxFormRadio
          button={{ context: 'primary', variant: 'outline' }}
          value="btnradio1"
          autoComplete="off"
          label="Radio 1"
        />
        <CxFormRadio
          button={{ context: 'primary', variant: 'outline' }}
          value="btnradio2"
          autoComplete="off"
          label="Radio 2"
        />
        <CxFormRadio
          button={{ context: 'primary', variant: 'outline' }}
          value="btnradio3"
          autoComplete="off"
          label="Radio 3"
        />
      </CxButtonGroup>
    </CxFormRadioGroup>
  )
}
