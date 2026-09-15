import { FileInput, FormLabel } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <FormLabel htmlFor="formFileSm">Small file input</FormLabel>
      <FileInput id="formFileSm" size="sm" className="mb-md" />
      <FormLabel htmlFor="formFileLg">Large file input</FormLabel>
      <FileInput id="formFileLg" size="lg" />
    </>
  )
}
