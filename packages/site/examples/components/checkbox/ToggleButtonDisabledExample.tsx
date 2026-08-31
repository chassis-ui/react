import { Checkbox } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Checkbox
      button={{ color: 'primary' }}
      id="button-check-3"
      autoComplete="off"
      label="Disabled"
      disabled
    />
  )
}
