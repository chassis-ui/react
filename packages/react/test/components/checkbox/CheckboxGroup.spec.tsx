import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Checkbox, CheckboxGroup } from '../../../src/index'

describe('CheckboxGroup', () => {
  describe('rendering', () => {
    test('renders a fieldset/legend wired up with the group role and description', () => {
      render(
        <CheckboxGroup
          label="Notifications"
          description="Choose as many as you like."
          defaultValue={[]}
        >
          <Checkbox value="email" label="Email" />
        </CheckboxGroup>
      )
      const group = screen.getByRole('group', { name: 'Notifications' })
      expect(group.tagName).toBe('FIELDSET')
      expect(group).toHaveClass('form-field')
      expect(screen.getByText('Notifications').tagName).toBe('LEGEND')
      expect(screen.getByText('Notifications')).toHaveClass('form-label')
      expect(group).toHaveAccessibleDescription('Choose as many as you like.')
    })

    test('renders each item wrapped in a form-check', () => {
      render(
        <CheckboxGroup label="Notifications" defaultValue={['email']}>
          <Checkbox value="email" label="Email" />
          <Checkbox value="sms" label="SMS" />
        </CheckboxGroup>
      )
      // The .form-check wrapper is a plain label with no role/name of its own - no accessible
      // query reaches it directly.
      // eslint-disable-next-line testing-library/no-node-access
      const emailWrapper = screen.getByRole('checkbox', { name: 'Email' }).closest('label')
      // eslint-disable-next-line testing-library/no-node-access
      const smsWrapper = screen.getByRole('checkbox', { name: 'SMS' }).closest('label')
      expect(emailWrapper).toHaveClass('form-check')
      expect(smsWrapper).toHaveClass('form-check')
    })
  })

  describe('validation', () => {
    test('invalid group renders the error message and is-invalid class', () => {
      render(
        <CheckboxGroup label="Notifications" invalid errorMessage="Choose at least one.">
          <Checkbox value="email" label="Email" />
        </CheckboxGroup>
      )
      expect(screen.getByText('Choose at least one.')).toHaveClass('invalid-feedback')
      expect(screen.getByRole('group')).toHaveClass('is-invalid')
    })

    test('propagates invalid to every Checkbox item', () => {
      render(
        <CheckboxGroup label="Notifications" invalid errorMessage="Choose at least one.">
          <Checkbox value="email" label="Email" />
          <Checkbox value="sms" label="SMS" />
        </CheckboxGroup>
      )
      expect(screen.getByRole('checkbox', { name: 'Email' })).toHaveClass('is-invalid')
      expect(screen.getByRole('checkbox', { name: 'SMS' })).toHaveClass('is-invalid')
    })

    test('propagates valid to every Checkbox item', () => {
      render(
        <CheckboxGroup label="Notifications" valid>
          <Checkbox value="email" label="Email" />
          <Checkbox value="sms" label="SMS" />
        </CheckboxGroup>
      )
      expect(screen.getByRole('checkbox', { name: 'Email' })).toHaveClass('is-valid')
      expect(screen.getByRole('checkbox', { name: 'SMS' })).toHaveClass('is-valid')
    })

    test("an item's own invalid/valid overrides the group's", () => {
      render(
        <CheckboxGroup label="Notifications" invalid>
          <Checkbox value="email" label="Email" invalid={false} valid />
          <Checkbox value="sms" label="SMS" />
        </CheckboxGroup>
      )
      const email = screen.getByRole('checkbox', { name: 'Email' })
      expect(email).toHaveClass('is-valid')
      expect(email).not.toHaveClass('is-invalid')
      expect(screen.getByRole('checkbox', { name: 'SMS' })).toHaveClass('is-invalid')
    })
  })

  // `required` reached react-aria alone, which writes `aria-required`: no checkbox carried the
  // native attribute, and a form with nothing selected reported itself valid.
  describe('required', () => {
    test('a required group asks its form for one checkbox, not for every one', () => {
      render(
        <form aria-label="Settings">
          <CheckboxGroup label="Notifications" name="channels" required>
            <Checkbox value="email" label="Email" />
            <Checkbox value="sms" label="SMS" />
          </CheckboxGroup>
        </form>
      )
      const form = screen.getByRole<HTMLFormElement>('form', { name: 'Settings' })
      const email = screen.getByRole('checkbox', { name: 'Email' })
      const sms = screen.getByRole('checkbox', { name: 'SMS' })
      // The native attribute alone, without react-aria's `aria-required` copy.
      expect(email).toHaveAttribute('required')
      expect(email).not.toHaveAttribute('aria-required')
      expect(sms).toHaveAttribute('required')
      expect(form.checkValidity()).toBe(false)

      fireEvent.click(email)
      expect(email).not.toBeRequired()
      expect(sms).not.toBeRequired()
      expect(form.checkValidity()).toBe(true)

      fireEvent.click(email)
      expect(form.checkValidity()).toBe(false)
    })

    test("a checkbox's own required stays, whatever the group has selected", () => {
      render(
        <form aria-label="Settings">
          <CheckboxGroup defaultValue={['email']} label="Notifications" name="channels">
            <Checkbox value="email" label="Email" />
            <Checkbox required value="terms" label="Terms" />
          </CheckboxGroup>
        </form>
      )
      expect(screen.getByRole('checkbox', { name: 'Email' })).not.toBeRequired()
      expect(screen.getByRole('checkbox', { name: 'Terms' })).toHaveAttribute('required')
      expect(screen.getByRole<HTMLFormElement>('form', { name: 'Settings' }).checkValidity()).toBe(
        false
      )
    })

    test('has no axe violations as a required group', async () => {
      const { container } = render(
        <CheckboxGroup label="Notifications" name="channels" required>
          <Checkbox value="email" label="Email" />
          <Checkbox value="sms" label="SMS" />
        </CheckboxGroup>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  // Each checkbox was given the group's invalid state as its own, and react-aria registers an
  // invalid item with the group: the group then stayed invalid for as long as its items were,
  // which was for good.
  describe('invalid', () => {
    const tree = (invalid?: boolean) => (
      <CheckboxGroup errorMessage="Pick one." invalid={invalid} label="Notifications">
        <Checkbox value="email" label="Email" />
        <Checkbox value="sms" label="SMS" />
      </CheckboxGroup>
    )

    test('comes off the checkboxes when the group is no longer invalid', () => {
      const { rerender } = render(tree(true))
      const email = screen.getByRole('checkbox', { name: 'Email' })
      expect(email).toHaveAttribute('aria-invalid', 'true')
      expect(email).toHaveClass('is-invalid')
      expect(screen.getByText('Pick one.')).toBeVisible()

      rerender(tree())
      expect(email).not.toHaveAttribute('aria-invalid')
      expect(email).not.toHaveClass('is-invalid')
      expect(screen.queryByText('Pick one.')).not.toBeInTheDocument()

      rerender(tree(true))
      expect(email).toHaveAttribute('aria-invalid', 'true')
    })

    test("keeps a checkbox's own invalid, whatever the group's is", () => {
      render(
        <CheckboxGroup label="Notifications">
          <Checkbox value="email" label="Email" />
          <Checkbox invalid value="sms" label="SMS" />
        </CheckboxGroup>
      )
      expect(screen.getByRole('checkbox', { name: 'SMS' })).toHaveAttribute('aria-invalid', 'true')
      expect(screen.getByRole('checkbox', { name: 'SMS' })).toHaveClass('is-invalid')
    })
  })

  // `form` reached every checkbox through react-aria, but the group's props didn't declare it:
  // TypeScript refused a group outside its `<form>` the one prop that joins it.
  describe('form', () => {
    test('a group outside its form joins it with every checkbox', () => {
      render(
        <>
          <form aria-label="Settings" id="settings" />
          <CheckboxGroup form="settings" label="Notifications" name="channels" required>
            <Checkbox value="email" label="Email" />
            <Checkbox value="sms" label="SMS" />
          </CheckboxGroup>
        </>
      )
      const form = screen.getByRole<HTMLFormElement>('form', { name: 'Settings' })
      expect(screen.getByRole('group', { name: 'Notifications' })).toHaveAttribute(
        'form',
        'settings'
      )
      expect(screen.getByRole('checkbox', { name: 'Email' })).toHaveAttribute('form', 'settings')
      expect(screen.getByRole('checkbox', { name: 'SMS' })).toHaveAttribute('form', 'settings')
      expect(form.checkValidity()).toBe(false)

      fireEvent.click(screen.getByRole('checkbox', { name: 'SMS' }))
      expect(form.checkValidity()).toBe(true)
      // What the form submits: `toHaveFormValues` reads the controls inside the form element.
      expect(new FormData(form).getAll('channels')).toEqual(['sms'])
    })

    test("a checkbox's own form wins over the group's", () => {
      render(
        <CheckboxGroup form="settings" label="Notifications" name="channels">
          <Checkbox value="email" label="Email" />
          <Checkbox form="other" value="sms" label="SMS" />
        </CheckboxGroup>
      )
      expect(screen.getByRole('checkbox', { name: 'Email' })).toHaveAttribute('form', 'settings')
      expect(screen.getByRole('checkbox', { name: 'SMS' })).toHaveAttribute('form', 'other')
    })

    test('a group without form leaves it off its checkboxes', () => {
      render(
        <CheckboxGroup label="Notifications" name="channels">
          <Checkbox value="email" label="Email" />
        </CheckboxGroup>
      )
      expect(screen.getByRole('group', { name: 'Notifications' })).not.toHaveAttribute('form')
      expect(screen.getByRole('checkbox', { name: 'Email' })).not.toHaveAttribute('form')
    })
  })

  describe('orientation', () => {
    test('orientation="horizontal" wraps items in a flex row', () => {
      render(
        <CheckboxGroup label="Notifications" defaultValue={[]} orientation="horizontal">
          <Checkbox value="email" label="Email" />
          <Checkbox value="sms" label="SMS" />
        </CheckboxGroup>
      )
      const email = screen.getByRole('checkbox', { name: 'Email' })
      // The flex-row wrapper is a plain div with no role/name - no accessible query reaches it.
      // The row wraps: items that don't fit a narrow container go to the next line.
      // eslint-disable-next-line testing-library/no-node-access
      expect(email.closest('.d-flex')).toHaveClass('flex-wrap', 'gap-md')
    })
  })

  describe('dev diagnostics', () => {
    test('warns about ignored props once per mount, not on every re-render', () => {
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
      const { rerender } = render(
        <CheckboxGroup label="Notifications" defaultValue={[]}>
          <Checkbox value="email" label="Email" isSelected onChange={() => {}} />
        </CheckboxGroup>
      )
      expect(consoleWarn).toHaveBeenCalledTimes(1)

      rerender(
        <CheckboxGroup label="Notifications" defaultValue={[]}>
          <Checkbox value="email" label="Email" isSelected onChange={() => {}} />
        </CheckboxGroup>
      )
      expect(consoleWarn).toHaveBeenCalledTimes(1)

      consoleWarn.mockRestore()
    })

    test('errors about a missing value once per mount, not on every re-render', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      const { rerender } = render(
        <CheckboxGroup label="Notifications" defaultValue={[]}>
          <Checkbox label="Email" />
        </CheckboxGroup>
      )
      expect(consoleError).toHaveBeenCalledTimes(1)

      rerender(
        <CheckboxGroup label="Notifications" defaultValue={[]}>
          <Checkbox label="Email" />
        </CheckboxGroup>
      )
      expect(consoleError).toHaveBeenCalledTimes(1)

      consoleError.mockRestore()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying fieldset', () => {
      const ref = React.createRef<HTMLFieldSetElement>()
      render(
        <CheckboxGroup ref={ref} label="Notifications" defaultValue={[]}>
          <Checkbox value="email" label="Email" />
        </CheckboxGroup>
      )
      expect(ref.current).toBeInstanceOf(HTMLFieldSetElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <CheckboxGroup
          label="Notifications"
          description="Choose as many as you like."
          defaultValue={[]}
        >
          <Checkbox value="email" label="Email" />
          <Checkbox value="sms" label="SMS" />
        </CheckboxGroup>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
