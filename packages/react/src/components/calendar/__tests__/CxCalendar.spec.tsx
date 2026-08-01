import * as React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { CalendarDate } from '@internationalized/date'
import { axe } from 'jest-axe'

import { CxCalendar } from '../../../index'

// `.cx-calendar-title` is the only reliable way to read the visible month/year — react-aria's
// live-announcer renders a second, visually-hidden node with the same text on every navigation,
// so text-based queries against the whole document match more than one element.
const getTitle = () =>
  // eslint-disable-next-line testing-library/no-node-access
  (document.querySelector('.cx-calendar-title') as HTMLElement).textContent

describe('CxCalendar', () => {
  describe('rendering', () => {
    test('renders a grid with the accessible label applied', () => {
      render(<CxCalendar aria-label="Event date" value={new CalendarDate(2026, 7, 24)} />)
      expect(screen.getByRole('grid')).toBeInTheDocument()
    })

    test('supports controlled value reflected in the grid selection', () => {
      const { rerender } = render(
        <CxCalendar aria-label="Event date" value={new CalendarDate(2026, 7, 24)} />
      )
      const grid = screen.getByRole('grid')
      expect(within(grid).getByRole('button', { name: /24/ })).toHaveClass('selected')

      rerender(<CxCalendar aria-label="Event date" value={new CalendarDate(2026, 7, 25)} />)
      expect(within(grid).getByRole('button', { name: /25/ })).toHaveClass('selected')
    })
  })

  describe('day selection', () => {
    test('clicking a day cell selects it and fires onChange', () => {
      const onChange = vi.fn()
      render(
        <CxCalendar
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
        <CxCalendar
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
        <CxCalendar
          aria-label="Event date"
          isDateUnavailable={(date) => date.day === 25}
          onChange={onChange}
          value={new CalendarDate(2026, 7, 15)}
        />
      )

      const grid = screen.getByRole('grid')
      const unavailable = within(grid).getByRole('button', { name: /25/ })
      expect(unavailable).toHaveClass('unavailable')
      expect(unavailable).not.toHaveClass('disabled')
      fireEvent.click(unavailable)
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('navigation', () => {
    test('the next button advances the visible month', () => {
      render(<CxCalendar aria-label="Event date" value={new CalendarDate(2026, 7, 24)} />)
      expect(getTitle()).toBe('July 2026')

      fireEvent.click(screen.getByRole('button', { name: /next/i }))
      expect(getTitle()).toBe('August 2026')
    })

    test('the previous button retreats the visible month', () => {
      render(<CxCalendar aria-label="Event date" value={new CalendarDate(2026, 7, 24)} />)
      fireEvent.click(screen.getByRole('button', { name: /previous/i }))
      expect(getTitle()).toBe('June 2026')
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      render(<CxCalendar aria-label="Event date" value={new CalendarDate(2026, 7, 24)} />)
      expect(await axe(document.body)).toHaveNoViolations()
    })
  })
})
