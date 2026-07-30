import { CxTextarea } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <CxTextarea
        placeholder="Disabled textarea placeholder"
        aria-label="Disabled textarea placeholder example"
        disabled
      />
      <CxTextarea
        defaultValue="Disabled textarea value"
        aria-label="Disabled textarea value example"
        disabled
      />
    </>
  )
}
