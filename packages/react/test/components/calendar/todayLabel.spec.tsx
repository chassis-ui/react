// @vitest-environment node
import * as React from 'react'
import { readdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { renderToString } from 'react-dom/server'
import { JSDOM } from 'jsdom'
import { within } from '@testing-library/react'
import { getLocalTimeZone, today } from '@internationalized/date'

import { Calendar, I18nProvider, RangeCalendar } from '../../../src/index'

// Until hydration a calendar cell's label is react-aria's for a day that isn't today
// (`useCellToday`), in every locale react-aria has strings for. The expected labels are built from
// react-aria's own strings (`react-aria/i18n`), so this also fails if they drift from the copy in
// `todayLabelStrings.ts`.
type Message = string | ((args: Record<string, string>) => string)
type CalendarStrings = Record<string, Message>

const i18n = path.join(
  path.dirname(createRequire(import.meta.url).resolve('react-aria/package.json')),
  'i18n'
)
const locales = readdirSync(i18n)
  .filter((file) => /^[a-z]{2}-[A-Z]{2}\.mjs$/.test(file))
  .map((file) => file.replace('.mjs', ''))

async function stringsFor(locale: string) {
  const { default: strings } = (await import(`react-aria/i18n/${locale}`)) as {
    default: Record<string, CalendarStrings>
  }
  const calendar = strings['@react-aria/calendar']!
  return (key: string, date?: string) => {
    const message = calendar[key]!
    return typeof message === 'function' ? message({ date: date ?? '' }) : message
  }
}

// Today's cell's label in the server HTML: the one button that names today's date.
function serverLabelOfToday(element: React.ReactElement, date: string): string {
  const { document } = new JSDOM(`<!doctype html><body>${renderToString(element)}</body>`).window
  const labels = within(document.body)
    .getAllByRole('button')
    .map((button) => button.getAttribute('aria-label') ?? '')
    .filter((label) => label.includes(date))
  expect(labels).toHaveLength(1)
  return labels[0]!
}

describe("a calendar's server labels in every locale", () => {
  test('finds the locales', () => {
    expect(locales.length).toBeGreaterThan(30)
    expect(locales).toContain('en-US')
  })

  test.for(locales)('%s', async (locale) => {
    const t = await stringsFor(locale)
    const day = today(getLocalTimeZone())
    const date = new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: getLocalTimeZone()
    }).format(day.toDate(getLocalTimeZone()))
    const inLocale = (element: React.ReactElement) => (
      <I18nProvider locale={locale}>{element}</I18nProvider>
    )

    expect(serverLabelOfToday(inLocale(<Calendar aria-label="Date" />), date)).toBe(date)
    expect(
      serverLabelOfToday(inLocale(<Calendar aria-label="Date" minValue={day} value={day} />), date)
    ).toBe(`${t('dateSelected', date)}, ${t('minimumDate')}`)
    expect(
      serverLabelOfToday(
        inLocale(
          <RangeCalendar aria-label="Dates" maxValue={day} value={{ start: day, end: day }} />
        ),
        date
      )
    ).toBe(
      `${t('dateSelected', `${t('selectedDateDescription', date)}, ${date}`)}, ${t('maximumDate')}`
    )
  })
})
