import * as React from 'react'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { useHeldBack, UseHeldBackOptions } from '../../src/hooks/useHeldBack'

// The hook under the fields' own specs and `test/utils/heldBackMark.spec.tsx`, which run every
// field through a submit it holds back. Here: what those don't reach. `useRequiredValueInput`'s
// spec covers `focus`, the cancelled event and the listeners that outlive a render.

const Form = ({ children }: { children: React.ReactNode }) => (
  <form aria-label="Order" onSubmit={(event) => event.preventDefault()}>
    {children}
    <button type="submit">Save</button>
  </form>
)
const save = () => screen.getByRole('button', { name: 'Save' })

describe('useHeldBack', () => {
  // Not `required` alone: whatever the form checks.
  test('marks a control held back by any constraint, until it meets it', async () => {
    const user = userEvent.setup()
    const Code = () => {
      const ref = React.useRef<HTMLInputElement>(null)
      const { invalid } = useHeldBack(ref, {})
      return (
        <input aria-invalid={invalid} aria-label="Code" defaultValue="ab" pattern="\d+" ref={ref} />
      )
    }
    render(
      <Form>
        <Code />
      </Form>
    )
    const code = screen.getByRole('textbox', { name: 'Code' })

    await user.click(save())
    expect(code).toHaveAttribute('aria-invalid', 'true')

    // Uncontrolled: no render follows the typing, and the hook hears the edit itself.
    await user.clear(code)
    await user.type(code, '12')
    expect(code).not.toHaveAttribute('aria-invalid')
  })

  // A `<fieldset>` has `validity` and `willValidate` of its own, and validates nothing.
  test('hears the controls inside a fieldset, and reads their validity, not its own', async () => {
    const user = userEvent.setup()
    const Group = () => {
      const ref = React.useRef<HTMLFieldSetElement>(null)
      const { heldBack } = useHeldBack(ref, {})
      return (
        <fieldset aria-label="Plan" data-held-back={heldBack} ref={ref}>
          <input aria-label="Free" name="plan" required type="radio" value="free" />
          <input aria-label="Pro" name="plan" required type="radio" value="pro" />
        </fieldset>
      )
    }
    render(
      <Form>
        <Group />
      </Form>
    )
    const group = screen.getByRole('group', { name: 'Plan' })
    expect(group).toHaveAttribute('data-held-back', 'false')

    await user.click(save())
    expect(group).toHaveAttribute('data-held-back', 'true')

    await user.click(screen.getByRole('radio', { name: 'Pro' }))
    expect(group).toHaveAttribute('data-held-back', 'false')
  })

  test.each<[string, UseHeldBackOptions, string | null]>([
    ['nothing set', {}, 'true'],
    ['invalid', { invalid: true }, 'true'],
    ['invalid={false}', { invalid: false }, null],
    ['valid', { valid: true }, null],
    ['enabled={false}', { enabled: false }, null]
  ])('with %s, a held-back control shows aria-invalid=%j', async (_name, options, expected) => {
    const user = userEvent.setup()
    const Name = () => {
      const ref = React.useRef<HTMLInputElement>(null)
      const { invalid } = useHeldBack(ref, options)
      return <input aria-invalid={invalid || undefined} aria-label="Name" ref={ref} required />
    }
    render(
      <Form>
        <Name />
      </Form>
    )
    await user.click(save())
    const name = screen.getByRole('textbox', { name: 'Name' })
    if (expected === null) expect(name).not.toHaveAttribute('aria-invalid')
    else expect(name).toHaveAttribute('aria-invalid', expected)
  })

  test("clears on the form's reset, with the control still empty", async () => {
    const user = userEvent.setup()
    const Name = () => {
      const ref = React.useRef<HTMLInputElement>(null)
      const { invalid } = useHeldBack(ref, {})
      return <input aria-invalid={invalid} aria-label="Name" ref={ref} required />
    }
    render(
      <Form>
        <Name />
      </Form>
    )
    await user.click(save())
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveAttribute('aria-invalid', 'true')

    act(() => screen.getByRole<HTMLFormElement>('form', { name: 'Order' }).reset())
    expect(screen.getByRole('textbox', { name: 'Name' })).not.toHaveAttribute('aria-invalid')
  })
})
