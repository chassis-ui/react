import { ButtonGroup, CxRadio, CxRadioGroup } from '@chassis-ui/react'

export const VerticalRadioToggleButtonGroupExample = () => {
  return (
    <CxRadioGroup aria-label="Vertical radio toggle button group" defaultValue="vbtnradio1">
      <ButtonGroup vertical>
        <CxRadio
          button={{ color: 'danger', variant: 'outline' }}
          value="vbtnradio1"
          autoComplete="off"
          label="Radio 1"
        />
        <CxRadio
          button={{ color: 'danger', variant: 'outline' }}
          value="vbtnradio2"
          autoComplete="off"
          label="Radio 2"
        />
        <CxRadio
          button={{ color: 'danger', variant: 'outline' }}
          value="vbtnradio3"
          autoComplete="off"
          label="Radio 3"
        />
      </ButtonGroup>
    </CxRadioGroup>
  )
}
