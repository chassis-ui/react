import { CxButtonGroup, CxRadio, CxRadioGroup } from '@chassis-ui/react'

export const RadioToggleButtonGroupExample = () => {
  return (
    <CxRadioGroup aria-label="Basic radio toggle button group" defaultValue="btnradio1">
      <CxButtonGroup>
        <CxRadio
          button={{ color: 'primary', variant: 'outline' }}
          value="btnradio1"
          autoComplete="off"
          label="Radio 1"
        />
        <CxRadio
          button={{ color: 'primary', variant: 'outline' }}
          value="btnradio2"
          autoComplete="off"
          label="Radio 2"
        />
        <CxRadio
          button={{ color: 'primary', variant: 'outline' }}
          value="btnradio3"
          autoComplete="off"
          label="Radio 3"
        />
      </CxButtonGroup>
    </CxRadioGroup>
  )
}
