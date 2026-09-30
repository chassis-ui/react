import { NumberField } from '@chassis-ui/react'

export const Example = () => (
  <>
    <NumberField defaultValue={3} disabled label="Disabled" />
    <NumberField defaultValue={3} label="Read only" readOnly />
    <NumberField defaultValue={120} invalid invalidFeedback="At most 100." label="Invalid" />
    <NumberField defaultValue={42} label="Valid" valid validFeedback="In stock." />
  </>
)
