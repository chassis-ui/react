import { ColorInput, FormLabel } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <FormLabel htmlFor="exampleColorInput">Color picker</FormLabel>
      <ColorInput id="exampleColorInput" defaultValue="#0d6efd" />
    </>
  )
}
