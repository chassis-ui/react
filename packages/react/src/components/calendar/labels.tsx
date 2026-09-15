import React, { createContext, ReactNode, useContext, useMemo } from 'react'

/**
 * The user-facing strings the calendar/datepicker family renders itself, rather than getting from
 * the active locale.
 *
 * Everything else these components say — weekday names, month names, the calendar system, segment
 * order — comes from `I18nProvider`'s locale via react-aria, which ships its own translations. The
 * strings below have no equivalent in react-aria's dictionaries, so they were hardcoded English
 * with no way to override them: under `<I18nProvider locale="ar-SA">` a user got Arabic month
 * names interleaved with an English "Previous years". Pass `labels` to translate them, the same
 * way `Pagination`'s `previousLabel`/`nextLabel` are translated (see the Internationalization
 * docs page).
 */
export interface CalendarLabels {
  /** Accessible name of the year view's "page back" arrow. */
  previousYears: string
  /** Accessible name of the year view's "page forward" arrow. */
  nextYears: string
  /** Prefix of the year view's live-region announcement, rendered as `${selectYear}, 2020 – 2034`. */
  selectYear: string
  /** Prefix of the month view's live-region announcement, rendered as `${selectMonth}, 2024`. */
  selectMonth: string
  /** Prefix of the header month button's accessible name, rendered as `${month}: March`. */
  month: string
  /** Prefix of the header year button's accessible name, rendered as `${year}: 2024`. */
  year: string
  /** Accessible name of the trigger that opens the calendar overlay. */
  calendar: string
  /** Accessible name of the adornment that resets the current selection. */
  clear: string
}

export const DEFAULT_CALENDAR_LABELS: CalendarLabels = {
  previousYears: 'Previous years',
  nextYears: 'Next years',
  selectYear: 'Select year',
  selectMonth: 'Select month',
  month: 'Month',
  year: 'Year',
  calendar: 'Calendar',
  clear: 'Clear'
}

const CalendarLabelsContext = createContext<CalendarLabels>(DEFAULT_CALENDAR_LABELS)

/**
 * Reads the merged labels. Internal — every component in this family that renders one of these
 * strings goes through here rather than taking its own prop, because most of them
 * (`CalendarYearGrid`, `CalendarMonthGrid`, `CalendarMonthYearPicker`) sit three or four levels
 * below the public component a consumer actually passes `labels` to.
 */
export const useCalendarLabels = (): CalendarLabels => useContext(CalendarLabelsContext)

interface CalendarLabelsProviderProps {
  children: ReactNode
  labels?: Partial<CalendarLabels>
}

/**
 * Merges `labels` over whatever is already in context, rather than replacing it. `DatePicker`
 * renders a `Calendar` internally, so both provide — without merging, the inner `Calendar`
 * (which usually has no `labels` of its own) would reset the outer `DatePicker`'s overrides back
 * to English.
 */
export const CalendarLabelsProvider = ({ children, labels }: CalendarLabelsProviderProps) => {
  const parent = useContext(CalendarLabelsContext)
  const value = useMemo(() => (labels ? { ...parent, ...labels } : parent), [parent, labels])

  return <CalendarLabelsContext.Provider value={value}>{children}</CalendarLabelsContext.Provider>
}
