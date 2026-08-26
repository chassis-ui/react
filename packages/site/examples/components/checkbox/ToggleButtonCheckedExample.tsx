import { Checkbox } from '@chassis-ui/react'

export const Example = () => {
  return (
    <Checkbox
      button={{ color: 'primary' }}
      id="button-check-2"
      autoComplete="off"
      label="Checked"
      defaultSelected
    />
  )
}
