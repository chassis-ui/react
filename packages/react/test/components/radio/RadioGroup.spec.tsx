import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Radio, RadioGroup } from '../../../src/index'

describe('RadioGroup', () => {
  describe('rendering', () => {
    test('renders a fieldset/legend wired up with the group role and description', () => {
      render(
        <RadioGroup label="Choose an option" description="Pick one." defaultValue="a">
          <Radio value="a" label="Option A" />
        </RadioGroup>
      )
      const group = screen.getByRole('radiogroup', { name: 'Choose an option' })
      expect(group.tagName).toBe('FIELDSET')
      expect(group).toHaveClass('form-field')
      expect(group).toHaveAttribute('aria-orientation', 'vertical')
      const legend = screen.getByText('Choose an option')
      expect(legend.tagName).toBe('LEGEND')
      expect(legend).toHaveClass('form-label')
      expect(group).toHaveAccessibleDescription('Pick one.')
    })
  })

  describe('validation', () => {
    test('invalid group renders the error message and is-invalid class', () => {
      render(
        <RadioGroup label="Choose an option" invalid errorMessage="Pick one to continue.">
          <Radio value="a" label="Option A" />
        </RadioGroup>
      )
      expect(screen.getByText('Pick one to continue.')).toHaveClass('invalid-feedback')
      expect(screen.getByRole('radiogroup')).toHaveClass('is-invalid')
    })

    test('propagates invalid to every Radio item', () => {
      render(
        <RadioGroup label="Choose an option" invalid errorMessage="Pick one to continue.">
          <Radio value="a" label="Option A" />
          <Radio value="b" label="Option B" />
        </RadioGroup>
      )
      expect(screen.getByRole('radio', { name: 'Option A' })).toHaveClass('is-invalid')
      expect(screen.getByRole('radio', { name: 'Option B' })).toHaveClass('is-invalid')
    })

    test('propagates valid to every Radio item', () => {
      render(
        <RadioGroup label="Choose an option" valid>
          <Radio value="a" label="Option A" />
        </RadioGroup>
      )
      expect(screen.getByRole('radio', { name: 'Option A' })).toHaveClass('is-valid')
    })
  })

  // `required` reached react-aria alone, which writes `aria-required` on the group: no radio
  // carried the native attribute, and a form with nothing selected reported itself valid.
  describe('required', () => {
    test('a required group puts the native required on its radios, so its form asks for one', () => {
      render(
        <form aria-label="Checkout">
          <RadioGroup label="Plan" name="plan" required>
            <Radio value="free" label="Free" />
            <Radio value="pro" label="Pro" />
          </RadioGroup>
        </form>
      )
      const form = screen.getByRole<HTMLFormElement>('form', { name: 'Checkout' })
      expect(screen.getByRole('radiogroup', { name: 'Plan' })).toBeRequired()
      expect(screen.getByRole('radio', { name: 'Free' })).toHaveAttribute('required')
      expect(screen.getByRole('radio', { name: 'Pro' })).toHaveAttribute('required')
      expect(form.checkValidity()).toBe(false)

      fireEvent.click(screen.getByRole('radio', { name: 'Pro' }))
      expect(form.checkValidity()).toBe(true)
      expect(form).toHaveFormValues({ plan: 'pro' })
    })

    test('a group that is not required leaves required off its radios', () => {
      render(
        <form aria-label="Checkout">
          <RadioGroup label="Plan" name="plan">
            <Radio value="free" label="Free" />
          </RadioGroup>
        </form>
      )
      expect(screen.getByRole('radio', { name: 'Free' })).not.toBeRequired()
      expect(screen.getByRole<HTMLFormElement>('form', { name: 'Checkout' }).checkValidity()).toBe(
        true
      )
    })

    test('has no axe violations as a required group', async () => {
      const { container } = render(
        <RadioGroup label="Plan" name="plan" required>
          <Radio value="free" label="Free" />
          <Radio value="pro" label="Pro" />
        </RadioGroup>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  // `form` reached every radio through react-aria, but the group's props didn't declare it:
  // TypeScript refused a group outside its `<form>` the one prop that joins it.
  describe('form', () => {
    test('a group outside its form joins it with every radio', () => {
      render(
        <>
          <form aria-label="Checkout" id="checkout" />
          <RadioGroup form="checkout" label="Plan" name="plan" required>
            <Radio value="free" label="Free" />
            <Radio value="pro" label="Pro" />
          </RadioGroup>
        </>
      )
      const form = screen.getByRole<HTMLFormElement>('form', { name: 'Checkout' })
      expect(screen.getByRole('radiogroup', { name: 'Plan' })).toHaveAttribute('form', 'checkout')
      expect(screen.getByRole('radio', { name: 'Free' })).toHaveAttribute('form', 'checkout')
      expect(screen.getByRole('radio', { name: 'Pro' })).toHaveAttribute('form', 'checkout')
      expect(form.checkValidity()).toBe(false)

      fireEvent.click(screen.getByRole('radio', { name: 'Pro' }))
      expect(form.checkValidity()).toBe(true)
      // What the form submits: `toHaveFormValues` reads the controls inside the form element.
      expect(new FormData(form).get('plan')).toBe('pro')
    })

    test("a radio's own form wins over the group's", () => {
      render(
        <RadioGroup form="checkout" label="Plan" name="plan">
          <Radio value="free" label="Free" />
          <Radio form="other" value="pro" label="Pro" />
        </RadioGroup>
      )
      expect(screen.getByRole('radio', { name: 'Free' })).toHaveAttribute('form', 'checkout')
      expect(screen.getByRole('radio', { name: 'Pro' })).toHaveAttribute('form', 'other')
    })

    test('a group without form leaves it off its radios', () => {
      render(
        <RadioGroup label="Plan" name="plan">
          <Radio value="free" label="Free" />
        </RadioGroup>
      )
      expect(screen.getByRole('radiogroup', { name: 'Plan' })).not.toHaveAttribute('form')
      expect(screen.getByRole('radio', { name: 'Free' })).not.toHaveAttribute('form')
    })
  })

  describe('controlled value', () => {
    // `value` was typed `string`: react-stately clears on `null` only, and `undefined` made the
    // group uncontrolled with the selection left as it was, so a form reset in TypeScript had no
    // legal way to unselect a controlled group.
    test('value={null} clears a controlled selection', () => {
      const onChange = vi.fn()
      const { rerender } = render(
        <RadioGroup label="Plan" onChange={onChange} value="pro">
          <Radio value="free" label="Free" />
          <Radio value="pro" label="Pro" />
        </RadioGroup>
      )
      expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked()

      rerender(
        <RadioGroup label="Plan" onChange={onChange} value={null}>
          <Radio value="free" label="Free" />
          <Radio value="pro" label="Pro" />
        </RadioGroup>
      )
      expect(screen.getByRole('radio', { name: 'Free' })).not.toBeChecked()
      expect(screen.getByRole('radio', { name: 'Pro' })).not.toBeChecked()
    })

    test('defaultValue={null} starts with nothing selected', () => {
      render(
        <RadioGroup defaultValue={null} label="Plan">
          <Radio value="free" label="Free" />
        </RadioGroup>
      )
      expect(screen.getByRole('radio', { name: 'Free' })).not.toBeChecked()
    })
  })

  describe('orientation', () => {
    test('orientation="horizontal" wraps items in a flex row', () => {
      render(
        <RadioGroup label="Choose an option" defaultValue="a" orientation="horizontal">
          <Radio value="a" label="Option A" />
          <Radio value="b" label="Option B" />
        </RadioGroup>
      )
      const radioA = screen.getByRole('radio', { name: 'Option A' })
      // The flex-row wrapper is a plain div with no role/name - no accessible query reaches it.
      // The row wraps: items that don't fit a narrow container go to the next line.
      // eslint-disable-next-line testing-library/no-node-access
      expect(radioA.closest('.d-flex')).toHaveClass('flex-wrap', 'gap-md')
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying fieldset', () => {
      const ref = React.createRef<HTMLFieldSetElement>()
      render(
        <RadioGroup ref={ref} label="Choose an option" defaultValue="a">
          <Radio value="a" label="Option A" />
        </RadioGroup>
      )
      expect(ref.current).toBeInstanceOf(HTMLFieldSetElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <RadioGroup label="Choose an option" description="Pick one." defaultValue="a">
          <Radio value="a" label="Option A" />
          <Radio value="b" label="Option B" />
        </RadioGroup>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
