import { ColorInput, FormLabel } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <FormLabel htmlFor="exampleColorInputDisabled">Disabled color picker</FormLabel>
      <ColorInput id="exampleColorInputDisabled" defaultValue="#0d6efd" disabled />
    </>
  )
}
