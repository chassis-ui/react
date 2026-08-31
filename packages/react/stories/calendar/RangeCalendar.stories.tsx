import type { Meta, StoryObj } from '@storybook/react-vite'
import { CalendarDate } from '@internationalized/date'

import type { DateRangePreset } from '../../src/utils/dateRangePresets'
import { RangeCalendar } from '../../src/components/calendar/RangeCalendar'

// Fixed, past dates rather than `today()` (as the docs-site examples use) — a visual-regression
// screenshot needs to render identically no matter what day it's run.
const anchor = new CalendarDate(2024, 3, 15)

const presets: DateRangePreset[] = [
  { label: 'This week', range: { start: anchor.subtract({ days: 4 }), end: anchor } },
  {
    label: 'Last week',
    range: { start: anchor.subtract({ days: 11 }), end: anchor.subtract({ days: 5 }) }
  },
  { label: 'This month', range: { start: new CalendarDate(2024, 3, 1), end: anchor } }
]

const meta: Meta<typeof RangeCalendar> = {
  component: RangeCalendar,
  title: 'calendar/RangeCalendar'
}
export default meta

type Story = StoryObj<typeof RangeCalendar>

export const Default: Story = {
  args: {
    'aria-label': 'Trip dates',
    defaultValue: { start: anchor, end: anchor.add({ days: 5 }) }
  }
}

export const MultiMonth: Story = {
  args: {
    'aria-label': 'Trip dates',
    defaultValue: { start: anchor, end: anchor.add({ days: 20 }) },
    visibleMonths: 2
  }
}

export const Presets: Story = {
  args: {
    'aria-label': 'Trip dates',
    defaultValue: presets[0]?.range,
    presets,
    visibleMonths: 2
  }
}
