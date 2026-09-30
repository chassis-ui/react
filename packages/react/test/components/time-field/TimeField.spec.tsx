import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { CalendarDateTime, Time } from '@internationalized/date'

import { TimeField } from '../../../src/index'

const segmentNames = () =>
  screen.getAllByRole('spinbutton').map((segment) => segment.getAttribute('aria-label'))
const segmentTexts = () => screen.getAllByRole('spinbutton').map((segment) => segment.textContent)

describe('TimeField', () => {
  describe('rendering', () => {
    test('renders a labelled .form-input group of spin buttons, one per unit', () => {
      render(<TimeField label="Start" />)
      const group = screen.getByRole('group', { name: 'Start' })
      expect(group).toHaveClass('form-input', 'time-field')
      expect(segmentNames()).toEqual(['hour, ', 'minute, ', 'AM/PM, '])
      for (const segment of screen.getAllByRole('spinbutton')) {
        expect(segment).toHaveClass('datepicker-segment')
        expect(group).toContainElement(segment)
        expect(segment).toHaveAccessibleName(/Start$/)
      }
    })

    test('shows 24 hours with hourCycle, and the units of granularity', () => {
      render(<TimeField aria-label="Start" granularity="second" hourCycle={24} />)
      expect(segmentNames()).toEqual(['hour, Start', 'minute, Start', 'second, Start'])
    })

    test('shows the hour alone with granularity="hour"', () => {
      render(<TimeField aria-label="Start" granularity="hour" />)
      expect(segmentNames()).toEqual(['hour, Start', 'AM/PM, Start'])
    })

    test('shows a value, and forces a leading zero', () => {
      render(
        <TimeField
          aria-label="Start"
          defaultValue={new Time(9, 5)}
          hourCycle={24}
          shouldForceLeadingZeros
        />
      )
      expect(segmentTexts()).toEqual(['09', '05'])
    })

    test("renders the time's isolation marks and the space before AM/PM as plain text", () => {
      render(<TimeField aria-label="Start" defaultValue={new Time(9, 30)} />)
      const exact = { normalizer: (text: string) => text }
      expect(screen.getByText('\u2066', exact)).not.toHaveClass('datepicker-segment')
      expect(screen.getByText('\u2069', exact)).not.toHaveClass('datepicker-segment')
      // The locale's space: U+202F, a narrow no-break space, in en-US.
      expect(screen.getByText(/^\s$/, exact)).not.toHaveClass('datepicker-segment')
      expect(screen.getByText(':', exact)).toHaveClass('datepicker-segment')
    })

    test('puts size, className and style on the group, keeping its isolation', () => {
      render(
        <TimeField aria-label="Start" className="custom" size="lg" style={{ maxWidth: '10rem' }} />
      )
      const group = screen.getByRole('group', { name: 'Start' })
      expect(group).toHaveClass('form-input', 'lg', 'custom')
      expect(group).toHaveAttribute('style', 'unicode-bidi: isolate; max-width: 10rem;')
    })
  })

  describe('value', () => {
    test('reports the time once every segment has a value, and submits it', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(
        <form aria-label="Booking">
          <TimeField label="Start" name="start" onChange={onChange} />
        </form>
      )
      await user.click(screen.getByRole('spinbutton', { name: /^hour/ }))
      await user.keyboard('930p')

      expect(onChange).toHaveBeenLastCalledWith(new Time(21, 30))
      expect(segmentTexts()).toEqual(['9', '30', 'PM'])
      expect(screen.getByRole('form', { name: 'Booking' })).toHaveFormValues({ start: '21:30:00' })
    })

    test('keeps the last value while a segment is empty, and reports null once all are', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(
        <TimeField
          aria-label="Start"
          defaultValue={new Time(9)}
          hourCycle={24}
          onChange={onChange}
        />
      )
      await user.click(screen.getByRole('spinbutton', { name: /^minute/ }))
      await user.keyboard('{Backspace}')
      expect(segmentTexts()).toEqual(['09', '––'])
      expect(onChange).not.toHaveBeenCalled()

      await user.click(screen.getByRole('spinbutton', { name: /^hour/ }))
      await user.keyboard('{Backspace}{Backspace}')
      expect(onChange).toHaveBeenLastCalledWith(null)
    })

    test('steps a segment with the arrow keys', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(<TimeField aria-label="Start" defaultValue={new Time(9, 30)} onChange={onChange} />)
      await user.click(screen.getByRole('spinbutton', { name: /^minute/ }))
      await user.keyboard('{ArrowUp}')
      expect(onChange).toHaveBeenLastCalledWith(new Time(9, 31))
    })

    test('shows a controlled value, and reports changes without making them', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      const { rerender } = render(
        <TimeField aria-label="Start" hourCycle={24} onChange={onChange} value={new Time(9, 30)} />
      )
      await user.click(screen.getByRole('spinbutton', { name: /^hour/ }))
      await user.keyboard('{ArrowUp}')
      expect(onChange).toHaveBeenLastCalledWith(new Time(10, 30))
      expect(segmentTexts()).toEqual(['09', '30'])

      rerender(
        <TimeField aria-label="Start" hourCycle={24} onChange={onChange} value={new Time(10, 30)} />
      )
      expect(segmentTexts()).toEqual(['10', '30'])
    })

    test('keeps the date of a CalendarDateTime value', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(
        <TimeField
          aria-label="Start"
          defaultValue={new CalendarDateTime(2026, 9, 30, 9, 30)}
          onChange={onChange}
        />
      )
      await user.click(screen.getByRole('spinbutton', { name: /^hour/ }))
      await user.keyboard('{ArrowUp}')
      expect(onChange).toHaveBeenLastCalledWith(new CalendarDateTime(2026, 9, 30, 10, 30))
    })

    test('resets with its form', async () => {
      const user = userEvent.setup()
      render(
        <form aria-label="Booking">
          <TimeField
            aria-label="Start"
            defaultValue={new Time(9, 30)}
            hourCycle={24}
            name="start"
          />
          <button type="reset">Reset</button>
        </form>
      )
      await user.click(screen.getByRole('spinbutton', { name: /^hour/ }))
      await user.keyboard('{ArrowUp}')
      expect(segmentTexts()).toEqual(['10', '30'])
      await user.click(screen.getByRole('button', { name: 'Reset' }))
      expect(segmentTexts()).toEqual(['09', '30'])
      expect(screen.getByRole('form', { name: 'Booking' })).toHaveFormValues({ start: '09:30:00' })
    })
  })

  describe('validation', () => {
    test('shows a time outside minValue and maxValue as invalid, with its feedback', () => {
      render(
        <TimeField
          defaultValue={new Time(8)}
          invalidFeedback="Between 9 AM and 5 PM."
          label="Start"
          maxValue={new Time(17)}
          minValue={new Time(9)}
        />
      )
      const group = screen.getByRole('group', { name: 'Start' })
      expect(group).toHaveClass('is-invalid')
      expect(screen.getAllByRole('spinbutton')[0]).toHaveAttribute('aria-invalid', 'true')
      expect(group).toHaveAccessibleDescription(/Between 9 AM and 5 PM\./)
    })

    test('keeps the range check when invalid is false', () => {
      render(
        <TimeField
          defaultValue={new Time(8)}
          invalid={false}
          invalidFeedback="Between 9 AM and 5 PM."
          label="Start"
          minValue={new Time(9)}
        />
      )
      expect(screen.getByRole('group', { name: 'Start' })).toHaveClass('is-invalid')
      expect(screen.getByText('Between 9 AM and 5 PM.')).toBeInTheDocument()
    })

    test('shows a time outside the range as invalid, not valid, whatever valid says', () => {
      render(
        <TimeField
          defaultValue={new Time(8)}
          label="Start"
          minValue={new Time(9)}
          valid
          validFeedback="Free."
        />
      )
      const group = screen.getByRole('group', { name: 'Start' })
      expect(group).toHaveClass('is-invalid')
      expect(group).not.toHaveClass('is-valid')
      expect(screen.queryByText('Free.')).not.toBeInTheDocument()
    })

    test('shows a time inside the range as it is', () => {
      render(
        <TimeField
          defaultValue={new Time(10)}
          invalidFeedback="Between 9 AM and 5 PM."
          label="Start"
          maxValue={new Time(17)}
          minValue={new Time(9)}
        />
      )
      expect(screen.getByRole('group', { name: 'Start' })).not.toHaveClass('is-invalid')
      expect(screen.queryByText('Between 9 AM and 5 PM.')).not.toBeInTheDocument()
    })

    test('shows invalid and valid as given, with help', () => {
      render(
        <>
          <TimeField help="Local time." invalid invalidFeedback="Required." label="Start" />
          <TimeField label="End" valid validFeedback="Free." />
        </>
      )
      const start = screen.getByRole('group', { name: 'Start' })
      expect(start).toHaveClass('is-invalid')
      expect(start).toHaveAccessibleDescription('Local time. Required.')
      expect(screen.getByRole('group', { name: 'End' })).toHaveClass('is-valid')
    })
  })

  describe('states', () => {
    test('disables the segments and leaves the value out of the form', () => {
      render(
        <form aria-label="Booking">
          <TimeField aria-label="Start" defaultValue={new Time(9)} disabled name="start" />
        </form>
      )
      expect(screen.getByRole('group', { name: 'Start' })).toHaveClass('disabled')
      for (const segment of screen.getAllByRole('spinbutton')) {
        expect(segment).toHaveAttribute('aria-disabled', 'true')
      }
      expect(screen.getByRole('form', { name: 'Booking' })).toHaveFormValues({})
    })

    test('writes no contenteditable on segments that are read-only', () => {
      render(<TimeField aria-label="Start" defaultValue={new Time(9)} readOnly />)
      for (const segment of screen.getAllByRole('spinbutton')) {
        expect(segment).toHaveAttribute('aria-readonly', 'true')
        expect(segment).not.toHaveAttribute('contenteditable')
      }
    })

    test('keeps a read-only value', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      render(
        <TimeField aria-label="Start" defaultValue={new Time(9)} onChange={onChange} readOnly />
      )
      await user.click(screen.getByRole('spinbutton', { name: /^hour/ }))
      await user.keyboard('{ArrowUp}5')
      expect(onChange).not.toHaveBeenCalled()
    })

    test('calls the focus and key handlers', async () => {
      const user = userEvent.setup()
      const onFocus = vi.fn()
      const onBlur = vi.fn()
      const onKeyDown = vi.fn()
      render(
        <>
          <TimeField aria-label="Start" onBlur={onBlur} onFocus={onFocus} onKeyDown={onKeyDown} />
          <button type="button">After</button>
        </>
      )
      await user.click(screen.getByRole('spinbutton', { name: /^hour/ }))
      expect(onFocus).toHaveBeenCalledTimes(1)
      // A segment keeps the keys it handles (arrows) to itself; others reach the field, once.
      await user.keyboard('{ArrowUp}')
      expect(onKeyDown).not.toHaveBeenCalled()
      await user.keyboard('{Escape}')
      expect(onKeyDown).toHaveBeenCalledTimes(1)
      expect(onKeyDown).toHaveBeenCalledWith(expect.objectContaining({ key: 'Escape' }))
      await user.click(screen.getByRole('button', { name: 'After' }))
      expect(onBlur).toHaveBeenCalledTimes(1)
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the group', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<TimeField aria-label="Start" ref={ref} />)
      expect(ref.current).toBe(screen.getByRole('group', { name: 'Start' }))
    })
  })

  describe('accessibility', () => {
    test('has no axe violations with a label, help, a value and feedback', async () => {
      const { container } = render(
        <form aria-label="Booking">
          <TimeField
            defaultValue={new Time(9, 30)}
            help="Local time."
            label="Start"
            name="start"
            valid
            validFeedback="Free."
          />
        </form>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
