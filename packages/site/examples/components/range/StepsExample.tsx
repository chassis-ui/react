import { FormLabel, RangeInput } from '@chassis-ui/react'

export const Example = () => {
  return (
    <>
      <FormLabel htmlFor="customRange3">Example range</FormLabel>
      <RangeInput min={0} max={5} step={0.5} defaultValue="3" id="customRange3" />
    </>
  )
}
