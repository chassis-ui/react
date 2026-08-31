import { ButtonGroup, Radio, RadioGroup } from '@chassis-ui/react'

export const Example = () => {
  return (
    <RadioGroup aria-label="Vertical radio toggle button group" defaultValue="vbtnradio1">
      <ButtonGroup vertical>
        <Radio
          button={{ color: 'danger', variant: 'outline' }}
          value="vbtnradio1"
          autoComplete="off"
          label="Radio 1"
        />
        <Radio
          button={{ color: 'danger', variant: 'outline' }}
          value="vbtnradio2"
          autoComplete="off"
          label="Radio 2"
        />
        <Radio
          button={{ color: 'danger', variant: 'outline' }}
          value="vbtnradio3"
          autoComplete="off"
          label="Radio 3"
        />
      </ButtonGroup>
    </RadioGroup>
  )
}
