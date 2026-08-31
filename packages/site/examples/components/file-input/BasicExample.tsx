import { FileInput, FormLabel } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <FormLabel htmlFor="formFile">Default file input</FormLabel>
      <FileInput id="formFile" />
    </>
  )
}
