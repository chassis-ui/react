import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxCheckbox, CxCheckboxGroup } from '../../../index'

describe('CxCheckboxGroup', () => {
  describe('rendering', () => {
    test('matches the baseline markup snapshot', () => {
      const { container } = render(
        <CxCheckboxGroup label="Notifications" defaultValue={['email']}>
          <CxCheckbox value="email" label="Email" />
          <CxCheckbox value="sms" label="SMS" />
        </CxCheckboxGroup>
      )
      expect(container).toMatchSnapshot()
    })

    test('renders a fieldset/legend wired up with the group role and description', () => {
      render(
        <CxCheckboxGroup
          label="Notifications"
          description="Choose as many as you like."
          defaultValue={[]}
        >
          <CxCheckbox value="email" label="Email" />
        </CxCheckboxGroup>
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
        <CxCheckboxGroup label="Notifications" invalid errorMessage="Choose at least one.">
          <CxCheckbox value="email" label="Email" />
        </CxCheckboxGroup>
      )
      expect(screen.getByText('Choose at least one.')).toHaveClass('invalid-feedback')
      expect(screen.getByRole('group')).toHaveClass('is-invalid')
    })
  })

  describe('orientation', () => {
    test('orientation="horizontal" wraps items in a flex row', () => {
      render(
        <CxCheckboxGroup label="Notifications" defaultValue={[]} orientation="horizontal">
          <CxCheckbox value="email" label="Email" />
          <CxCheckbox value="sms" label="SMS" />
        </CxCheckboxGroup>
      )
      const email = screen.getByRole('checkbox', { name: 'Email' })
      // The flex-row wrapper is a plain div with no role/name - no accessible query reaches it.
      // eslint-disable-next-line testing-library/no-node-access
      expect(email.closest('.d-flex')).not.toBeNull()
    })
  })

  describe('ref forwarding', () => {
    test('forwards a ref to the underlying fieldset', () => {
      const ref = React.createRef<HTMLFieldSetElement>()
      render(
        <CxCheckboxGroup ref={ref} label="Notifications" defaultValue={[]}>
          <CxCheckbox value="email" label="Email" />
        </CxCheckboxGroup>
      )
      expect(ref.current).toBeInstanceOf(HTMLFieldSetElement)
    })
  })

  describe('accessibility', () => {
    test('has no axe violations', async () => {
      const { container } = render(
        <CxCheckboxGroup
          label="Notifications"
          description="Choose as many as you like."
          defaultValue={[]}
        >
          <CxCheckbox value="email" label="Email" />
          <CxCheckbox value="sms" label="SMS" />
        </CxCheckboxGroup>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
