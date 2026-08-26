import { FileInput, FormLabel } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <FormLabel htmlFor="formFileMultiple">Multiple files input</FormLabel>
      <FileInput id="formFileMultiple" multiple />
    </>
  )
}
