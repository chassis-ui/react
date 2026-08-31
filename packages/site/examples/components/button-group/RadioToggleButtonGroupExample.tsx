import { ButtonGroup, Radio, RadioGroup } from '@chassis-ui/react'

export const Example = () => {
  return (
    <RadioGroup aria-label="Basic radio toggle button group" defaultValue="btnradio1">
      <ButtonGroup>
        <Radio
          button={{ color: 'primary', variant: 'outline' }}
          value="btnradio1"
          autoComplete="off"
          label="Radio 1"
        />
        <Radio
          button={{ color: 'primary', variant: 'outline' }}
          value="btnradio2"
          autoComplete="off"
          label="Radio 2"
        />
        <Radio
          button={{ color: 'primary', variant: 'outline' }}
          value="btnradio3"
          autoComplete="off"
          label="Radio 3"
        />
      </ButtonGroup>
    </RadioGroup>
  )
}
