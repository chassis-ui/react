import { CxTextInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <CxTextInput defaultValue="Readonly input" aria-label="readonly input example" readOnly />
      <CxTextInput
        defaultValue="Readonly disabled input"
        aria-label="readonly disabled input example"
        readOnly
        disabled
      />
    </>
  )
}
