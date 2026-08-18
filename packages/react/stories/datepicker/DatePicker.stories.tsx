import type { Meta, StoryObj } from '@storybook/react-vite'
import { CalendarDate } from '@internationalized/date'

import { DatePicker } from '../../src/components/datepicker/DatePicker'

// Fixed, past date rather than `today()` (as the docs-site examples use) — a visual-regression
// screenshot needs to render identically no matter what day it's run.
const anchor = new CalendarDate(2024, 3, 15)

const meta: Meta<typeof DatePicker> = {
  component: DatePicker,
  title: 'datepicker/DatePicker'
}
export default meta

type Story = StoryObj<typeof DatePicker>

export const Closed: Story = {
  args: {
    'aria-label': 'Event date',
    defaultValue: anchor
  }
}

// `defaultOpen` renders the calendar popover open on mount — the only way to screenshot its
// content without driving real pointer/keyboard interaction from the test. The popover portals
// to `document.body` (see Popover.tsx), outside Storybook's `#storybook-root`, so the Playwright
// spec screenshots the whole iframe page for this story rather than a specific element.
export const Open: Story = {
  args: {
    'aria-label': 'Event date',
    defaultOpen: true,
    defaultValue: anchor
  }
}

export const OpenWithMinMax: Story = {
  args: {
    'aria-label': 'Appointment date',
    defaultOpen: true,
    defaultValue: anchor,
    maxValue: anchor.add({ days: 10 }),
    minValue: anchor.subtract({ days: 5 })
  }
}
