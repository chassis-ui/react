import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { CxCheckbox, CxCheckboxGroup } from '../../../index'

test('loads and displays CxCheckbox component', async () => {
  const { container } = render(<CxCheckbox />)
  expect(container).toMatchSnapshot()
})

test('CxCheckbox customize button=false', async () => {
  const { container } = render(
    <CxCheckbox className="bazinga" context="secondary" id="id" label="label" />
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('bazinga')
  expect(container.firstChild).toHaveClass('form-check')
  const checkInput = screen.getByRole('checkbox').parentElement
  expect(checkInput).toHaveClass('check-input')
  expect(checkInput).toHaveClass('secondary')
})

test('CxCheckbox customize button=true', async () => {
  const { container } = render(
    <CxCheckbox
      button={{ context: 'primary', size: 'large', shape: 'rounded', variant: 'ghost' }}
      className="bazinga"
      id="id"
      label="label"
    />
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('button')
  expect(container.firstChild).toHaveClass('button-check')
  expect(container.firstChild).toHaveClass('primary')
})

test('an uncontrolled checkbox toggles on click and fires onChange(isSelected)', () => {
  const onChange = vi.fn()
  render(<CxCheckbox aria-label="Terms" defaultSelected={false} onChange={onChange} />)
  const input = screen.getByRole('checkbox')
  expect(input).not.toBeChecked()
  fireEvent.click(input)
  expect(input).toBeChecked()
  expect(onChange).toHaveBeenCalledWith(true)
})

test('a controlled checkbox reflects isSelected and fires onChange(isSelected) without changing itself', () => {
  const onChange = vi.fn()
  render(<CxCheckbox aria-label="Terms" isSelected={false} onChange={onChange} />)
  const input = screen.getByRole('checkbox')
  fireEvent.click(input)
  expect(onChange).toHaveBeenCalledWith(true)
  // Still false — the consumer owns the state and hasn't re-rendered with isSelected={true}.
  expect(input).not.toBeChecked()
})

test('indeterminate is synced onto the native input by the checkbox hook', () => {
  render(<CxCheckbox aria-label="Select all" indeterminate />)
  const input = screen.getByRole('checkbox') as HTMLInputElement
  expect(input.indeterminate).toBe(true)
})

test('inside a CxCheckboxGroup, selection is owned by the group and reported via its onChange', () => {
  const onChange = vi.fn()
  render(
    <CxCheckboxGroup aria-label="Notifications" defaultValue={['email']} onChange={onChange}>
      <CxCheckbox value="email" label="Email" />
      <CxCheckbox value="sms" label="SMS" />
    </CxCheckboxGroup>
  )
  const email = screen.getByRole('checkbox', { name: 'Email' })
  const sms = screen.getByRole('checkbox', { name: 'SMS' })
  expect(email).toBeChecked()
  expect(sms).not.toBeChecked()

  fireEvent.click(sms)
  expect(onChange).toHaveBeenCalledWith(['email', 'sms'])
  expect(sms).toBeChecked()
})
