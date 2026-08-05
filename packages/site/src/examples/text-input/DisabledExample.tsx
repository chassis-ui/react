import { TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <TextInput
        placeholder="Disabled input placeholder"
        aria-label="Disabled input placeholder example"
        disabled
      />
      <TextInput
        defaultValue="Disabled input value"
        aria-label="Disabled input value example"
        disabled
      />
    </>
  )
}
