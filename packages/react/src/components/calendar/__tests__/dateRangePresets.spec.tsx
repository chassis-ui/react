import { getDefaultDateRangePresets } from '../dateRangePresets'

describe('getDefaultDateRangePresets', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // A Wednesday, so week/month boundaries are unambiguous.
    vi.setSystemTime(new Date('2026-07-15T12:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('computes the expected labels and ranges relative to today, in order', () => {
    const presets = getDefaultDateRangePresets('en-US')
    const byLabel = Object.fromEntries(presets.map((preset) => [preset.label, preset.range]))

    expect(presets.map((preset) => preset.label)).toEqual([
      'Today',
      'Last 7 Days',
      'Last 30 Days',
      'Last 90 Days',
      'Last Week',
      'Last Month'
    ])

    expect(byLabel.Today.start.toString()).toBe('2026-07-15')
    expect(byLabel.Today.end.toString()).toBe('2026-07-15')

    expect(byLabel['Last 7 Days'].start.toString()).toBe('2026-07-09')
    expect(byLabel['Last 7 Days'].end.toString()).toBe('2026-07-15')

    expect(byLabel['Last 30 Days'].start.toString()).toBe('2026-06-16')
    expect(byLabel['Last 30 Days'].end.toString()).toBe('2026-07-15')

    expect(byLabel['Last 90 Days'].start.toString()).toBe('2026-04-17')
    expect(byLabel['Last 90 Days'].end.toString()).toBe('2026-07-15')

    // en-US weeks start Sunday — the prior Sun-Sat week, not the 7 days before today.
    expect(byLabel['Last Week'].start.toString()).toBe('2026-07-05')
    expect(byLabel['Last Week'].end.toString()).toBe('2026-07-11')

    expect(byLabel['Last Month'].start.toString()).toBe('2026-06-01')
    expect(byLabel['Last Month'].end.toString()).toBe('2026-06-30')
  })

  test('Last Week follows the locale — en-US (Sunday-start) differs from fr-FR (Monday-start)', () => {
    const enPresets = getDefaultDateRangePresets('en-US')
    const frPresets = getDefaultDateRangePresets('fr-FR')
    const enLastWeek = enPresets.find((preset) => preset.label === 'Last Week')?.range
    const frLastWeek = frPresets.find((preset) => preset.label === 'Last Week')?.range

    expect(frLastWeek?.start.toString()).not.toBe(enLastWeek?.start.toString())
  })
})
