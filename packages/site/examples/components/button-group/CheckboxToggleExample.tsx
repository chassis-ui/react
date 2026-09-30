import { ButtonGroup, Checkbox } from '@chassis-ui/react'

export const Example = () => {
  return (
    <ButtonGroup role="group" aria-label="Basic checkbox toggle button group">
      <Checkbox
        button={{ color: 'primary', variant: 'outline' }}
        id="btncheck1"
        label="Checkbox 1"
      />
      <Checkbox
        button={{ color: 'primary', variant: 'outline' }}
        id="btncheck2"
        label="Checkbox 2"
      />
      <Checkbox
        button={{ color: 'primary', variant: 'outline' }}
        id="btncheck3"
        label="Checkbox 3"
      />
    </ButtonGroup>
  )
}
