import { InputAdorn, NumberField } from '@chassis-ui/react'

export const Example = () => (
  <>
    <NumberField adornEnd={<InputAdorn>cm</InputAdorn>} defaultValue={180} label="Height" />
    <NumberField defaultValue={2026} label="Year" stepButtons={false} />
  </>
)
