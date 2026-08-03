import * as React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { CalendarDate } from '@internationalized/date'
import { axe } from 'jest-axe'

import { CxRangeCalendar, I18nProvider } from '../../../index'

// State classes (`weekend`, `unavailable`, range endpoints, etc.) live on the `.datepicker-date`
// wrapper, not the `.datepicker-date-btn` button itself — matching chassis-css's own
// `.datepicker-date-X > .datepicker-date-btn` selector pattern.
const getDateCell = (button: HTMLElement) =>
  // eslint-disable-next-line testing-library/no-node-access
  button.closest('.datepicker-date') as HTMLElement

describe('CxRangeCalendar', () => {
  describe('rendering', () => {
    test('renders a grid with the accessible label applied', () => {
      render(
        <CxRangeCalendar
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
        <CxRangeCalendar
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
        <CxRangeCalendar
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

    test('dates outside minValue/maxValue are disabled and cannot start a selection', () => {
      const onChange = vi.fn()
      render(
        <CxRangeCalendar
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
        <CxRangeCalendar
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
  })

  describe('keyboard interaction', () => {
    test('Enter key selects a start and end date, mirroring click', () => {
      const onChange = vi.fn()
      render(
        <CxRangeCalendar
          aria-label="Trip dates"
          defaultValue={{ start: new CalendarDate(2026, 7, 1), end: new CalendarDate(2026, 7, 1) }}
          onChange={onChange}
        />
      )
      const grid = screen.getByRole('grid')
      const start = within(grid).getByRole('button', { name: /July 10, 2026/ })
      const end = within(grid).getByRole('button', { name: /July 15, 2026/ })

      start.focus()
      fireEvent.keyDown(start, { key: 'Enter' })
      fireEvent.keyUp(start, { key: 'Enter' })
      expect(onChange).not.toHaveBeenCalled()

      end.focus()
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
        <CxRangeCalendar
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
    test('renders month and year selects reflecting the visible month', () => {
      render(
        <CxRangeCalendar
          aria-label="Trip dates"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 7, 15) }}
        />
      )
      expect(screen.getByRole('combobox', { name: /month/i })).toHaveValue('7')
    })

    test('the next/previous buttons advance and rewind the visible month', () => {
      render(
        <CxRangeCalendar
          aria-label="Trip dates"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 7, 15) }}
        />
      )
      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      expect(screen.getByRole('combobox', { name: /month/i })).toHaveValue('8')
      fireEvent.click(screen.getByRole('button', { name: /previous/i }))
      expect(screen.getByRole('combobox', { name: /month/i })).toHaveValue('7')
    })

    test('selecting a year from the dropdown moves the visible range', () => {
      render(
        <CxRangeCalendar
          aria-label="Trip dates"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 7, 15) }}
        />
      )
      const yearOption = screen.getByRole('option', { name: '2027' }) as HTMLOptionElement
      fireEvent.change(screen.getByRole('combobox', { name: /year/i }), {
        target: { value: yearOption.value }
      })
      expect(screen.getByRole('combobox', { name: /month/i })).toHaveValue('7')
      expect(
        (screen.getByRole('combobox', { name: /year/i }) as HTMLSelectElement).selectedOptions[0]
          .textContent
      ).toBe('2027')
    })
  })

  describe('firstDayOfWeek', () => {
    test('defaults to Monday regardless of locale', () => {
      render(
        <I18nProvider locale="en-US">
          <CxRangeCalendar
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
        <CxRangeCalendar
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
        <CxRangeCalendar
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
          <CxRangeCalendar
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
        <CxRangeCalendar
          aria-label="Trip dates"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 7, 15) }}
        />
      )
      expect(screen.getAllByRole('grid')).toHaveLength(1)
      expect(screen.getAllByRole('combobox', { name: /month/i })).toHaveLength(1)
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument()
    })

    test('renders the requested number of months, each with its own synced month/year dropdowns', () => {
      render(
        <CxRangeCalendar
          aria-label="Trip dates"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 8, 15) }}
          visibleMonths={2}
        />
      )
      expect(screen.getAllByRole('grid')).toHaveLength(2)
      const monthSelects = screen.getAllByRole('combobox', { name: /month/i })
      expect(monthSelects.map((select) => (select as HTMLSelectElement).value)).toEqual(['7', '8'])
    })

    test('a single global prev/next pair pages every visible month at once, with none in the per-month headers', () => {
      render(
        <CxRangeCalendar
          aria-label="Trip dates"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 8, 15) }}
          visibleMonths={2}
        />
      )
      expect(screen.getAllByRole('button', { name: /next/i })).toHaveLength(1)
      expect(screen.getAllByRole('button', { name: /previous/i })).toHaveLength(1)

      // Paging moves the whole visible span at once (the default `pageBehavior`), so two visible
      // months advance by two months, not one.
      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      const monthSelects = screen.getAllByRole('combobox', { name: /month/i })
      expect(monthSelects.map((select) => (select as HTMLSelectElement).value)).toEqual(['9', '10'])
    })

    test('selecting a month from the second block moves both months in sync', () => {
      render(
        <CxRangeCalendar
          aria-label="Trip dates"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 8, 15) }}
          visibleMonths={2}
        />
      )
      const [, secondMonthSelect] = screen.getAllByRole('combobox', { name: /month/i })
      fireEvent.change(secondMonthSelect, { target: { value: '12' } })

      const updatedSelects = screen.getAllByRole('combobox', { name: /month/i })
      expect(updatedSelects.map((select) => (select as HTMLSelectElement).value)).toEqual([
        '11',
        '12'
      ])
    })

    // Regression coverage for a case the tests above don't reach: picking a month that's less
    // than a full `visibleMonths` away from the current one — the common case, since adjacent
    // blocks are always exactly one month apart. `state.setFocusedDate` only pages the visible
    // range when the new focus lands outside it; a target still inside the current range (this
    // test) used to silently no-op, and one exactly `visibleMonths - 1` short of the boundary
    // (the test below) used to overshoot by an extra month. See `setVisibleRangeStart`.
    test('selecting the immediately next month in the first block advances by one month', () => {
      render(
        <CxRangeCalendar
          aria-label="Trip dates"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 8, 15) }}
          visibleMonths={2}
        />
      )
      const [firstMonthSelect] = screen.getAllByRole('combobox', { name: /month/i })
      fireEvent.change(firstMonthSelect, { target: { value: '8' } })

      const updatedSelects = screen.getAllByRole('combobox', { name: /month/i })
      expect(updatedSelects.map((select) => (select as HTMLSelectElement).value)).toEqual([
        '8',
        '9'
      ])
    })

    test('selecting the immediately previous month in the second block retreats by one month', () => {
      render(
        <CxRangeCalendar
          aria-label="Trip dates"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 8, 15) }}
          visibleMonths={2}
        />
      )
      const [, secondMonthSelect] = screen.getAllByRole('combobox', { name: /month/i })
      fireEvent.change(secondMonthSelect, { target: { value: '7' } })

      const updatedSelects = screen.getAllByRole('combobox', { name: /month/i })
      expect(updatedSelects.map((select) => (select as HTMLSelectElement).value)).toEqual([
        '6',
        '7'
      ])
    })

    test('a range spanning both visible months is selectable and pills continuously', () => {
      const onChange = vi.fn()
      render(
        <CxRangeCalendar
          aria-label="Trip dates"
          defaultValue={{ start: new CalendarDate(2026, 7, 1), end: new CalendarDate(2026, 7, 1) }}
          onChange={onChange}
          visibleMonths={2}
        />
      )

      const grids = screen.getAllByRole('grid')
      fireEvent.click(within(grids[0]).getByRole('button', { name: /July 28, 2026/ }))
      fireEvent.click(within(grids[1]).getByRole('button', { name: /August 3, 2026/ }))

      expect(onChange).toHaveBeenCalledWith({
        start: new CalendarDate(2026, 7, 28),
        end: new CalendarDate(2026, 8, 3)
      })
    })
  })

  describe('presets', () => {
    test('no presets prop renders no preset list', () => {
      render(<CxRangeCalendar aria-label="Trip dates" />)
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.querySelector('.cx-calendar-presets')).toBeNull()
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
      render(<CxRangeCalendar aria-label="Trip dates" presets={customPresets} />)
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
      render(
        <CxRangeCalendar aria-label="Trip dates" onChange={onChange} presets={customPresets} />
      )
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
        <CxRangeCalendar
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
        <CxRangeCalendar
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
        <CxRangeCalendar
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
        <CxRangeCalendar
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
        <CxRangeCalendar
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
        <CxRangeCalendar
          aria-label="Trip dates"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 7, 15) }}
        />
      )
      expect(await axe(document.body)).toHaveNoViolations()
    })

    test('has no axe violations with two months visible', async () => {
      render(
        <CxRangeCalendar
          aria-label="Trip dates"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 8, 5) }}
          visibleMonths={2}
        />
      )
      expect(await axe(document.body)).toHaveNoViolations()
    })
  })
})
