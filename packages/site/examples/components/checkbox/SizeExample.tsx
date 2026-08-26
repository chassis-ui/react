import { Checkbox } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Checkbox size="large" id="checkLarge" label="Large checkbox" />
      <Checkbox id="checkMedium" label="Default checkbox" />
      <Checkbox size="small" id="checkSmall" label="Small checkbox" />
    </>
  )
}
