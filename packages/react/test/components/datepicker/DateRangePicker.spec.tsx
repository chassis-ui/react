import * as React from 'react'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  CalendarDate,
  CalendarDateTime,
  parseZonedDateTime,
  ZonedDateTime
} from '@internationalized/date'
import { axe } from 'jest-axe'

import { DateRangePicker } from '../../../src/index'
import { actUserEvent } from '../../actUserEvent'

const openCalendar = () => {
  fireEvent.click(screen.getByRole('button', { name: /calendar/i }))
}

// Same rationale as `DatePicker.spec.tsx`: the popover wrapper only toggles a `hidden` attribute
// and has no role of its own, and is the first `.datepicker` in document order.
const getCalendarWrapper = () =>
  // eslint-disable-next-line testing-library/no-node-access
  document.querySelector('.datepicker') as HTMLElement

describe('DateRangePicker', () => {
  describe('rendering', () => {
    test('renders a labeled group with two segmented date fields', () => {
      render(<DateRangePicker aria-label="Trip dates" />)
      expect(screen.getByRole('group', { name: 'Trip dates' })).toBeInTheDocument()
      expect(screen.getAllByRole('spinbutton').length).toBeGreaterThan(3)
    })

    test('supports a controlled value reflected in both fields', () => {
      const onChange = vi.fn()
      render(
        <DateRangePicker
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
      render(<DateRangePicker aria-label="Trip dates" />)
      const dialog = getCalendarWrapper()
      expect(dialog).toHaveAttribute('hidden')
      openCalendar()
      expect(dialog).not.toHaveAttribute('hidden')
      expect(screen.getByRole('grid')).toBeInTheDocument()
    })

    test('re-clicking the toggle button closes an open calendar', () => {
      render(<DateRangePicker aria-label="Trip dates" />)
      const toggle = screen.getByRole('button', { name: /calendar/i })
      const dialog = getCalendarWrapper()
      fireEvent.click(toggle)
      expect(dialog).not.toHaveAttribute('hidden')
      fireEvent.click(toggle)
      expect(dialog).toHaveAttribute('hidden')
    })

    test('pressing Escape while the calendar is open closes it', () => {
      render(<DateRangePicker aria-label="Trip dates" />)
      const dialog = getCalendarWrapper()
      openCalendar()
      expect(dialog).not.toHaveAttribute('hidden')
      fireEvent.keyDown(dialog, { key: 'Escape' })
      expect(dialog).toHaveAttribute('hidden')
    })

    // Regression coverage: see `DatePicker.spec.tsx`'s identical test for why `userEvent.click`
    // (not `fireEvent.click`) is required — it's the one that simulates the browser's real
    // focus-shifting-to-body behavior on a click, which is what `useOverlay`'s `isDismissable`
    // outside-click listener depends on to fire for a plain, non-focusable click target.
    test('a real click on plain page content outside the calendar closes it', async () => {
      const user = userEvent.setup()
      render(
        <div>
          <DateRangePicker aria-label="Trip dates" />
          <p>Some page content</p>
        </div>
      )
      const dialog = getCalendarWrapper()
      // See `actUserEvent.ts` / `DatePicker.spec.tsx` for why this needs `actUserEvent`.
      await actUserEvent(() => user.click(screen.getByRole('button', { name: /calendar/i })))
      expect(dialog).not.toHaveAttribute('hidden')
      await actUserEvent(() => user.click(screen.getByText('Some page content')))
      expect(dialog).toHaveAttribute('hidden')
    })

    // Regression coverage: see `DatePicker.spec.tsx`'s identical test — both share
    // `useOverlayPlacement`, which opts out of `useOverlayPosition`'s close-on-any-window-scroll
    // listener so the popover repositions with its trigger instead of vanishing on scroll.
    test('scrolling the window while the calendar is open does not close it', () => {
      render(<DateRangePicker aria-label="Trip dates" />)
      const dialog = getCalendarWrapper()
      openCalendar()
      expect(dialog).not.toHaveAttribute('hidden')
      fireEvent.scroll(window)
      expect(dialog).not.toHaveAttribute('hidden')
    })

    test('defaultVisible renders the calendar already open', () => {
      render(<DateRangePicker aria-label="Trip dates" defaultVisible />)
      expect(getCalendarWrapper()).not.toHaveAttribute('hidden')
    })

    test('visible controls the calendar and onVisibleChange reports toggle attempts without opening it', () => {
      const onVisibleChange = vi.fn()
      const { rerender } = render(
        <DateRangePicker
          aria-label="Trip dates"
          visible={false}
          onVisibleChange={onVisibleChange}
        />
      )
      fireEvent.click(screen.getByRole('button', { name: /calendar/i }))
      expect(onVisibleChange).toHaveBeenCalledWith(true)
      expect(getCalendarWrapper()).toHaveAttribute('hidden')

      rerender(
        <DateRangePicker aria-label="Trip dates" visible onVisibleChange={onVisibleChange} />
      )
      expect(getCalendarWrapper()).not.toHaveAttribute('hidden')
    })
  })

  describe('clearing', () => {
    test('no clear button when nothing is selected', () => {
      render(<DateRangePicker aria-label="Trip dates" />)
      expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument()
    })

    test('clicking the clear button resets the range and fires onChange with null', () => {
      const onChange = vi.fn()
      render(
        <DateRangePicker
          aria-label="Trip dates"
          onChange={onChange}
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 7, 15) }}
        />
      )
      fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
      expect(onChange).toHaveBeenCalledWith(null)
    })

    test('no clear button when disabled, even with a value', () => {
      render(
        <DateRangePicker
          aria-label="Trip dates"
          disabled
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 7, 15) }}
        />
      )
      expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument()
    })

    // Regression coverage: see `DatePicker.spec.tsx`'s identical test — the clear button
    // unmounts itself on press, which drops focus to `document.body` without an explicit refocus.
    // Needs an actually-clearing (uncontrolled) picker, unlike the tests above.
    test('clicking the clear button moves focus to the calendar toggle button, not the document body', async () => {
      const user = userEvent.setup()
      render(
        <DateRangePicker
          aria-label="Trip dates"
          defaultValue={{
            start: new CalendarDate(2026, 7, 10),
            end: new CalendarDate(2026, 7, 15)
          }}
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
    test('closing the calendar restores focus to the toggle button', async () => {
      const user = userEvent.setup()
      render(<DateRangePicker aria-label="Trip dates" />)
      const toggle = screen.getByRole('button', { name: /calendar/i })

      await actUserEvent(() => user.click(toggle))
      await actUserEvent(() => user.keyboard('{Escape}'))

      // eslint-disable-next-line testing-library/no-node-access
      await waitFor(() => expect(document.activeElement).toBe(toggle))
    })
  })

  describe('range selection', () => {
    test('clicking a start then an end date commits the range, fires onChange, and closes the calendar', () => {
      const onChange = vi.fn()
      render(
        <DateRangePicker
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
        <DateRangePicker
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
        <DateRangePicker
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

  describe('unavailableDates', () => {
    // The dates' own `toString()` carries their time, which no `YYYY-MM-DD` entry matched.
    test('a range with times that starts on a listed date marks the field invalid', () => {
      render(
        <DateRangePicker
          aria-label="Trip dates"
          defaultValue={{
            start: new CalendarDateTime(2026, 7, 15, 9, 30),
            end: new CalendarDateTime(2026, 7, 17, 17)
          }}
          unavailableDates={['2026-07-15']}
        />
      )
      expect(screen.getByRole('group', { name: 'Trip dates' })).toHaveClass('is-invalid')
    })
  })

  describe('labels', () => {
    test("calendar names the trigger in place of the locale's own name", () => {
      render(<DateRangePicker aria-label="Dates du séjour" labels={{ calendar: 'Calendrier' }} />)
      expect(screen.getByRole('button', { name: /^Calendrier/ })).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    test('picking only a start date does not fire onChange or close the calendar', () => {
      const onChange = vi.fn()
      render(
        <DateRangePicker
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
        <DateRangePicker
          aria-label="Trip dates"
          name="tripDates"
          value={{ start: new CalendarDate(2026, 7, 10), end: new CalendarDate(2026, 7, 15) }}
        />
      )
      expect(screen.getByText('10')).toBeInTheDocument()

      rerender(<DateRangePicker aria-label="Trip dates" name="tripDates" value={null} />)

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
        <DateRangePicker
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
        <DateRangePicker
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
        <DateRangePicker
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
      render(<DateRangePicker aria-label="Trip dates" />)
      openCalendar()
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.querySelector('.datepicker-presets')).toBeNull()
    })

    test('renders each preset as a button', () => {
      const customPresets = [
        {
          label: 'Custom Range',
          range: { start: new CalendarDate(2026, 7, 1), end: new CalendarDate(2026, 7, 10) }
        }
      ]
      render(<DateRangePicker aria-label="Trip dates" presets={customPresets} />)
      openCalendar()
      expect(screen.getByRole('button', { name: 'Custom Range' })).toBeInTheDocument()
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
        <DateRangePicker aria-label="Trip dates" onChange={onChange} presets={customPresets} />
      )
      openCalendar()
      fireEvent.click(screen.getByRole('button', { name: 'Custom Range' }))

      expect(onChange).toHaveBeenCalledWith({
        start: new CalendarDate(2026, 7, 1),
        end: new CalendarDate(2026, 7, 10)
      })
      expect(getCalendarWrapper()).toHaveAttribute('hidden')
    })

    test('marks the preset matching the current value as selected', () => {
      const customPresets = [
        {
          label: 'Custom Range',
          range: { start: new CalendarDate(2026, 7, 1), end: new CalendarDate(2026, 7, 10) }
        }
      ]
      render(
        <DateRangePicker
          aria-label="Trip dates"
          presets={customPresets}
          value={{ start: new CalendarDate(2026, 7, 1), end: new CalendarDate(2026, 7, 10) }}
        />
      )
      openCalendar()
      const presetButton = screen.getByRole('button', { name: 'Custom Range' })
      expect(presetButton).toHaveClass('selected')
      expect(presetButton).toHaveAttribute('aria-current', 'true')
    })

    test('has no axe violations with presets shown', async () => {
      const customPresets = [
        {
          label: 'Custom Range',
          range: { start: new CalendarDate(2026, 7, 1), end: new CalendarDate(2026, 7, 10) }
        }
      ]
      render(
        <DateRangePicker
          aria-label="Trip dates"
          presets={customPresets}
          value={{ start: new CalendarDate(2026, 7, 1), end: new CalendarDate(2026, 7, 10) }}
        />
      )
      openCalendar()
      expect(
        await axe(document.body, { rules: { region: { enabled: false } } })
      ).toHaveNoViolations()
    })
  })

  describe('presets, as the grid would select them', () => {
    test('keeps a preset inside minValue and maxValue, and still closes the calendar', () => {
      const onChange = vi.fn()
      render(
        <DateRangePicker
          aria-label="Trip dates"
          maxValue={new CalendarDate(2026, 7, 20)}
          minValue={new CalendarDate(2026, 7, 10)}
          onChange={onChange}
          presets={[
            {
              label: 'July',
              range: { end: new CalendarDate(2026, 7, 31), start: new CalendarDate(2026, 7, 1) }
            }
          ]}
        />
      )
      openCalendar()
      fireEvent.click(screen.getByRole('button', { name: 'July' }))

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenCalledWith({
        end: new CalendarDate(2026, 7, 20),
        start: new CalendarDate(2026, 7, 10)
      })
      expect(getCalendarWrapper()).toHaveAttribute('hidden')
      expect(screen.getByRole('group', { name: 'Trip dates' })).not.toHaveClass('is-invalid')
    })

    test('keeps the times of the current range', () => {
      const onChange = vi.fn()
      render(
        <DateRangePicker
          aria-label="Trip dates"
          defaultValue={{
            end: new CalendarDateTime(2026, 7, 5, 17, 0),
            start: new CalendarDateTime(2026, 7, 3, 9, 30)
          }}
          onChange={onChange}
          presets={[
            {
              label: 'Mid July',
              range: { end: new CalendarDate(2026, 7, 20), start: new CalendarDate(2026, 7, 10) }
            }
          ]}
        />
      )
      openCalendar()
      fireEvent.click(screen.getByRole('button', { name: 'Mid July' }))

      expect(onChange).toHaveBeenCalledWith({
        end: new CalendarDateTime(2026, 7, 20, 17, 0),
        start: new CalendarDateTime(2026, 7, 10, 9, 30)
      })
    })
  })

  describe('time', () => {
    const segmentText = () =>
      screen.getAllByRole('spinbutton').map((segment) => segment.textContent)

    // Hidden inputs are excluded from the accessibility tree - no query reaches them.
    const getHiddenInput = (name: string) =>
      // eslint-disable-next-line testing-library/no-node-access
      document.querySelector(`input[type="hidden"][name="${name}"]`) as HTMLInputElement

    test('granularity adds the time segments to both empty fields', () => {
      render(<DateRangePicker aria-label="Stay" granularity="hour" />)
      expect(screen.getAllByRole('spinbutton', { name: /^hour/ })).toHaveLength(2)
      expect(screen.queryByRole('spinbutton', { name: /^minute/ })).toBeNull()
    })

    test('picking a range in the calendar keeps both times', () => {
      const onChange = vi.fn()
      render(
        <DateRangePicker
          aria-label="Stay"
          defaultValue={{
            end: new CalendarDateTime(2024, 3, 17, 11, 0),
            start: new CalendarDateTime(2024, 3, 15, 15, 0)
          }}
          name="stay"
          onChange={onChange}
        />
      )
      openCalendar()
      const grid = screen.getByRole('grid')
      fireEvent.click(within(grid).getByRole('button', { name: /March 20, 2024/ }))
      fireEvent.click(within(grid).getByRole('button', { name: /March 22, 2024/ }))
      const { end, start } = onChange.mock.calls[0]![0]
      expect(start).toBeInstanceOf(CalendarDateTime)
      expect([start.toString(), end.toString()]).toEqual([
        '2024-03-20T15:00:00',
        '2024-03-22T11:00:00'
      ])
      expect(segmentText()).toEqual([
        '3',
        '20',
        '2024',
        '3',
        '00',
        'PM',
        '3',
        '22',
        '2024',
        '11',
        '00',
        'AM'
      ])
      expect(getHiddenInput('stayStart').value).toBe('2024-03-20T15:00:00')
      expect(getHiddenInput('stayEnd').value).toBe('2024-03-22T11:00:00')
    })

    test('a range picked while empty takes the time and type of placeholderValue', () => {
      const onChange = vi.fn()
      render(
        <DateRangePicker
          aria-label="Stay"
          granularity="minute"
          onChange={onChange}
          placeholderValue={parseZonedDateTime('2024-03-01T09:00[Asia/Tokyo]')}
        />
      )
      openCalendar()
      const grid = screen.getByRole('grid')
      fireEvent.click(within(grid).getByRole('button', { name: /March 20, 2024/ }))
      fireEvent.click(within(grid).getByRole('button', { name: /March 22, 2024/ }))
      const { end, start } = onChange.mock.calls[0]![0]
      expect(start).toBeInstanceOf(ZonedDateTime)
      expect([start.toString(), end.toString()]).toEqual([
        '2024-03-20T09:00:00+09:00[Asia/Tokyo]',
        '2024-03-22T09:00:00+09:00[Asia/Tokyo]'
      ])
    })

    test('an end before the start marks the field invalid, with its feedback', () => {
      render(
        <DateRangePicker
          aria-label="Stay"
          invalidFeedback="Check out after you check in"
          value={{
            end: new CalendarDateTime(2024, 3, 15, 11, 0),
            start: new CalendarDateTime(2024, 3, 15, 15, 0)
          }}
        />
      )
      const group = screen.getByRole('group', { name: 'Stay' })
      expect(group).toHaveClass('is-invalid')
      expect(group.getAttribute('aria-describedby')).toContain(
        screen.getByText('Check out after you check in').id
      )
    })
  })

  describe('form integration', () => {
    test('creates a pair of hidden inputs for form submission when name is provided', () => {
      const { rerender } = render(
        <DateRangePicker
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
        <DateRangePicker
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
      const { container } = render(<DateRangePicker aria-label="Trip dates" />)
      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
      expect(container.querySelector('.form-field')).toBeNull()
    })

    test('wraps in .form-field and associates the label via htmlFor when label is set', () => {
      render(<DateRangePicker label="Trip dates" />)
      const group = screen.getByRole('group', { name: 'Trip dates' })
      // eslint-disable-next-line testing-library/no-node-access
      expect(group.closest('.form-field')).not.toBeNull()
      expect(screen.getByText('Trip dates').tagName).toBe('LABEL')
    })

    test('renders invalid feedback and applies the is-invalid class only when invalid', () => {
      const { rerender } = render(
        <DateRangePicker aria-label="Trip dates" invalidFeedback="Required" />
      )
      expect(screen.queryByText('Required')).toBeNull()

      rerender(<DateRangePicker aria-label="Trip dates" invalid invalidFeedback="Required" />)
      const group = screen.getByRole('group', { name: 'Trip dates' })
      expect(screen.getByText('Required')).toHaveClass('invalid-feedback')
      expect(group).toHaveClass('is-invalid')
    })
  })

  // The help and feedback ids went on the group alone, which takes no focus: the segments and
  // the calendar button, which do, were described by nothing. And the group's own value replaced
  // react-aria's, which also holds its description of the selected range.
  describe('description', () => {
    test('describes the first segment of each field and the calendar button by the help', () => {
      render(
        <>
          <span id="extra-help">In your time zone.</span>
          <DateRangePicker aria-describedby="extra-help" help="Up to 30 nights." label="Stay" />
        </>
      )
      const description = 'Up to 30 nights. In your time zone.'
      expect(screen.getByRole('group', { name: 'Stay' })).toHaveAccessibleDescription(description)
      const segments = screen.getAllByRole('spinbutton')
      expect(segments).toHaveLength(6)
      // react-aria describes the first segment of a field alone, so the help isn't read on each.
      segments.forEach((segment, index) => {
        if (index % 3 === 0) expect(segment).toHaveAccessibleDescription(description)
        else expect(segment).not.toHaveAttribute('aria-describedby')
      })
      expect(screen.getByRole('button', { name: /calendar/i })).toHaveAccessibleDescription(
        description
      )
    })

    test('describes every segment by the feedback while invalid', () => {
      render(
        <DateRangePicker help="Up to 30 nights." invalid invalidFeedback="Required." label="Stay" />
      )
      for (const segment of screen.getAllByRole('spinbutton')) {
        expect(segment).toHaveAccessibleDescription('Up to 30 nights. Required.')
        // The help and the feedback, and no id of a react-aria slot that isn't rendered.
        expect(segment.getAttribute('aria-describedby')?.split(' ')).toHaveLength(2)
      }
    })

    test("keeps react-aria's description of the selected range on the group, beside the help", () => {
      render(
        <DateRangePicker
          defaultValue={{
            end: new CalendarDate(2024, 3, 20),
            start: new CalendarDate(2024, 3, 15)
          }}
          help="Up to 30 nights."
          label="Stay"
        />
      )
      const group = screen.getByRole('group', { name: 'Stay' })
      // How the two dates are joined is `Intl`'s choice ("March 15 to 20, 2024").
      expect(group).toHaveAccessibleDescription(
        /^Selected Range: March 15.* 2024 Up to 30 nights\.$/
      )
      expect(group.getAttribute('aria-describedby')?.split(' ')).toHaveLength(2)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations with the calendar open', async () => {
      render(
        <DateRangePicker
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
