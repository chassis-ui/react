import { CxTextarea } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <CxTextarea size="large" placeholder="Large textarea" aria-label="Large textarea example" />
      <CxTextarea placeholder="Default textarea" aria-label="Default textarea example" />
      <CxTextarea size="small" placeholder="Small textarea" aria-label="Small textarea example" />
    </>
  )
}
