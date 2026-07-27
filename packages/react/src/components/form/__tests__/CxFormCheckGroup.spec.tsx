import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import { CxFormCheck, CxFormCheckGroup } from '../../../index'

test('loads and displays CxFormCheckGroup component', async () => {
  const { container } = render(
    <CxFormCheckGroup label="Notifications" defaultValue={['email']}>
      <CxFormCheck value="email" label="Email" />
      <CxFormCheck value="sms" label="SMS" />
    </CxFormCheckGroup>
  )
  expect(container).toMatchSnapshot()
})

test('renders a fieldset/legend wired up with the group role and description', () => {
  render(
    <CxFormCheckGroup
      label="Notifications"
      description="Choose as many as you like."
      defaultValue={[]}
    >
      <CxFormCheck value="email" label="Email" />
    </CxFormCheckGroup>
  )
  const group = screen.getByRole('group', { name: 'Notifications' })
  expect(group.tagName).toBe('FIELDSET')
  expect(screen.getByText('Notifications').tagName).toBe('LEGEND')
  expect(group).toHaveAccessibleDescription('Choose as many as you like.')
})

test('invalid group renders the error message and is-invalid class', () => {
  render(
    <CxFormCheckGroup label="Notifications" invalid errorMessage="Choose at least one.">
      <CxFormCheck value="email" label="Email" />
    </CxFormCheckGroup>
  )
  expect(screen.getByText('Choose at least one.')).toHaveClass('invalid-feedback')
  expect(screen.getByRole('group')).toHaveClass('is-invalid')
})

test('orientation="horizontal" wraps items in a flex row', () => {
  render(
    <CxFormCheckGroup label="Notifications" defaultValue={[]} orientation="horizontal">
      <CxFormCheck value="email" label="Email" />
      <CxFormCheck value="sms" label="SMS" />
    </CxFormCheckGroup>
  )
  const email = screen.getByRole('checkbox', { name: 'Email' })
  expect(email.closest('.d-flex')).not.toBeNull()
})

test('forwards a ref to the underlying fieldset', () => {
  const ref = React.createRef<HTMLFieldSetElement>()
  render(
    <CxFormCheckGroup ref={ref} label="Notifications" defaultValue={[]}>
      <CxFormCheck value="email" label="Email" />
    </CxFormCheckGroup>
  )
  expect(ref.current).toBeInstanceOf(HTMLFieldSetElement)
})

test('has no axe violations', async () => {
  const { container } = render(
    <CxFormCheckGroup
      label="Notifications"
      description="Choose as many as you like."
      defaultValue={[]}
    >
      <CxFormCheck value="email" label="Email" />
      <CxFormCheck value="sms" label="SMS" />
    </CxFormCheckGroup>
  )
  expect(await axe(container)).toHaveNoViolations()
})
