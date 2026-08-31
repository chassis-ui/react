import type { Meta, StoryObj } from '@storybook/react-vite'
import { CalendarDate } from '@internationalized/date'

import { Calendar } from '../../src/components/calendar/Calendar'

// Fixed, past dates rather than `today()` (as the docs-site examples use) — a visual-regression
// screenshot needs to render identically no matter what day it's run, and `today()` would shift
// the visible month and the `.datepicker-date-today` highlight on every run.
const anchor = new CalendarDate(2024, 3, 15)

const meta: Meta<typeof Calendar> = {
  component: Calendar,
  title: 'calendar/Calendar'
}
export default meta

type Story = StoryObj<typeof Calendar>

export const Default: Story = {
  args: {
    'aria-label': 'Event date',
    defaultValue: anchor
  }
}

export const MultiMonth: Story = {
  args: {
    'aria-label': 'Event date',
    defaultValue: anchor,
    visibleMonths: 2
  }
}

export const MultiSelect: Story = {
  args: {
    'aria-label': 'Event dates',
    defaultValue: [anchor, anchor.add({ days: 5 }), anchor.add({ days: 12 })],
    selectionMode: 'multiple'
  }
}

export const UnavailableDates: Story = {
  args: {
    'aria-label': 'Appointment date',
    defaultValue: anchor,
    unavailableDates: [
      anchor.add({ days: 2 }).toString(),
      anchor.add({ days: 5 }).toString(),
      anchor.add({ days: 9 }).toString()
    ]
  }
}

export const Disabled: Story = {
  args: {
    'aria-label': 'Event date',
    defaultValue: anchor,
    disabled: true
  }
}
