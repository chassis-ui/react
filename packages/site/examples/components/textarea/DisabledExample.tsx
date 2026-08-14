import { Textarea } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Textarea
        placeholder="Disabled textarea placeholder"
        aria-label="Disabled textarea placeholder example"
        disabled
      />
      <Textarea
        defaultValue="Disabled textarea value"
        aria-label="Disabled textarea value example"
        disabled
      />
    </>
  )
}
