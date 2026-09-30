import { Time } from '@internationalized/date'
import { TimeField } from '@chassis-ui/react'

export const Example = () => (
  <>
    <TimeField aria-label="Small time field" defaultValue={new Time(9, 30)} size="sm" />
    <TimeField aria-label="Default time field" defaultValue={new Time(9, 30)} />
    <TimeField aria-label="Large time field" defaultValue={new Time(9, 30)} size="lg" />
  </>
)
