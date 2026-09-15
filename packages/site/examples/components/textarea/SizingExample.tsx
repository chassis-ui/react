import { Textarea } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Textarea size="lg" placeholder="Large textarea" aria-label="Large textarea example" />
      <Textarea placeholder="Default textarea" aria-label="Default textarea example" />
      <Textarea size="sm" placeholder="Small textarea" aria-label="Small textarea example" />
    </>
  )
}
