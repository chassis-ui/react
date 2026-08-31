import { Checkbox } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Checkbox label="Disabled checkbox" disabled />
      <Checkbox label="Disabled checked checkbox" defaultSelected disabled />
    </>
  )
}
