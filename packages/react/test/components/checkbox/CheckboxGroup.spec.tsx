import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Checkbox, CheckboxGroup } from '../../../src/index'

describe('CheckboxGroup', () => {
  describe('rendering', () => {
    test('matches the baseline markup snapshot', () => {
      const { container } = render(
        <CheckboxGroup label="Notifications" defaultValue={['email']}>
          <Checkbox value="email" label="Email" />
          <Checkbox value="sms" label="SMS" />
        </CheckboxGroup>
      )
      expect(container).toMatchSnapshot()
    })

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
      expect(screen.getByText('Notifications').tagName).toBe('LEGEND')
      expect(group).toHaveAccessibleDescription('Choose as many as you like.')
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
