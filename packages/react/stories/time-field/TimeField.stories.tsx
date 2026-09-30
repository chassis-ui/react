import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, within } from 'storybook/test'
import { Time } from '@internationalized/date'

import { TimeField } from '../../src/components/time-field/TimeField'
import { I18nProvider } from '../../src/index'

const meta: Meta<typeof TimeField> = {
  component: TimeField,
  title: 'time-field/TimeField'
}

export default meta

type Story = StoryObj<typeof TimeField>

// Stories set a locale, so the segments and their order don't depend on the browser running them.
const inLocale = (locale: string) => (Story: () => React.ReactElement) => (
  <I18nProvider locale={locale}>
    <Story />
  </I18nProvider>
)

export const Default: Story = {
  args: {
    help: 'In your local time.',
    label: 'Start',
    onChange: fn()
  },
  decorators: [inLocale('en-US')],
  play: async function ({ args, canvas, userEvent }) {
    await userEvent.click(canvas.getByRole('spinbutton', { name: /^hour/ }))
    await userEvent.keyboard('930p')
    await expect(args.onChange).toHaveBeenLastCalledWith(new Time(21, 30))
    await expect(canvas.getByRole('spinbutton', { name: /^AM\/PM/ })).toHaveTextContent('PM')
  }
}

export const Granularity: Story = {
  render: () => (
    <div className="vstack gap-md" style={{ maxWidth: '20rem' }}>
      <TimeField defaultValue={new Time(9)} granularity="hour" label="Hour" />
      <TimeField defaultValue={new Time(9, 30)} label="Minute" />
      <TimeField defaultValue={new Time(9, 30, 15)} granularity="second" label="Second" />
      <TimeField defaultValue={new Time(21, 30)} hourCycle={24} label="24 hours" />
    </div>
  ),
  decorators: [inLocale('en-US')]
}

export const Locales: Story = {
  render: () => (
    <div className="vstack gap-md" style={{ maxWidth: '20rem' }}>
      {['en-GB', 'de-DE', 'ja-JP', 'ar-EG'].map((locale) => (
        <I18nProvider key={locale} locale={locale}>
          <TimeField defaultValue={new Time(21, 30)} label={locale} />
        </I18nProvider>
      ))}
    </div>
  )
}

// A time reads left to right in a right-to-left locale, as it is written there: the hour before
// the minute, both before the AM/PM marker.
export const RightToLeft: Story = {
  render: () => (
    <div className="vstack gap-md" dir="rtl" style={{ maxWidth: '20rem' }}>
      <I18nProvider locale="he-IL">
        <TimeField defaultValue={new Time(21, 30)} label="he-IL" />
      </I18nProvider>
      <I18nProvider locale="ar-EG">
        <TimeField defaultValue={new Time(21, 30)} label="ar-EG" />
      </I18nProvider>
    </div>
  ),
  // The segments' names are in the locale's language; their DOM order is hour, then minute.
  play: async function ({ canvas }) {
    for (const name of ['he-IL', 'ar-EG']) {
      const [hour, minute] = within(canvas.getByRole('group', { name })).getAllByRole('spinbutton')
      await expect(hour.getBoundingClientRect().left).toBeLessThan(
        minute.getBoundingClientRect().left
      )
    }
  }
}

export const Range: Story = {
  args: {
    defaultValue: new Time(8),
    help: 'Office hours.',
    invalidFeedback: 'Between 9 AM and 5 PM.',
    label: 'Meeting',
    maxValue: new Time(17),
    minValue: new Time(9)
  },
  decorators: [inLocale('en-US')],
  play: async function ({ canvas }) {
    await expect(canvas.getByRole('group', { name: 'Meeting' })).toHaveClass('is-invalid')
    await expect(canvas.getByText('Between 9 AM and 5 PM.')).toBeVisible()
  }
}

export const Sizes: Story = {
  render: () => (
    <div className="vstack gap-md" style={{ maxWidth: '20rem' }}>
      <TimeField aria-label="Small" defaultValue={new Time(9, 30)} size="sm" />
      <TimeField aria-label="Medium" defaultValue={new Time(9, 30)} />
      <TimeField aria-label="Large" defaultValue={new Time(9, 30)} size="lg" />
    </div>
  ),
  decorators: [inLocale('en-US')]
}

export const States: Story = {
  render: () => (
    <div className="vstack gap-md" style={{ maxWidth: '20rem' }}>
      <TimeField defaultValue={new Time(9, 30)} disabled label="Disabled" />
      <TimeField defaultValue={new Time(9, 30)} label="Read only" readOnly />
      <TimeField invalid invalidFeedback="Choose a time." label="Invalid" />
      <TimeField defaultValue={new Time(9, 30)} label="Valid" valid validFeedback="Free." />
    </div>
  ),
  decorators: [inLocale('en-US')]
}
