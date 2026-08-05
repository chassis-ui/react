import { Textarea } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Textarea rows={1} placeholder="1 row" aria-label="Textarea with one row" />
      <Textarea rows={4} placeholder="4 rows" aria-label="Textarea with four rows" />
    </>
  )
}
