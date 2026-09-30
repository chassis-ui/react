import { Time } from '@internationalized/date'
import { TimeField } from '@chassis-ui/react'

export const Example = () => (
  <>
    <TimeField defaultValue={new Time(9, 30)} disabled label="Disabled" />
    <TimeField defaultValue={new Time(9, 30)} label="Read only" readOnly />
    <TimeField invalid invalidFeedback="Choose a time." label="Invalid" />
    <TimeField defaultValue={new Time(9, 30)} label="Valid" valid validFeedback="Free." />
  </>
)
