import * as React from 'react'
import { act, render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CalendarDate } from '@internationalized/date'
import { axe } from 'jest-axe'

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

test('re-clicking the toggle button closes an open calendar', () => {
  render(<CxDatePicker aria-label="Event date" />)
  const toggle = screen.getByRole('button')
  const dialog = document.querySelector('.cx-datepicker-calendar') as HTMLElement
  act(() => {
    fireEvent.click(toggle)
  })
  expect(dialog).not.toHaveAttribute('hidden')
  act(() => {
    fireEvent.click(toggle)
  })
  expect(dialog).toHaveAttribute('hidden')
})

test('pressing Escape while the calendar is open closes it', () => {
  render(<CxDatePicker aria-label="Event date" />)
  const dialog = document.querySelector('.cx-datepicker-calendar') as HTMLElement
  openCalendar()
  expect(dialog).not.toHaveAttribute('hidden')
  fireEvent.keyDown(dialog, { key: 'Escape' })
  expect(dialog).toHaveAttribute('hidden')
})

test('focus moves into the calendar on open and is trapped there until it closes', async () => {
  const user = userEvent.setup()
  render(<CxDatePicker aria-label="Event date" value={new CalendarDate(2026, 7, 24)} />)
  const dialog = document.querySelector('.cx-datepicker-calendar') as HTMLElement
  openCalendar()

  expect(dialog.contains(document.activeElement)).toBe(true)

  // Shift+Tabbing past the first focusable element should wrap back inside the calendar
  // instead of escaping to the toggle button or the page behind it.
  for (let i = 0; i < 6; i += 1) {
    await user.tab({ shift: true })
    expect(dialog.contains(document.activeElement)).toBe(true)
  }
})

test('closing the calendar restores focus to the toggle button', async () => {
  const user = userEvent.setup()
  render(<CxDatePicker aria-label="Event date" />)
  const toggle = screen.getByRole('button')

  // `userEvent.click` (unlike `fireEvent.click`) focuses the element first, matching a real
  // click — required for `FocusScope`'s `restoreFocus` to have a toggle button to return to.
  await user.click(toggle)
  await user.keyboard('{Escape}')

  // `FocusScope` only restores focus once it observes focus having fallen back to `<body>`
  // (the browser's default when the focused element unmounts), which it checks for on the next
  // animation frame rather than synchronously.
  await waitFor(() => expect(document.activeElement).toBe(toggle))
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

test('has no axe violations with the calendar open', async () => {
  render(<CxDatePicker aria-label="Event date" value={new CalendarDate(2026, 7, 24)} />)
  openCalendar()
  // The calendar dialog portals to document.body, sibling to the field itself — neither sits
  // inside a page landmark in this isolated fixture, which trips axe's "region" best-practice
  // rule. That rule is about overall page structure, not anything CxDatePicker controls.
  expect(await axe(document.body, { rules: { region: { enabled: false } } })).toHaveNoViolations()
})

test('renders no wrapper when label/help/feedback are all unset', () => {
  const { container } = render(<CxDatePicker aria-label="Event date" />)
  expect(container.querySelector('.form-field')).toBeNull()
})

test('wraps in .form-field and associates the label via htmlFor when label is set', () => {
  render(<CxDatePicker label="Event date" />)
  const group = screen.getByRole('group', { name: 'Event date' })
  expect(group.closest('.form-field')).not.toBeNull()
  expect(screen.getByText('Event date').tagName).toBe('LABEL')
})

test('merges label association with a consumer-supplied aria-labelledby instead of dropping it', () => {
  render(
    <div>
      <span id="extra-label">Extra</span>
      <CxDatePicker aria-labelledby="extra-label" label="Event date" />
    </div>
  )
  expect(screen.getByRole('group', { name: 'Event date Extra' })).toBeInTheDocument()
})

test('renders help text and wires it into aria-describedby', () => {
  render(<CxDatePicker aria-label="Event date" help="Some help" />)
  const group = screen.getByRole('group', { name: 'Event date' })
  const help = screen.getByText('Some help')
  expect(help).toHaveClass('form-help')
  expect(group.getAttribute('aria-describedby')).toContain(help.id)
})

test('renders invalid feedback and wires it into aria-describedby and the is-invalid class only when invalid', () => {
  const { rerender } = render(<CxDatePicker aria-label="Event date" invalidFeedback="Required" />)
  expect(screen.queryByText('Required')).toBeNull()

  rerender(<CxDatePicker aria-label="Event date" invalid invalidFeedback="Required" />)
  const group = screen.getByRole('group', { name: 'Event date' })
  const feedback = screen.getByText('Required')
  expect(feedback).toHaveClass('invalid-feedback')
  expect(group.getAttribute('aria-describedby')).toContain(feedback.id)
  expect(group).toHaveClass('is-invalid')
})

test('renders valid feedback and applies the is-valid class only when valid', () => {
  render(<CxDatePicker aria-label="Event date" valid validFeedback="Looks good" />)
  const group = screen.getByRole('group', { name: 'Event date' })
  expect(screen.getByText('Looks good')).toHaveClass('valid-feedback')
  expect(group).toHaveClass('is-valid')
})
