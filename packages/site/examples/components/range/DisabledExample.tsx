import { FormLabel, RangeInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <FormLabel htmlFor="disabledRange">Disabled range</FormLabel>
      <RangeInput id="disabledRange" disabled />
    </>
  )
}
