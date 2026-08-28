import * as React from 'react'
import { render, screen } from '@testing-library/react'
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
      // eslint-disable-next-line testing-library/no-node-access
      expect(email.closest('.d-flex')).not.toBeNull()
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
