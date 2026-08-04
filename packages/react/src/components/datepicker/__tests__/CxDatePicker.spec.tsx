import * as React from 'react'
import { act, render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CalendarDate } from '@internationalized/date'
import { axe } from 'jest-axe'

import { CxDatePicker } from '../../../index'

const openCalendar = () => {
  fireEvent.click(screen.getByRole('button'))
}

// The popover wrapper only toggles a `hidden` attribute and has no role of its own (the actual
// role="dialog" lives on the Calendar rendered inside it, only while open) - no accessible query
// reaches the wrapper itself. It's the first `.datepicker` in document order — the nested
// `CxCalendar` (also classed `.datepicker`, adopting chassis-css's real class name) only exists
// once the popover is open, and always renders after this one.
const getCalendarWrapper = () =>
  // eslint-disable-next-line testing-library/no-node-access
  document.querySelector('.datepicker') as HTMLElement

describe('CxDatePicker', () => {
  describe('rendering', () => {
    test('renders a labeled group with a segmented date field', () => {
      render(<CxDatePicker aria-label="Event date" />)
      expect(screen.getByRole('group', { name: 'Event date' })).toBeInTheDocument()
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
  })

  describe('open/close behavior', () => {
    test('the calendar dialog is hidden until the toggle button is pressed', () => {
      render(<CxDatePicker aria-label="Event date" />)
      const dialog = getCalendarWrapper()
      expect(dialog).toHaveAttribute('hidden')
      openCalendar()
      expect(dialog).not.toHaveAttribute('hidden')
      expect(screen.getByRole('grid')).toBeInTheDocument()
    })

    test('re-clicking the toggle button closes an open calendar', () => {
      render(<CxDatePicker aria-label="Event date" />)
      const toggle = screen.getByRole('button')
      const dialog = getCalendarWrapper()
      fireEvent.click(toggle)
      expect(dialog).not.toHaveAttribute('hidden')
      fireEvent.click(toggle)
      expect(dialog).toHaveAttribute('hidden')
    })

    test('pressing Escape while the calendar is open closes it', () => {
      render(<CxDatePicker aria-label="Event date" />)
      const dialog = getCalendarWrapper()
      openCalendar()
      expect(dialog).not.toHaveAttribute('hidden')
      fireEvent.keyDown(dialog, { key: 'Escape' })
      expect(dialog).toHaveAttribute('hidden')
    })

    // Regression coverage: `useOverlayPosition` (which `useOverlayPlacement` calls to position
    // the popover) also offers to close the overlay on any window scroll via `useCloseOnScroll`,
    // armed whenever a non-null `onClose` is passed. The popover should instead just reposition
    // with its trigger as the page scrolls, the same as `CxAutocomplete`'s panel.
    test('scrolling the window while the calendar is open does not close it', () => {
      render(<CxDatePicker aria-label="Event date" />)
      const dialog = getCalendarWrapper()
      openCalendar()
      expect(dialog).not.toHaveAttribute('hidden')
      fireEvent.scroll(window)
      expect(dialog).not.toHaveAttribute('hidden')
    })
  })

  describe('focus management', () => {
    // Tabbing inside the calendar triggers focus-ring bookkeeping in react-aria's
    // `useCalendarGrid`/`useFocus` (each hold their own `isFocusWithin`/`isFocused` state) as a
    // *direct* consequence of `user.tab`'s blur/focus dispatch - confirmed by capturing
    // `IS_REACT_ACT_ENVIRONMENT` at the exact moment React's warning fires: it read `true`, i.e.
    // user-event's own internal act-environment toggle (which only wraps `waitFor`, not this)
    // was not in effect here. `user.tab`/`user.click`/`user.keyboard` need an explicit `act(...)`
    // around them for these specific hooks' updates to be captured.
    test('focus moves into the calendar on open and is trapped there until it closes', async () => {
      const user = userEvent.setup()
      render(<CxDatePicker aria-label="Event date" value={new CalendarDate(2026, 7, 24)} />)
      const dialog = getCalendarWrapper()
      openCalendar()

      // Checking that focus is *somewhere inside* the dialog (not a specific element) has no
      // role/text-based query — .contains() against document.activeElement is the standard way.
      // eslint-disable-next-line testing-library/no-node-access
      expect(dialog.contains(document.activeElement)).toBe(true)

      // Shift+Tabbing past the first focusable element should wrap back inside the calendar
      // instead of escaping to the toggle button or the page behind it.
      for (let i = 0; i < 6; i += 1) {
        // eslint-disable-next-line testing-library/no-unnecessary-act -- see comment above
        await act(async () => {
          await user.tab({ shift: true })
        })
        // eslint-disable-next-line testing-library/no-node-access
        expect(dialog.contains(document.activeElement)).toBe(true)
      }
    })

    test('closing the calendar restores focus to the toggle button', async () => {
      const user = userEvent.setup()
      render(<CxDatePicker aria-label="Event date" />)
      const toggle = screen.getByRole('button')

      // `userEvent.click` (unlike `fireEvent.click`) focuses the element first, matching a real
      // click — required for `FocusScope`'s `restoreFocus` to have a toggle button to return to.
      // eslint-disable-next-line testing-library/no-unnecessary-act -- see comment above
      await act(async () => {
        await user.click(toggle)
      })
      // eslint-disable-next-line testing-library/no-unnecessary-act -- see comment above
      await act(async () => {
        await user.keyboard('{Escape}')
      })

      // document.activeElement is the standard way to read current focus; no Testing Library
      // query surfaces it.
      // eslint-disable-next-line testing-library/no-node-access
      await waitFor(() => expect(document.activeElement).toBe(toggle))
    })
  })

  describe('day selection', () => {
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
      expect(getCalendarWrapper()).toHaveAttribute('hidden')
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

    test('dates listed in unavailableDates cannot be selected from the calendar', () => {
      const onChange = vi.fn()
      render(
        <CxDatePicker
          aria-label="Event date"
          onChange={onChange}
          unavailableDates={['2026-07-25']}
          value={new CalendarDate(2026, 7, 15)}
        />
      )
      openCalendar()

      const grid = screen.getByRole('grid')
      const unavailable = within(grid).getByRole('button', { name: /25/ })
      // eslint-disable-next-line testing-library/no-node-access
      expect(unavailable.closest('.datepicker-date')).toHaveClass('datepicker-date-unavailable')
      fireEvent.click(unavailable)
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('firstDayOfWeek', () => {
    test('is forwarded to the calendar popover, defaulting to Monday', () => {
      render(<CxDatePicker aria-label="Event date" value={new CalendarDate(2026, 7, 24)} />)
      openCalendar()
      // eslint-disable-next-line testing-library/no-node-access
      expect(getCalendarWrapper().querySelector('.datepicker-week-day')).toHaveTextContent('M')
    })

    test('can be overridden', () => {
      render(
        <CxDatePicker
          aria-label="Event date"
          firstDayOfWeek="sun"
          value={new CalendarDate(2026, 7, 24)}
        />
      )
      openCalendar()
      // eslint-disable-next-line testing-library/no-node-access
      expect(getCalendarWrapper().querySelector('.datepicker-week-day')).toHaveTextContent('S')
    })
  })

  describe('visibleMonths', () => {
    test('passes through to the popover calendar', () => {
      render(
        <CxDatePicker
          aria-label="Event date"
          value={new CalendarDate(2026, 7, 24)}
          visibleMonths={2}
        />
      )
      openCalendar()
      expect(screen.getAllByRole('grid')).toHaveLength(2)
    })
  })

  describe('selectionMode multiple', () => {
    test('renders a labeled group with a read-only, comma-separated field', () => {
      render(
        <CxDatePicker
          aria-label="Event dates"
          selectionMode="multiple"
          value={[new CalendarDate(2026, 7, 5), new CalendarDate(2026, 7, 12)]}
        />
      )
      expect(screen.getByRole('group', { name: 'Event dates' })).toBeInTheDocument()
      expect(screen.getByText('Jul 5, 2026, Jul 12, 2026')).toBeInTheDocument()
    })

    test('renders nothing in the field when no dates are selected', () => {
      render(<CxDatePicker aria-label="Event dates" selectionMode="multiple" />)
      const group = screen.getByRole('group', { name: 'Event dates' })
      // eslint-disable-next-line testing-library/no-node-access
      expect(group.querySelector('.cx-datepicker-field')).toHaveTextContent('')
    })

    // Regression coverage: the popover calendar starts controlled with a real `[]` (not
    // `undefined`) before anything is picked — see `CxCalendar.spec.tsx`'s identical test for
    // why that specific shape used to crash react-stately's initial-focus computation.
    test('opening the popover with no dates selected yet renders the grid without crashing', () => {
      render(<CxDatePicker aria-label="Event dates" selectionMode="multiple" />)
      openCalendar()
      expect(screen.getByRole('grid')).toBeInTheDocument()
    })

    test('selecting dates in the popover updates the field and fires onChange, without closing the popover', () => {
      const onChange = vi.fn()
      render(
        <CxDatePicker
          aria-label="Event dates"
          defaultValue={[new CalendarDate(2026, 7, 5)]}
          onChange={onChange}
          selectionMode="multiple"
        />
      )
      openCalendar()

      const grid = screen.getByRole('grid')
      fireEvent.click(within(grid).getByRole('button', { name: /July 12, 2026/ }))
      expect(onChange).toHaveBeenCalledWith([
        new CalendarDate(2026, 7, 5),
        new CalendarDate(2026, 7, 12)
      ])
      expect(getCalendarWrapper()).not.toHaveAttribute('hidden')
    })

    test('supports uncontrolled defaultValue', () => {
      render(
        <CxDatePicker
          aria-label="Event dates"
          defaultValue={[new CalendarDate(2026, 7, 5)]}
          selectionMode="multiple"
        />
      )
      expect(screen.getByText('Jul 5, 2026')).toBeInTheDocument()
    })

    test('creates one hidden input per selected date when name is provided', () => {
      render(
        <CxDatePicker
          aria-label="Event dates"
          name="eventDates"
          selectionMode="multiple"
          value={[new CalendarDate(2026, 7, 5), new CalendarDate(2026, 7, 12)]}
        />
      )
      // eslint-disable-next-line testing-library/no-node-access
      const hiddenInputs = document.querySelectorAll('input[type="hidden"][name="eventDates"]')
      expect(Array.from(hiddenInputs).map((input) => (input as HTMLInputElement).value)).toEqual([
        '2026-07-05',
        '2026-07-12'
      ])
    })
  })

  describe('form integration', () => {
    test('creates a hidden input for form submission when name is provided', () => {
      const { rerender } = render(
        <CxDatePicker
          aria-label="Event date"
          name="eventDate"
          value={new CalendarDate(2026, 7, 24)}
        />
      )
      // Hidden inputs are intentionally excluded from the accessibility tree - no query reaches
      // them.
      // eslint-disable-next-line testing-library/no-node-access
      const hidden = document.querySelector(
        'input[type="hidden"][name="eventDate"]'
      ) as HTMLInputElement
      expect(hidden).toBeInTheDocument()
      expect(hidden.value).toBe('2026-07-24')

      rerender(
        <CxDatePicker
          aria-label="Event date"
          name="eventDate"
          value={new CalendarDate(2026, 8, 1)}
        />
      )
      expect(hidden.value).toBe('2026-08-01')
    })
  })

  describe('field wrapping', () => {
    test('renders no wrapper when label/help/feedback are all unset', () => {
      // The .form-field wrapper has no role/name, so its absence can only be checked by class.
      const { container } = render(<CxDatePicker aria-label="Event date" />)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector('.form-field')).toBeNull()
    })

    test('wraps in .form-field and associates the label via htmlFor when label is set', () => {
      render(<CxDatePicker label="Event date" />)
      const group = screen.getByRole('group', { name: 'Event date' })
      // Same class-only wrapper as above - no accessible query reaches it.
      // eslint-disable-next-line testing-library/no-node-access
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
      const { rerender } = render(
        <CxDatePicker aria-label="Event date" invalidFeedback="Required" />
      )
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
  })

  describe('accessibility', () => {
    test('has no axe violations with the calendar open', async () => {
      render(<CxDatePicker aria-label="Event date" value={new CalendarDate(2026, 7, 24)} />)
      openCalendar()
      // The calendar dialog portals to document.body, sibling to the field itself — neither
      // sits inside a page landmark in this isolated fixture, which trips axe's "region"
      // best-practice rule. That rule is about overall page structure, not anything
      // CxDatePicker controls.
      expect(
        await axe(document.body, { rules: { region: { enabled: false } } })
      ).toHaveNoViolations()
    })

    test('has no axe violations in multiple selection mode with the calendar open', async () => {
      render(
        <CxDatePicker
          aria-label="Event dates"
          selectionMode="multiple"
          value={[new CalendarDate(2026, 7, 5), new CalendarDate(2026, 7, 12)]}
        />
      )
      openCalendar()
      expect(
        await axe(document.body, { rules: { region: { enabled: false } } })
      ).toHaveNoViolations()
    })
  })
})
