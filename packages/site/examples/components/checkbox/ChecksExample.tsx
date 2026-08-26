import { Checkbox } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Checkbox id="flexCheckDefault" label="Default checkbox" />
      <Checkbox id="flexCheckChecked" label="Checked checkbox" defaultSelected />
    </>
  )
}
