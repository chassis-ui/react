import { Time } from '@internationalized/date'
import { TimeField } from '@chassis-ui/react'

export const Example = () => (
  <>
    <TimeField defaultValue={new Time(9)} granularity="hour" label="Hour" />
    <TimeField defaultValue={new Time(9, 30, 15)} granularity="second" label="Second" />
    <TimeField defaultValue={new Time(21, 30)} hourCycle={24} label="24 hours" />
  </>
)
