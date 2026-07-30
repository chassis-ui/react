import { CxTextarea } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <CxTextarea rows={1} placeholder="1 row" aria-label="Textarea with one row" />
      <CxTextarea rows={4} placeholder="4 rows" aria-label="Textarea with four rows" />
    </>
  )
}
