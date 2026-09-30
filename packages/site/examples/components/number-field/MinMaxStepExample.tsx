import { NumberField } from '@chassis-ui/react'

export const Example = () => (
  <NumberField
    defaultValue={4}
    help="From 2 to 12, in steps of 2."
    label="Seats"
    max={12}
    min={2}
    step={2}
  />
)
