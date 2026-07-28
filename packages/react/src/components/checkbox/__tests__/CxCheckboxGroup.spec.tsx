import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxCheckbox, CxCheckboxGroup } from '../../../index'

test('loads and displays CxCheckboxGroup component', async () => {
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

test('invalid group renders the error message and is-invalid class', () => {
  render(
    <CxCheckboxGroup label="Notifications" invalid errorMessage="Choose at least one.">
      <CxCheckbox value="email" label="Email" />
    </CxCheckboxGroup>
  )
  expect(screen.getByText('Choose at least one.')).toHaveClass('invalid-feedback')
  expect(screen.getByRole('group')).toHaveClass('is-invalid')
})

test('orientation="horizontal" wraps items in a flex row', () => {
  render(
    <CxCheckboxGroup label="Notifications" defaultValue={[]} orientation="horizontal">
      <CxCheckbox value="email" label="Email" />
      <CxCheckbox value="sms" label="SMS" />
    </CxCheckboxGroup>
  )
  const email = screen.getByRole('checkbox', { name: 'Email' })
  expect(email.closest('.d-flex')).not.toBeNull()
})

test('forwards a ref to the underlying fieldset', () => {
  const ref = React.createRef<HTMLFieldSetElement>()
  render(
    <CxCheckboxGroup ref={ref} label="Notifications" defaultValue={[]}>
      <CxCheckbox value="email" label="Email" />
    </CxCheckboxGroup>
  )
  expect(ref.current).toBeInstanceOf(HTMLFieldSetElement)
})

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
