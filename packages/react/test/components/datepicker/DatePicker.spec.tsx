import * as React from 'react'
import { act, render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  CalendarDate,
  CalendarDateTime,
  DateValue,
  parseZonedDateTime,
  ZonedDateTime
} from '@internationalized/date'
import { axe } from 'jest-axe'

import { DatePicker, I18nProvider } from '../../../src/index'
import { actUserEvent } from '../../actUserEvent'

const openCalendar = () => {
  fireEvent.click(screen.getByRole('button', { name: /calendar/i }))
}

// The popover wrapper only toggles a `hidden` attribute and has no role of its own (the actual
// role="dialog" lives on the Calendar rendered inside it, only while open) - no accessible query
// reaches the wrapper itself. It's the first `.datepicker` in document order — the nested
// `Calendar` (also classed `.datepicker`, adopting chassis-css's real class name) only exists
// once the popover is open, and always renders after this one.
const getCalendarWrapper = () =>
  // eslint-disable-next-line testing-library/no-node-access
  document.querySelector('.datepicker') as HTMLElement

describe('DatePicker', () => {
  describe('rendering', () => {
    test('renders a labeled group with a segmented date field', () => {
      render(<DatePicker aria-label="Event date" />)
      expect(screen.getByRole('group', { name: 'Event date' })).toBeInTheDocument()
    })

    test('supports controlled value reflected in the field segments', () => {
      const onChange = vi.fn()
      const { rerender } = render(
        <DatePicker
          aria-label="Event date"
          onChange={onChange}
          value={new CalendarDate(2026, 7, 24)}
        />
      )
      expect(screen.getByText('24')).toBeInTheDocument()

      rerender(
        <DatePicker
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
      render(<DatePicker aria-label="Event date" />)
      const dialog = getCalendarWrapper()
      expect(dialog).toHaveAttribute('hidden')
      openCalendar()
      expect(dialog).not.toHaveAttribute('hidden')
      expect(screen.getByRole('grid')).toBeInTheDocument()
    })

    test('re-clicking the toggle button closes an open calendar', () => {
      render(<DatePicker aria-label="Event date" />)
      const toggle = screen.getByRole('button', { name: /calendar/i })
      const dialog = getCalendarWrapper()
      fireEvent.click(toggle)
      expect(dialog).not.toHaveAttribute('hidden')
      fireEvent.click(toggle)
      expect(dialog).toHaveAttribute('hidden')
    })

    test('pressing Escape while the calendar is open closes it', () => {
      render(<DatePicker aria-label="Event date" />)
      const dialog = getCalendarWrapper()
      openCalendar()
      expect(dialog).not.toHaveAttribute('hidden')
      fireEvent.keyDown(dialog, { key: 'Escape' })
      expect(dialog).toHaveAttribute('hidden')
    })

    // Regression coverage: `useOverlay`'s `shouldCloseOnBlur` mechanism alone doesn't catch this —
    // it explicitly bails when the click target isn't focusable (focus lands on `document.body`
    // instead, the common case for a plain click on page content), relying on a separate
    // pointerdown-outside listener that `useOverlay` only wires up when `isDismissable` is true.
    // `userEvent.click` (not `fireEvent.click`) is required here — it's the one that actually
    // simulates the browser's real focus-shifting-to-body behavior on a click.
    //
    // Both clicks go through `actUserEvent` (see `actUserEvent.ts`) — the same `usePress`/overlay-
    // position state updates flagged in the "focus management" describe block below land outside
    // `act()`'s tracked environment here too, and a plain `act()` wrapper isn't enough to catch
    // them.
    test('a real click on plain page content outside the calendar closes it', async () => {
      const user = userEvent.setup()
      render(
        <div>
          <DatePicker aria-label="Event date" />
          <p>Some page content</p>
        </div>
      )
      const dialog = getCalendarWrapper()
      await actUserEvent(() => user.click(screen.getByRole('button', { name: /calendar/i })))
      expect(dialog).not.toHaveAttribute('hidden')
      await actUserEvent(() => user.click(screen.getByText('Some page content')))
      expect(dialog).toHaveAttribute('hidden')
    })

    // Regression coverage: `useOverlayPosition` (which `useOverlayPlacement` calls to position
    // the popover) also offers to close the overlay on any window scroll via `useCloseOnScroll`,
    // armed whenever a non-null `onClose` is passed. The popover should instead just reposition
    // with its trigger as the page scrolls, the same as `Autocomplete`'s panel.
    test('scrolling the window while the calendar is open does not close it', () => {
      render(<DatePicker aria-label="Event date" />)
      const dialog = getCalendarWrapper()
      openCalendar()
      expect(dialog).not.toHaveAttribute('hidden')
      fireEvent.scroll(window)
      expect(dialog).not.toHaveAttribute('hidden')
    })

    test('defaultVisible renders the calendar already open', () => {
      render(<DatePicker aria-label="Event date" defaultVisible />)
      expect(getCalendarWrapper()).not.toHaveAttribute('hidden')
    })

    test('visible controls the calendar and onVisibleChange reports toggle attempts without opening it', () => {
      const onVisibleChange = vi.fn()
      const { rerender } = render(
        <DatePicker aria-label="Event date" visible={false} onVisibleChange={onVisibleChange} />
      )
      fireEvent.click(screen.getByRole('button', { name: /calendar/i }))
      expect(onVisibleChange).toHaveBeenCalledWith(true)
      expect(getCalendarWrapper()).toHaveAttribute('hidden')

      rerender(<DatePicker aria-label="Event date" visible onVisibleChange={onVisibleChange} />)
      expect(getCalendarWrapper()).not.toHaveAttribute('hidden')
    })
  })

  // Rendered in place, the calendar was clipped by any ancestor that scrolls, which scrolled
  // instead of the calendar covering what is under it.
  describe('portal', () => {
    test.for(['single', 'multiple'] as const)(
      'a %s-selection calendar is portaled out of a scrolling ancestor',
      (selectionMode) => {
        render(
          <div aria-label="Scroller" role="region" style={{ overflow: 'auto' }}>
            <DatePicker aria-label="Event date" selectionMode={selectionMode} />
          </div>
        )
        fireEvent.click(screen.getByRole('button', { name: /calendar/i }))
        expect(screen.getByRole('region', { name: 'Scroller' })).not.toContainElement(
          screen.getByRole('grid')
        )
      }
    )

    test('in an open dialog, the calendar is portaled into that dialog', () => {
      render(
        <dialog aria-label="Booking" open>
          <DatePicker aria-label="Event date" />
        </dialog>
      )
      fireEvent.click(screen.getByRole('button', { name: /calendar/i }))
      expect(screen.getByRole('dialog', { name: 'Booking' })).toContainElement(
        screen.getByRole('grid')
      )
    })
  })

  describe('clearing', () => {
    test('no clear button when there is nothing selected', () => {
      render(<DatePicker aria-label="Event date" />)
      expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument()
    })

    test('clicking the clear button resets the value and fires onChange with null', () => {
      const onChange = vi.fn()
      render(
        <DatePicker
          aria-label="Event date"
          onChange={onChange}
          value={new CalendarDate(2026, 7, 24)}
        />
      )
      fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
      expect(onChange).toHaveBeenCalledWith(null)
    })

    test('no clear button when disabled, even with a value', () => {
      render(<DatePicker aria-label="Event date" disabled value={new CalendarDate(2026, 7, 24)} />)
      expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument()
    })

    test('multiple selection: clicking the clear button empties the selection', () => {
      const onChange = vi.fn()
      render(
        <DatePicker
          aria-label="Event dates"
          onChange={onChange}
          selectionMode="multiple"
          value={[new CalendarDate(2026, 7, 5), new CalendarDate(2026, 7, 12)]}
        />
      )
      fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
      expect(onChange).toHaveBeenCalledWith([])
    })

    // Regression coverage: the clear button unmounts itself the moment the value it's clearing
    // becomes empty — without an explicit refocus, that drops focus to `document.body` (the same
    // failure mode `CalendarMonthYearPicker`'s view switch had — see its own comment). Needs an
    // actually-clearing (uncontrolled) picker, unlike the tests above — a controlled `value` that
    // the test never updates never causes the button to unmount in the first place.
    test('clicking the clear button moves focus to the calendar toggle button, not the document body', async () => {
      const user = userEvent.setup()
      render(<DatePicker aria-label="Event date" defaultValue={new CalendarDate(2026, 7, 24)} />)
      await actUserEvent(() => user.click(screen.getByRole('button', { name: 'Clear' })))
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument()
      })
      expect(screen.getByRole('button', { name: /calendar/i })).toHaveFocus()
    })

    test('multiple selection: clicking the clear button moves focus to the calendar toggle button', async () => {
      const user = userEvent.setup()
      render(
        <DatePicker
          aria-label="Event dates"
          defaultValue={[new CalendarDate(2026, 7, 5)]}
          selectionMode="multiple"
        />
      )
      await actUserEvent(() => user.click(screen.getByRole('button', { name: 'Clear' })))
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument()
      })
      expect(screen.getByRole('button', { name: /calendar/i })).toHaveFocus()
    })
  })

  describe('focus management', () => {
    // Tabbing inside the calendar triggers focus-ring bookkeeping in react-aria's
    // `useCalendarGrid`/`useFocus` (each hold their own `isFocusWithin`/`isFocused` state) as a
    // *direct* consequence of `user.tab`'s blur/focus dispatch. A plain `act()` wrapper around
    // `user.tab`/`user.click`/`user.keyboard` isn't enough to catch these specific hooks' updates
    // — see `actUserEvent.ts` for why (`@testing-library/dom`'s `asyncWrapper`, which every
    // `userEvent` method routes through, force-disables `act()`'s environment flag for its own
    // duration; `actUserEvent` neutralizes that just for the call).
    test('focus moves into the calendar on open and is trapped there until it closes', async () => {
      const user = userEvent.setup()
      render(<DatePicker aria-label="Event date" value={new CalendarDate(2026, 7, 24)} />)
      const dialog = getCalendarWrapper()
      openCalendar()

      // Checking that focus is *somewhere inside* the dialog (not a specific element) has no
      // role/text-based query — .contains() against document.activeElement is the standard way.
      // eslint-disable-next-line testing-library/no-node-access
      expect(dialog.contains(document.activeElement)).toBe(true)

      // Shift+Tabbing past the first focusable element should wrap back inside the calendar
      // instead of escaping to the toggle button or the page behind it.
      for (let i = 0; i < 6; i += 1) {
        await actUserEvent(() => user.tab({ shift: true }))
        // eslint-disable-next-line testing-library/no-node-access
        expect(dialog.contains(document.activeElement)).toBe(true)
      }
    })

    test('closing the calendar restores focus to the toggle button', async () => {
      const user = userEvent.setup()
      render(<DatePicker aria-label="Event date" />)
      const toggle = screen.getByRole('button', { name: /calendar/i })

      // `userEvent.click` (unlike `fireEvent.click`) focuses the element first, matching a real
      // click — required for `FocusScope`'s `restoreFocus` to have a toggle button to return to.
      await actUserEvent(() => user.click(toggle))
      await actUserEvent(() => user.keyboard('{Escape}'))

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
        <DatePicker
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
        <DatePicker
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
        <DatePicker
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

  describe('unavailableDates', () => {
    test('a value on a listed date marks the field invalid', () => {
      render(
        <DatePicker
          aria-label="Event date"
          defaultValue={new CalendarDate(2026, 7, 15)}
          unavailableDates={['2026-07-15']}
        />
      )
      expect(screen.getByRole('group', { name: 'Event date' })).toHaveClass('is-invalid')
    })

    // The value's own `toString()` carries its time, which no `YYYY-MM-DD` entry matched.
    test('a value with a time on a listed date marks the field invalid too', () => {
      render(
        <DatePicker
          aria-label="Event date"
          defaultValue={new CalendarDateTime(2026, 7, 15, 9, 30)}
          unavailableDates={['2026-07-15']}
        />
      )
      expect(screen.getByRole('group', { name: 'Event date' })).toHaveClass('is-invalid')
    })
  })

  describe('labels', () => {
    test("calendar names the trigger in place of the locale's own name", () => {
      render(
        <DatePicker
          aria-label="Date de départ"
          defaultValue={new CalendarDate(2026, 7, 15)}
          labels={{ calendar: 'Calendrier', clear: 'Effacer' }}
        />
      )
      expect(screen.getByRole('button', { name: /^Calendrier/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Effacer' })).toBeInTheDocument()
    })

    test('the trigger keeps the name of the locale without one', () => {
      render(
        <I18nProvider locale="fr-FR">
          <DatePicker aria-label="Date de départ" />
        </I18nProvider>
      )
      expect(screen.getByRole('button', { name: /^Calendrier/ })).toBeInTheDocument()
    })
  })

  describe('firstDayOfWeek', () => {
    test('is forwarded to the calendar popover, defaulting to Monday', () => {
      render(<DatePicker aria-label="Event date" value={new CalendarDate(2026, 7, 24)} />)
      openCalendar()
      // eslint-disable-next-line testing-library/no-node-access
      expect(getCalendarWrapper().querySelector('.datepicker-week-day')).toHaveTextContent('M')
    })

    test('can be overridden', () => {
      render(
        <DatePicker
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
        <DatePicker
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
        <DatePicker
          aria-label="Event dates"
          selectionMode="multiple"
          value={[new CalendarDate(2026, 7, 5), new CalendarDate(2026, 7, 12)]}
        />
      )
      expect(screen.getByRole('group', { name: 'Event dates' })).toBeInTheDocument()
      expect(screen.getByText('Jul 5, 2026, Jul 12, 2026')).toBeInTheDocument()
    })

    test('renders nothing in the field when no dates are selected', () => {
      render(<DatePicker aria-label="Event dates" selectionMode="multiple" />)
      const group = screen.getByRole('group', { name: 'Event dates' })
      // eslint-disable-next-line testing-library/no-node-access
      expect(group.querySelector('.datepicker-field')).toHaveTextContent('')
    })

    // Regression coverage: the popover calendar starts controlled with a real `[]` (not
    // `undefined`) before anything is picked — see `Calendar.spec.tsx`'s identical test for
    // why that specific shape used to crash react-stately's initial-focus computation.
    test('opening the popover with no dates selected yet renders the grid without crashing', () => {
      render(<DatePicker aria-label="Event dates" selectionMode="multiple" />)
      openCalendar()
      expect(screen.getByRole('grid')).toBeInTheDocument()
    })

    test('selecting dates in the popover updates the field and fires onChange, without closing the popover', () => {
      const onChange = vi.fn()
      render(
        <DatePicker
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
        <DatePicker
          aria-label="Event dates"
          defaultValue={[new CalendarDate(2026, 7, 5)]}
          selectionMode="multiple"
        />
      )
      expect(screen.getByText('Jul 5, 2026')).toBeInTheDocument()
    })

    // Each value is far enough from UTC that its instant falls on another day in any one viewer's
    // time zone: the field shows the day the value itself is on.
    test('shows a ZonedDateTime on its own day, whatever the time zone of the viewer', () => {
      render(
        <DatePicker
          aria-label="Event dates"
          selectionMode="multiple"
          value={[
            parseZonedDateTime('2026-07-15T00:30[Pacific/Kiritimati]'),
            parseZonedDateTime('2026-07-17T23:30[Pacific/Pago_Pago]')
          ]}
        />
      )
      expect(screen.getByRole('group', { name: 'Event dates' })).toHaveTextContent(
        'Jul 15, 2026, Jul 17, 2026'
      )
    })

    test('creates one hidden input per selected date when name is provided', () => {
      render(
        <DatePicker
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

    test('the toggle button is disabled and cannot open the popover when the picker is disabled', () => {
      render(
        <DatePicker
          aria-label="Event dates"
          disabled
          selectionMode="multiple"
          value={[new CalendarDate(2026, 7, 5)]}
        />
      )
      const toggle = screen.getByRole('button', { name: /calendar/i })
      expect(toggle).toBeDisabled()

      fireEvent.click(toggle)
      expect(getCalendarWrapper()).toHaveAttribute('hidden')
    })

    test('the popover calendar dialog is labelled by the field label, not just the visible month', () => {
      render(
        <DatePicker
          aria-label="Event dates"
          selectionMode="multiple"
          value={[new CalendarDate(2026, 7, 5)]}
        />
      )
      openCalendar()
      expect(screen.getByRole('dialog', { name: /Event dates/ })).toBeInTheDocument()
    })
  })

  describe('time', () => {
    const segmentText = () =>
      screen.getAllByRole('spinbutton').map((segment) => segment.textContent)

    // Hidden inputs are excluded from the accessibility tree - no query reaches them.
    const getHiddenInput = (name: string) =>
      // eslint-disable-next-line testing-library/no-node-access
      document.querySelector(`input[type="hidden"][name="${name}"]`) as HTMLInputElement

    test('granularity adds the time segments to an empty field', () => {
      render(<DatePicker aria-label="Start" granularity="minute" />)
      expect(screen.getByRole('spinbutton', { name: /^hour/ })).toBeInTheDocument()
      expect(screen.getByRole('spinbutton', { name: /^minute/ })).toBeInTheDocument()
      expect(screen.queryByRole('spinbutton', { name: /^second/ })).toBeNull()
    })

    test('a value with a time shows it without a granularity', () => {
      render(<DatePicker aria-label="Start" value={new CalendarDateTime(2024, 3, 15, 9, 5)} />)
      expect(segmentText()).toEqual(['3', '15', '2024', '9', '05', 'AM'])
    })

    test('hourCycle and shouldForceLeadingZeros change how the time is written', () => {
      render(
        <DatePicker
          aria-label="Start"
          defaultValue={new CalendarDateTime(2024, 3, 5, 14, 5)}
          hourCycle={24}
          shouldForceLeadingZeros
        />
      )
      expect(segmentText()).toEqual(['03', '05', '2024', '14', '05'])
    })

    test('picking a day in the calendar keeps the time', () => {
      const onChange = vi.fn()
      render(
        <DatePicker
          aria-label="Start"
          defaultValue={new CalendarDateTime(2024, 3, 15, 9, 30)}
          onChange={onChange}
        />
      )
      openCalendar()
      fireEvent.click(screen.getByRole('button', { name: /March 20, 2024/ }))
      expect(onChange).toHaveBeenCalledTimes(1)
      const value = onChange.mock.calls[0]![0]
      expect(value).toBeInstanceOf(CalendarDateTime)
      expect(value.toString()).toBe('2024-03-20T09:30:00')
      expect(segmentText()).toEqual(['3', '20', '2024', '9', '30', 'AM'])
    })

    test('a day picked in an empty field takes the time and type of placeholderValue', () => {
      const onChange = vi.fn()
      render(
        <DatePicker
          aria-label="Start"
          granularity="minute"
          onChange={onChange}
          placeholderValue={parseZonedDateTime('2024-03-01T09:00[Asia/Tokyo]')}
        />
      )
      openCalendar()
      fireEvent.click(screen.getByRole('button', { name: /March 20, 2024/ }))
      const value = onChange.mock.calls[0]![0]
      expect(value).toBeInstanceOf(ZonedDateTime)
      expect(value.toString()).toBe('2024-03-20T09:00:00+09:00[Asia/Tokyo]')
    })

    test('a day picked in an empty field without placeholderValue starts at midnight', () => {
      const onChange = vi.fn()
      render(
        <DatePicker aria-label="Start" defaultVisible granularity="minute" onChange={onChange} />
      )
      const [firstDay] = screen
        .getAllByRole('button')
        .filter((button) => /\b1, \d{4}$/.test(button.getAttribute('aria-label') ?? ''))
      fireEvent.click(firstDay!)
      const value = onChange.mock.calls[0]![0]
      expect(value).toBeInstanceOf(CalendarDateTime)
      expect([value.hour, value.minute]).toEqual([0, 0])
    })

    test('a cleared zoned value stays zoned only with a zoned placeholderValue', () => {
      const Controlled = ({ placeholderValue }: { placeholderValue?: ZonedDateTime }) => {
        const [value, setValue] = React.useState<DateValue | null>(
          parseZonedDateTime('2024-03-15T09:30[Asia/Tokyo]')
        )
        return (
          <DatePicker
            aria-label="Call"
            onChange={setValue}
            placeholderValue={placeholderValue}
            value={value}
          />
        )
      }
      // With no placeholder, the calendar opens on today's month: pick its 10th.
      const pickAfterClearing = () => {
        fireEvent.click(screen.getByRole('button', { name: /clear/i }))
        openCalendar()
        const [tenth] = screen
          .getAllByRole('button')
          .filter((button) => /\b10, \d{4}$/.test(button.getAttribute('aria-label') ?? ''))
        fireEvent.click(tenth!)
      }

      const { unmount } = render(
        <Controlled placeholderValue={parseZonedDateTime('2024-03-01T09:00[Asia/Tokyo]')} />
      )
      pickAfterClearing()
      expect(screen.getByRole('group', { name: 'Call' })).toHaveTextContent('GMT+9')
      unmount()

      // react-stately builds the time from `defaultValue`/`placeholderValue`, not the value that
      // was cleared: midnight, with no zone. The docs say so.
      render(<Controlled />)
      pickAfterClearing()
      expect(screen.getByRole('group', { name: 'Call' })).not.toHaveTextContent('GMT+9')
      expect(segmentText().slice(3)).toEqual(['12', '00', 'AM'])
    })

    test("the literal between the date and the time loses the segment's padding, a date's own keep it", () => {
      render(
        <I18nProvider locale="ko-KR">
          <DatePicker aria-label="Start" value={new CalendarDateTime(2024, 3, 15, 9, 5)} />
        </I18nProvider>
      )
      // "2024. 3. 15. 오전 9:05": the first two ". " are the date's, the third stands between the
      // date and the time. Literal segments have no role; only their class tells them apart.
      const literals = Array.from(
        // eslint-disable-next-line testing-library/no-node-access
        screen.getByRole('group', { name: 'Start' }).querySelectorAll('span')
      ).filter((span) => span.textContent === '. ')
      expect(literals.map((literal) => literal.classList.contains('datepicker-segment'))).toEqual([
        true,
        true,
        false
      ])
    })

    test('the hidden input holds the date and time, with the zone of a ZonedDateTime', () => {
      const { rerender } = render(
        <DatePicker
          aria-label="Start"
          name="start"
          value={new CalendarDateTime(2024, 3, 15, 9, 30)}
        />
      )
      expect(getHiddenInput('start').value).toBe('2024-03-15T09:30:00')

      rerender(
        <DatePicker
          aria-label="Start"
          name="start"
          value={parseZonedDateTime('2024-03-15T09:30[Asia/Tokyo]')}
        />
      )
      expect(getHiddenInput('start').value).toBe('2024-03-15T09:30:00+09:00[Asia/Tokyo]')
    })

    test('a ZonedDateTime shows its time zone unless hideTimeZone', () => {
      const value = parseZonedDateTime('2024-03-15T09:30[Asia/Tokyo]')
      const { rerender } = render(<DatePicker aria-label="Start" value={value} />)
      const group = screen.getByRole('group', { name: 'Start' })
      expect(group).toHaveTextContent('GMT+9')

      rerender(<DatePicker aria-label="Start" hideTimeZone value={value} />)
      expect(group).not.toHaveTextContent('GMT+9')
    })

    test('the day of minValue stays selectable, and a time before it marks the field invalid', () => {
      const minValue = new CalendarDateTime(2024, 3, 15, 10, 0)
      const { rerender } = render(
        <DatePicker
          aria-label="Start"
          invalidFeedback="Too early"
          minValue={minValue}
          valid
          value={new CalendarDateTime(2024, 3, 15, 11, 0)}
        />
      )
      const group = screen.getByRole('group', { name: 'Start' })
      expect(group).toHaveClass('is-valid')
      expect(screen.queryByText('Too early')).toBeNull()

      openCalendar()
      expect(screen.getByRole('button', { name: /March 15, 2024/ })).not.toHaveAttribute(
        'aria-disabled'
      )
      expect(screen.getByRole('button', { name: /March 14, 2024/ })).toHaveAttribute(
        'aria-disabled',
        'true'
      )

      rerender(
        <DatePicker
          aria-label="Start"
          invalidFeedback="Too early"
          minValue={minValue}
          valid
          value={new CalendarDateTime(2024, 3, 15, 9, 0)}
        />
      )
      expect(group).toHaveClass('is-invalid')
      expect(group).not.toHaveClass('is-valid')
      expect(group.getAttribute('aria-describedby')).toContain(screen.getByText('Too early').id)
    })

    test('an out-of-range date shows invalid even with invalid={false}', () => {
      render(
        <DatePicker
          aria-label="Start"
          invalid={false}
          maxValue={new CalendarDate(2024, 3, 10)}
          value={new CalendarDate(2024, 3, 15)}
        />
      )
      expect(screen.getByRole('group', { name: 'Start' })).toHaveClass('is-invalid')
    })

    test('invalid reaches the segments as aria-invalid', () => {
      render(<DatePicker aria-label="Start" invalid value={new CalendarDate(2024, 3, 15)} />)
      for (const segment of screen.getAllByRole('spinbutton')) {
        expect(segment).toHaveAttribute('aria-invalid', 'true')
      }
    })

    test('follows a 24-hour locale', () => {
      render(
        <I18nProvider locale="de-DE">
          <DatePicker aria-label="Start" value={new CalendarDateTime(2024, 3, 15, 14, 5)} />
        </I18nProvider>
      )
      expect(segmentText()).toEqual(['15', '3', '2024', '14', '05'])
    })

    test('has no axe violations with a time and the calendar open', async () => {
      render(
        <DatePicker
          aria-label="Start"
          defaultVisible
          value={parseZonedDateTime('2024-03-15T09:30[Asia/Tokyo]')}
        />
      )
      // See the accessibility tests below for why "region" is off.
      expect(
        await axe(document.body, { rules: { region: { enabled: false } } })
      ).toHaveNoViolations()
    })
  })

  describe('form integration', () => {
    test('creates a hidden input for form submission when name is provided', () => {
      const { rerender } = render(
        <DatePicker
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
        <DatePicker aria-label="Event date" name="eventDate" value={new CalendarDate(2026, 8, 1)} />
      )
      expect(hidden.value).toBe('2026-08-01')
    })
  })

  // react-stately's picker state has no reset of its own: after an edit and a reset, the form
  // still submitted the edited date.
  describe('form reset', () => {
    test('puts the date back to its first value', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(
        <form aria-label="Event">
          <DatePicker
            aria-label="Event date"
            defaultValue={new CalendarDate(2024, 3, 15)}
            name="date"
            onChange={onChange}
          />
          <button type="reset">Reset</button>
        </form>
      )
      const form = screen.getByRole<HTMLFormElement>('form', { name: 'Event' })
      await user.click(screen.getByRole('spinbutton', { name: /^month/ }))
      await user.keyboard('{ArrowUp}')
      expect(new FormData(form).get('date')).toBe('2024-04-15')

      await user.click(screen.getByRole('button', { name: 'Reset' }))
      expect(new FormData(form).get('date')).toBe('2024-03-15')
      expect(onChange).toHaveBeenLastCalledWith(new CalendarDate(2024, 3, 15))
    })

    test('puts a controlled date back to its first value through onChange', async () => {
      const user = userEvent.setup()
      const Wrapper = () => {
        const [value, setValue] = React.useState<DateValue | null>(new CalendarDate(2024, 3, 15))
        return (
          <form aria-label="Event">
            <DatePicker aria-label="Event date" name="date" onChange={setValue} value={value} />
            <button type="reset">Reset</button>
          </form>
        )
      }
      render(<Wrapper />)
      const form = screen.getByRole<HTMLFormElement>('form', { name: 'Event' })
      await user.click(screen.getByRole('spinbutton', { name: /^month/ }))
      await user.keyboard('{ArrowUp}')
      expect(new FormData(form).get('date')).toBe('2024-04-15')

      await user.click(screen.getByRole('button', { name: 'Reset' }))
      expect(new FormData(form).get('date')).toBe('2024-03-15')
    })
  })

  // The picker had no `required` at all: nothing marked it for a screen reader, and its value
  // input was `type="hidden"`, which a form doesn't validate, so an empty one was submitted.
  describe('required', () => {
    const Booking = ({
      onSubmit = () => undefined,
      ...props
    }: React.ComponentProps<typeof DatePicker> & { onSubmit?: () => void }) => (
      <form
        aria-label="Booking"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <DatePicker invalidFeedback="Pick a day." label="Day" name="day" {...props} />
        <button type="submit">Save</button>
        <button type="reset">Reset</button>
      </form>
    )
    const form = () => screen.getByRole<HTMLFormElement>('form', { name: 'Booking' })
    const group = () => screen.getByRole('group', { name: 'Day' })
    const save = () => screen.getByRole('button', { name: 'Save' })
    const month = () => screen.getByRole('spinbutton', { name: /^month/ })
    // `checkValidity()` fires `invalid` at the picker's input, as a submit does, and the picker
    // marks itself on it: a state update.
    const checkValidity = () => {
      let valid = true
      act(() => {
        valid = form().checkValidity()
      })
      return valid
    }
    const submitted = () => [...new FormData(form()).entries()]
    // What each case below is told apart from: an empty required picker, which holds its form
    // back. Rendered first, then the case in its place.
    const insteadOfEmpty = (ui: React.ReactElement, empty = <Booking required />) => {
      const { unmount } = render(empty)
      expect(checkValidity()).toBe(false)
      unmount()
      return render(ui)
    }

    describe('single', () => {
      test('an empty required picker holds its form back, and takes focus', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()
        render(<Booking onSubmit={onSubmit} required />)

        expect(checkValidity()).toBe(false)
        await user.click(save())
        expect(onSubmit).not.toHaveBeenCalled()
        expect(month()).toHaveFocus()
      })

      test('says it is required on every segment', () => {
        const { rerender } = render(<Booking required />)
        for (const segment of screen.getAllByRole('spinbutton')) {
          expect(segment).toHaveAttribute('aria-required', 'true')
        }
        rerender(<Booking />)
        for (const segment of screen.getAllByRole('spinbutton')) {
          expect(segment).not.toHaveAttribute('aria-required')
        }
      })

      test('a partly filled one still holds it back', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()
        render(<Booking onSubmit={onSubmit} required />)
        await user.click(month())
        await user.keyboard('0724')

        await user.click(save())
        expect(onSubmit).not.toHaveBeenCalled()
      })

      test('submits once a date is typed', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()
        render(<Booking onSubmit={onSubmit} required />)
        expect(checkValidity()).toBe(false)
        await user.click(month())
        await user.keyboard('07242026')

        expect(checkValidity()).toBe(true)
        await user.click(save())
        expect(onSubmit).toHaveBeenCalledTimes(1)
        expect(submitted()).toEqual([['day', '2026-07-24']])
      })

      test('submits a value it was given', () => {
        insteadOfEmpty(<Booking defaultValue={new CalendarDate(2026, 7, 24)} required />)
        expect(checkValidity()).toBe(true)
        expect(submitted()).toEqual([['day', '2026-07-24']])
      })

      test('a disabled one holds nothing back', () => {
        insteadOfEmpty(<Booking disabled required />)
        expect(checkValidity()).toBe(true)
      })

      test('a picker that is not required submits empty', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()
        insteadOfEmpty(<Booking onSubmit={onSubmit} />)
        expect(checkValidity()).toBe(true)
        await user.click(save())
        expect(onSubmit).toHaveBeenCalledTimes(1)
        expect(submitted()).toEqual([['day', '']])
      })

      test('holds the form back with no name, and submits nothing of its own', async () => {
        const user = userEvent.setup()
        render(<Booking name={undefined} required />)
        expect(checkValidity()).toBe(false)

        await user.click(month())
        await user.keyboard('07242026')
        expect(checkValidity()).toBe(true)
        expect(submitted()).toEqual([])
      })

      // `invalid` is how the picker looks, as on every other field: it holds nothing back.
      test('invalid alone holds nothing back', () => {
        insteadOfEmpty(<Booking defaultValue={new CalendarDate(2026, 7, 24)} invalid required />)
        expect(checkValidity()).toBe(true)
      })

      // The browser has no bubble to show on an input that isn't displayed.
      describe('after a submit it held back', () => {
        test('shows as invalid, with the feedback, as `invalid` shows it', async () => {
          const user = userEvent.setup()
          render(<Booking required />)
          expect(group()).not.toHaveClass('is-invalid')
          expect(screen.queryByText('Pick a day.')).not.toBeInTheDocument()

          await user.click(save())
          expect(group()).toHaveClass('form-input', 'is-invalid')
          expect(screen.getByText('Pick a day.')).toHaveClass('invalid-feedback')
          expect(group()).toHaveAccessibleDescription('Pick a day.')
          for (const segment of screen.getAllByRole('spinbutton')) {
            expect(segment).toHaveAttribute('aria-invalid', 'true')
            expect(segment).toHaveAccessibleDescription('Pick a day.')
          }
        })

        test('`checkValidity()` marks it too', () => {
          render(<Booking required />)
          expect(checkValidity()).toBe(false)
          expect(group()).toHaveClass('is-invalid')
        })

        test('clears once a date is typed', async () => {
          const user = userEvent.setup()
          render(<Booking required />)
          await user.click(save())
          await user.keyboard('0724')
          expect(group()).toHaveClass('is-invalid')

          await user.keyboard('2026')
          expect(group()).not.toHaveClass('is-invalid')
          expect(screen.queryByText('Pick a day.')).not.toBeInTheDocument()
          for (const segment of screen.getAllByRole('spinbutton')) {
            expect(segment).not.toHaveAttribute('aria-invalid')
          }
        })

        test('clears once a day is picked in the calendar', async () => {
          const user = userEvent.setup()
          render(<Booking placeholderValue={new CalendarDate(2026, 7, 1)} required />)
          await user.click(save())
          expect(group()).toHaveClass('is-invalid')

          openCalendar()
          fireEvent.click(within(screen.getByRole('grid')).getByRole('button', { name: / 15, / }))
          expect(submitted()).toEqual([['day', '2026-07-15']])
          expect(group()).not.toHaveClass('is-invalid')
        })

        test("clears on the form's reset, and still holds the form back", async () => {
          const user = userEvent.setup()
          render(<Booking required />)
          await user.click(save())
          expect(group()).toHaveClass('is-invalid')

          await user.click(screen.getByRole('button', { name: 'Reset' }))
          expect(group()).not.toHaveClass('is-invalid')
          expect(screen.queryByText('Pick a day.')).not.toBeInTheDocument()
          expect(checkValidity()).toBe(false)
        })

        // The caller's own state wins: `invalid` once it is set, to `false` too, and `valid`.
        test.each([
          ['invalid={false}', { invalid: false }],
          ['valid', { valid: true }]
        ])('%s keeps the picker as the caller shows it', async (_name, props) => {
          const user = userEvent.setup()
          const onSubmit = vi.fn()
          const { rerender } = render(<Booking onSubmit={onSubmit} required {...props} />)
          await user.click(save())
          expect(onSubmit).not.toHaveBeenCalled()
          expect(group()).not.toHaveClass('is-invalid')
          expect(screen.queryByText('Pick a day.')).not.toBeInTheDocument()

          // The submit was held back all the same: the mark shows once the caller lets go.
          rerender(<Booking onSubmit={onSubmit} required />)
          expect(group()).toHaveClass('is-invalid')
        })

        test('has no axe violations while marked, and logs no error', async () => {
          const user = userEvent.setup()
          const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
          const { container } = render(<Booking required />)
          await user.click(save())
          expect(group()).toHaveClass('is-invalid')
          expect(await axe(container)).toHaveNoViolations()
          expect(consoleError).not.toHaveBeenCalled()
          consoleError.mockRestore()
        })
      })
    })

    // The calendar button is this variant's one element that takes focus, and each date has a
    // hidden input of its own: none while the picker is empty.
    describe('selectionMode multiple', () => {
      const Dates = (props: {
        defaultValue?: CalendarDate[]
        disabled?: boolean
        onSubmit?: () => void
        required?: boolean
      }) => <Booking invalidFeedback="Pick a day at least." selectionMode="multiple" {...props} />
      const calendarButton = () => screen.getByRole('button', { name: /calendar/i })
      const pick = (day: RegExp) =>
        fireEvent.click(within(screen.getByRole('grid')).getByRole('button', { name: day }))

      test('an empty required picker holds its form back, and its button takes focus', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()
        render(<Dates onSubmit={onSubmit} required />)

        expect(checkValidity()).toBe(false)
        await user.click(save())
        expect(onSubmit).not.toHaveBeenCalled()
        expect(calendarButton()).toHaveFocus()
      })

      test('shows as invalid after the submit it held back, until a date is picked', async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()
        render(<Dates onSubmit={onSubmit} required />)
        expect(group()).not.toHaveClass('is-invalid')

        await user.click(save())
        expect(group()).toHaveClass('form-input', 'is-invalid')
        expect(screen.getByText('Pick a day at least.')).toHaveClass('invalid-feedback')
        expect(group()).toHaveAccessibleDescription('Pick a day at least.')
        expect(calendarButton()).toHaveAccessibleDescription('Pick a day at least.')

        openCalendar()
        pick(/ 15, /)
        expect(group()).not.toHaveClass('is-invalid')
        expect(screen.queryByText('Pick a day at least.')).not.toBeInTheDocument()
        expect(checkValidity()).toBe(true)
        expect(submitted()).toHaveLength(1)

        // Emptied again it holds the form back, and is marked by the next submit only.
        pick(/ 15, /)
        expect(submitted()).toEqual([])
        expect(group()).not.toHaveClass('is-invalid')
        expect(checkValidity()).toBe(false)
        expect(group()).toHaveClass('is-invalid')
      })

      test("clears on the form's reset", async () => {
        const user = userEvent.setup()
        render(<Dates required />)
        await user.click(save())
        expect(group()).toHaveClass('is-invalid')
        await user.click(screen.getByRole('button', { name: 'Reset' }))
        expect(group()).not.toHaveClass('is-invalid')
      })

      test('submits the dates it was given, and nothing for the input that holds it back', () => {
        insteadOfEmpty(
          <Dates
            defaultValue={[new CalendarDate(2026, 7, 5), new CalendarDate(2026, 7, 12)]}
            required
          />,
          <Dates required />
        )
        expect(checkValidity()).toBe(true)
        expect(submitted()).toEqual([
          ['day', '2026-07-05'],
          ['day', '2026-07-12']
        ])
      })

      test.each([
        ['disabled', { disabled: true, required: true }],
        ['not required', {}]
      ])('a %s one holds nothing back', (_state, props) => {
        insteadOfEmpty(<Dates {...props} />, <Dates required />)
        expect(checkValidity()).toBe(true)
        expect(submitted()).toEqual([])
      })

      test('has no axe violations while marked, and logs no error', async () => {
        const user = userEvent.setup()
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
        const { container } = render(<Dates required />)
        await user.click(save())
        expect(group()).toHaveClass('is-invalid')
        expect(await axe(container)).toHaveNoViolations()
        expect(consoleError).not.toHaveBeenCalled()
        consoleError.mockRestore()
      })
    })
  })

  describe('field wrapping', () => {
    test('renders no wrapper when label/help/feedback are all unset', () => {
      // The .form-field wrapper has no role/name, so its absence can only be checked by class.
      const { container } = render(<DatePicker aria-label="Event date" />)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector('.form-field')).toBeNull()
    })

    test('wraps in .form-field and associates the label via htmlFor when label is set', () => {
      render(<DatePicker label="Event date" />)
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
          <DatePicker aria-labelledby="extra-label" label="Event date" />
        </div>
      )
      expect(screen.getByRole('group', { name: 'Event date Extra' })).toBeInTheDocument()
    })

    test('renders help text and wires it into aria-describedby', () => {
      render(<DatePicker aria-label="Event date" help="Some help" />)
      const group = screen.getByRole('group', { name: 'Event date' })
      const help = screen.getByText('Some help')
      expect(help).toHaveClass('form-help')
      expect(group.getAttribute('aria-describedby')).toContain(help.id)
    })

    test('renders invalid feedback and wires it into aria-describedby and the is-invalid class only when invalid', () => {
      const { rerender } = render(<DatePicker aria-label="Event date" invalidFeedback="Required" />)
      expect(screen.queryByText('Required')).toBeNull()

      rerender(<DatePicker aria-label="Event date" invalid invalidFeedback="Required" />)
      const group = screen.getByRole('group', { name: 'Event date' })
      const feedback = screen.getByText('Required')
      expect(feedback).toHaveClass('invalid-feedback')
      expect(group.getAttribute('aria-describedby')).toContain(feedback.id)
      expect(group).toHaveClass('is-invalid')
    })

    // The help and feedback ids went on the group alone, which takes no focus: the segments and
    // the calendar button, which do, were described by nothing. And the group's own value
    // replaced react-aria's, which also holds its description of the selected date.
    test('describes the first segment and the calendar button by the help, not only the group', () => {
      render(
        <>
          <span id="extra-help">In your time zone.</span>
          <DatePicker aria-describedby="extra-help" help="Weekdays only." label="Event date" />
        </>
      )
      const description = 'Weekdays only. In your time zone.'
      expect(screen.getByRole('group', { name: 'Event date' })).toHaveAccessibleDescription(
        description
      )
      const [first, ...others] = screen.getAllByRole('spinbutton')
      expect(first).toHaveAccessibleDescription(description)
      // react-aria describes the first segment alone, so the help isn't read on every one.
      for (const segment of others) expect(segment).not.toHaveAttribute('aria-describedby')
      expect(screen.getByRole('button', { name: /calendar/i })).toHaveAccessibleDescription(
        description
      )
    })

    test('describes every segment by the feedback while invalid', () => {
      render(<DatePicker help="Weekdays only." invalid invalidFeedback="Required." label="Day" />)
      for (const segment of screen.getAllByRole('spinbutton')) {
        expect(segment).toHaveAccessibleDescription('Weekdays only. Required.')
        // The help and the feedback, and no id of a react-aria slot that isn't rendered.
        expect(segment.getAttribute('aria-describedby')?.split(' ')).toHaveLength(2)
      }
    })

    test("keeps react-aria's description of the selected date on the group, beside the help", () => {
      render(
        <DatePicker
          defaultValue={new CalendarDate(2024, 3, 15)}
          help="Weekdays only."
          label="Event date"
        />
      )
      const group = screen.getByRole('group', { name: 'Event date' })
      expect(group).toHaveAccessibleDescription('Selected Date: March 15, 2024 Weekdays only.')
      expect(group.getAttribute('aria-describedby')?.split(' ')).toHaveLength(2)
    })

    test('describes the calendar button of a multiple-date picker, its one focusable element', () => {
      render(
        <DatePicker
          help="Weekdays only."
          invalid
          invalidFeedback="Required."
          label="Event dates"
          selectionMode="multiple"
        />
      )
      expect(screen.getByRole('button', { name: /calendar/i })).toHaveAccessibleDescription(
        'Weekdays only. Required.'
      )
    })

    test('renders valid feedback and applies the is-valid class only when valid', () => {
      render(<DatePicker aria-label="Event date" valid validFeedback="Looks good" />)
      const group = screen.getByRole('group', { name: 'Event date' })
      expect(screen.getByText('Looks good')).toHaveClass('valid-feedback')
      expect(group).toHaveClass('is-valid')
    })
  })

  describe('accessibility', () => {
    test('has no axe violations with the calendar open', async () => {
      render(<DatePicker aria-label="Event date" value={new CalendarDate(2026, 7, 24)} />)
      openCalendar()
      // The calendar dialog portals to document.body, sibling to the field itself — neither
      // sits inside a page landmark in this isolated fixture, which trips axe's "region"
      // best-practice rule. That rule is about overall page structure, not anything
      // DatePicker controls.
      expect(
        await axe(document.body, { rules: { region: { enabled: false } } })
      ).toHaveNoViolations()
    })

    test('has no axe violations in multiple selection mode with the calendar open', async () => {
      render(
        <DatePicker
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
