import { Checkbox } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <Checkbox size="lg" id="checkLarge" label="Large checkbox" />
      <Checkbox id="checkMedium" label="Default checkbox" />
      <Checkbox size="sm" id="checkSmall" label="Small checkbox" />
    </>
  )
}
