import { DateRangePicker } from '@chassis-ui/react'
import { getLocalTimeZone, toCalendarDateTime, today } from '@internationalized/date'

export const Example = () => {
  // Today at 3 PM: the time both dates start from, and the month the calendar opens on.
  const checkIn = toCalendarDateTime(today(getLocalTimeZone())).set({ hour: 15 })

  return (
    <DateRangePicker
      granularity="minute"
      help="Check-in from 3 PM, check-out by 11 AM."
      label="Stay"
      name="stay"
      placeholderValue={checkIn}
    />
  )
}
