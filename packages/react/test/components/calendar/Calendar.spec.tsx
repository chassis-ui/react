import * as React from 'react'
import { act, render, screen, fireEvent, within } from '@testing-library/react'
import { CalendarDate } from '@internationalized/date'
import { axe } from 'jest-axe'

import { Calendar, I18nProvider } from '../../../src/index'

// State classes (`selected`, `weekend`, `unavailable`, etc.) live on the `.datepicker-date`
// wrapper, not the `.datepicker-date-btn` button itself — matching chassis-css's own
// `.datepicker-date-X > .datepicker-date-btn` selector pattern.
const getDateCell = (button: HTMLElement) =>
  // eslint-disable-next-line testing-library/no-node-access
  button.closest('.datepicker-date') as HTMLElement

// The month/year header buttons carry an `aria-label` ("Month: August") distinct from their
// visible text (just "August") — the label is what `getByRole`'s `name` matches against.
const getMonthButton = () => screen.getByRole('button', { name: /^Month:/ })
const getYearButton = () => screen.getByRole('button', { name: /^Year:/ })

describe('Calendar', () => {
  describe('rendering', () => {
    test('renders a grid with the accessible label applied', () => {
      render(<Calendar aria-label="Event date" value={new CalendarDate(2026, 7, 24)} />)
      expect(screen.getByRole('grid')).toBeInTheDocument()
    })

    test('supports controlled value reflected in the grid selection', () => {
      const { rerender } = render(
        <Calendar aria-label="Event date" value={new CalendarDate(2026, 7, 24)} />
      )
      const grid = screen.getByRole('grid')
      expect(getDateCell(within(grid).getByRole('button', { name: /24/ }))).toHaveClass(
        'datepicker-date-selected'
      )

      rerender(<Calendar aria-label="Event date" value={new CalendarDate(2026, 7, 25)} />)
      expect(getDateCell(within(grid).getByRole('button', { name: /25/ }))).toHaveClass(
        'datepicker-date-selected'
      )
    })
  })

  describe('day selection', () => {
    test('clicking a day cell selects it and fires onChange', () => {
      const onChange = vi.fn()
      render(
        <Calendar
          aria-label="Event date"
          onChange={onChange}
          value={new CalendarDate(2026, 7, 24)}
        />
      )

      const grid = screen.getByRole('grid')
      fireEvent.click(within(grid).getByRole('button', { name: /15/ }))

      expect(onChange).toHaveBeenCalledWith(new CalendarDate(2026, 7, 15))
    })

    test('dates outside minValue/maxValue are disabled and cannot be selected', () => {
      const onChange = vi.fn()
      render(
        <Calendar
          aria-label="Event date"
          maxValue={new CalendarDate(2026, 7, 20)}
          minValue={new CalendarDate(2026, 7, 10)}
          onChange={onChange}
          value={new CalendarDate(2026, 7, 15)}
        />
      )

      const grid = screen.getByRole('grid')
      const outOfRange = within(grid).getByRole('button', { name: /25/ })
      expect(outOfRange).toHaveAttribute('aria-disabled', 'true')
      fireEvent.click(outOfRange)
      expect(onChange).not.toHaveBeenCalled()
    })

    test('unavailable dates are styled distinctly and cannot be selected', () => {
      const onChange = vi.fn()
      render(
        <Calendar
          aria-label="Event date"
          isDateUnavailable={(date) => date.day === 25}
          onChange={onChange}
          value={new CalendarDate(2026, 7, 15)}
        />
      )

      const grid = screen.getByRole('grid')
      const unavailable = within(grid).getByRole('button', { name: /25/ })
      expect(getDateCell(unavailable)).toHaveClass('datepicker-date-unavailable')
      expect(getDateCell(unavailable)).not.toHaveClass('datepicker-date-disabled')
      fireEvent.click(unavailable)
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('navigation', () => {
    test('the next button advances the visible month', () => {
      render(<Calendar aria-label="Event date" value={new CalendarDate(2026, 7, 24)} />)
      expect(getMonthButton()).toHaveTextContent('July')

      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      expect(getMonthButton()).toHaveTextContent('August')
    })

    test('the previous button retreats the visible month', () => {
      render(<Calendar aria-label="Event date" value={new CalendarDate(2026, 7, 24)} />)
      fireEvent.click(screen.getByRole('button', { name: /previous/i }))
      expect(getMonthButton()).toHaveTextContent('June')
    })

    test('arrow-key paging past the last day of the month auto-advances the visible month', () => {
      render(<Calendar aria-label="Event date" value={new CalendarDate(2026, 7, 31)} />)
      const grid = screen.getByRole('grid')
      const lastDay = within(grid).getByRole('button', { name: /July 31, 2026/ })

      // `.focus()` is a raw DOM call, not a Testing Library dispatch — it isn't act-wrapped on
      // its own (see the equivalent comment in `RangeCalendar.spec.tsx`'s keyboard tests).
      act(() => lastDay.focus())
      fireEvent.keyDown(lastDay, { key: 'ArrowRight' })

      expect(getMonthButton()).toHaveTextContent('August')
    })

    test('arrow-key paging before the first day of the month auto-retreats the visible month', () => {
      render(<Calendar aria-label="Event date" value={new CalendarDate(2026, 7, 1)} />)
      const grid = screen.getByRole('grid')
      const firstDay = within(grid).getByRole('button', { name: /July 1, 2026/ })

      act(() => firstDay.focus())
      fireEvent.keyDown(firstDay, { key: 'ArrowLeft' })

      expect(getMonthButton()).toHaveTextContent('June')
    })

    test('renders month and year buttons reflecting the visible month', () => {
      render(<Calendar aria-label="Event date" value={new CalendarDate(2026, 7, 24)} />)
      expect(getMonthButton()).toHaveTextContent('July')
      expect(getYearButton()).toHaveTextContent('2026')
    })

    test('picking a month from the month grid jumps the visible month and returns to the day grid', () => {
      render(<Calendar aria-label="Event date" value={new CalendarDate(2026, 7, 24)} />)

      fireEvent.click(getMonthButton())
      fireEvent.click(screen.getByRole('button', { name: 'Jan' }))

      expect(getMonthButton()).toHaveTextContent('Jan')
      // Back in the day grid (not still showing the month grid) — only the visible month's own
      // days are ever selectable, so this also confirms the grid re-rendered for the new month
      // rather than merely re-labeling.
      const grid = screen.getByRole('grid')
      expect(getDateCell(within(grid).getByRole('button', { name: /24/ }))).not.toHaveClass(
        'datepicker-date-outside'
      )
    })

    test('picking a year from the year grid jumps the visible year and returns to the day grid', () => {
      render(<Calendar aria-label="Event date" value={new CalendarDate(2026, 7, 24)} />)

      fireEvent.click(getYearButton())
      fireEvent.click(screen.getByRole('button', { name: '2027' }))

      expect(getYearButton()).toHaveTextContent('2027')
      // The year grid's own wrapper is the only `role="group"` element in a bare `Calendar` — its
      // absence confirms the picker view actually closed, not just that the header text changed.
      expect(screen.queryByRole('group')).not.toBeInTheDocument()
    })

    test('the year grid pages forward and back by its own arrows', () => {
      render(<Calendar aria-label="Event date" value={new CalendarDate(2026, 7, 24)} />)

      fireEvent.click(getYearButton())
      expect(screen.getByRole('button', { name: '2026' })).toBeInTheDocument()

      fireEvent.click(screen.getByRole('button', { name: /next years/i }))
      expect(screen.queryByRole('button', { name: '2026' })).not.toBeInTheDocument()

      fireEvent.click(screen.getByRole('button', { name: /previous years/i }))
      expect(screen.getByRole('button', { name: '2026' })).toBeInTheDocument()
    })

    test('the back button in the month/year grid returns to the day grid without changing anything', () => {
      render(<Calendar aria-label="Event date" value={new CalendarDate(2026, 7, 24)} />)

      fireEvent.click(getMonthButton())
      // The month grid's own header button is the current year — doubles as "back".
      fireEvent.click(screen.getByRole('button', { name: '2026' }))

      expect(getMonthButton()).toHaveTextContent('July')
      expect(screen.getByRole('grid')).toBeInTheDocument()
    })

    test('the month and year buttons are disabled when the calendar is disabled', () => {
      render(<Calendar aria-label="Event date" disabled value={new CalendarDate(2026, 7, 24)} />)
      expect(getMonthButton()).toBeDisabled()
      expect(getYearButton()).toBeDisabled()
    })

    test('switching to the month grid moves focus onto it instead of dropping to the document body', () => {
      render(<Calendar aria-label="Event date" value={new CalendarDate(2026, 7, 24)} />)
      fireEvent.click(getMonthButton())
      expect(document.body).not.toHaveFocus()
      expect(screen.getByRole('button', { name: 'Jul' })).toHaveFocus()
    })

    test('switching to the year grid moves focus onto it instead of dropping to the document body', () => {
      render(<Calendar aria-label="Event date" value={new CalendarDate(2026, 7, 24)} />)
      fireEvent.click(getYearButton())
      expect(document.body).not.toHaveFocus()
      expect(screen.getByRole('button', { name: '2026' })).toHaveFocus()
    })

    test('returning to the day grid restores focus onto it instead of dropping to the document body', () => {
      render(<Calendar aria-label="Event date" value={new CalendarDate(2026, 7, 24)} />)
      fireEvent.click(getMonthButton())
      fireEvent.click(screen.getByRole('button', { name: 'Jan' }))
      expect(document.body).not.toHaveFocus()
      // document.activeElement is the standard way to read current focus; no Testing Library
      // query surfaces it, and which day ends up focused depends on internal react-stately paging
      // math this test isn't pinning down — only that focus landed somewhere inside the grid.
      // eslint-disable-next-line testing-library/no-node-access
      expect(screen.getByRole('grid')).toContainElement(document.activeElement as HTMLElement)
    })
  })

  describe('firstDayOfWeek', () => {
    test('defaults to Monday regardless of locale', () => {
      render(
        <I18nProvider locale="en-US">
          <Calendar aria-label="Event date" value={new CalendarDate(2026, 7, 24)} />
        </I18nProvider>
      )
      // The header row is `aria-hidden` (see react-aria's `useCalendarGrid`), so its
      // `columnheader` cells aren't reachable via role queries — direct node access is the only
      // way to read them.
      // eslint-disable-next-line testing-library/no-node-access
      const headers = document.querySelectorAll('.datepicker-week-day')
      expect(headers[0]).toHaveTextContent('M')

      // July 24, 2026 is a Friday. With Monday as the first column, its row starts on July 20
      // (Monday) — so Friday the 24th falls in the 5th data cell of that row.
      const grid = screen.getByRole('grid')
      const rows = within(grid).getAllByRole('row')
      const rowWithThe24th = rows.find((row) =>
        within(row)
          .queryAllByRole('button')
          .some((cell) => cell.getAttribute('aria-label')?.includes('July 24, 2026'))
      ) as HTMLElement
      const cellsInRow = within(rowWithThe24th).getAllByRole('button')
      expect(cellsInRow[4]).toHaveAccessibleName(/Friday, July 24, 2026/)
    })

    test('can be overridden, e.g. to Sunday', () => {
      render(
        <Calendar
          aria-label="Event date"
          firstDayOfWeek="sun"
          value={new CalendarDate(2026, 7, 24)}
        />
      )
      // eslint-disable-next-line testing-library/no-node-access
      const headers = document.querySelectorAll('.datepicker-week-day')
      expect(headers[0]).toHaveTextContent('S')

      // With Sunday as the first column, the row containing July 24 (Friday) starts on July 19
      // (Sunday) — so Friday the 24th falls in the 6th data cell instead.
      const grid = screen.getByRole('grid')
      const rows = within(grid).getAllByRole('row')
      const rowWithThe24th = rows.find((row) =>
        within(row)
          .queryAllByRole('button')
          .some((cell) => cell.getAttribute('aria-label')?.includes('July 24, 2026'))
      ) as HTMLElement
      const cellsInRow = within(rowWithThe24th).getAllByRole('button')
      expect(cellsInRow[5]).toHaveAccessibleName(/Friday, July 24, 2026/)
    })
  })

  describe('weekend styling', () => {
    test('marks Saturday/Sunday as weekends under en-US', () => {
      render(
        <I18nProvider locale="en-US">
          <Calendar aria-label="Event date" value={new CalendarDate(2026, 7, 24)} />
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

    test('follows the active locale — ar-SA treats Friday/Saturday as the weekend instead', () => {
      render(
        <I18nProvider locale="ar-SA">
          <Calendar aria-label="Event date" value={new CalendarDate(2026, 7, 24)} />
        </I18nProvider>
      )
      // ar-SA renders day numbers as Arabic-Indic numerals ("٢٤"), so text-based queries can't
      // find cells by ASCII digit — instead, pick cells by their chronological position among the
      // visible month's own (non-"outside") days: index 23 is July 24, index 25 is July 26.
      const grid = screen.getByRole('grid')
      const inRangeCells = within(grid)
        .getAllByRole('button')
        .filter((cell) => !getDateCell(cell).classList.contains('datepicker-date-outside'))
      expect(getDateCell(inRangeCells[23]!)).toHaveClass('datepicker-date-weekend')
      expect(getDateCell(inRangeCells[25]!)).not.toHaveClass('datepicker-date-weekend')
    })
  })

  describe('unavailableDates', () => {
    test('blocks selection of dates listed as ISO strings', () => {
      const onChange = vi.fn()
      render(
        <Calendar
          aria-label="Event date"
          onChange={onChange}
          unavailableDates={['2026-07-25']}
          value={new CalendarDate(2026, 7, 15)}
        />
      )

      const grid = screen.getByRole('grid')
      const unavailable = within(grid).getByRole('button', { name: /25/ })
      expect(getDateCell(unavailable)).toHaveClass('datepicker-date-unavailable')
      fireEvent.click(unavailable)
      expect(onChange).not.toHaveBeenCalled()
    })

    test('composes with isDateUnavailable — either marks a date unavailable', () => {
      const onChange = vi.fn()
      render(
        <Calendar
          aria-label="Event date"
          isDateUnavailable={(date) => date.day === 12}
          onChange={onChange}
          unavailableDates={['2026-07-25']}
          value={new CalendarDate(2026, 7, 15)}
        />
      )

      // Regexes like `/12/` also match the "2026" inside every cell's aria-label, so these use
      // the full formatted label to pin down a single cell.
      const grid = screen.getByRole('grid')
      expect(getDateCell(within(grid).getByRole('button', { name: /July 12, 2026/ }))).toHaveClass(
        'datepicker-date-unavailable'
      )
      expect(getDateCell(within(grid).getByRole('button', { name: /July 25, 2026/ }))).toHaveClass(
        'datepicker-date-unavailable'
      )
      expect(
        getDateCell(within(grid).getByRole('button', { name: /July 13, 2026/ }))
      ).not.toHaveClass('datepicker-date-unavailable')
    })
  })

  describe('visibleMonths', () => {
    test('defaults to a single month with prev/next arrows in its own header', () => {
      render(<Calendar aria-label="Event date" value={new CalendarDate(2026, 7, 24)} />)
      expect(screen.getAllByRole('grid')).toHaveLength(1)
      expect(screen.getAllByRole('button', { name: /^Month:/ })).toHaveLength(1)
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument()
    })

    test('renders the requested number of months, each with its own synced month/year picker', () => {
      render(
        <Calendar aria-label="Event date" value={new CalendarDate(2026, 7, 24)} visibleMonths={2} />
      )
      expect(screen.getAllByRole('grid')).toHaveLength(2)
      const monthButtons = screen.getAllByRole('button', { name: /^Month:/ })
      expect(monthButtons.map((button) => button.textContent)).toEqual(['July', 'August'])
    })

    test('a single global prev/next pair pages every visible month at once, with none in the per-month headers', () => {
      render(
        <Calendar aria-label="Event date" value={new CalendarDate(2026, 7, 24)} visibleMonths={2} />
      )
      expect(screen.getAllByRole('button', { name: /next/i })).toHaveLength(1)
      expect(screen.getAllByRole('button', { name: /previous/i })).toHaveLength(1)

      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      let monthButtons = screen.getAllByRole('button', { name: /^Month:/ })
      expect(monthButtons.map((button) => button.textContent)).toEqual(['August', 'September'])

      fireEvent.click(screen.getByRole('button', { name: /previous/i }))
      monthButtons = screen.getAllByRole('button', { name: /^Month:/ })
      expect(monthButtons.map((button) => button.textContent)).toEqual(['July', 'August'])
    })

    test('picking a month from the second block moves both months in sync', () => {
      render(
        <Calendar aria-label="Event date" value={new CalendarDate(2026, 7, 24)} visibleMonths={2} />
      )
      const [, secondMonthButton] = screen.getAllByRole('button', { name: /^Month:/ })
      fireEvent.click(secondMonthButton!)
      fireEvent.click(screen.getByRole('button', { name: 'Dec' }))

      const monthButtons = screen.getAllByRole('button', { name: /^Month:/ })
      expect(monthButtons.map((button) => button.textContent)).toEqual(['November', 'December'])
    })

    test('clicking a date in the second visible month selects it', () => {
      const onChange = vi.fn()
      render(
        <Calendar
          aria-label="Event date"
          onChange={onChange}
          value={new CalendarDate(2026, 7, 1)}
          visibleMonths={2}
        />
      )

      const grids = screen.getAllByRole('grid')
      fireEvent.click(within(grids[1]!).getByRole('button', { name: /August 3, 2026/ }))

      expect(onChange).toHaveBeenCalledWith(new CalendarDate(2026, 8, 3))
    })

    // Regression coverage: the global prev/next overlay and `CalendarYearGrid`'s own prev/next
    // pager both render in the same spot — see `RangeCalendar`'s identical test for the full
    // reasoning.
    test('the global prev/next overlay hides while any visible month is in year-selection mode', () => {
      render(
        <Calendar aria-label="Event date" value={new CalendarDate(2026, 7, 24)} visibleMonths={2} />
      )

      expect(screen.getByRole('button', { name: /^next$/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^previous$/i })).toBeInTheDocument()

      const [, secondYearButton] = screen.getAllByRole('button', { name: /^Year:/ })
      fireEvent.click(secondYearButton!)

      expect(screen.queryByRole('button', { name: /^next$/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /^previous$/i })).not.toBeInTheDocument()

      fireEvent.click(screen.getByRole('button', { name: /2026 – 2040/ }))

      expect(screen.getByRole('button', { name: /^next$/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^previous$/i })).toBeInTheDocument()
    })
  })

  describe('selectionMode', () => {
    test('defaults to single selection — picking a new date replaces the old one', () => {
      const onChange = vi.fn()
      render(
        <Calendar
          aria-label="Event date"
          onChange={onChange}
          value={new CalendarDate(2026, 7, 24)}
        />
      )

      const grid = screen.getByRole('grid')
      fireEvent.click(within(grid).getByRole('button', { name: /July 15, 2026/ }))

      expect(onChange).toHaveBeenCalledWith(new CalendarDate(2026, 7, 15))
    })

    test('multiple selection: clicking several dates selects all of them independently', () => {
      const onChange = vi.fn()
      render(
        <Calendar
          aria-label="Event date"
          onChange={onChange}
          selectionMode="multiple"
          value={[new CalendarDate(2026, 7, 5)]}
        />
      )

      const grid = screen.getByRole('grid')
      expect(getDateCell(within(grid).getByRole('button', { name: /July 5, 2026/ }))).toHaveClass(
        'datepicker-date-selected'
      )

      fireEvent.click(within(grid).getByRole('button', { name: /July 12, 2026/ }))
      expect(onChange).toHaveBeenCalledWith([
        new CalendarDate(2026, 7, 5),
        new CalendarDate(2026, 7, 12)
      ])
    })

    test('multiple selection: clicking an already-selected date deselects it', () => {
      const onChange = vi.fn()
      render(
        <Calendar
          aria-label="Event date"
          onChange={onChange}
          selectionMode="multiple"
          value={[new CalendarDate(2026, 7, 5), new CalendarDate(2026, 7, 12)]}
        />
      )

      const grid = screen.getByRole('grid')
      fireEvent.click(within(grid).getByRole('button', { name: /July 5, 2026/ }))

      expect(onChange).toHaveBeenCalledWith([new CalendarDate(2026, 7, 12)])
    })

    test('multiple selection: supports uncontrolled defaultValue', () => {
      render(
        <Calendar
          aria-label="Event date"
          defaultValue={[new CalendarDate(2026, 7, 5), new CalendarDate(2026, 7, 12)]}
          selectionMode="multiple"
        />
      )

      const grid = screen.getByRole('grid')
      expect(getDateCell(within(grid).getByRole('button', { name: /July 5, 2026/ }))).toHaveClass(
        'datepicker-date-selected'
      )
      expect(getDateCell(within(grid).getByRole('button', { name: /July 12, 2026/ }))).toHaveClass(
        'datepicker-date-selected'
      )
      expect(
        getDateCell(within(grid).getByRole('button', { name: /July 13, 2026/ }))
      ).not.toHaveClass('datepicker-date-selected')
    })

    // Regression coverage: react-stately's `useCalendarState` computes an initial focused date
    // by falling back to today only when the value is nullish — an empty array is truthy, so
    // without `defaultFocusedValue` it instead indexes the (nonexistent) first element and
    // throws trying to call `.subtract` on the resulting `undefined`. This is the actual shape
    // `DatePicker`'s multi-select mode starts with (a real `[]`, not `undefined`) before any
    // date is picked.
    test('multiple selection: renders without an initial value, controlled as an empty array', () => {
      render(<Calendar aria-label="Event date" selectionMode="multiple" value={[]} />)
      expect(screen.getByRole('grid')).toBeInTheDocument()
    })

    test('multiple selection: renders without an initial value, uncontrolled as an empty array', () => {
      render(<Calendar aria-label="Event date" defaultValue={[]} selectionMode="multiple" />)
      expect(screen.getByRole('grid')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      render(<Calendar aria-label="Event date" value={new CalendarDate(2026, 7, 24)} />)
      expect(await axe(document.body)).toHaveNoViolations()
    })

    test('has no axe violations in multiple selection mode', async () => {
      render(
        <Calendar
          aria-label="Event date"
          selectionMode="multiple"
          value={[new CalendarDate(2026, 7, 5), new CalendarDate(2026, 7, 12)]}
        />
      )
      expect(await axe(document.body)).toHaveNoViolations()
    })

    test('has no axe violations with the month grid open', async () => {
      render(<Calendar aria-label="Event date" value={new CalendarDate(2026, 7, 24)} />)
      fireEvent.click(getMonthButton())
      expect(await axe(document.body)).toHaveNoViolations()
    })

    test('has no axe violations with the year grid open', async () => {
      render(<Calendar aria-label="Event date" value={new CalendarDate(2026, 7, 24)} />)
      fireEvent.click(getYearButton())
      expect(await axe(document.body)).toHaveNoViolations()
    })
  })
})
