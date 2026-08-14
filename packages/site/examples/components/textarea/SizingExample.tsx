import { Textarea } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Textarea size="large" placeholder="Large textarea" aria-label="Large textarea example" />
      <Textarea placeholder="Default textarea" aria-label="Default textarea example" />
      <Textarea size="small" placeholder="Small textarea" aria-label="Small textarea example" />
    </>
  )
}
