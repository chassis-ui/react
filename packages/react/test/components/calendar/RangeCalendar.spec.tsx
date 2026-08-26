import * as React from 'react'
import { act, render, screen, fireEvent, within } from '@testing-library/react'
import { CalendarDate } from '@internationalized/date'
import { axe } from 'jest-axe'

import { RangeCalendar, I18nProvider } from '../../../src/index'

// State classes (`weekend`, `unavailable`, range endpoints, etc.) live on the `.datepicker-date`
// wrapper, not the `.datepicker-date-btn` button itself — matching chassis-css's own
// `.datepicker-date-X > .datepicker-date-btn` selector pattern.
const getDateCell = (button: HTMLElement) =>
  // eslint-disable-next-line testing-library/no-node-access
  button.closest('.datepicker-date') as HTMLElement

describe('RangeCalendar', () => {
  describe('rendering', () => {
    test('renders a grid with the accessible label applied', () => {
      render(
        <RangeCalendar
          aria-label="Trip dates"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 7, 15) }}
        />
      )
      expect(screen.getByRole('grid')).toBeInTheDocument()
    })
  })

  describe('range selection', () => {
    test('clicking a start then an end date commits the range and fires onChange once', () => {
      const onChange = vi.fn()
      render(
        <RangeCalendar
          aria-label="Trip dates"
          defaultValue={{ start: new CalendarDate(2026, 7, 1), end: new CalendarDate(2026, 7, 1) }}
          onChange={onChange}
        />
      )

      const grid = screen.getByRole('grid')
      fireEvent.click(within(grid).getByRole('button', { name: /July 10, 2026/ }))
      expect(onChange).not.toHaveBeenCalled()

      fireEvent.click(within(grid).getByRole('button', { name: /July 15, 2026/ }))
      expect(onChange).toHaveBeenCalledWith({
        start: new CalendarDate(2026, 7, 10),
        end: new CalendarDate(2026, 7, 15)
      })
    })

    test('reversing the click order still produces a normalized start-before-end range', () => {
      const onChange = vi.fn()
      render(
        <RangeCalendar
          aria-label="Trip dates"
          defaultValue={{ start: new CalendarDate(2026, 7, 1), end: new CalendarDate(2026, 7, 1) }}
          onChange={onChange}
        />
      )

      const grid = screen.getByRole('grid')
      fireEvent.click(within(grid).getByRole('button', { name: /July 15, 2026/ }))
      fireEvent.click(within(grid).getByRole('button', { name: /July 10, 2026/ }))

      expect(onChange).toHaveBeenCalledWith({
        start: new CalendarDate(2026, 7, 10),
        end: new CalendarDate(2026, 7, 15)
      })
    })

    test('hovering a date while choosing the end date suppresses its focus ring', () => {
      render(
        <RangeCalendar
          aria-label="Trip dates"
          defaultValue={{ start: new CalendarDate(2026, 7, 1), end: new CalendarDate(2026, 7, 1) }}
        />
      )

      const grid = screen.getByRole('grid')
      // Starts a selection (sets `state.anchorDate`) without committing an end date yet — the
      // state react-aria's `onPointerEnter` moves real DOM focus in, to live-preview the range
      // as the pointer moves (see useCalendarCell's `onPointerEnter` -> `highlightDate`).
      fireEvent.click(within(grid).getByRole('button', { name: /July 10, 2026/ }))

      const hovered = within(grid).getByRole('button', { name: /July 15, 2026/ })
      fireEvent.pointerEnter(hovered, { pointerType: 'mouse' })

      expect(hovered.style.outline).toBe('none')
    })

    test('clicking the same date twice selects a single-day range', () => {
      const onChange = vi.fn()
      render(
        <RangeCalendar
          aria-label="Trip dates"
          defaultValue={{ start: new CalendarDate(2026, 7, 1), end: new CalendarDate(2026, 7, 1) }}
          onChange={onChange}
        />
      )

      const grid = screen.getByRole('grid')
      const day = within(grid).getByRole('button', { name: /July 10, 2026/ })
      fireEvent.click(day)
      expect(onChange).not.toHaveBeenCalled()

      fireEvent.click(day)
      expect(onChange).toHaveBeenCalledWith({
        start: new CalendarDate(2026, 7, 10),
        end: new CalendarDate(2026, 7, 10)
      })
    })

    test('dates outside minValue/maxValue are disabled and cannot start a selection', () => {
      const onChange = vi.fn()
      render(
        <RangeCalendar
          aria-label="Trip dates"
          defaultValue={{
            start: new CalendarDate(2026, 7, 15),
            end: new CalendarDate(2026, 7, 15)
          }}
          maxValue={new CalendarDate(2026, 7, 20)}
          minValue={new CalendarDate(2026, 7, 10)}
          onChange={onChange}
        />
      )

      const grid = screen.getByRole('grid')
      const outOfRange = within(grid).getByRole('button', { name: /July 25, 2026/ })
      expect(outOfRange).toHaveAttribute('aria-disabled', 'true')
      fireEvent.click(outOfRange)
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('unavailableDates', () => {
    test('blocks a range endpoint from landing on a listed date', () => {
      const onChange = vi.fn()
      render(
        <RangeCalendar
          aria-label="Trip dates"
          defaultValue={{ start: new CalendarDate(2026, 7, 1), end: new CalendarDate(2026, 7, 1) }}
          onChange={onChange}
          unavailableDates={['2026-07-15']}
        />
      )

      const grid = screen.getByRole('grid')
      const unavailable = within(grid).getByRole('button', { name: /July 15, 2026/ })
      expect(getDateCell(unavailable)).toHaveClass('datepicker-date-unavailable')
    })

    test('an unavailable date strictly between start and a candidate end disables every date past it', () => {
      const onChange = vi.fn()
      render(
        <RangeCalendar
          aria-label="Trip dates"
          defaultValue={{ start: new CalendarDate(2026, 7, 1), end: new CalendarDate(2026, 7, 1) }}
          onChange={onChange}
          unavailableDates={['2026-07-15']}
        />
      )

      const grid = screen.getByRole('grid')
      fireEvent.click(within(grid).getByRole('button', { name: /July 10, 2026/ }))

      // Once a start anchor is set, react-stately constrains the selectable range to stop just
      // short of the nearest unavailable date on either side — a date past it becomes disabled
      // rather than selectable-but-silently-clamped, so a range can never straddle it.
      const pastUnavailable = within(grid).getByRole('button', { name: /July 20, 2026/ })
      expect(pastUnavailable).toHaveAttribute('aria-disabled', 'true')
      fireEvent.click(pastUnavailable)
      expect(onChange).not.toHaveBeenCalled()

      const lastAvailable = within(grid).getByRole('button', { name: /July 14, 2026/ })
      expect(lastAvailable).not.toHaveAttribute('aria-disabled', 'true')
      fireEvent.click(lastAvailable)
      expect(onChange).toHaveBeenCalledWith({
        start: new CalendarDate(2026, 7, 10),
        end: new CalendarDate(2026, 7, 14)
      })
    })
  })

  describe('keyboard interaction', () => {
    test('Enter key selects a start and end date, mirroring click', () => {
      const onChange = vi.fn()
      render(
        <RangeCalendar
          aria-label="Trip dates"
          defaultValue={{ start: new CalendarDate(2026, 7, 1), end: new CalendarDate(2026, 7, 1) }}
          onChange={onChange}
        />
      )
      const grid = screen.getByRole('grid')
      const start = within(grid).getByRole('button', { name: /July 10, 2026/ })
      const end = within(grid).getByRole('button', { name: /July 15, 2026/ })

      // `.focus()` is a raw DOM call, not a Testing Library dispatch — it isn't act-wrapped on
      // its own, and react-aria's focus-ring tracking updates state in response to it.
      act(() => start.focus())
      fireEvent.keyDown(start, { key: 'Enter' })
      fireEvent.keyUp(start, { key: 'Enter' })
      expect(onChange).not.toHaveBeenCalled()

      act(() => end.focus())
      fireEvent.keyDown(end, { key: 'Enter' })
      fireEvent.keyUp(end, { key: 'Enter' })
      expect(onChange).toHaveBeenCalledWith({
        start: new CalendarDate(2026, 7, 10),
        end: new CalendarDate(2026, 7, 15)
      })
    })
  })

  describe('pill styling', () => {
    test('marks the start and end cells distinctly from the days in between', () => {
      render(
        <RangeCalendar
          aria-label="Trip dates"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 7, 15) }}
        />
      )

      // Range endpoints get a much richer aria-label from react-aria ("Selected Range: Friday,
      // July 10 to Wednesday, July 15, 2026, Wednesday, July 15, 2026 selected") that repeats
      // *both* endpoint dates in every cell within the range — a bare `/July 15, 2026/` matches
      // both the start and end cell. Anchoring on "<date> selected" (only ever true of a cell's
      // own date, never the other endpoint mentioned in the range summary) disambiguates them.
      const grid = screen.getByRole('grid')
      const start = within(grid).getByRole('button', { name: /Friday, July 10, 2026 selected/ })
      const middle = within(grid).getByRole('button', { name: /July 12, 2026/ })
      const end = within(grid).getByRole('button', { name: /Wednesday, July 15, 2026 selected/ })

      expect(start).toHaveClass('datepicker-date-range-start')
      expect(start).not.toHaveClass('datepicker-date-range-end')
      expect(end).toHaveClass('datepicker-date-range-end')
      expect(end).not.toHaveClass('datepicker-date-range-start')
      expect(middle).not.toHaveClass('datepicker-date-range-start')
      expect(middle).not.toHaveClass('datepicker-date-range-end')
      expect(getDateCell(middle)).toHaveClass('datepicker-date-in-range')
    })
  })

  describe('navigation', () => {
    test('renders month and year buttons reflecting the visible month', () => {
      render(
        <RangeCalendar
          aria-label="Trip dates"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 7, 15) }}
        />
      )
      expect(screen.getByRole('button', { name: /^Month:/ })).toHaveTextContent('July')
    })

    test('the next/previous buttons advance and rewind the visible month', () => {
      render(
        <RangeCalendar
          aria-label="Trip dates"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 7, 15) }}
        />
      )
      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      expect(screen.getByRole('button', { name: /^Month:/ })).toHaveTextContent('August')
      fireEvent.click(screen.getByRole('button', { name: /previous/i }))
      expect(screen.getByRole('button', { name: /^Month:/ })).toHaveTextContent('July')
    })

    test('picking a year from the year grid moves the visible range', () => {
      render(
        <RangeCalendar
          aria-label="Trip dates"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 7, 15) }}
        />
      )
      fireEvent.click(screen.getByRole('button', { name: /^Year:/ }))
      fireEvent.click(screen.getByRole('button', { name: '2027' }))

      expect(screen.getByRole('button', { name: /^Year:/ })).toHaveTextContent('2027')
      expect(screen.getByRole('button', { name: /^Month:/ })).toHaveTextContent('July')
    })
  })

  describe('firstDayOfWeek', () => {
    test('defaults to Monday regardless of locale', () => {
      render(
        <I18nProvider locale="en-US">
          <RangeCalendar
            aria-label="Trip dates"
            value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 7, 15) }}
          />
        </I18nProvider>
      )
      // eslint-disable-next-line testing-library/no-node-access
      const headers = document.querySelectorAll('.datepicker-week-day')
      expect(headers[0]).toHaveTextContent('M')
    })

    test('can be overridden, e.g. to Sunday', () => {
      render(
        <RangeCalendar
          aria-label="Trip dates"
          firstDayOfWeek="sun"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 7, 15) }}
        />
      )
      // eslint-disable-next-line testing-library/no-node-access
      const headers = document.querySelectorAll('.datepicker-week-day')
      expect(headers[0]).toHaveTextContent('S')
    })

    test('applies consistently across every visible month', () => {
      render(
        <RangeCalendar
          aria-label="Trip dates"
          firstDayOfWeek="sun"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 8, 15) }}
          visibleMonths={2}
        />
      )
      // eslint-disable-next-line testing-library/no-node-access
      const weekDayRows = document.querySelectorAll('.datepicker-week')
      expect(weekDayRows).toHaveLength(2)
      weekDayRows.forEach((row) => {
        // eslint-disable-next-line testing-library/no-node-access
        expect(row.querySelectorAll('.datepicker-week-day')[0]).toHaveTextContent('S')
      })
    })
  })

  describe('weekend styling', () => {
    test('marks Saturday/Sunday as weekends under en-US', () => {
      render(
        <I18nProvider locale="en-US">
          <RangeCalendar
            aria-label="Trip dates"
            defaultValue={{
              start: new CalendarDate(2026, 7, 24),
              end: new CalendarDate(2026, 7, 24)
            }}
          />
        </I18nProvider>
      )
      const grid = screen.getByRole('grid')
      expect(
        getDateCell(within(grid).getByRole('button', { name: /Saturday, July 25/ }))
      ).toHaveClass('datepicker-date-weekend')
      expect(
        getDateCell(within(grid).getByRole('button', { name: /Monday, July 27/ }))
      ).not.toHaveClass('datepicker-date-weekend')
    })
  })

  describe('visibleMonths', () => {
    test('defaults to a single month with prev/next arrows in its own header', () => {
      render(
        <RangeCalendar
          aria-label="Trip dates"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 7, 15) }}
        />
      )
      expect(screen.getAllByRole('grid')).toHaveLength(1)
      expect(screen.getAllByRole('button', { name: /^Month:/ })).toHaveLength(1)
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument()
    })

    test('renders the requested number of months, each with its own synced month/year picker', () => {
      render(
        <RangeCalendar
          aria-label="Trip dates"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 8, 15) }}
          visibleMonths={2}
        />
      )
      expect(screen.getAllByRole('grid')).toHaveLength(2)
      const monthButtons = screen.getAllByRole('button', { name: /^Month:/ })
      expect(monthButtons.map((button) => button.textContent)).toEqual(['July', 'August'])
    })

    test('a single global prev/next pair pages every visible month at once, with none in the per-month headers', () => {
      render(
        <RangeCalendar
          aria-label="Trip dates"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 8, 15) }}
          visibleMonths={2}
        />
      )
      expect(screen.getAllByRole('button', { name: /next/i })).toHaveLength(1)
      expect(screen.getAllByRole('button', { name: /previous/i })).toHaveLength(1)

      // Paging slides the whole visible window by one month at a time (`pageBehavior: 'single'`),
      // not by the entire visible span — so two visible months advance by one month, not two,
      // matching `CalendarMonthYearPicker`'s own one-month-at-a-time jumps.
      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      let monthButtons = screen.getAllByRole('button', { name: /^Month:/ })
      expect(monthButtons.map((button) => button.textContent)).toEqual(['August', 'September'])

      fireEvent.click(screen.getByRole('button', { name: /previous/i }))
      monthButtons = screen.getAllByRole('button', { name: /^Month:/ })
      expect(monthButtons.map((button) => button.textContent)).toEqual(['July', 'August'])
    })

    test('paging across a year boundary slides by one month, not by the full visible span', () => {
      render(
        <RangeCalendar
          aria-label="Trip dates"
          value={{ start: new CalendarDate(2026, 11, 10), end: new CalendarDate(2026, 11, 15) }}
          visibleMonths={2}
        />
      )
      // Starts on November/December 2026.
      const monthButtons = () => screen.getAllByRole('button', { name: /^Month:/ })
      const yearButtons = () => screen.getAllByRole('button', { name: /^Year:/ })
      expect(monthButtons().map((button) => button.textContent)).toEqual(['November', 'December'])
      expect(yearButtons().map((button) => button.textContent)).toEqual(['2026', '2026'])

      // Next should land on December 2026/January 2027 — not skip straight to January/February.
      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      expect(monthButtons().map((button) => button.textContent)).toEqual(['December', 'January'])
      expect(yearButtons().map((button) => button.textContent)).toEqual(['2026', '2027'])

      // Previous should undo that back to November/December 2026.
      fireEvent.click(screen.getByRole('button', { name: /previous/i }))
      expect(monthButtons().map((button) => button.textContent)).toEqual(['November', 'December'])
      expect(yearButtons().map((button) => button.textContent)).toEqual(['2026', '2026'])
    })

    test('picking a month from the second block moves both months in sync', () => {
      render(
        <RangeCalendar
          aria-label="Trip dates"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 8, 15) }}
          visibleMonths={2}
        />
      )
      const [, secondMonthButton] = screen.getAllByRole('button', { name: /^Month:/ })
      fireEvent.click(secondMonthButton!)
      fireEvent.click(screen.getByRole('button', { name: 'Dec' }))

      const monthButtons = screen.getAllByRole('button', { name: /^Month:/ })
      expect(monthButtons.map((button) => button.textContent)).toEqual(['November', 'December'])
    })

    // Regression coverage for a case the tests above don't reach: picking a month that's less
    // than a full `visibleMonths` away from the current one — the common case, since adjacent
    // blocks are always exactly one month apart. `state.setFocusedDate` only pages the visible
    // range when the new focus lands outside it; a target still inside the current range (this
    // test) used to silently no-op, and one exactly `visibleMonths - 1` short of the boundary
    // (the test below) used to overshoot by an extra month. See `setVisibleRangeStart`.
    test('picking the immediately next month in the first block advances by one month', () => {
      render(
        <RangeCalendar
          aria-label="Trip dates"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 8, 15) }}
          visibleMonths={2}
        />
      )
      const [firstMonthButton] = screen.getAllByRole('button', { name: /^Month:/ })
      fireEvent.click(firstMonthButton!)
      fireEvent.click(screen.getByRole('button', { name: 'Aug' }))

      const monthButtons = screen.getAllByRole('button', { name: /^Month:/ })
      expect(monthButtons.map((button) => button.textContent)).toEqual(['August', 'September'])
    })

    test('picking the immediately previous month in the second block retreats by one month', () => {
      render(
        <RangeCalendar
          aria-label="Trip dates"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 8, 15) }}
          visibleMonths={2}
        />
      )
      const [, secondMonthButton] = screen.getAllByRole('button', { name: /^Month:/ })
      fireEvent.click(secondMonthButton!)
      fireEvent.click(screen.getByRole('button', { name: 'Jul' }))

      const monthButtons = screen.getAllByRole('button', { name: /^Month:/ })
      expect(monthButtons.map((button) => button.textContent)).toEqual(['June', 'July'])
    })

    test('a range spanning both visible months is selectable and pills continuously', () => {
      const onChange = vi.fn()
      render(
        <RangeCalendar
          aria-label="Trip dates"
          defaultValue={{ start: new CalendarDate(2026, 7, 1), end: new CalendarDate(2026, 7, 1) }}
          onChange={onChange}
          visibleMonths={2}
        />
      )

      const grids = screen.getAllByRole('grid')
      fireEvent.click(within(grids[0]!).getByRole('button', { name: /July 28, 2026/ }))
      fireEvent.click(within(grids[1]!).getByRole('button', { name: /August 3, 2026/ }))

      expect(onChange).toHaveBeenCalledWith({
        start: new CalendarDate(2026, 7, 28),
        end: new CalendarDate(2026, 8, 3)
      })
    })

    // Regression coverage: the global prev/next overlay (`.datepicker-controls`, absolutely
    // positioned across the very top of the calendar) and `CalendarYearGrid`'s own prev/next pager
    // both render in that same spot — visible together, they'd sit on top of one another. The
    // overlay must step aside whenever any visible month block has switched to its year view.
    test('the global prev/next overlay hides while any visible month is in year-selection mode', () => {
      render(
        <RangeCalendar
          aria-label="Trip dates"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 8, 15) }}
          visibleMonths={2}
        />
      )

      expect(screen.getByRole('button', { name: /^next$/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^previous$/i })).toBeInTheDocument()

      const [, secondYearButton] = screen.getAllByRole('button', { name: /^Year:/ })
      fireEvent.click(secondYearButton!)

      expect(screen.queryByRole('button', { name: /^next$/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /^previous$/i })).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Next years' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Previous years' })).toBeInTheDocument()

      fireEvent.click(screen.getByRole('button', { name: /2026 – 2040/ }))

      expect(screen.getByRole('button', { name: /^next$/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^previous$/i })).toBeInTheDocument()
    })

    // Same overlay, same reasoning, for the month view — it has no pager of its own to overlap,
    // but the global one would still be paging a day grid that's no longer showing, which reads
    // as it doing nothing.
    test('the global prev/next overlay hides while any visible month is in month-selection mode', () => {
      render(
        <RangeCalendar
          aria-label="Trip dates"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 8, 15) }}
          visibleMonths={2}
        />
      )

      const [firstMonthButton] = screen.getAllByRole('button', { name: /^Month:/ })
      fireEvent.click(firstMonthButton!)

      expect(screen.queryByRole('button', { name: /^next$/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /^previous$/i })).not.toBeInTheDocument()

      fireEvent.click(screen.getByRole('button', { name: '2026' }))

      expect(screen.getByRole('button', { name: /^next$/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^previous$/i })).toBeInTheDocument()
    })
  })

  describe('presets', () => {
    test('no presets prop renders no preset list', () => {
      render(<RangeCalendar aria-label="Trip dates" />)
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.querySelector('.datepicker-presets')).toBeNull()
    })

    test('renders each preset as a button', () => {
      const customPresets = [
        {
          label: 'Custom Range',
          range: { start: new CalendarDate(2026, 7, 1), end: new CalendarDate(2026, 7, 10) }
        },
        {
          label: 'Another Range',
          range: { start: new CalendarDate(2026, 8, 1), end: new CalendarDate(2026, 8, 10) }
        }
      ]
      render(<RangeCalendar aria-label="Trip dates" presets={customPresets} />)
      expect(screen.getByRole('button', { name: 'Custom Range' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Another Range' })).toBeInTheDocument()
    })

    test('selecting a preset commits its range and fires onChange', () => {
      const onChange = vi.fn()
      const customPresets = [
        {
          label: 'Custom Range',
          range: { start: new CalendarDate(2026, 7, 1), end: new CalendarDate(2026, 7, 10) }
        }
      ]
      render(<RangeCalendar aria-label="Trip dates" onChange={onChange} presets={customPresets} />)
      fireEvent.click(screen.getByRole('button', { name: 'Custom Range' }))

      expect(onChange).toHaveBeenCalledWith({
        start: new CalendarDate(2026, 7, 1),
        end: new CalendarDate(2026, 7, 10)
      })
    })

    test('selecting a preset reflects in the grid selection for a controlled value', () => {
      const onChange = vi.fn()
      const customPresets = [
        {
          label: 'Custom Range',
          range: { start: new CalendarDate(2026, 7, 1), end: new CalendarDate(2026, 7, 10) }
        }
      ]
      const { rerender } = render(
        <RangeCalendar
          aria-label="Trip dates"
          onChange={onChange}
          presets={customPresets}
          value={{ start: new CalendarDate(2026, 7, 20), end: new CalendarDate(2026, 7, 20) }}
        />
      )
      fireEvent.click(screen.getByRole('button', { name: 'Custom Range' }))
      expect(onChange).toHaveBeenCalledWith({
        start: new CalendarDate(2026, 7, 1),
        end: new CalendarDate(2026, 7, 10)
      })

      rerender(
        <RangeCalendar
          aria-label="Trip dates"
          onChange={onChange}
          presets={customPresets}
          value={{ start: new CalendarDate(2026, 7, 1), end: new CalendarDate(2026, 7, 10) }}
        />
      )
      const grid = screen.getByRole('grid')
      expect(getDateCell(within(grid).getByRole('button', { name: /July 5, 2026/ }))).toHaveClass(
        'datepicker-date-in-range'
      )

      const presetButton = screen.getByRole('button', { name: 'Custom Range' })
      expect(presetButton).toHaveClass('selected')
      expect(presetButton).toHaveAttribute('aria-current', 'true')
    })

    test('marks the preset matching the current value as selected on initial render', () => {
      const customPresets = [
        {
          label: 'Custom Range',
          range: { start: new CalendarDate(2026, 7, 1), end: new CalendarDate(2026, 7, 10) }
        }
      ]
      render(
        <RangeCalendar
          aria-label="Trip dates"
          presets={customPresets}
          value={{ start: new CalendarDate(2026, 7, 1), end: new CalendarDate(2026, 7, 10) }}
        />
      )
      const presetButton = screen.getByRole('button', { name: 'Custom Range' })
      expect(presetButton).toHaveClass('selected')
      expect(presetButton).toHaveAttribute('aria-current', 'true')
    })

    test('no preset is selected when the current value matches none of them', () => {
      const customPresets = [
        {
          label: 'Custom Range',
          range: { start: new CalendarDate(2026, 7, 1), end: new CalendarDate(2026, 7, 10) }
        }
      ]
      render(
        <RangeCalendar
          aria-label="Trip dates"
          presets={customPresets}
          value={{ start: new CalendarDate(2026, 7, 20), end: new CalendarDate(2026, 7, 22) }}
        />
      )
      const presetButton = screen.getByRole('button', { name: 'Custom Range' })
      expect(presetButton).not.toHaveClass('selected')
      expect(presetButton).not.toHaveAttribute('aria-current')
    })

    test('has no axe violations with presets shown', async () => {
      const customPresets = [
        {
          label: 'Custom Range',
          range: { start: new CalendarDate(2026, 7, 1), end: new CalendarDate(2026, 7, 10) }
        }
      ]
      render(
        <RangeCalendar
          aria-label="Trip dates"
          presets={customPresets}
          value={{ start: new CalendarDate(2026, 7, 1), end: new CalendarDate(2026, 7, 10) }}
        />
      )
      expect(
        await axe(document.body, { rules: { region: { enabled: false } } })
      ).toHaveNoViolations()
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      render(
        <RangeCalendar
          aria-label="Trip dates"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 7, 15) }}
        />
      )
      expect(await axe(document.body)).toHaveNoViolations()
    })

    test('has no axe violations with two months visible', async () => {
      render(
        <RangeCalendar
          aria-label="Trip dates"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 8, 5) }}
          visibleMonths={2}
        />
      )
      expect(await axe(document.body)).toHaveNoViolations()
    })
  })
})
