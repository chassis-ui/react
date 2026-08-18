import type { Meta, StoryObj } from '@storybook/react-vite'
import { CalendarDate } from '@internationalized/date'

import type { DateRangePreset } from '../../src/utils/dateRangePresets'
import { DateRangePicker } from '../../src/components/datepicker/DateRangePicker'

// Fixed, past dates rather than `today()` (as the docs-site examples use) — a visual-regression
// screenshot needs to render identically no matter what day it's run.
const anchor = new CalendarDate(2024, 3, 15)

const presets: DateRangePreset[] = [
  { label: 'This week', range: { start: anchor.subtract({ days: 4 }), end: anchor } },
  {
    label: 'Last week',
    range: { start: anchor.subtract({ days: 11 }), end: anchor.subtract({ days: 5 }) }
  }
]

const meta: Meta<typeof DateRangePicker> = {
  component: DateRangePicker,
  title: 'datepicker/DateRangePicker'
}
export default meta

type Story = StoryObj<typeof DateRangePicker>

export const Closed: Story = {
  args: {
    'aria-label': 'Trip dates',
    defaultValue: { start: anchor, end: anchor.add({ days: 5 }) }
  }
}

// `defaultOpen` renders the calendar popover open on mount — the only way to screenshot its
// content without driving real pointer/keyboard interaction from the test. The popover portals
// to `document.body` (see Popover.tsx), outside Storybook's `#storybook-root`, so the Playwright
// spec screenshots the whole iframe page for this story rather than a specific element.
export const Open: Story = {
  args: {
    'aria-label': 'Trip dates',
    defaultOpen: true,
    defaultValue: { start: anchor, end: anchor.add({ days: 5 }) }
  }
}

export const OpenWithPresets: Story = {
  args: {
    'aria-label': 'Trip dates',
    defaultOpen: true,
    defaultValue: presets[0]?.range,
    presets
  }
}
