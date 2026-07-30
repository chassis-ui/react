import { CxTextarea } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <CxTextarea value="Readonly textarea" aria-label="readonly textarea example" readOnly />
      <CxTextarea
        defaultValue="Readonly disabled textarea"
        aria-label="readonly disabled textarea example"
        readOnly
        disabled
      />
    </>
  )
}
