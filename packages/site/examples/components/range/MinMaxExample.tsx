import { FormLabel, RangeInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <FormLabel htmlFor="customRange2">Example range</FormLabel>
      <RangeInput min={0} max={5} defaultValue="3" id="customRange2" />
    </>
  )
}
