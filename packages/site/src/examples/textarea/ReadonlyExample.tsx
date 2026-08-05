import { Textarea } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Textarea value="Readonly textarea" aria-label="readonly textarea example" readOnly />
      <Textarea
        defaultValue="Readonly disabled textarea"
        aria-label="readonly disabled textarea example"
        readOnly
        disabled
      />
    </>
  )
}
