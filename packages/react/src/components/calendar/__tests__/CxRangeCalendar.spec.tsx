import * as React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { CalendarDate } from '@internationalized/date'
import { axe } from 'jest-axe'

import { CxRangeCalendar, I18nProvider } from '../../../index'

const getTitle = () =>
  // eslint-disable-next-line testing-library/no-node-access
  (document.querySelector('.cx-calendar-title') as HTMLElement).textContent

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
      expect(unavailable).toHaveClass('unavailable')
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

      expect(start).toHaveClass('range-start')
      expect(start).not.toHaveClass('range-end')
      expect(end).toHaveClass('range-end')
      expect(end).not.toHaveClass('range-start')
      expect(middle).not.toHaveClass('range-start')
      expect(middle).not.toHaveClass('range-end')
      // eslint-disable-next-line testing-library/no-node-access
      expect(middle.closest('td')).toHaveClass('in-range')
    })
  })

  describe('navigation — dropdown (default)', () => {
    test('renders month and year selects reflecting the visible month', () => {
      render(
        <CxRangeCalendar
          aria-label="Trip dates"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 7, 15) }}
        />
      )
      expect(screen.getByRole('combobox', { name: /month/i })).toHaveValue('7')
    })
  })

  describe('navigation — arrows', () => {
    test('the next button advances the visible month', () => {
      render(
        <CxRangeCalendar
          aria-label="Trip dates"
          navigation="arrows"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 7, 15) }}
        />
      )
      expect(getTitle()).toBe('July 2026')
      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      expect(getTitle()).toBe('August 2026')
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
      expect(within(grid).getByRole('button', { name: /Saturday, July 25/ })).toHaveClass('weekend')
      expect(within(grid).getByRole('button', { name: /Monday, July 27/ })).not.toHaveClass(
        'weekend'
      )
    })
  })

  describe('visibleMonths', () => {
    test('defaults to a single month with no per-month heading', () => {
      render(
        <CxRangeCalendar
          aria-label="Trip dates"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 7, 15) }}
        />
      )
      expect(screen.getAllByRole('grid')).toHaveLength(1)
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.querySelector('.cx-calendar-month-heading')).toBeNull()
    })

    test('renders the requested number of months, each with its own heading', () => {
      render(
        <CxRangeCalendar
          aria-label="Trip dates"
          navigation="arrows"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 8, 15) }}
          visibleMonths={2}
        />
      )
      expect(screen.getAllByRole('grid')).toHaveLength(2)
      // eslint-disable-next-line testing-library/no-node-access
      const headings = [...document.querySelectorAll('.cx-calendar-month-heading')].map(
        (el) => el.textContent
      )
      expect(headings).toEqual(['July 2026', 'August 2026'])
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
