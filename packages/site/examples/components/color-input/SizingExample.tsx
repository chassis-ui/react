import { ColorInput, FormLabel } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <FormLabel htmlFor="colorInputSm">Small color input</FormLabel>
      <ColorInput id="colorInputSm" size="sm" className="mb-md" />
      <FormLabel htmlFor="colorInputLg">Large color input</FormLabel>
      <ColorInput id="colorInputLg" size="lg" />
    </>
  )
}
