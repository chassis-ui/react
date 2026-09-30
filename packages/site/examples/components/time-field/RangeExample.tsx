import { Time } from '@internationalized/date'
import { TimeField } from '@chassis-ui/react'

export const Example = () => (
  <TimeField
    defaultValue={new Time(8)}
    help="Office hours."
    invalidFeedback="Between 9 AM and 5 PM."
    label="Meeting"
    maxValue={new Time(17)}
    minValue={new Time(9)}
  />
)
