import { NumberField } from '@chassis-ui/react'

export const Example = () => (
  <>
    <NumberField aria-label="Small number field" defaultValue={1} size="sm" />
    <NumberField aria-label="Default number field" defaultValue={1} />
    <NumberField aria-label="Large number field" defaultValue={1} size="lg" />
  </>
)
