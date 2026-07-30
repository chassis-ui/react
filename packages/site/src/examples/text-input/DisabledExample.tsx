import { CxTextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <CxTextInput
        placeholder="Disabled input placeholder"
        aria-label="Disabled input placeholder example"
        disabled
      />
      <CxTextInput
        defaultValue="Disabled input value"
        aria-label="Disabled input value example"
        disabled
      />
    </>
  )
}
