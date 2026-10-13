import * as React from 'react'
import { flushSync } from 'react-dom'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  useRequiredValueInput,
  UseRequiredValueInputOptions
} from '../../src/hooks/useRequiredValueInput'

interface FieldProps extends Omit<UseRequiredValueInputOptions, 'focus'> {
  disabled?: boolean
  /** Whether the field passes `focus`, as every field but `TimeField` does. */
  focuses?: boolean
  /** A new key renders another input element in place of the first. */
  inputKey?: string
  label?: string
  value?: string
}

// A field as the components build one: something that takes focus, and the input that carries
// the value, `type="hidden"` until the hook says otherwise.
const Field = ({
  disabled,
  focuses = true,
  inputKey,
  label = 'Day',
  value = '',
  ...options
}: FieldProps) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const { inputProps, missing } = useRequiredValueInput(inputRef, {
    ...options,
    focus: focuses ? () => buttonRef.current?.focus() : undefined
  })
  return (
    <>
      <button aria-invalid={missing || undefined} ref={buttonRef} type="button">
        {label}
      </button>
      <input
        disabled={disabled}
        key={inputKey}
        name={label}
        type="hidden"
        value={value}
        {...inputProps}
        ref={inputRef}
      />
    </>
  )
}

const Form = ({ children, onSubmit }: { children: React.ReactNode; onSubmit?: () => void }) => (
  <form
    aria-label="Booking"
    onSubmit={(event) => {
      event.preventDefault()
      onSubmit?.()
    }}
  >
    {children}
    <button type="submit">Save</button>
    <button type="reset">Reset</button>
  </form>
)

const form = () => screen.getByRole<HTMLFormElement>('form', { name: 'Booking' })
const field = (name = 'Day') => screen.getByRole('button', { name })
const save = () => screen.getByRole('button', { name: 'Save' })
const valueInput = (name = 'Day') => form().elements.namedItem(name) as HTMLInputElement
// `checkValidity()` fires `invalid` at the input, as a submit does: a state update.
const checkValidity = () => {
  let valid = true
  act(() => {
    valid = form().checkValidity()
  })
  return valid
}
const marked = (name?: string) => field(name).getAttribute('aria-invalid') === 'true'

describe('useRequiredValueInput', () => {
  describe('the input', () => {
    test('stays hidden, which a form does not validate, unless the field is required', () => {
      render(
        <Form>
          <Field />
        </Form>
      )
      expect(valueInput()).toHaveAttribute('type', 'hidden')
      expect(valueInput()).not.toBeRequired()
      expect(checkValidity()).toBe(true)
      expect(marked()).toBe(false)
    })

    test('is a required text input that is not displayed once it is', () => {
      render(
        <Form>
          <Field required />
        </Form>
      )
      expect(valueInput()).toHaveAttribute('type', 'text')
      expect(valueInput()).toHaveAttribute('hidden')
      expect(valueInput()).toBeRequired()
      expect(checkValidity()).toBe(false)
    })

    test('holds nothing back with a value, or disabled', () => {
      const { rerender } = render(
        <Form>
          <Field required value="2026-07-24" />
        </Form>
      )
      expect(checkValidity()).toBe(true)
      expect(form()).toHaveFormValues({ Day: '2026-07-24' })

      rerender(
        <Form>
          <Field disabled required />
        </Form>
      )
      expect(checkValidity()).toBe(true)
      expect(marked()).toBe(false)
    })
  })

  describe('a submit the input held back', () => {
    test('marks the field as missing and focuses it, and the form stays', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(
        <Form onSubmit={onSubmit}>
          <Field required />
        </Form>
      )
      expect(marked()).toBe(false)

      await user.click(save())
      expect(onSubmit).not.toHaveBeenCalled()
      expect(marked()).toBe(true)
      expect(field()).toHaveFocus()
    })

    // A browser has no bubble for an input it doesn't display, and Chromium logs an error for
    // an invalid control it can't focus unless the event is cancelled.
    test("cancels the input's `invalid` event", () => {
      render(
        <Form>
          <Field required />
        </Form>
      )
      const event = new Event('invalid', { cancelable: true })
      act(() => {
        valueInput().dispatchEvent(event)
      })
      expect(event.defaultPrevented).toBe(true)
      expect(marked()).toBe(true)
    })

    test('focuses only the first invalid field of the form, and marks each', async () => {
      const user = userEvent.setup()
      render(
        <Form>
          <Field label="Start" required />
          <Field label="End" required />
        </Form>
      )
      await user.click(save())
      expect(field('Start')).toHaveFocus()
      expect(marked('Start')).toBe(true)
      expect(marked('End')).toBe(true)
    })

    test('leaves the focus where a control before it is the invalid one', async () => {
      const user = userEvent.setup()
      render(
        <Form>
          <input aria-label="Name" required />
          <Field required />
        </Form>
      )
      await user.click(save())
      expect(field()).not.toHaveFocus()
      expect(marked()).toBe(true)
    })

    // `TimeField`: react-aria's own listener on the same input focuses the first segment and
    // cancels the event, and would do neither after an event already cancelled.
    test('without `focus`, marks the field and leaves the event alone', () => {
      render(
        <Form>
          <Field focuses={false} required />
        </Form>
      )
      const event = new Event('invalid', { cancelable: true })
      act(() => {
        valueInput().dispatchEvent(event)
      })
      expect(event.defaultPrevented).toBe(false)
      expect(marked()).toBe(true)
      expect(field()).not.toHaveFocus()
    })

    test('marks a field outside any form, which has no first invalid control to focus', () => {
      render(<Field required />)
      // No form to reach the input through, and no role on an input that isn't displayed.
      const input = screen.getByDisplayValue('')
      expect(input).toBeRequired()
      act(() => {
        ;(input as HTMLInputElement).checkValidity()
      })
      expect(marked()).toBe(true)
      expect(field()).not.toHaveFocus()
    })
  })

  describe('the mark', () => {
    const held = (props: FieldProps = {}) => {
      const view = render(
        <Form>
          <Field required {...props} />
        </Form>
      )
      expect(checkValidity()).toBe(false)
      return (next: FieldProps) =>
        view.rerender(
          <Form>
            <Field required {...props} {...next} />
          </Form>
        )
    }

    test('clears once the field has a value, and does not come back when it is emptied', () => {
      const update = held()
      expect(marked()).toBe(true)

      update({ value: '2026-07-24' })
      expect(marked()).toBe(false)

      update({ value: '' })
      expect(marked()).toBe(false)
      expect(checkValidity()).toBe(false)
      expect(marked()).toBe(true)
    })

    test("clears on the form's reset", async () => {
      const user = userEvent.setup()
      held()
      expect(marked()).toBe(true)
      await user.click(screen.getByRole('button', { name: 'Reset' }))
      expect(marked()).toBe(false)
    })

    test.each([
      ['is no longer required', { required: false }],
      ['is disabled', { disabled: true }]
    ])('clears once the field %s', (_state, props) => {
      const update = held()
      expect(marked()).toBe(true)
      update(props)
      expect(marked()).toBe(false)
    })

    // The caller's own state wins: `invalid` once it is set, to `false` too, and `valid`.
    test.each([
      ['invalid={false}', { invalid: false }],
      ['invalid', { invalid: true }],
      ['valid', { valid: true }]
    ])('is left to the caller with %s', (_name, props) => {
      const update = held(props)
      expect(marked()).toBe(false)

      // The submit was held back all the same: the mark shows once the caller lets go.
      update({ invalid: undefined, valid: undefined })
      expect(marked()).toBe(true)
    })

    test('valid={false} leaves the mark', () => {
      held({ valid: false })
      expect(marked()).toBe(true)
    })
  })

  // A browser runs a render that one listener asked for before it calls the next listener of the
  // same event. A listener that such a render removed and added again was never called: the
  // `reset` after react-aria's own listener in `TimeField`, and after the first input's in a
  // `DateRangePicker`. jsdom runs no render there by itself, so a listener registered before the
  // field's renders in its place.
  describe('a render between two listeners of one event', () => {
    const RendersOn = ({ type }: { type: 'invalid' | 'reset' }) => {
      const [, rerender] = React.useReducer((count: number) => count + 1, 0)
      return (
        <Form>
          <Earlier listener={() => flushSync(rerender)} type={type} />
          <Field required />
        </Form>
      )
    }
    // Before `Field` in the tree, so its effect runs first and its listeners are called first:
    // on the form for `reset`, and on the field's own input for `invalid`, which doesn't bubble.
    const Earlier = ({ listener, type }: { listener: () => void; type: 'invalid' | 'reset' }) => {
      const ref = React.useRef<HTMLInputElement>(null)
      React.useEffect(() => {
        const form = ref.current!.form!
        const target = type === 'reset' ? form : (form.elements.namedItem('Day') as Element)
        target.addEventListener(type, listener)
        return () => target.removeEventListener(type, listener)
      })
      return <input ref={ref} type="hidden" />
    }

    test('still hears the `invalid` that marks the field', async () => {
      const user = userEvent.setup()
      render(<RendersOn type="invalid" />)
      await user.click(save())
      expect(marked()).toBe(true)
      expect(field()).toHaveFocus()
    })

    test('still hears the `reset` that clears the mark', async () => {
      const user = userEvent.setup()
      render(<RendersOn type="reset" />)
      await user.click(save())
      expect(marked()).toBe(true)
      await user.click(screen.getByRole('button', { name: 'Reset' }))
      expect(marked()).toBe(false)
    })

    test('listens to the input a render put in place of the first', async () => {
      const user = userEvent.setup()
      const { rerender } = render(
        <Form>
          <Field inputKey="first" required />
        </Form>
      )
      const first = valueInput()
      rerender(
        <Form>
          <Field inputKey="second" required />
        </Form>
      )
      expect(valueInput()).not.toBe(first)
      await user.click(save())
      expect(marked()).toBe(true)
    })
  })
})
