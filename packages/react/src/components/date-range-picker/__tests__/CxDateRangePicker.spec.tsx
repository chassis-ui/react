import * as React from 'react'
import { act, render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CalendarDate } from '@internationalized/date'
import { axe } from 'jest-axe'

import { CxDateRangePicker } from '../../../index'

const openCalendar = () => {
  fireEvent.click(screen.getByRole('button'))
}

// Same rationale as `CxDatePicker.spec.tsx`: the popover wrapper only toggles a `hidden` attribute
// and has no role of its own, and is the first `.datepicker` in document order.
const getCalendarWrapper = () =>
  // eslint-disable-next-line testing-library/no-node-access
  document.querySelector('.datepicker') as HTMLElement

describe('CxDateRangePicker', () => {
  describe('rendering', () => {
    test('renders a labeled group with two segmented date fields', () => {
      render(<CxDateRangePicker aria-label="Trip dates" />)
      expect(screen.getByRole('group', { name: 'Trip dates' })).toBeInTheDocument()
      expect(screen.getAllByRole('spinbutton').length).toBeGreaterThan(3)
    })

    test('supports a controlled value reflected in both fields', () => {
      const onChange = vi.fn()
      render(
        <CxDateRangePicker
          aria-label="Trip dates"
          onChange={onChange}
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 7, 15) }}
        />
      )
      expect(screen.getByText('10')).toBeInTheDocument()
      expect(screen.getByText('15')).toBeInTheDocument()
    })
  })

  describe('open/close behavior', () => {
    test('the calendar dialog is hidden until the toggle button is pressed', () => {
      render(<CxDateRangePicker aria-label="Trip dates" />)
      const dialog = getCalendarWrapper()
      expect(dialog).toHaveAttribute('hidden')
      openCalendar()
      expect(dialog).not.toHaveAttribute('hidden')
      expect(screen.getByRole('grid')).toBeInTheDocument()
    })

    test('re-clicking the toggle button closes an open calendar', () => {
      render(<CxDateRangePicker aria-label="Trip dates" />)
      const toggle = screen.getByRole('button')
      const dialog = getCalendarWrapper()
      fireEvent.click(toggle)
      expect(dialog).not.toHaveAttribute('hidden')
      fireEvent.click(toggle)
      expect(dialog).toHaveAttribute('hidden')
    })

    test('pressing Escape while the calendar is open closes it', () => {
      render(<CxDateRangePicker aria-label="Trip dates" />)
      const dialog = getCalendarWrapper()
      openCalendar()
      expect(dialog).not.toHaveAttribute('hidden')
      fireEvent.keyDown(dialog, { key: 'Escape' })
      expect(dialog).toHaveAttribute('hidden')
    })
  })

  describe('focus management', () => {
    test('closing the calendar restores focus to the toggle button', async () => {
      const user = userEvent.setup()
      render(<CxDateRangePicker aria-label="Trip dates" />)
      const toggle = screen.getByRole('button')

      // eslint-disable-next-line testing-library/no-unnecessary-act -- see CxDatePicker.spec.tsx
      await act(async () => {
        await user.click(toggle)
      })
      // eslint-disable-next-line testing-library/no-unnecessary-act -- see CxDatePicker.spec.tsx
      await act(async () => {
        await user.keyboard('{Escape}')
      })

      // eslint-disable-next-line testing-library/no-node-access
      await waitFor(() => expect(document.activeElement).toBe(toggle))
    })
  })

  describe('range selection', () => {
    test('clicking a start then an end date commits the range, fires onChange, and closes the calendar', () => {
      const onChange = vi.fn()
      render(
        <CxDateRangePicker
          aria-label="Trip dates"
          defaultValue={{ start: new CalendarDate(2026, 7, 1), end: new CalendarDate(2026, 7, 1) }}
          onChange={onChange}
        />
      )
      openCalendar()

      const grid = screen.getByRole('grid')
      fireEvent.click(within(grid).getByRole('button', { name: /July 10, 2026/ }))
      expect(onChange).not.toHaveBeenCalled()

      fireEvent.click(within(grid).getByRole('button', { name: /July 15, 2026/ }))
      expect(onChange).toHaveBeenCalledWith({
        start: new CalendarDate(2026, 7, 10),
        end: new CalendarDate(2026, 7, 15)
      })
      expect(getCalendarWrapper()).toHaveAttribute('hidden')
    })

    test('dates outside minValue/maxValue are disabled and cannot be selected', () => {
      const onChange = vi.fn()
      render(
        <CxDateRangePicker
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
      openCalendar()

      const grid = screen.getByRole('grid')
      const outOfRange = within(grid).getByRole('button', { name: /July 25, 2026/ })
      expect(outOfRange).toHaveAttribute('aria-disabled', 'true')
      fireEvent.click(outOfRange)
      expect(onChange).not.toHaveBeenCalled()
    })

    test('dates listed in unavailableDates cannot be selected from the calendar', () => {
      const onChange = vi.fn()
      render(
        <CxDateRangePicker
          aria-label="Trip dates"
          defaultValue={{ start: new CalendarDate(2026, 7, 1), end: new CalendarDate(2026, 7, 1) }}
          onChange={onChange}
          unavailableDates={['2026-07-15']}
        />
      )
      openCalendar()

      const grid = screen.getByRole('grid')
      const unavailable = within(grid).getByRole('button', { name: /July 15, 2026/ })
      // eslint-disable-next-line testing-library/no-node-access
      expect(unavailable.closest('.datepicker-date')).toHaveClass('datepicker-date-unavailable')
    })
  })

  describe('edge cases', () => {
    test('picking only a start date does not fire onChange or close the calendar', () => {
      const onChange = vi.fn()
      render(
        <CxDateRangePicker
          aria-label="Trip dates"
          defaultValue={{ start: new CalendarDate(2026, 7, 1), end: new CalendarDate(2026, 7, 1) }}
          onChange={onChange}
        />
      )
      openCalendar()

      const grid = screen.getByRole('grid')
      fireEvent.click(within(grid).getByRole('button', { name: /July 10, 2026/ }))

      expect(onChange).not.toHaveBeenCalled()
      expect(getCalendarWrapper()).not.toHaveAttribute('hidden')
    })

    test('a controlled value can be cleared back to null', () => {
      const { rerender } = render(
        <CxDateRangePicker
          aria-label="Trip dates"
          name="tripDates"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 7, 15) }}
        />
      )
      expect(screen.getByText('10')).toBeInTheDocument()

      rerender(<CxDateRangePicker aria-label="Trip dates" name="tripDates" value={null} />)

      // eslint-disable-next-line testing-library/no-node-access
      const startInput = document.querySelector(
        'input[type="hidden"][name="tripDatesStart"]'
      ) as HTMLInputElement
      // eslint-disable-next-line testing-library/no-node-access
      const endInput = document.querySelector(
        'input[type="hidden"][name="tripDatesEnd"]'
      ) as HTMLInputElement
      expect(startInput.value).toBe('')
      expect(endInput.value).toBe('')
      expect(screen.queryByText('10')).toBeNull()
    })
  })

  describe('visibleMonths', () => {
    test('passes through to the popover calendar', () => {
      render(
        <CxDateRangePicker
          aria-label="Trip dates"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 8, 5) }}
          visibleMonths={2}
        />
      )
      openCalendar()
      expect(screen.getAllByRole('grid')).toHaveLength(2)
    })
  })

  describe('firstDayOfWeek', () => {
    test('is forwarded to the popover calendar, defaulting to Monday', () => {
      render(
        <CxDateRangePicker
          aria-label="Trip dates"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 7, 15) }}
        />
      )
      openCalendar()
      // eslint-disable-next-line testing-library/no-node-access
      expect(getCalendarWrapper().querySelector('.datepicker-week-day')).toHaveTextContent('M')
    })

    test('can be overridden', () => {
      render(
        <CxDateRangePicker
          aria-label="Trip dates"
          firstDayOfWeek="sun"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 7, 15) }}
        />
      )
      openCalendar()
      // eslint-disable-next-line testing-library/no-node-access
      expect(getCalendarWrapper().querySelector('.datepicker-week-day')).toHaveTextContent('S')
    })
  })

  describe('presets', () => {
    test('no presets prop renders no preset list', () => {
      render(<CxDateRangePicker aria-label="Trip dates" />)
      openCalendar()
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.querySelector('.cx-calendar-presets')).toBeNull()
    })

    test('presets={true} renders the default preset list', () => {
      render(<CxDateRangePicker aria-label="Trip dates" presets />)
      openCalendar()
      ;['Today', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Last Week', 'Last Month'].forEach(
        (label) => {
          expect(screen.getByRole('button', { name: label })).toBeInTheDocument()
        }
      )
    })

    test('a custom presets array overrides the default list', () => {
      const customPresets = [
        {
          label: 'Custom Range',
          range: { start: new CalendarDate(2026, 7, 1), end: new CalendarDate(2026, 7, 10) }
        }
      ]
      render(<CxDateRangePicker aria-label="Trip dates" presets={customPresets} />)
      openCalendar()
      expect(screen.getByRole('button', { name: 'Custom Range' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Today' })).toBeNull()
    })

    test('selecting a preset commits its range, fires onChange, and closes the calendar', () => {
      const onChange = vi.fn()
      const customPresets = [
        {
          label: 'Custom Range',
          range: { start: new CalendarDate(2026, 7, 1), end: new CalendarDate(2026, 7, 10) }
        }
      ]
      render(
        <CxDateRangePicker aria-label="Trip dates" onChange={onChange} presets={customPresets} />
      )
      openCalendar()
      fireEvent.click(screen.getByRole('button', { name: 'Custom Range' }))

      expect(onChange).toHaveBeenCalledWith({
        start: new CalendarDate(2026, 7, 1),
        end: new CalendarDate(2026, 7, 10)
      })
      expect(getCalendarWrapper()).toHaveAttribute('hidden')
    })

    test('has no axe violations with presets shown', async () => {
      render(<CxDateRangePicker aria-label="Trip dates" presets />)
      openCalendar()
      expect(
        await axe(document.body, { rules: { region: { enabled: false } } })
      ).toHaveNoViolations()
    })
  })

  describe('form integration', () => {
    test('creates a pair of hidden inputs for form submission when name is provided', () => {
      const { rerender } = render(
        <CxDateRangePicker
          aria-label="Trip dates"
          name="tripDates"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 7, 15) }}
        />
      )
      // eslint-disable-next-line testing-library/no-node-access
      const startInput = document.querySelector(
        'input[type="hidden"][name="tripDatesStart"]'
      ) as HTMLInputElement
      // eslint-disable-next-line testing-library/no-node-access
      const endInput = document.querySelector(
        'input[type="hidden"][name="tripDatesEnd"]'
      ) as HTMLInputElement
      expect(startInput.value).toBe('2026-07-10')
      expect(endInput.value).toBe('2026-07-15')

      rerender(
        <CxDateRangePicker
          aria-label="Trip dates"
          name="tripDates"
          value={{ start: new CalendarDate(2026, 8, 1), end: new CalendarDate(2026, 8, 5) }}
        />
      )
      expect(startInput.value).toBe('2026-08-01')
      expect(endInput.value).toBe('2026-08-05')
    })
  })

  describe('field wrapping', () => {
    test('renders no wrapper when label/help/feedback are all unset', () => {
      const { container } = render(<CxDateRangePicker aria-label="Trip dates" />)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector('.form-field')).toBeNull()
    })

    test('wraps in .form-field and associates the label via htmlFor when label is set', () => {
      render(<CxDateRangePicker label="Trip dates" />)
      const group = screen.getByRole('group', { name: 'Trip dates' })
      // eslint-disable-next-line testing-library/no-node-access
      expect(group.closest('.form-field')).not.toBeNull()
      expect(screen.getByText('Trip dates').tagName).toBe('LABEL')
    })

    test('renders invalid feedback and applies the is-invalid class only when invalid', () => {
      const { rerender } = render(
        <CxDateRangePicker aria-label="Trip dates" invalidFeedback="Required" />
      )
      expect(screen.queryByText('Required')).toBeNull()

      rerender(<CxDateRangePicker aria-label="Trip dates" invalid invalidFeedback="Required" />)
      const group = screen.getByRole('group', { name: 'Trip dates' })
      expect(screen.getByText('Required')).toHaveClass('invalid-feedback')
      expect(group).toHaveClass('is-invalid')
    })
  })

  describe('accessibility', () => {
    test('has no axe violations with the calendar open', async () => {
      render(
        <CxDateRangePicker
          aria-label="Trip dates"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 7, 15) }}
        />
      )
      openCalendar()
      expect(
        await axe(document.body, { rules: { region: { enabled: false } } })
      ).toHaveNoViolations()
    })
  })
})
