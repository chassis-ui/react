import { FileInput, FormLabel } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <FormLabel htmlFor="formFileDisabled">Disabled file input</FormLabel>
      <FileInput id="formFileDisabled" disabled />
    </>
  )
}
