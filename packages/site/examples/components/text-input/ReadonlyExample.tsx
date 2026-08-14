import { TextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <TextInput defaultValue="Readonly input" aria-label="readonly input example" readOnly />
      <TextInput
        defaultValue="Readonly disabled input"
        aria-label="readonly disabled input example"
        readOnly
        disabled
      />
    </>
  )
}
