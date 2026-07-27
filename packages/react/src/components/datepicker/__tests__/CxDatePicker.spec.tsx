import * as React from 'react'
import { act, render, screen, fireEvent, within } from '@testing-library/react'
import { CalendarDate } from '@internationalized/date'

import { CxDatePicker } from '../../../index'

const openCalendar = () => {
  const toggle = screen.getByRole('button')
  act(() => {
    fireEvent.click(toggle)
  })
}

test('renders a labeled group with a segmented date field', () => {
  render(<CxDatePicker aria-label="Event date" />)
  expect(screen.getByRole('group', { name: 'Event date' })).toBeInTheDocument()
})

test('the calendar dialog is hidden until the toggle button is pressed', () => {
  render(<CxDatePicker aria-label="Event date" />)
  const dialog = document.querySelector('.cx-datepicker-calendar') as HTMLElement
  expect(dialog).toHaveAttribute('hidden')
  openCalendar()
  expect(dialog).not.toHaveAttribute('hidden')
  expect(screen.getByRole('grid')).toBeInTheDocument()
})

test('clicking a day cell selects it, fires onChange, and closes the calendar', () => {
  const onChange = vi.fn()
  render(
    <CxDatePicker
      aria-label="Event date"
      onChange={onChange}
      value={new CalendarDate(2026, 7, 24)}
    />
  )
  openCalendar()

  const grid = screen.getByRole('grid')
  fireEvent.click(within(grid).getByRole('button', { name: /15/ }))

  expect(onChange).toHaveBeenCalledWith(new CalendarDate(2026, 7, 15))
  const dialog = document.querySelector('.cx-datepicker-calendar') as HTMLElement
  expect(dialog).toHaveAttribute('hidden')
})

test('dates outside minValue/maxValue are disabled and cannot be selected', () => {
  const onChange = vi.fn()
  render(
    <CxDatePicker
      aria-label="Event date"
      maxValue={new CalendarDate(2026, 7, 20)}
      minValue={new CalendarDate(2026, 7, 10)}
      onChange={onChange}
      value={new CalendarDate(2026, 7, 15)}
    />
  )
  openCalendar()

  const grid = screen.getByRole('grid')
  const outOfRange = within(grid).getByRole('button', { name: /25/ })
  expect(outOfRange).toHaveAttribute('aria-disabled', 'true')
  fireEvent.click(outOfRange)
  expect(onChange).not.toHaveBeenCalled()
})

test('creates a hidden input for form submission when name is provided', () => {
  const { container, rerender } = render(
    <CxDatePicker aria-label="Event date" name="eventDate" value={new CalendarDate(2026, 7, 24)} />
  )
  const hidden = container.querySelector(
    'input[type="hidden"][name="eventDate"]'
  ) as HTMLInputElement
  expect(hidden).toBeInTheDocument()
  expect(hidden.value).toBe('2026-07-24')

  rerender(
    <CxDatePicker aria-label="Event date" name="eventDate" value={new CalendarDate(2026, 8, 1)} />
  )
  expect(hidden.value).toBe('2026-08-01')
})

test('supports controlled value reflected in the field segments', () => {
  const onChange = vi.fn()
  const { rerender } = render(
    <CxDatePicker
      aria-label="Event date"
      onChange={onChange}
      value={new CalendarDate(2026, 7, 24)}
    />
  )
  expect(screen.getByText('24')).toBeInTheDocument()

  rerender(
    <CxDatePicker
      aria-label="Event date"
      onChange={onChange}
      value={new CalendarDate(2026, 7, 25)}
    />
  )
  expect(screen.getByText('25')).toBeInTheDocument()
})
